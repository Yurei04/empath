
"use client"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizonalIcon } from "lucide-react";

export default function EmapthConversationInput({ inputValue, userInput, isLoading, sendMessage }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex gap-3 w-full">
            <Input
                type="text"
                className="flex-1 bg-gray-900/50 border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 h-12 text-base"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => userInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
            />
            <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 px-6 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={isLoading || !inputValue.trim()}
                onClick={sendMessage}
            >
                <SendHorizonalIcon className="w-5 h-5" />
            </Button>
        </div>
    );
}