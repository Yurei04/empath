"use client"

import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import EmapthConversationInput from "./empathy-input";
import { Card } from "../ui/card";

export default function EmapthConversation (
    sendMessage , 
    messages, 
    isLoading
) {    
    const scrollRef = useRef(null);
    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        if(scrollRef.current) {
            scrollRef.current.scrollIntoView({behavior: "smooth"})
        }
    }, [messages])

    const handleMessage = () => {
        if(!inputValue || inputValue.trim() === "") return;
        sendMessage(inputValue)
        setInputValue("")
    }

    return (
         <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        <p className="text-lg font-medium">Hi! I&apos;m here to listen.</p>
                        <p className="text-sm mt-2">What&apos;s on your mind today?</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <Card
                        key={idx}
                        className={`p-4 ${
                            msg.role === 'user'
                            ? 'ml-auto bg-blue-500 text-white max-w-[80%]'
                            : 'mr-auto bg-gray-100 text-gray-900 max-w-[80%]'
                        }`}
                    >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                    </Card>
                ))}

                {isLoading && (
                    <Card className="mr-auto bg-gray-100 p-4 max-w-[80%]">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                    </Card>
                )}

                <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="border-t p-4">
                <EmapthConversationInput
                    inputValue={inputValue}
                    userInput={setInputValue}
                    isLoading={isLoading}
                    sendMessage={handleSendMessage}
                />
            </div>
        </div>
    )
}