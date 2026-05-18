import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck } from 'lucide-react';


// Deterministic avatar colors — same palette as App.js NinjaAvatar
const NINJA_AVATAR_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];
const getNinjaColor = (id) => NINJA_AVATAR_COLORS[Number(id) % NINJA_AVATAR_COLORS.length];
const getNinjaInitial = (name) => name ? name.trim()[0].toUpperCase() : '?';


export default function NinjaTaskforce({ isLoggedIn, setShowLogin, activeNinjas }) {
  return (
    <motion.div 
      key="tab-people"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full absolute inset-0 bg-[#121212] overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-2 shrink-0 border-b border-zinc-800/50 bg-[#121212] z-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 shadow-inner">
            <Users className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight leading-snug">Ninja Taskforce</h2>
            <p className="text-xs text-zinc-400 font-medium tracking-wide">
              {activeNinjas.length} ACTIVE AGENTS IN SECTOR
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Real Content Layer (Always rendered, but blurred if not logged in) */}
        <div className={`flex flex-col h-full w-full transition-all duration-700 ease-out ${!isLoggedIn ? 'opacity-40 blur-[8px] scale-[0.98] pointer-events-none select-none' : ''}`}>
          {/* Authenticated Roster (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 pb-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Active Roster</h3>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{activeNinjas.length} ONLINE</span>
              </div>
              <div className="flex flex-col gap-3">
                {activeNinjas.map((ninja, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={ninja.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-800/60 transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0 select-none text-base"
                      style={{ backgroundColor: getNinjaColor(ninja.id) }}
                    >
                      {getNinjaInitial(ninja.name)}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-zinc-100 truncate">{ninja.name || `Agent #${String(ninja.id).slice(-4)}`}</span>
                        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50 shrink-0 uppercase tracking-widest">
                          Field Agent
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 truncate mt-0.5 font-medium tracking-wide">
                        {ninja.ward || 'Bengaluru'}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {activeNinjas.length === 0 && (
                  <div className="text-center p-6 bg-zinc-900/20 rounded-2xl border border-zinc-800/50 text-zinc-500 text-sm">
                    No active agents in the current map view. Pan to locate.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Floating Modal Layer (The Positive FOMO Gate) */}
        <AnimatePresence>
          {!isLoggedIn && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-black/20"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
                className="w-full max-w-sm bg-zinc-900/80 backdrop-blur-2xl border border-zinc-700/60 rounded-[32px] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-sky-500/5 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Users className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Join the Movement</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                    <strong className="text-zinc-200">{activeNinjas.length} Civic Ninjas</strong> are coordinating right now. Authenticate to sync with local war rooms and amplify your impact.
                  </p>
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="w-full h-14 rounded-2xl bg-white text-black font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" /> Activate Civic Profile
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
