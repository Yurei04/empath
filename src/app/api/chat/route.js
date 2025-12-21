import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

// ============================================
// CONFIGURATION
// DO NOT TOUCH IN ANY CIRCUMSTANCES
// ============================================

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

// External API endpoints
const EMOTION_CLASSIFIER_URL = process.env.CLASSIFIER_API_URL

const DISTORTION_DETECTOR_URL = process.env.DISTORTION_DETECTOR_URL 

// LLM Models 
const LLM_MODELS = [
  'meta-llama/Llama-3.3-70B-Instruct',
  'meta-llama/Llama-3.2-3B-Instruct',
]

// ============================================
// SESSION MANAGEMENT
// ============================================

const sessions = new Map()

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      emotionSessionId: null,
      history: [],
      emotionMetrics: {
        mode: 'supportive',
        severity: 0,
        intent: 'general_support',
        dejection: 0,
        mood: 0,
        calmness: 0,
      },
      distortionMetrics: {
        totalDistortions: 0,
        recentDistortions: [],
        distortionTrend: 'stable', // stable, increasing, decreasing
        dominantDistortions: [],
        cognitiveLoad: 0, // 0-100 scale
      },
      combinedSeverity: 0,
      interventionLevel: 'observe', // observe, guide, intervene, crisis
    })
  }
  return sessions.get(sessionId)
}

// ============================================
// EMOTION CLASSIFICATION - MODEL: EMPATHY
// ============================================

async function classifyEmotion(text, sessionId = null, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${EMOTION_CLASSIFIER_URL}/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, session_id: sessionId }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!response.ok) {
        throw new Error(`Emotion API error: ${response.status}`)
      }

      const data = await response.json()
      console.log(`✅ Emotion: ${data.intent} (${data.confidence.toFixed(2)}) | Mode: ${data.mode}`)
      return data

    } catch (error) {
      console.error(`❌ Emotion classification attempt ${attempt + 1} failed:`, error.message)
      
      if (attempt === maxRetries) {
        return {
          session_id: sessionId,
          intent: 'general_support',
          confidence: 0.5,
          dejection: 0,
          mood: 0,
          calmness: 0,
          severity: 0,
          mode: 'supportive',
          system_prompt: 'You are a warm, empathetic mental health support assistant.',
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
    }
  }
}

// ============================================
// COGNITIVE DISTORTION DETECTION - MODEL: EMPHASIST
// ============================================

