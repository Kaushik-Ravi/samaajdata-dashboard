import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Sparkles, ArrowLeft, ChevronDown, MoreHorizontal, Check } from 'lucide-react';

// Mock Leaderboard Data per Category
const MOCK_LEADERBOARDS = {
  'Safety': {
    data: [
      { rank: 1, name: "Indiranagar Block 4", score: 98, lat: 12.9719, lng: 77.6412 },
      { rank: 2, name: "Koramangala 3rd Block", score: 95, lat: 12.9279, lng: 77.6271 },
      { rank: 3, name: "Jayanagar 4th T Block", score: 92, lat: 12.9250, lng: 77.5938 },
      { rank: 4, name: "HSR Layout Sector 2", score: 89, lat: 12.9081, lng: 77.6476 },
      { rank: 5, name: "Whitefield Phase 1", score: 88, lat: 12.9698, lng: 77.7499 },
    ],
    currentRank: 14,
    currentScore: 82
  },
  'Greenery': {
    data: [
      { rank: 1, name: "Cubbon Park Edge", score: 99, lat: 12.9779, lng: 77.5952 },
      { rank: 2, name: "Lalbagh Botanical", score: 97, lat: 12.9507, lng: 77.5848 },
      { rank: 3, name: "HSR Layout Sector 2", score: 92, lat: 12.9081, lng: 77.6476 },
      { rank: 4, name: "Sadashivanagar", score: 90, lat: 13.0068, lng: 77.5816 },
      { rank: 5, name: "Malleswaram", score: 88, lat: 13.0033, lng: 77.5714 },
    ],
    currentRank: 8,
    currentScore: 85
  },
  'Cleanliness': {
    data: [
      { rank: 1, name: "Sadashivanagar", score: 97, lat: 13.0068, lng: 77.5816 },
      { rank: 2, name: "Jayanagar 4th T Block", score: 94, lat: 12.9250, lng: 77.5938 },
      { rank: 3, name: "Current Map View", score: 91, lat: 12.9716, lng: 77.5946, isCurrent: true },
      { rank: 4, name: "Koramangala 3rd Block", score: 89, lat: 12.9279, lng: 77.6271 },
      { rank: 5, name: "Indiranagar Block 4", score: 87, lat: 12.9719, lng: 77.6412 },
    ],
    currentRank: 3,
    currentScore: 91
  }
};

