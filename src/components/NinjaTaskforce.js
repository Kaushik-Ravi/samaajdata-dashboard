import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Lock, ShieldCheck, MessageCircle, Send, Radio } from 'lucide-react';

export default function NinjaTaskforce({ isLoggedIn, setShowLogin, activeNinjas }) {
  // Mock communities tailored to specific localized contexts per user request
  const COMMUNITIES = [
    { id: 1, platform: 'WhatsApp', name: 'Water | Jayanagar Community', members: '243 online', icon: MessageCircle, color: '#10b981', bg: 'bg-emerald-500/10' },
    { id: 2, platform: 'Telegram', name: 'Safety Patrol | Koramangala', members: '1,204 members', icon: Send, color: '#0ea5e9', bg: 'bg-sky-500/10' },
    { id: 3, platform: 'Reddit', name: 'Builders Space | Bangalore', members: 'Top 5% Civic Forum', icon: Radio, color: '#f97316', bg: 'bg-orange-500/10' },
  ];

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
                    <div className="relative shrink-0">
                      <img src={ninja.img} alt={ninja.name} className="w-12 h-12 rounded-full border-2 border-zinc-800 object-cover" />
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#121212] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-zinc-100 truncate">{ninja.name}</span>
                        <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0 shadow-sm">
                          {ninja.xp} XP
                        </span>
                      </div>
                      <span className="text-xs text-zinc-400 truncate mt-0.5 font-medium tracking-wide">
                        {ninja.specialty} Specialist
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

          {/* Sector Comms (Fixed Footer) */}
          <div className="shrink-0 p-6 pt-5 border-t border-zinc-800/80 bg-[#121212]/95 backdrop-blur-xl relative z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                <Radio className="w-3 h-3 text-zinc-400" /> Sector Comms
              </h3>
              <div className="flex flex-col gap-3">
                {COMMUNITIES.map((comm) => (
                  <button 
                    key={comm.id}
                    className="group relative w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all text-left overflow-hidden"
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-10 h-10 rounded-full ${comm.bg} flex items-center justify-center shrink-0`}>
                         <comm.icon className="w-5 h-5" style={{ color: comm.color }} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{comm.name}</span>
                        <span className="text-xs text-zinc-500 mt-0.5">{comm.members}</span>
                      </div>
                    </div>
                    <div className="relative z-10 px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-bold tracking-wider group-hover:bg-zinc-700 transition-colors">
                      JOIN
                    </div>
                  </button>
                ))}
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
                {/* Subtle internal gradient for premium feel */}
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