async function detectDistortions(text, threshold = 0.5, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${DISTORTION_DETECTOR_URL}/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, threshold }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!response.ok) {
        throw new Error(`Distortion API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.has_distortions) {
        const distortionList = data.distortions.map(d => d.distortion).join(', ')
        console.log(`🧠 Distortions: ${distortionList}`)
      } else {
        console.log(`✅ No distortions detected`)
      }
      
      return data

    } catch (error) {
      console.error(`❌ Distortion detection attempt ${attempt + 1} failed:`, error.message)
      
      if (attempt === maxRetries) {
        return {
          text,
          distortions: [],
          has_distortions: false,
          summary: 'Detection unavailable',
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
    }
  }
}

// ============================================
// DISTORTION WEIGHTS FOR SEVERITY
// ============================================

const DISTORTION_SEVERITY_WEIGHTS = {
  catastrophizing: 3.0,
  overgeneralization: 2.5,
  black_and_white: 2.0,
  self_blame: 2.5,
  mind_reading: 1.5,
}

// ============================================
// COMBINED METRICS CALCULATION
// ============================================

function updateDistortionMetrics(session, distortionData) {
  const { distortions, has_distortions } = distortionData
  
  // Update recent distortions (keep last 5 messages)
  if (has_distortions) {
    session.distortionMetrics.recentDistortions.push({
      timestamp: Date.now(),
      distortions: distortions.map(d => d.distortion),
      count: distortions.length,
    })
    
    // Keep only last 5
    if (session.distortionMetrics.recentDistortions.length > 5) {
      session.distortionMetrics.recentDistortions.shift()
    }
  }
  
  // Calculate total distortions
  session.distortionMetrics.totalDistortions += distortions.length
  
  // Calculate cognitive load (0-100)
  let cognitiveLoad = 0
  distortions.forEach(d => {
    const weight = DISTORTION_SEVERITY_WEIGHTS[d.distortion] || 1.0
    cognitiveLoad += d.confidence * weight * 20 // Scale to 0-100
  })
  session.distortionMetrics.cognitiveLoad = Math.min(100, cognitiveLoad)
  
  // Determine distortion trend
  if (session.distortionMetrics.recentDistortions.length >= 3) {
    const recent = session.distortionMetrics.recentDistortions
    const lastThree = recent.slice(-3).map(r => r.count)
    
    if (lastThree[2] > lastThree[1] && lastThree[1] > lastThree[0]) {
      session.distortionMetrics.distortionTrend = 'increasing'
    } else if (lastThree[2] < lastThree[1] && lastThree[1] < lastThree[0]) {
      session.distortionMetrics.distortionTrend = 'decreasing'
    } else {
      session.distortionMetrics.distortionTrend = 'stable'
    }
  }
  
  // Find dominant distortions
  const distortionCounts = {}
  session.distortionMetrics.recentDistortions.forEach(entry => {
    entry.distortions.forEach(d => {
      distortionCounts[d] = (distortionCounts[d] || 0) + 1
    })
  })
  
  session.distortionMetrics.dominantDistortions = Object.entries(distortionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([distortion]) => distortion)
}

function calculateCombinedSeverity(session) {
  const emotionSeverity = session.emotionMetrics.severity
  const cognitiveLoad = session.distortionMetrics.cognitiveLoad
  const distortionTrend = session.distortionMetrics.distortionTrend
  
  // Base combined severity (60% emotion, 40% cognitive)
  let combined = (emotionSeverity * 6) + (cognitiveLoad * 4)
  
  // Apply trend modifier
  if (distortionTrend === 'increasing') {
    combined *= 1.2 // 20% increase
  } else if (distortionTrend === 'decreasing') {
    combined *= 0.9 // 10% decrease
  }
  
  session.combinedSeverity = Math.min(100, combined)
  
  // Determine intervention level
  if (session.emotionMetrics.mode === 'crisis') {
    session.interventionLevel = 'crisis'
  } else if (session.combinedSeverity > 60 || distortionTrend === 'increasing') {
    session.interventionLevel = 'intervene'
  } else if (session.combinedSeverity > 35) {
    session.interventionLevel = 'guide'
  } else {
    session.interventionLevel = 'observe'
  }
}

// ============================================
// ENHANCED SYSTEM PROMPT GENERATION
// ============================================

function generateEnhancedSystemPrompt(session, distortionData) {
  const { emotionMetrics, distortionMetrics, interventionLevel, combinedSeverity } = session
  const { has_distortions, distortions } = distortionData
  
  let basePrompt = "You are a warm, empathetic mental health support assistant trained in Cognitive Behavioral Therapy (CBT)."
  
  // Add emotion-based context
  if (emotionMetrics.mode === 'crisis') {
    basePrompt += " The user is in crisis. Show genuine concern and guide them to crisis resources immediately."
    return basePrompt
  }
  
  // Add severity context
  if (combinedSeverity > 60) {
    basePrompt += ` The user shows high distress (severity ${Math.round(combinedSeverity)}/100). Be extra empathetic and supportive.`
  } else if (combinedSeverity > 35) {
    basePrompt += ` The user is experiencing moderate distress (severity ${Math.round(combinedSeverity)}/100).`
  }
  
  // Add cognitive distortion context
  if (has_distortions) {
    const distortionNames = distortions.map(d => d.distortion.replace('_', ' ')).join(', ')
    
    basePrompt += `\n\nIMPORTANT: The user's message contains cognitive distortions: ${distortionNames}.`
    
    // Add specific guidance based on intervention level
    if (interventionLevel === 'intervene') {
      basePrompt += " Gently challenge these thinking patterns using Socratic questioning. Help them examine evidence and consider alternative perspectives."
    } else if (interventionLevel === 'guide') {
      basePrompt += " Acknowledge their feelings, then subtly introduce alternative perspectives. Use validation before reframing."
    } else {
      basePrompt += " Note these patterns but focus on validation and empathy. Build rapport before addressing distortions."
    }
    
    // Add specific distortion guidance
    if (distortions.some(d => d.distortion === 'catastrophizing')) {
      basePrompt += " Help them examine the likelihood of worst-case scenarios."
    }
    if (distortions.some(d => d.distortion === 'overgeneralization')) {
      basePrompt += " Gently point out exceptions to their 'always/never' statements."
    }
    if (distortions.some(d => d.distortion === 'black_and_white')) {
      basePrompt += " Introduce nuance and middle-ground perspectives."
    }
    if (distortions.some(d => d.distortion === 'self_blame')) {
      basePrompt += " Help them distribute responsibility more fairly and consider external factors."
    }
    if (distortions.some(d => d.distortion === 'mind_reading')) {
      basePrompt += " Encourage them to check assumptions rather than assume others' thoughts."
    }
  }
  
  // Add trend context
  if (distortionMetrics.distortionTrend === 'increasing') {
    basePrompt += "\n\nNote: Their cognitive distortions are increasing. Consider suggesting professional support if this continues."
  } else if (distortionMetrics.distortionTrend === 'decreasing') {
    basePrompt += "\n\nPositive sign: Their cognitive distortions are decreasing. Acknowledge their progress."
  }
  
  basePrompt += "\n\nKeep responses concise (2-4 sentences). Use empathy first, then gentle guidance."
  
  return basePrompt
}