export default function AreaIntelligence({ activeAreaIssues, ISSUE_CONFIG, setActiveFilters, panToRegion, onVerifyIssue, resolvedIssueIds = [] }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Safety');

  // 1. Calculate aggregations
  const unresolvedAreaIssues = activeAreaIssues.filter(issue => !resolvedIssueIds.includes(issue.id));
  const totalAreaIssues = unresolvedAreaIssues.length;
  
  const areaIssueCounts = unresolvedAreaIssues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});

  const sortedAreaIssues = Object.entries(areaIssueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // 2. Dynamic Neighborhood Health Logic
  const totalResolvedInSession = resolvedIssueIds.length;
  const fixesNeeded = Math.max(1, 5 - (totalResolvedInSession % 5));
  const progressPercent = ((5 - fixesNeeded) / 5) * 100;

  // 3. Dynamic 30-Day Overview Logic
  let bestCategory = 'Air'; // default
  let lowestCount = Infinity;
  
  const allCategories = Object.keys(ISSUE_CONFIG);
  for (const cat of allCategories) {
    const count = areaIssueCounts[cat] || 0;
    if (count < lowestCount) {
      lowestCount = count;
      bestCategory = cat;
    }
  }

  // Map category to a positive phrase
  const positivePraiseMap = {
    'Air': 'Top Air Quality',
    'Water': 'Clean Waterways',
    'Safety': 'High Safety Rating',
    'Deforestation': 'Preserved Greenery',
    'Garbage': 'Clean Streets',
    'Traffic': 'Smooth Traffic',
    'Noise': 'Quiet Zone',
    'Electricity': 'Stable Grid',
    'Roads': 'Excellent Roads',
    'Encroachment': 'Clear Pathways'
  };

  // Best rating category name mapping
  const categoryRatingMap = {
    'Air': 'Air Quality',
    'Water': 'Water Safety',
    'Safety': 'Safety',
    'Deforestation': 'Greenery',
    'Garbage': 'Cleanliness',
    'Traffic': 'Traffic',
    'Noise': 'Quietness',
    'Electricity': 'Power Stability',
    'Roads': 'Infrastructure',
  };

  const bestRatingCategoryName = categoryRatingMap[bestCategory] || 'Safety';
  
  // Sync initial dropdown state
  useEffect(() => {
    if (MOCK_LEADERBOARDS[bestRatingCategoryName]) {
      setActiveCategory(bestRatingCategoryName);
    }
  }, [bestRatingCategoryName]);

  const praiseText = positivePraiseMap[bestCategory] || 'Excellent Area';
  const ratingName = bestRatingCategoryName;
  const resolvedCount = 12 + resolvedIssueIds.length;

  const currentLeaderboard = MOCK_LEADERBOARDS[activeCategory] || MOCK_LEADERBOARDS['Safety'];

  return (
    <motion.div 
      key="tab-area"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full absolute inset-0 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {!showLeaderboard ? (
          <motion.div 
            key="dashboard-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-8 flex flex-col gap-8 h-full overflow-y-auto absolute inset-0"
          >
            {/* Zone A: Neighborhood Health */}
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight mb-2 leading-snug">
                  Neighborhood Health
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Resolve <strong className="text-white">{fixesNeeded} more issues</strong> to take your area to the <button onClick={() => setShowLeaderboard(true)} className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4 decoration-emerald-500/50 hover:decoration-emerald-400 focus:outline-none transition-all">Top 10</button> in <strong className="text-emerald-400">{ratingName}</strong> rating.
                </p>
              </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mt-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          />
        </div>

        {/* Action Button */}
        <button 
          onClick={() => onVerifyIssue()}
          className="w-full h-12 mt-2 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors"
        >
          Verify Issues
        </button>
      </div>

      {/* Zone B: 30-Day Overview */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
          30-Day Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Issues Resolved</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xl font-semibold text-zinc-200">{resolvedCount}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Area Highlight</span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-zinc-200 leading-tight">{praiseText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone C: Current Local Challenges */}
      <div className="flex flex-col gap-3 pb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Current Local Challenges
          </h3>
          <span className="text-[10px] font-bold text-zinc-600">{totalAreaIssues} TOTAL</span>
        </div>
        
        <div className="flex flex-col gap-1">
          {sortedAreaIssues.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-4">No active challenges detected.</p>
          ) : (
            sortedAreaIssues.map(([type, count], index) => {
              const config = ISSUE_CONFIG[type];
              if (!config) return null;
              const IconComp = config.icon;
              const percentage = Math.min(100, (count / Math.max(1, totalAreaIssues)) * 100);
              
              return (
                <button 
                  key={type} 
                  onClick={() => onVerifyIssue(type)}
                  className="flex flex-col gap-2 p-3 rounded-xl hover:bg-zinc-900/40 transition-colors group text-left cursor-pointer w-full"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <IconComp className="w-4 h-4" style={{ color: config.color }} />
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{type}</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">{count}</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900/80 rounded-full overflow-hidden mt-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
          </motion.div>
        ) : (
          <motion.div 
            key="leaderboard-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="p-8 flex flex-col gap-6 h-full overflow-y-auto absolute inset-0"
          >
            {/* Header / Back Navigation */}
            <div className="flex flex-col gap-6">
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-white transition-colors w-max"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Area
              </button>
              
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight mb-2 leading-snug">
                  City Grid Rankings
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  The absolute highest performing sectors in the <strong className="text-white">{activeCategory}</strong> category.
                </p>
              </div>
            </div>

            {/* Category Dropdown Menu */}
            <div className="relative mb-2 z-50">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Category</span>
                  <span>{activeCategory}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {Object.keys(MOCK_LEADERBOARDS).map(cat => (
                      <button 
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center justify-between w-full p-4 hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-300 hover:text-white"
                      >
                        {cat}
                        {activeCategory === cat && <Check className="w-4 h-4 text-emerald-500" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* The Top 5 List */}
            <div className="flex flex-col">
              {currentLeaderboard.data.map((item, index) => (
                <button 
                  key={item.rank} 
                  onClick={() => {
                    panToRegion(item.lat, item.lng);
                    setShowLeaderboard(false);
                  }}
                  className={`flex items-center justify-between p-4 border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors group text-left cursor-pointer focus:outline-none ${item.isCurrent ? 'bg-emerald-500/10 border-emerald-500/20' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center pt-[1px] text-[11px] font-bold ${index === 0 ? 'bg-amber-400/20 text-amber-400' : index === 1 ? 'bg-zinc-300/20 text-zinc-300' : index === 2 ? 'bg-orange-400/20 text-orange-400' : item.isCurrent ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                      {item.rank}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold transition-colors ${item.isCurrent ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>{item.name}</span>
                      {item.isCurrent && <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">Your Position</span>}
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-400">{item.score}</span>
                </button>
              ))}
              
              {/* Conditional Rendering for Anchor (Only show if we aren't in the Top 5) */}
              {currentLeaderboard.currentRank > 5 && (
                <>
                  {/* Fade Away Visual Anchor */}
                  <div className="flex flex-col items-center justify-center py-4 text-zinc-700">
                    <MoreHorizontal className="w-5 h-5" />
                  </div>
                  
                  {/* Your Current View Anchor */}
                  <div className="mt-auto pb-8">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border-l-2 border-emerald-500">
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center pt-[1px] text-[11px] font-bold text-zinc-500">
                          {currentLeaderboard.currentRank}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white">Current Map View</span>
                          <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase mt-0.5">Your Position</span>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-bold text-emerald-400">{currentLeaderboard.currentScore}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
