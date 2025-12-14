import { useState } from "react";
import EmapthConversationInput from "./empathy-input";
import EmapthConversation from "./empathy-messages";

export default function EmapthConversationScreen (

) {
    const [messageSent, setMessageSend] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    
    if(!data) {
        setIsLoading(true)
        return (
            <div>
                 
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full">
            <div className="">
                <EmapthConversation 
                    userMessage={user}
                    botMessage={bot}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}