// ============================================
// LLM GENERATION
// ============================================

async function generateLLMResponse(messages, modelIndex = 0) {
  if (modelIndex >= LLM_MODELS.length) {
    throw new Error('All LLM models failed')
  }

  const currentModel = LLM_MODELS[modelIndex]
  
  try {
    console.log(`🤖 Attempting LLM: ${currentModel}`)
    
    const response = await hf.chatCompletion({
      model: currentModel,
      messages,
      max_tokens: 300,
      temperature: 0.8,
      top_p: 0.92,
    })

    const content = response.choices[0].message.content
    console.log(`✅ LLM response generated`)
    return content

  } catch (error) {
    console.error(`❌ ${currentModel} failed:`, error.message)
    
    if (modelIndex < LLM_MODELS.length - 1) {
      return generateLLMResponse(messages, modelIndex + 1)
    }
    
    throw error
  }
}

async function generateStreamingResponse(messages, modelIndex = 0) {
  if (modelIndex >= LLM_MODELS.length) {
    throw new Error('All LLM models failed')
  }

  const currentModel = LLM_MODELS[modelIndex]
  
  try {
    const stream = hf.chatCompletionStream({
      model: currentModel,
      messages,
      max_tokens: 300,
      temperature: 0.8,
      top_p: 0.92,
    })

    return { stream, model: currentModel }

  } catch (error) {
    console.error(`❌ ${currentModel} streaming failed`)
    
    if (modelIndex < LLM_MODELS.length - 1) {
      return generateStreamingResponse(messages, modelIndex + 1)
    }
    
    throw error
  }
}

// ============================================
// CRISIS RESPONSE
// ============================================

function getCrisisResponse() {
  return (
    "I'm really concerned about your safety right now.\n\n" +
    '**Please reach out immediately:**\n' +
    '• Call/text **988** (Suicide & Crisis Lifeline - US)\n' +
    '• Text **HOME to 741741** (Crisis Text Line - US)\n' +
    '• Call **911** or go to nearest ER\n' +
    '• International: findahelpline.com\n\n' +
    "You don't have to face this alone. Help is available 24/7."
  )
}

// ============================================
// POST — Enhanced Chat Handler
// ============================================

