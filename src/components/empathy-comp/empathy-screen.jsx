import { useState } from "react";
import EmapthConversationInput from "./empathy-input";
import EmapthConversation from "./empathy-messages";

export default function EmapthConversationScreen (

) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [metrics, setMetrics] = useState([])
    const [sessionId] = useState(() => "session_" + Math.random().toString(36).substring(2, 9))
    
    const sendMessage = async (userMessage) => {
        if(!userMessage || userMessage.trim()) return


        const newUserMessage = {role: "user", content: userMessage};
        setMessages(prev => [...prev, newUserMessage])
        setIsLoading(true)


        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "appplication/json"},
                body: JSON.stringify({
                    message: userMessage,
                    sessionId: sessionId,
                    stream: false,
                }),
            })

            const data = await response.json();

            const botMessage= { role: "empathy", content: data.response}
            setMessages(prev => [...prev, botMessage])


            if(data.metrics) {
                setMetrics(data.metrics)

            }


        } catch (error) {
            console.log("error: " , error)
            setMessages(prev => [
                ...prev, {
                role: "empathy", content: "Sorry something went wrong please try again later... "
                }
            ])

        } finally {
            setIsLoading(false)
        }


    }

    const sendMessageStreaming = async (userMessage) => {
        if(!userMessage.trim()) return

        const newUserMessage = {role: "user", content: userMessage}
        setMessages(prev => [...prev, newUserMessage])
        setIsLoading(true)


        try {
            const reponse = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    message: userMessage,
                    sessionId: sessionId,
                    stream: true
                })
            })

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            
            let fullResponse = "";

            setMessages(prev => [...prev, {role: "empathy", content: ""}])


            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.slice(6));

                        if (data.chunk) {
                        fullResponse += data.chunk;
                        // Update last message
                        setMessages(prev => {
                                const updated = [...prev];
                                updated[updated.length - 1].content = fullResponse;
                                return updated;
                            });
                        }

                        if (data.done && data.metrics) {
                            setMetrics(data.metrics);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Stream Error ", error)
        } finally {
            setIsLoading(false)
        }


    }

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
                    sendMessage={sendMessageStreaming}
                    messages={messages}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}