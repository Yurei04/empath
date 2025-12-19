"use client"

import { useState } from "react"
import { EMPATH_MODES } from "@/lib/empathModes"
import EmapthConversationScreen from "./empathy-screen"
import LetterMain from "@/pages/empath-page/letter-main"
import HomepageMain from "@/pages/home-page/home-page-main"

export default function EmpathCore() {
  const [mode, setMode] = useState(EMPATH_MODES.CHAT)

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="w-full h-[calc(100vh-8rem)] rounded-2xl overflow-hidden backdrop-blur-xl bg-black/40 border border-purple-500/20 shadow-2xl shadow-purple-500/10">

          {mode === EMPATH_MODES.CHAT && (
            <EmapthConversationScreen onNavigate={setMode} />
          )}

          {mode === EMPATH_MODES.LETTER && <LetterMain />}

          {mode === EMPATH_MODES.HOME && <HomepageMain />}

          {mode === EMPATH_MODES.GAME && (
            <div className="flex h-full items-center justify-center text-purple-300 text-xl">
              🎮 Mini Game Coming Soon…
            </div>
          )}

          {mode === EMPATH_MODES.MUSIC && (
            <div className="flex h-full items-center justify-center text-purple-300 text-xl">
              🎵 Music Mode Coming Soon…
            </div>
          )}
        </div>

        {/* Optional Manual Navigation */}
        <div className="mt-4 flex justify-center gap-3">
          <NavButton label="💬 Chat" active={mode === EMPATH_MODES.CHAT} onClick={() => setMode(EMPATH_MODES.CHAT)} />
          <NavButton label="✉️ Letter" active={mode === EMPATH_MODES.LETTER} onClick={() => setMode(EMPATH_MODES.LETTER)} />
          <NavButton label="🏠 Home" active={mode === EMPATH_MODES.HOME} onClick={() => setMode(EMPATH_MODES.HOME)} />
          <NavButton label="🎮 Game" active={mode === EMPATH_MODES.GAME} onClick={() => setMode(EMPATH_MODES.GAME)} />
        </div>
      </div>
    </div>
  )
}

function NavButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-medium transition-all ${
        active
          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
          : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700"
      }`}
    >
      {label}
    </button>
  )
}
