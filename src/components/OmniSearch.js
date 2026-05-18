import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Maximize2, CornerDownLeft } from 'lucide-react';

const PLACEHOLDERS = [
  "How many trees were cut in Koramangala in 2024?",
  "Calculate offset for 3 cars in Indiranagar.",
  "Show me unresolved water issues near me.",
  "What is the safety index of JP Nagar Phase 2?",
  "Draft a report for the local ward officer."
];

export default function OmniSearch({ onExpand, onSend }) {
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (query.trim()) {
      onSend(query);
      setQuery('');
    } else {
      onExpand(); // If empty, just expand to assistant view
    }
  };

  return (
    <motion.div 
      initial={{ y: 50, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      className="absolute bottom-12 left-1/2 w-full max-w-2xl z-[300]"
    >
      <div className="relative group flex items-center bg-[#121212]/90 backdrop-blur-3xl border border-zinc-700/60 hover:border-zinc-500/80 rounded-[32px] p-3 pl-8 shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
        <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
        
        <div className="relative flex-1 h-12 ml-4 flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            {!query && (
              <motion.span
                key={placeholderIdx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center text-base font-medium text-zinc-400 pointer-events-none whitespace-nowrap"
              >
                {PLACEHOLDERS[placeholderIdx]}
              </motion.span>
            )}
          </AnimatePresence>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="w-full h-full bg-transparent text-base font-medium text-white placeholder-transparent focus:outline-none z-10"
            placeholder="Ask anything..."
          />
        </div>

        <div className="flex items-center gap-2 pr-2 shrink-0">
          <button 
            onClick={onExpand}
            className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors mr-2"
            title="Expand to Full Assistant"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSend}
            className="h-10 px-4 rounded-full flex items-center justify-center bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all gap-1.5"
          >
            <span className="text-sm font-bold">Enter</span>
            <CornerDownLeft className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