export async function POST(request) {
  try {
    const { message, sessionId = 'default', stream = false } = await request.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid message is required' },
        { status: 400 }
      )
    }

    const session = getSession(sessionId)

    // ============================================
    // DUAL CLASSIFICATION
    // ============================================

    console.log('\n🔍 Running dual analysis...')

    // Run both classifiers in parallel
    const [emotionData, distortionData] = await Promise.all([
      classifyEmotion(message, session.emotionSessionId),
      detectDistortions(message, 0.5),
    ])

    // Update emotion session
    session.emotionSessionId = emotionData.session_id
    session.emotionMetrics = {
      mode: emotionData.mode,
      severity: emotionData.severity,
      intent: emotionData.intent,
      confidence: emotionData.confidence,
      dejection: emotionData.dejection,
      mood: emotionData.mood,
      calmness: emotionData.calmness,
    }

    // Update distortion metrics
    updateDistortionMetrics(session, distortionData)
    calculateCombinedSeverity(session)

    console.log(`📊 Combined Severity: ${session.combinedSeverity.toFixed(1)}/100 | Intervention: ${session.interventionLevel}`)

    // Add user message to history
    session.history.push({ role: 'user', content: message })

    // ============================================
    // CRISIS HANDLING
    // ============================================

    if (emotionData.mode === 'crisis') {
      const crisisResponse = getCrisisResponse()
      session.history.push({ role: 'assistant', content: crisisResponse })

      return NextResponse.json({
        response: crisisResponse,
        emotionMetrics: session.emotionMetrics,
        distortionMetrics: session.distortionMetrics,
        combinedSeverity: session.combinedSeverity,
        interventionLevel: session.interventionLevel,
        isCrisis: true,
      })
    }

    // ============================================
    // GENERATE ENHANCED RESPONSE
    // ============================================

    const systemPrompt = generateEnhancedSystemPrompt(session, distortionData)
    const messages = [
      { role: 'system', content: systemPrompt },
      ...session.history.slice(-10),
    ]

    // ============================================
    // STREAMING
    // ============================================

    if (stream) {
      let streamObj
      try {
        streamObj = await generateStreamingResponse(messages)
      } catch (error) {
        console.error('❌ Streaming failed, using fallback')
        const response = await generateLLMResponse(messages)
        session.history.push({ role: 'assistant', content: response })
        
        return NextResponse.json({
          response,
          emotionMetrics: session.emotionMetrics,
          distortionMetrics: session.distortionMetrics,
          combinedSeverity: session.combinedSeverity,
          interventionLevel: session.interventionLevel,
          fallback: true,
        })
      }

      const encoder = new TextEncoder()

      const readable = new ReadableStream({
        async start(controller) {
          let fullResponse = ''

          try {
            for await (const chunk of streamObj.stream) {
              const text = chunk?.choices?.[0]?.delta?.content
              if (text) {
                fullResponse += text
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ chunk: text })}\n\n`)
                )
              }
            }

            session.history.push({ role: 'assistant', content: fullResponse })

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  emotionMetrics: session.emotionMetrics,
                  distortionMetrics: session.distortionMetrics,
                  combinedSeverity: session.combinedSeverity,
                  interventionLevel: session.interventionLevel,
                  model: streamObj.model,
                })}\n\n`
              )
            )

          } catch (error) {
            console.error('❌ Streaming error:', error)
            const fallbackText = "I'm here to support you. Could you tell me more?"
            
            session.history.push({ role: 'assistant', content: fallbackText })

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ chunk: fallbackText, error: true })}\n\n`
              )
            )
            
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  emotionMetrics: session.emotionMetrics,
                  distortionMetrics: session.distortionMetrics,
                  combinedSeverity: session.combinedSeverity,
                  interventionLevel: session.interventionLevel,
                })}\n\n`
              )
            )
          } finally {
            controller.close()
          }
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // ============================================
    // NON-STREAMING
    // ============================================

    let botResponse
    try {
      botResponse = await generateLLMResponse(messages)
    } catch (error) {
      console.error('❌ All LLM models failed')
      botResponse = "I'm here to listen and support you. Could you share more?"
    }

    session.history.push({ role: 'assistant', content: botResponse })

    return NextResponse.json({
      response: botResponse,
      emotionMetrics: session.emotionMetrics,
      distortionMetrics: session.distortionMetrics,
      combinedSeverity: session.combinedSeverity,
      interventionLevel: session.interventionLevel,
    })

  } catch (error) {
    console.error('❌ Critical error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        message: 'I apologize, but I encountered an error. Please try again.',
      },
      { status: 500 }
    )
  }
}

// ============================================
// GET — Enhanced Metrics
// ============================================

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId') || 'default'
    const session = getSession(sessionId)

    return NextResponse.json({
      emotionMetrics: session.emotionMetrics,
      distortionMetrics: session.distortionMetrics,
      combinedSeverity: session.combinedSeverity,
      interventionLevel: session.interventionLevel,
    })

  } catch (error) {
    console.error('Metrics fetch error:', error)
    return NextResponse.json(
      { 
        emotionMetrics: { mode: 'supportive', severity: 0 },
        distortionMetrics: { cognitiveLoad: 0, totalDistortions: 0 },
        combinedSeverity: 0,
        interventionLevel: 'observe',
      },
      { status: 200 }
    )
  }
}

// ============================================
// DELETE — Reset Session
// ============================================

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId') || 'default'
    
    const session = getSession(sessionId)
    
    if (session.emotionSessionId) {
      try {
        await fetch(
          `${EMOTION_CLASSIFIER_URL}/session/reset/${session.emotionSessionId}`,
          { method: 'POST' }
        )
      } catch (error) {
        console.error('Failed to reset emotion session:', error)
      }
    }
    
    sessions.delete(sessionId)
    
    return NextResponse.json({ 
      message: 'Session reset successfully',
      sessionId 
    })

  } catch (error) {
    console.error('Session reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset session' },
      { status: 500 }
    )
  }
}