/**
 * File: app/api/chat/route.js
 * ==========================
 * Mental Health Chatbot API Route (JS version)
 */

import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

// ============================================
// EMOTIONAL STATE TRACKING
// ============================================

const INTENT_WEIGHTS = {
  depression: { dejection: 3.0, mood: 2.0, calmness: 1.5 },
  suicide: { dejection: 5.0, mood: 3.0, calmness: 3.5 },
  trauma: { dejection: 3.5, mood: 1.5, calmness: 2.5 },
  grief: { dejection: 2.5, mood: 1.5, calmness: 1.0 },
  self_esteem: { dejection: 1.0, mood: 3.5, calmness: 0.5 },
  anxiety: { dejection: 0.5, mood: 1.0, calmness: 3.5 },
  sleep_issues: { dejection: 1.0, mood: 1.0, calmness: 2.5 },
  anger: { dejection: 1.0, mood: 1.5, calmness: 3.5 },
  relationship: { dejection: 1.5, mood: 2.0, calmness: 2.0 },
  family: { dejection: 1.5, mood: 2.0, calmness: 1.5 },
}

// In-memory sessions (use Redis / KV in production)
const sessions = new Map()

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      dejection: 0,
      calmness: 0,
      mood: 0,
      severity: 0,
      mode: 'supportive',
      history: [],
    })
  }
  return sessions.get(sessionId)
}

async function classifyIntent(text) {
  try {
    const result = await hf.textClassification({
      model: 'YureiYuri/empathy',
      inputs: text,
    })

    const topResult = result[0]
    return {
      intent: topResult.label,
      confidence: topResult.score,
    }
  } catch (error) {
    console.error('Classification error:', error)
    return { intent: 'general_support', confidence: 0.5 }
  }
}

function updateState(session, intent, confidence) {
  // Apply decay
  session.dejection *= 0.88
  session.calmness *= 0.88
  session.mood *= 0.88

  // Add new weights
  const weights = INTENT_WEIGHTS[intent] || {
    dejection: 0.5,
    mood: 0.5,
    calmness: 0.5,
  }

  session.dejection += weights.dejection * confidence
  session.mood += weights.mood * confidence
  session.calmness += weights.calmness * confidence

  // Calculate severity
  session.severity =
    session.dejection * 0.5 +
    session.mood * 0.25 +
    session.calmness * 0.25

  // Update mode
  if (intent === 'suicide' || session.severity > 35) {
    session.mode = 'crisis'
  } else if (session.severity > 20) {
    session.mode = 'urgent'
  } else if (session.severity > 10) {
    session.mode = 'concerned'
  } else {
    session.mode = 'supportive'
  }

  console.log(
    `📊 ${intent} (${confidence.toFixed(2)}) | Mode: ${session.mode} | Severity: ${session.severity.toFixed(1)}`
  )
}

function getSystemPrompt(mode) {
  const base = 'You are a warm, empathetic mental health support assistant.'

  switch (mode) {
    case 'crisis':
      return `${base} The user is in crisis. Show genuine concern and guide them to crisis resources.`
    case 'urgent':
      return `${base} The user shows significant distress. Be extra empathetic and supportive.`
    case 'concerned':
      return `${base} The user is experiencing moderate distress. Show increased warmth and validation.`
    default:
      return `${base} Have a natural, supportive conversation. Keep responses concise (2–3 sentences). Listen actively.`
  }
}

// ============================================
// POST — Chat Handler
// ============================================

export async function POST(request) {
  try {
    const { message, sessionId = 'default', stream = false } =
      await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      )
    }

    const session = getSession(sessionId)

    // Intent classification (background)
    const { intent, confidence } = await classifyIntent(message)
    updateState(session, intent, confidence)

    session.history.push({ role: 'user', content: message })

    // Crisis handling
    if (session.mode === 'crisis') {
      const crisisResponse =
        "I'm really concerned about your safety right now.\n\n" +
        'Please reach out immediately:\n' +
        '• Call/text **988** (Suicide & Crisis Lifeline)\n' +
        '• Text **HOME to 741741** (Crisis Text Line)\n' +
        '• Call **911** or go to nearest ER\n\n' +
        "You don't have to face this alone. Help is available 24/7."

      session.history.push({ role: 'assistant', content: crisisResponse })

      return NextResponse.json({
        response: crisisResponse,
        metrics: {
          intent,
          confidence,
          severity: session.severity,
          mode: session.mode,
          dejection: session.dejection,
          mood: session.mood,
          calmness: session.calmness,
        },
      })
    }

    const systemMessage = getSystemPrompt(session.mode)

    const messages = [
      { role: 'system', content: systemMessage },
      ...session.history.slice(-10),
    ]

    // ============================================
    // STREAMING RESPONSE
    // ============================================

    if (stream) {
      const streamResponse = hf.chatCompletionStream({
        model: 'meta-llama/Llama-3.2-3B-Instruct',
        messages,
        max_tokens: 300,
        temperature: 0.8,
        top_p: 0.92,
      })

      const encoder = new TextEncoder()

      const readable = new ReadableStream({
        async start(controller) {
          let fullResponse = ''

          try {
            for await (const chunk of streamResponse) {
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

            session.history.push({
              role: 'assistant',
              content: fullResponse,
            })

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  metrics: {
                    intent,
                    confidence,
                    severity: session.severity,
                    mode: session.mode,
                    dejection: session.dejection,
                    mood: session.mood,
                    calmness: session.calmness,
                  },
                })}\n\n`
              )
            )
          } catch (error) {
            console.error('Streaming error:', error)
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  chunk:
                    "I'm here to support you. Could you tell me more?",
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

    const response = await hf.chatCompletion({
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      messages,
      max_tokens: 300,
      temperature: 0.8,
      top_p: 0.92,
    })

    const botResponse = response.choices[0].message.content
    session.history.push({ role: 'assistant', content: botResponse })

    return NextResponse.json({
      response: botResponse,
      metrics: {
        intent,
        confidence,
        severity: session.severity,
        mode: session.mode,
        dejection: session.dejection,
        mood: session.mood,
        calmness: session.calmness,
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process message', details: error.message },
      { status: 500 }
    )
  }
}

// ============================================
// GET — Metrics Endpoint
// ============================================

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId') || 'default'
  const session = getSession(sessionId)

  return NextResponse.json({
    severity: session.severity,
    mode: session.mode,
    dejection: session.dejection,
    mood: session.mood,
    calmness: session.calmness,
  })
}
