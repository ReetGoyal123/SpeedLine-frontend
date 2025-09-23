"use client";

import { useState, useRef } from "react";
import { MessageCircle, Maximize2, Minimize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Hello! I'm your SpeedLine assistant. How can I help with train management today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState({ width: 380, height: 500 });
  const [isResizing, setIsResizing] = useState(false);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Check if API key is available
  const isApiKeyAvailable = !!GROQ_API_KEY;

  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(320, startWidth + (startX - e.clientX));
      const newHeight = Math.max(400, startHeight + (startY - e.clientY));
      
      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    if (!isApiKeyAvailable) {
      setMessages(prev => [...prev, 
        { role: "user", content: input },
        { role: "assistant", content: "Sorry, the chatbot is not configured properly. Please check the API key configuration." }
      ]);
      setInput("");
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [...messages, userMessage],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      const botReply = res.data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: "assistant", content: botReply }]);
    } catch (err: any) {
      console.error("Chatbot API error:", err);
      const errorMessage = err.response?.data?.error?.message || "Sorry, I'm having trouble connecting. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${errorMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chatbot Icon (Lower Right Corner) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl rounded-full p-4 border-2 border-blue-300 hover:shadow-2xl transition-all duration-300"
          onClick={() => setOpen(true)}
          aria-label="Open chatbot"
        >
          <MessageCircle className="text-white" size={32} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        </motion.button>
      </div>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={chatboxRef}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            style={{ 
              width: size.width, 
              height: size.height,
              right: '24px',
              bottom: '100px'
            }}
            className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden backdrop-blur-sm"
          >
            {/* Header with drag handle and resize indicator */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold text-lg">SpeedLine Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-blue-100 hover:text-white p-1 rounded transition-colors"
                  onClick={() => setSize(prev => ({ width: prev.width === 380 ? 500 : 380, height: prev.height }))}
                  aria-label="Toggle size"
                >
                  {size.width > 400 ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button
                  className="text-blue-100 hover:text-white p-1 rounded transition-colors"
                  onClick={() => setOpen(false)}
                  aria-label="Close chatbot"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Resize handle */}
              <div
                ref={resizeRef}
                onMouseDown={handleMouseDown}
                className="absolute -top-2 -left-2 w-6 h-6 cursor-nw-resize hover:bg-blue-500 rounded-full opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center"
                style={{ cursor: 'nw-resize' }}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Messages area */}
            <div 
              className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50" 
              style={{ maxHeight: size.height - 140 }}
            >
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${
                    msg.role === "user" 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-l-2xl rounded-tr-2xl" 
                      : "bg-white text-gray-800 rounded-r-2xl rounded-tl-2xl shadow-sm border"
                  } px-4 py-3 text-sm leading-relaxed`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-gray-500 px-4 py-3 rounded-r-2xl rounded-tl-2xl shadow-sm border">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Input area */}
            <div className="border-t bg-white px-6 py-4">
              <form
                className="flex items-center gap-3"
                onSubmit={e => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ask about train schedules, delays, or operations..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && !loading && sendMessage()}
                  disabled={loading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                  disabled={loading || !input.trim()}
                >
                  Send
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
