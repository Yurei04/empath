"use client"
import React, { useState } from "react"

import EmapthConversationScreen from "./empathy-screen"
import HomepageMain from "@/pages/home-page/home-page-main"
import LetterMain from "@/pages/empath-page/letter-main"
import { MessageSquare, Mail, Home, BookHeart } from 'lucide-react'
import BlogPage from "@/pages/blog-page/blog-page"

export default function EmpathCore() {
  const [view, setView] = useState("chat")

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-950 via-orange-950 to-yellow-950">
      <div className="w-full max-w-7xl mx-auto p-4 h-screen flex flex-col">
        <div className="w-full flex-1 rounded-2xl overflow-hidden backdrop-blur-xl bg-black/40 border border-yellow-500/20 shadow-2xl shadow-orange-500/10 flex flex-col">
          
          <div className="flex-1 overflow-y-auto">
            {view === "chat" && <EmapthConversationScreen onNavigate={setView} />}

            {view === "letter" && <LetterMain />}

            {view === "home" && <HomepageMain />}

            {view === "blog" && <BlogPage />}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-4 flex justify-center gap-3 flex-wrap shadow-2xl shadow-amber-500/20 backdrop-blur-xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 border border-amber-400/30 rounded-2xl px-5 sm:px-8 py-5 transition-all duration-500 hover:shadow-amber-500/30 hover:border-amber-400/50">
          <NavButton icon={MessageSquare} label="Chat" active={view === "chat"} onClick={() => setView("chat")} />
          <NavButton icon={Mail} label="Letter" active={view === "letter"} onClick={() => setView("letter")} />
          <NavButton icon={Home} label="Home" active={view === "home"} onClick={() => setView("home")} />
          <NavButton icon={BookHeart} label="Blog" active={view === "blog"} onClick={() => setView("blog")} />
        </div>
      
      </div>
    </div>
  )
}

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2 ${
        active
          ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg shadow-orange-500/50"
          : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-yellow-700/30 hover:border-yellow-600/50"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  )
}