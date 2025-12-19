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
      mode: "supportive",
      history: [],
      pendingAction: null,
    })
  }
  return sessions.get(sessionId)
}



function isAffirmative(text) {
  return /^(yes|yeah|yep|sure|okay|ok|alright|why not)$/i.test(
    text.trim()
  )
}

function isNegative(text) {
  return /^(no|nah|not now|maybe later)$/i.test(
    text.trim()
  )
}

function suggestAction(session, action, message) {
  session.pendingAction = action

  session.history.push({
    role: "assistant",
    content: message,
  })

  return {
    response: message,
  }
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
  session.dejection *= 0.88
  session.calmness *= 0.88
  session.mood *= 0.88

  const weights = INTENT_WEIGHTS[intent] || {
    dejection: 0.5,
    mood: 0.5,
    calmness: 0.5,
  }

  session.dejection += weights.dejection * confidence
  session.mood += weights.mood * confidence
  session.calmness += weights.calmness * confidence

  session.severity =
    session.dejection * 0.5 +
    session.mood * 0.25 +
    session.calmness * 0.25

  if (intent === "suicide" || session.severity > 35) {
    session.mode = "crisis"
  } else if (session.severity > 20) {
    session.mode = "urgent"
  } else if (session.severity > 10) {
    session.mode = "concerned"
  } else {
    session.mode = "supportive"
  }
}

function getSystemPrompt(mode) {
const base = `
        You are a warm, empathetic mental health support assistant.

        Rules:
        - You do NOT provide medical or clinical advice.
        - You do NOT use profanity or harmful language.
        - You respect user autonomy at all times.
        - You may suggest gentle activities, but only proceed if the user agrees.
        - If the user declines an activity, acknowledge and continue the conversation naturally.

        Style:
        - Speak calmly and compassionately.
        - Keep responses concise (2–3 sentences).
        - Ask open-ended, non-intrusive questions when appropriate.
        - Never pressure the user to do anything.
    `


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
    const { message, sessionId = "default", stream = false } =
      await request.json()

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    const session = getSession(sessionId)

    /* ===============================
       1️⃣ HANDLE CONSENT FIRST
    =============================== */
    if (session.pendingAction) {
      if (isAffirmative(message)) {
        const action = session.pendingAction
        session.pendingAction = null

        return NextResponse.json({
          response: "Alright, let’s do that together.",
          action,
        })
      }

      if (isNegative(message)) {
        session.pendingAction = null
        return NextResponse.json({
          response: "That’s okay. We can keep talking.",
        })
      }
    }

    /* ===============================
       2️⃣ NORMAL CHAT FLOW
    =============================== */
    session.history.push({ role: "user", content: message })

    const { intent, confidence } = await classifyIntent(message)
    updateState(session, intent, confidence)

    /* ===============================
       3️⃣ CRISIS SHORT-CIRCUIT
    =============================== */
    if (session.mode === "crisis") {
      const crisisResponse =
        "I'm really concerned about your safety right now.\n\n" +
        "Please reach out immediately:\n" +
        "• Call/text 988\n" +
        "• Text HOME to 741741\n" +
        "• Call local emergency services\n\n" +
        "You’re not alone."

      session.history.push({ role: "assistant", content: crisisResponse })

      return NextResponse.json({ response: crisisResponse })
    }

    /* ===============================
       4️⃣ AI RESPONSE
    =============================== */
    const systemMessage = getSystemPrompt(session.mode)

    const messages = [
      { role: "system", content: systemMessage },
      ...session.history.slice(-10),
    ]

    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.2-3B-Instruct",
      messages,
      max_tokens: 300,
      temperature: 0.8,
      top_p: 0.92,
    })

    const botResponse = response.choices[0].message.content
    session.history.push({ role: "assistant", content: botResponse })

    /* ===============================
       5️⃣ SUGGEST ACTION (OPTIONAL)
    =============================== */
    let suggestion = null

    if (session.mode === "concerned") {
      suggestion = suggestAction(
        session,
        "PLAY_GAME",
        "It might help to pause for a moment. Would you like to play a short calming game?"
      )
    }

    if (!suggestion && session.mode === "supportive" && Math.random() < 0.3) {
      suggestion = suggestAction(
        session,
        "CREATE_LETTER",
        "Would you like to write something encouraging, even just for yourself?"
      )
    }

    if (suggestion) return NextResponse.json(suggestion)

    return NextResponse.json({ response: botResponse })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to process message" },
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
