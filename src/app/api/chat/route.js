/**
 * File: app/api/chat/route.js
 * ==========================
 * Mental Health Chatbot API Route
 * Uses external HF Space for classification + local LLM
 */

import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

// ============================================
// CONFIGURATION
// ============================================

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

// Replace with your actual HF Space URL after deployment
const CLASSIFIER_API_URL = process.env.CLASSIFIER_API_URL || 
  'https://YOUR_USERNAME-mental-health-classifier.hf.space'

// Best free conversational models (in order of preference)
const LLM_MODELS = [
  'meta-llama/Llama-3.3-70B-Instruct',      // Best quality
  'meta-llama/Llama-3.2-3B-Instruct',       // Fast and good
  'mistralai/Mistral-7B-Instruct-v0.3',     // Reliable fallback
  'microsoft/Phi-3.5-mini-instruct',        // Lightweight fallback
]

// ============================================
// SESSION MANAGEMENT
// ============================================

// In-memory sessions (use Redis/Vercel KV in production)
const sessions = new Map()

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      classifierSessionId: null, // HF Space session ID
      history: [],
      lastMetrics: {
        mode: 'supportive',
        severity: 0,
        intent: 'general_support',
      },
    })
  }
  return sessions.get(sessionId)
}

// ============================================
// CLASSIFIER API INTEGRATION
// ============================================

async function classifyWithRetry(text, sessionId = null, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch(`${CLASSIFIER_API_URL}/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          session_id: sessionId,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!response.ok) {
        throw new Error(`Classifier API error: ${response.status}`)
      }

      const data = await response.json()
      
      console.log(`✅ Classification: ${data.intent} (${data.confidence.toFixed(2)}) | Mode: ${data.mode} | Severity: ${data.severity}`)
      
      return data

    } catch (error) {
      console.error(`❌ Classification attempt ${attempt + 1} failed:`, error.message)
      
      if (attempt === maxRetries) {
        // Return safe defaults on final failure
        console.warn('⚠️ Using fallback classification')
        return {
          session_id: sessionId,
          intent: 'general_support',
          confidence: 0.5,
          dejection: 0,
          mood: 0,
          calmness: 0,
          severity: 0,
          mode: 'supportive',
          system_prompt: 'You are a warm, empathetic mental health support assistant. Have a natural, supportive conversation. Keep responses concise (2-3 sentences). Listen actively.',
        }
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
    }
  }
}

// ============================================
// LLM INTEGRATION WITH FALLBACKS
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
    console.log(`✅ LLM response generated with ${currentModel}`)
    return content

  } catch (error) {
    console.error(`❌ ${currentModel} failed:`, error.message)
    
    // Try next model
    if (modelIndex < LLM_MODELS.length - 1) {
      console.log(`🔄 Falling back to next model...`)
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
    console.log(`🤖 Attempting streaming with: ${currentModel}`)
    
    const stream = hf.chatCompletionStream({
      model: currentModel,
      messages,
      max_tokens: 300,
      temperature: 0.8,
      top_p: 0.92,
    })

    return { stream, model: currentModel }

  } catch (error) {
    console.error(`❌ ${currentModel} streaming failed:`, error.message)
    
    // Try next model
    if (modelIndex < LLM_MODELS.length - 1) {
      console.log(`🔄 Falling back to next model...`)
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
    '• International: Find your local crisis line at findahelpline.com\n\n' +
    "You don't have to face this alone. Help is available 24/7."
  )
}

// ============================================
// POST — Chat Handler
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

    // Step 1: Classify intent with external API
    const classification = await classifyWithRetry(
      message,
      session.classifierSessionId
    )

    // Update session with classifier's session ID
    session.classifierSessionId = classification.session_id
    session.lastMetrics = {
      mode: classification.mode,
      severity: classification.severity,
      intent: classification.intent,
      confidence: classification.confidence,
      dejection: classification.dejection,
      mood: classification.mood,
      calmness: classification.calmness,
    }

    // Add user message to history
    session.history.push({ role: 'user', content: message })

    // Step 2: Handle crisis mode
    if (classification.mode === 'crisis') {
      const crisisResponse = getCrisisResponse()
      session.history.push({ role: 'assistant', content: crisisResponse })

      return NextResponse.json({
        response: crisisResponse,
        metrics: session.lastMetrics,
        isCrisis: true,
      })
    }

    // Step 3: Prepare messages for LLM
    const systemMessage = classification.system_prompt
    const messages = [
      { role: 'system', content: systemMessage },
      ...session.history.slice(-10), // Keep last 10 messages for context
    ]

    // ============================================
    // STREAMING RESPONSE
    // ============================================

    if (stream) {
      let streamObj
      try {
        streamObj = await generateStreamingResponse(messages)
      } catch (error) {
        console.error('❌ All streaming models failed, falling back to non-streaming')
        
        // Fallback to non-streaming
        try {
          const response = await generateLLMResponse(messages)
          session.history.push({ role: 'assistant', content: response })
          
          return NextResponse.json({
            response,
            metrics: session.lastMetrics,
            fallback: true,
          })
        } catch (fallbackError) {
          throw new Error('All LLM attempts failed')
        }
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
                  encoder.encode(
                    `data: ${JSON.stringify({ chunk: text })}\n\n`
                  )
                )
              }
            }

            // Save to history
            session.history.push({
              role: 'assistant',
              content: fullResponse,
            })

            // Send completion with metrics
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  metrics: session.lastMetrics,
                  model: streamObj.model,
                })}\n\n`
              )
            )

          } catch (error) {
            console.error('❌ Streaming error:', error)
            
            // Send fallback response
            const fallbackText = "I'm here to support you. Could you tell me more about what you're experiencing?"
            fullResponse = fallbackText
            
            session.history.push({
              role: 'assistant',
              content: fallbackText,
            })

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ 
                  chunk: fallbackText,
                  error: true 
                })}\n\n`
              )
            )
            
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  metrics: session.lastMetrics,
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
    // NON-STREAMING RESPONSE
    // ============================================

    let botResponse
    try {
      botResponse = await generateLLMResponse(messages)
    } catch (error) {
      console.error('❌ All LLM models failed:', error)
      
      // Final fallback response
      botResponse = "I'm here to listen and support you. Could you share more about what's on your mind?"
    }

    session.history.push({ role: 'assistant', content: botResponse })

    return NextResponse.json({
      response: botResponse,
      metrics: session.lastMetrics,
    })

  } catch (error) {
    console.error('❌ Critical chat error:', error)
    
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
// GET — Metrics Endpoint
// ============================================

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId') || 'default'
    const session = getSession(sessionId)

    // If we have a classifier session, fetch current state
    if (session.classifierSessionId) {
      try {
        const response = await fetch(
          `${CLASSIFIER_API_URL}/session/${session.classifierSessionId}`
        )
        
        if (response.ok) {
          const data = await response.json()
          return NextResponse.json(data)
        }
      } catch (error) {
        console.error('Failed to fetch classifier metrics:', error)
      }
    }

    // Return cached metrics
    return NextResponse.json(session.lastMetrics)

  } catch (error) {
    console.error('Metrics fetch error:', error)
    return NextResponse.json(
      { 
        mode: 'supportive',
        severity: 0,
        dejection: 0,
        mood: 0,
        calmness: 0,
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
    
    // Reset classifier session if exists
    if (session.classifierSessionId) {
      try {
        await fetch(
          `${CLASSIFIER_API_URL}/session/reset/${session.classifierSessionId}`,
          { method: 'POST' }
        )
      } catch (error) {
        console.error('Failed to reset classifier session:', error)
      }
    }
    
    // Delete local session
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