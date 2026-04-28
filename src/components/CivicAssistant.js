import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUp } from 'lucide-react';

export default function CivicAssistant({ initialQuery, panToRegion }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'I am your Civic Intelligence Assistant. Ask me any question about your local infrastructure, safety, or environment, and I will help you find the answers.'
    }
  ]);
  const [inputValue, setInputValue] = useState(initialQuery || '');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const query = typeof text === 'string' && text.type !== 'click' ? text : inputValue;
    if (!query || !query.trim()) return;

    const newUserMsg = { id: Date.now(), role: 'user', content: query };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Response with Map Syncing Capability
    setTimeout(() => {
      let aiResponse = "I've analyzed the latest MCP intelligence regarding your query.";
      
      // Basic mock intent detection for map syncing
      if (query.toLowerCase().includes('indiranagar')) {
        aiResponse = "Navigating to Indiranagar sector. I've highlighted the recent active alerts in this grid.";
        if (panToRegion) panToRegion(12.9719, 77.6412); // Indiranagar coords
      } else if (query.toLowerCase().includes('trees') || query.toLowerCase().includes('offset')) {
        aiResponse = "To offset 3 cars locally, we recommend planting 15 native canopy trees. I have highlighted optimal planting zones in your viewport.";
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <motion.div 
      key="tab-assistant"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full absolute inset-0 bg-[#121212] overflow-hidden"
    >
      {/* Header Context Bar */}
      <div className="p-6 pb-4 shrink-0 border-b border-zinc-800/50 bg-[#121212] z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-inner">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight leading-snug">Civic Intelligence</h2>
          </div>
        </div>
      </div>

      {/* Chat History */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center shrink-0 mr-3 mt-0.5">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
            )}
            <div 
              className={`max-w-[85%] text-[15px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#1E1F20] text-white rounded-3xl px-5 py-3' 
                  : 'text-zinc-200 pt-0.5'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center shrink-0 mr-3 mt-0.5">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-zinc-400 pt-2 flex items-center gap-2 pl-2">
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-6 pt-2 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent relative z-10">
        <div className="relative flex items-end bg-[#1E1F20] border border-zinc-700/30 rounded-3xl p-2 shadow-xl focus-within:bg-[#2A2B2D] transition-colors">
          <textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Civic Intelligence..."
            className="w-full bg-transparent text-[15px] text-white placeholder-zinc-500 focus:outline-none resize-none py-3 px-4 max-h-32 custom-scrollbar"
            rows="1"
            style={{ minHeight: '44px' }}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mb-1 mr-1 transition-all disabled:opacity-30 disabled:hover:scale-100 disabled:bg-zinc-800 disabled:text-zinc-500 bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95"
          >
            <ArrowUp className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
