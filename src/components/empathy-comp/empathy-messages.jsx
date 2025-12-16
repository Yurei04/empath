
"use client"
import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import EmapthConversationInput from "./empathy-input";
import { Card } from "../ui/card";

export default function EmapthConversation({ messages, isLoading, sendMessage }) {    
    const scrollRef = useRef(null);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if(scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if(!inputValue || inputValue.trim() === "") return;
        sendMessage(inputValue);
        setInputValue("");
    };

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-4 max-w-4xl mx-auto">
                    {messages.length === 0 && (
                        <div className="text-center py-12 space-y-4">
                            <div className="text-6xl mb-4">🧠</div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Hi! I&apos;m here to listen.
                            </h2>
                            <p className="text-gray-400 text-lg">
                                What&apos;s on your mind today?
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2 justify-center">
                                <button 
                                    onClick={() => sendMessage("I'm feeling stressed")}
                                    className="px-4 py-2 bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/30 rounded-lg text-sm text-purple-300 transition-all"
                                >
                                    I&apos;m feeling stressed
                                </button>
                                <button 
                                    onClick={() => sendMessage("I need someone to talk to")}
                                    className="px-4 py-2 bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/30 rounded-lg text-sm text-purple-300 transition-all"
                                >
                                    I need someone to talk to
                                </button>
                                <button 
                                    onClick={() => sendMessage("Having a tough day")}
                                    className="px-4 py-2 bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/30 rounded-lg text-sm text-purple-300 transition-all"
                                >
                                    Having a tough day
                                </button>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div 
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                        >
                            <Card
                                className={`p-4 max-w-[85%] shadow-lg ${
                                    msg.role === 'user'
                                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-purple-400/50'
                                        : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border-gray-700/50'
                                }`}
                            >
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </Card>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start animate-in fade-in duration-300">
                            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 p-4 shadow-lg">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </Card>
                        </div>
                    )}

                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-purple-500/20 bg-gradient-to-r from-gray-900/50 to-purple-900/20 backdrop-blur-sm p-4">
                <div className="max-w-4xl mx-auto">
                    <EmapthConversationInput
                        inputValue={inputValue}
                        userInput={setInputValue}
                        isLoading={isLoading}
                        sendMessage={handleSendMessage}
                    />
                    <p className="text-center text-xs text-gray-500 mt-2">
                        ⚠️ In crisis? Call <span className="text-purple-400 font-semibold">988</span> (Suicide & Crisis Lifeline)
                    </p>
                </div>
            </div>
        </div>
    );
}
