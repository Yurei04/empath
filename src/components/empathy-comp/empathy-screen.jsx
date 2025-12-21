import React, { useState, useRef, useEffect } from "react";

/**
 * EmapthConversationScreen.jsx
 * Replaces your previous component with robust streaming + metrics parsing
 */

function EmapthConversation({ messages, isLoading, sendMessage, suggestions, onInputChange, inputValue, metrics}) {
  return (
    <div className="flex flex-col h-full w-full bg-gray-950">
      {/* Header with Logo and Title */}
      <div className="border-b border-yellow-600/30 bg-gray-900/50 p-4 sm:p-6 transition-300">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-600 to-yellow-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-orange-500/30">
              💬
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                Empath AI
              </h1>
              <p className="text-sm text-yellow-600/70">
                Your supportive companion
              </p>
            </div>
          </div>

          {/* Right: Metrics */}
          {metrics && (
            <div className="bg-gray-900 border border-yellow-600/30 text-yellow-50 p-3 rounded-lg text-xs max-w-xs">
              <div><strong>Severity:</strong> {metrics.combinedSeverity ?? '—'}</div>
              <div><strong>Intervention:</strong> {metrics.interventionLevel ?? '—'}</div>
              <div><strong>Model:</strong> {metrics.model ?? '—'}</div>
            </div>
          )}

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
                I'm here to listen and support you. Share what's on your mind.
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
            value={inputValue}
            onChange={onInputChange}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(inputValue)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 border border-yellow-600/30 text-yellow-50 placeholder-yellow-600/50 rounded-xl px-4 py-3 sm:px-5 sm:py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
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
  const [input, setInput] = useState("");
  const [metrics, setMetrics] = useState(null); // stores emotion/distortion/combined metrics from server
  const sessionIdRef = useRef('session_' + Math.random().toString(36).substr(2, 9));
  const controllerRef = useRef(null); // for aborting streaming fetch
  const bufferRef = useRef(''); // used for streaming parsing across chunks

  const suggestions = [
    "I'm feeling overwhelmed today",
    "I need someone to talk to",
    "Help me understand my feelings",
    "I'm struggling with stress"
  ];

  // Cleanup on unmount - abort any ongoing fetch
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  // Helper: push a new message (atomic and safer)
  const pushMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  // Helper: replace last assistant message content (for streaming)
  const replaceLastAssistant = (content) => {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      // find last assistant message index from end
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].role === 'assistant') {
          updated[i] = { ...updated[i], content };
          return updated;
        }
      }
      // fallback: append assistant
      updated.push({ role: 'assistant', content });
      return updated;
    });
  };

  const processEventChunk = (eventStr) => {
    const lines = eventStr.split('\n');

    for (const line of lines) {
      if (!line.startsWith('data:')) continue;

      try {
        const data = JSON.parse(line.replace('data:', '').trim());

        if (data.chunk) {
          setMessages(prev => {
            const updated = [...prev];
            let idx = -1;

            for (let i = updated.length - 1; i >= 0; i--) {
              if (updated[i].role === 'assistant') {
                idx = i;
                break;
              }
            }

            if (idx === -1) {
              updated.push({ role: 'assistant', content: data.chunk });
            } else {
              updated[idx] = {
                ...updated[idx],
                content: (updated[idx].content || '') + data.chunk
              };
            }

            return updated;
          });
        }

        if (data.done) {
          setMetrics({
            emotionMetrics: data.emotionMetrics,
            distortionMetrics: data.distortionMetrics,
            combinedSeverity: data.combinedSeverity,
            interventionLevel: data.interventionLevel,
            model: data.model,
          });
        }

      } catch (err) {
        console.error('[SSE parse error]', err);
      }
    }
  };


  // Send message using streaming (SSE) if possible, robust parsing
  const sendMessageStreaming = async (userMessage) => {
    const message = (typeof userMessage === 'string') ? userMessage.trim() : '';
    if (!message) return;

    // abort previous stream request if any
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }

    // Append user message and an empty assistant placeholder in a single update to avoid ordering bugs
    setMessages(prev => [...prev, { role: 'user', content: message }, { role: 'assistant', content: '' }]);
    setIsLoading(true);
    bufferRef.current = '';
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId: sessionIdRef.current,
          stream: true
        }),
        signal
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let doneReading = false;

      while (!doneReading) {
        const { done, value } = await reader.read();
        if (done) {
          doneReading = true;
          break;
        }
        const chunkText = decoder.decode(value, { stream: true });
        bufferRef.current += chunkText;

        // Process complete SSE events separated by \n\n
        const parts = bufferRef.current.split('\n\n');
        // Keep the last part (it may be incomplete)
        bufferRef.current = parts.pop();

        for (const part of parts) {
          // each part may include multiple "data: " lines; process them
          try {
            processEventChunk(part);
          } catch (e) {
            console.error('[Frontend] processEventChunk error:', e);
          }
        }
      }

      // If bufferRef still has content (final event without trailing \n\n), process it
      if (bufferRef.current.trim()) {
        processEventChunk(bufferRef.current);
        bufferRef.current = '';
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('[Frontend] Streaming request aborted');
      } else {
        console.error('[Frontend] Streaming error:', error);
        // Replace assistant last message with an error notice
        setMessages(prev => {
          const updated = [...prev];
          let idx = -1;
          for (let i = updated.length - 1; i >= 0; i--) {
            if (updated[i].role === 'assistant') { idx = i; break;}
          }
          if (idx === -1) {
            updated.push({ role: 'assistant', content: "I'm sorry — something went wrong. Please try again."});
          } else {
            updated[idx] = { ...updated[idx], content: "I'm sorry — something went wrong. Please try again."};
          }
          return updated;
        });

        // fallback: try non-streaming once
        try {
          await sendMessageNoStreaming(message);
        } catch (e) {
          console.error('[Frontend] Fallback no-stream error:', e);
        }
      }
    } finally {
      setIsLoading(false);
      if (controllerRef.current) {
        controllerRef.current = null;
      }
    }
  };

  const sendMessageNoStreaming = async (userMessage) => {
    const message = (typeof userMessage === 'string') ? userMessage.trim() : '';
    if (!message) return;

    // Append user message (only) if not already appended
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId: sessionIdRef.current,
          stream: false
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      const assistantText = data.response || "I'm here to listen and support you. Could you share more?";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantText }]);

      // capture metrics if present
      if (data.emotionMetrics || data.distortionMetrics || data.combinedSeverity) {
        setMetrics({
          emotionMetrics: data.emotionMetrics,
          distortionMetrics: data.distortionMetrics,
          combinedSeverity: data.combinedSeverity,
          interventionLevel: data.interventionLevel,
        });
      }
    } catch (error) {
      console.error('[Frontend] No-stream error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Unified sendMessage that chooses streaming first
  const sendMessage = (text) => {
    if (!text || !text.trim()) return;
    setInput(""); // clear input immediately for better UX
    sendMessageStreaming(text);
  };

  // Allow clicking suggestions to send
  const handleSuggestionClick = (suggestion) => {
    setInput("");
    sendMessageStreaming(suggestion);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-950">
      <EmapthConversation
        messages={messages}
        isLoading={isLoading}
        sendMessage={(msg) => sendMessage(msg)}
        suggestions={suggestions}
        onInputChange={(e) => setInput(e.target.value)}
        inputValue={input}
        metrics={metrics}
      />
    </div>
  );
}
