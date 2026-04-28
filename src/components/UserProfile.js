import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Award, Zap, Shield, Droplet, TreePine, 
  MapPin, Activity, CheckCircle2, TrendingUp, Settings2, ChevronRight
} from 'lucide-react';

// --- MOCK DATA ---
const PROFILE_DATA = {
  name: "Arjun Kumar",
  title: "Civic Validator",
  joinDate: "Joined Jan 2025",
  avatar: "https://i.pravatar.cc/150?u=admin_arjun",
  metrics: {
    actions: "142",
    points: "3.4k",
    rank: "5%",
  },
  badges: [
    { icon: Droplet, label: "Water Guardian", color: "text-[#a8c7fa]", bg: "bg-[#004a77]" },
    { icon: Shield, label: "First Responder", color: "text-[#ffb4ab]", bg: "bg-[#93000a]" },
    { icon: TreePine, label: "Eco Warrior", color: "text-[#6dd58c]", bg: "bg-[#0f5223]" },
  ],
  activityLog: [
    { id: 1, action: "Verified Water Leakage", location: "Koramangala 4th Block", time: "2h ago" },
    { id: 2, action: "Reported Illegal Parking", location: "Indiranagar 100ft Rd", time: "Yesterday" },
    { id: 3, action: "Offset 3 Cars (Trees)", location: "HSR Layout Sector 2", time: "Oct 24" },
    { id: 4, action: "Resolved Garbage Dump", location: "JP Nagar Phase 1", time: "Oct 21" },
  ]
};

// Generate GitHub-style heatmap data (last ~84 days = 12 weeks * 7 days)
const generateHeatmap = () => {
  const days = [];
  for (let i = 0; i < 84; i++) {
    // Random intensity 0-4
    const intensity = Math.random() > 0.5 ? Math.floor(Math.random() * 4) + 1 : 0;
    days.push(intensity);
  }
  return days;
};

const HEATMAP_DATA = generateHeatmap();

const INTENSITY_COLORS = {
  0: "bg-[#2d2f31]", 
  1: "bg-[#0e4429]",
  2: "bg-[#006d32]",
  3: "bg-[#26a641]",
  4: "bg-[#39d353]", 
};

export default function UserProfile() {
  return (
    <motion.div 
      key="tab-profile"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full absolute inset-0 bg-[#131314] overflow-y-auto [&::-webkit-scrollbar]:hidden"
    >
      {/* Header Profile Section */}
      <div className="px-8 pt-10 pb-8 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img 
                src={PROFILE_DATA.avatar} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#131314] rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-[#a8c7fa] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-[#004a77] stroke-[3]" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[22px] font-medium text-[#e3e3e3] tracking-tight leading-snug">
                {PROFILE_DATA.name}
              </h2>
              <div className="flex items-center gap-2 text-[13px] text-[#c4c7c5]">
                <span className="font-medium text-[#a8c7fa]">{PROFILE_DATA.title}</span>
                <span>&middot;</span>
                <span>Bengaluru Area</span>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-[#282a2c] text-[#c4c7c5] hover:text-[#e3e3e3] transition-colors">
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metrics Row (Material 3 Tonal Cards) */}
      <div className="px-8 pb-8 shrink-0">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#282a2c] rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-xs font-medium text-[#c4c7c5] mb-1">Actions</span>
            <span className="text-2xl font-normal text-[#e3e3e3] tracking-tight">{PROFILE_DATA.metrics.actions}</span>
          </div>
          <div className="bg-[#282a2c] rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-xs font-medium text-[#c4c7c5] mb-1">Points</span>
            <span className="text-2xl font-normal text-[#e3e3e3] tracking-tight">{PROFILE_DATA.metrics.points}</span>
          </div>
          <div className="bg-[#004a77] rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-xs font-medium text-[#a8c7fa]/80 mb-1">Top Rank</span>
            <span className="text-2xl font-medium text-[#a8c7fa] tracking-tight">{PROFILE_DATA.metrics.rank}</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="px-8 pb-8 shrink-0">
        <h3 className="text-sm font-medium text-[#e3e3e3] mb-4">Credentials</h3>
        <div className="flex flex-wrap gap-2">
          {PROFILE_DATA.badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${badge.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${badge.color}`} />
                <span className={`text-[13px] font-medium ${badge.color}`}>{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* GitHub-style Contribution Heatmap */}
      <div className="px-8 pb-8 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#e3e3e3]">Activity matrix</h3>
          <span className="text-xs text-[#c4c7c5]">Last 90 days</span>
        </div>
        
        <div className="flex items-center justify-center p-5 bg-[#1e1e20] rounded-2xl border border-[#2d2f31]">
          <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
            {HEATMAP_DATA.map((intensity, i) => (
              <div 
                key={i} 
                className={`w-[10px] h-[10px] rounded-[2px] ${INTENSITY_COLORS[intensity]}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="px-8 pb-10 shrink-0 flex-1">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-medium text-[#e3e3e3]">Recent logs</h3>
          <button className="text-[13px] font-medium text-[#a8c7fa] hover:text-[#d3e3fd] transition-colors flex items-center">
            View all <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
        <div className="space-y-2">
          {PROFILE_DATA.activityLog.map((log) => (
            <div key={log.id} className="flex items-center gap-4 group cursor-pointer p-3 -mx-3 rounded-xl hover:bg-[#282a2c] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#1e1e20] border border-[#2d2f31] flex items-center justify-center shrink-0 group-hover:bg-[#131314] transition-colors">
                <Activity className="w-4 h-4 text-[#a8c7fa]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[#e3e3e3] truncate">{log.action}</p>
                <div className="flex items-center gap-1.5 text-[13px] text-[#c4c7c5]">
                  <span className="truncate">{log.location}</span>
                  <span>&middot;</span>
                  <span className="shrink-0">{log.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
