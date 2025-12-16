
"use client"
import { useState } from "react"
import EmapthConversationScreen from "./empathy-screen";
import LetterMain from "@/pages/empath-page/letter-main";
import HomepageMain from "@/pages/home-page/home-page-main";
import Image from "next/image";

export default function EmpathCore() {
    const [isLetterSending, setIsLetterSending] = useState(false);
    const [isHomeScreen, setIsMainMenu] = useState(false);
    const [isConversation, setIsConversation] = useState(true); // Default to conversation
    const [isMiniGame, setIsMiniGame] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
            <div className="w-full max-w-7xl mx-auto p-4">
                {/* Main Content Area */}
                <div className="w-full h-[calc(100vh-8rem)] rounded-2xl overflow-hidden backdrop-blur-xl bg-black/40 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
                    {isConversation ? (
                        <div className="w-full h-full">
                            <EmapthConversationScreen />
                        </div>    
                    ) : isLetterSending ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <LetterMain />
                        </div>
                    ) : isHomeScreen ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <HomepageMain />
                        </div>
                    ) : isMiniGame ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <div className="text-purple-300 text-xl">Mini Game Coming Soon...</div>
                        </div>        
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <div className="text-red-400 text-xl">System Error Loading....</div>
                        </div>
                    )}
                </div>

                {/* Navigation/Mode Switcher - Optional */}
                <div className="mt-4 flex justify-center gap-3">
                    <button 
                        onClick={() => {
                            setIsConversation(true);
                            setIsLetterSending(false);
                            setIsMainMenu(false);
                            setIsMiniGame(false);
                        }}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            isConversation 
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
                        }`}
                    >
                        💬 Chat
                    </button>
                    <button 
                        onClick={() => {
                            setIsConversation(false);
                            setIsLetterSending(true);
                            setIsMainMenu(false);
                            setIsMiniGame(false);
                        }}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            isLetterSending 
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
                        }`}
                    >
                        ✉️ Letter
                    </button>
                    <button 
                        onClick={() => {
                            setIsConversation(false);
                            setIsLetterSending(false);
                            setIsMainMenu(true);
                            setIsMiniGame(false);
                        }}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            isHomeScreen 
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
                        }`}
                    >
                        🏠 Home
                    </button>
                    <button 
                        onClick={() => {
                            setIsConversation(false);
                            setIsLetterSending(false);
                            setIsMainMenu(false);
                            setIsMiniGame(true);
                        }}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            isMiniGame 
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
                        }`}
                    >
                        🎮 Game
                    </button>
                </div>
            </div>
        </div>
    )
}