import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import EmapthConversationInput from "./empathy-input";
import { Card } from "../ui/card";

export default function EmapthConversation (
    userMessage, 
    botMessage, 
    isLoading
) {
    const [message, setMessage] = useState([userMessage || botMessage])
    const [inputValue, setInputValue] = useState("")

    const handleMessage = () => {
        if(!inputValue || inputValue.trim() === "") return;
        
    }

    return (
        <div>
            <ScrollArea
                className=""
            >
                <div className="">
                    {message.map((idx, mes) => {
                        <Card className="" key={idx}>

                        </Card>
                    })}
                </div>
            </ScrollArea>
            <div>
                <EmapthConversationInput
                    inputValue={inputValue}
                    userInput={setInputValue}
                    isLoading={isLoading}
                    sendMessage={handleMessage}
                />
            </div>
        </div>
    )
}