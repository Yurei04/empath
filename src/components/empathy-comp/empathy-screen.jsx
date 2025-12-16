
"use client"
import { useState } from "react";
import EmapthConversation from "./empathy-messages";

export default function EmapthConversationScreen() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [sessionId] = useState(() => 'session_' + Math.random().toString(36).substr(2, 9));

  const sendMessageStreaming = async (userMessage) => {
    if (!userMessage.trim()) return;

    const newUserMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
          stream: true,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

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
      console.error('Streaming error:', error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = "I'm here to support you. Could you tell me more?";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Chat Area */}
      <EmapthConversation
        messages={messages}
        isLoading={isLoading}
        sendMessage={sendMessageStreaming}
      />
    </div>
  );
}