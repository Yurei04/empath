import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizonalIcon } from "lucide-react";

export default function EmapthConversationInput (
    inputValue, userInput, isLoading, sendMessage
) {
    return (
        <div className="w-full">
            <Input
                type="text"
                className=""
                variant="ghost" 
                placeholder="Type your message... " 
                value={inputValue} 
                onChange={(e) => userInput(e.target.value)}
                disabled={isLoading}
            />
            <Button
                className=""
                variant="ghost"
                disabled={isLoading || !userInput.trim()}
                onClick={() => sendMessage()}
            >
                <SendHorizonalIcon 
                    className=""
                />
            </Button>
        </div>
    )
}
