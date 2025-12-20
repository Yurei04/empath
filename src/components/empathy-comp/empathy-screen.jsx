import { useState } from "react";

function EmapthConversation({ messages, isLoading, sendMessage }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const suggestions = [
    "I'm feeling overwhelmed today",
    "I need someone to talk to",
    "Help me understand my feelings",
    "I'm struggling with stress"
  ];

  return (
    <div className="flex flex-col h-full w-full bg-gray-950">
      {/* Header with Logo and Title */}
      <div className="border-b border-yellow-600/30 bg-gray-900/50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-600 to-yellow-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-orange-500/30">
            💬
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Empath AI
            </h1>
            <p className="text-sm text-yellow-600/70">Your supportive companion</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 sm:px-6 lg:px-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-600 to-yellow-500 rounded-full flex items-center justify-center text-4xl sm:text-5xl mx-auto mb-4 shadow-xl shadow-orange-500/30">
                🤝
              </div>
              <h2 className="text-yellow-400 text-xl sm:text-2xl font-semibold mb-2">
                Welcome to Empath AI
              </h2>
              <p className="text-yellow-600/70 text-sm sm:text-base max-w-md">
                I'm here to listen and support you. Share what&apos;s on your mind.
              </p>
            </div>

            {/* Suggestions */}
            <div className="w-full max-w-2xl">
              <p className="text-yellow-500 text-sm font-medium mb-3 text-center">
                Try asking:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion)}
                    className="bg-gray-900 cursor-pointer border border-yellow-600/30 text-yellow-50 rounded-xl px-4 py-3 text-sm text-left hover:bg-gray-800 hover:border-yellow-500/50 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-orange-600 to-yellow-500' 
                    : 'bg-gray-800 border border-yellow-600/30'
                }`}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                
                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-4 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-orange-600 to-yellow-500 text-gray-950'
                      : 'bg-gray-900 text-yellow-50 border border-yellow-600/30'
                  }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 bg-gray-800 border border-yellow-600/30">
                🤖
              </div>
              <div className="bg-gray-900 border border-yellow-600/30 rounded-2xl px-5 py-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-yellow-600/30 bg-gray-900/50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 border border-yellow-600/30 text-yellow-50 placeholder-yellow-600/50 rounded-xl px-4 py-3 sm:px-5 sm:py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-orange-600 to-yellow-500 text-gray-950 font-semibold rounded-xl px-6 sm:px-8 py-3 sm:py-4 hover:from-orange-700 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base whitespace-nowrap"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

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
      // Simulated streaming response for demo
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      const simulatedResponse = "I understand you're sharing something important with me. I'm here to listen and support you. Could you tell me more about what you're experiencing?";
      
      for (let i = 0; i < simulatedResponse.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 20));
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = simulatedResponse.slice(0, i + 1);
          return updated;
        });
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
    <div className="flex flex-col w-full h-screen bg-gray-950">
      <EmapthConversation
        messages={messages}
        isLoading={isLoading}
        sendMessage={sendMessageStreaming}
      />
    </div>
  );
}