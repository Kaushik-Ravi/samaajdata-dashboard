import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Sparkles, ArrowLeft, ChevronDown, Search, Loader2, User, Zap, Check } from 'lucide-react';
import AreaComparison from './AreaComparison';

// Google-tier smart number formatter — preserves granularity below 10K
const formatMetric = (n) => {
  if (!n || n === 0) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 10_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
};



const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1 min-w-[120px]" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors border ${isOpen ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900'}`}
      >
        <div className="flex flex-col items-start overflow-hidden">
          <span className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">{label}</span>
          <span className="text-xs font-semibold text-zinc-200 truncate w-full text-left">{value}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full mt-1.5 bg-[#121212] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden z-[5000] max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          >
            {options.map(opt => (
              <button 
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-zinc-800/50 transition-colors text-left"
              >
                <span className={`text-[11px] font-medium truncate pr-2 ${value === opt ? 'text-emerald-400' : 'text-zinc-300'}`}>{opt}</span>
                {value === opt && <Check className="w-3 h-3 text-emerald-500 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RegionSearchInput = ({ region, panToRegion, getMapCenter, mapCenter }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeoutRef = useRef(null);
  const reverseGeoTimeoutRef = useRef(null);
  // Ref so the mapCenter effect can read focus state without stale closure
  const isFocusedRef = useRef(false);
  useEffect(() => { isFocusedRef.current = isFocused; }, [isFocused]);

  // Auto reverse-geocode when the map moves — fires 600ms after pan settles
  useEffect(() => {
    if (!mapCenter) return;
    if (reverseGeoTimeoutRef.current) clearTimeout(reverseGeoTimeoutRef.current);
    reverseGeoTimeoutRef.current = setTimeout(async () => {
      if (isFocusedRef.current) return; // Don't overwrite while user is typing
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${mapCenter.lat}&lon=${mapCenter.lng}`
        );
        const data = await res.json();
        if (data && data.display_name) {
          // Show first 2 meaningful parts: "JP Nagar, Bengaluru"
          const parts = data.display_name.split(',');
          setQuery(parts.slice(0, 2).join(', ').trim());
        }
      } catch {
        // Silently fail — keep previous query intact
      } finally {
        setIsSearching(false);
      }
    }, 600);
    return () => { if (reverseGeoTimeoutRef.current) clearTimeout(reverseGeoTimeoutRef.current); };
  }, [mapCenter]);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (val.length > 2) {
      setIsSearching(true);
      setShowDropdown(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`
          );
          const data = await res.json();
          setResults(data || []);
        } catch (err) {
          console.error('Geocoding failed', err);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setResults([]);
      setShowDropdown(false);
      setIsSearching(false);
    }
  };

  const handleSelect = (result) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    // Keep showing the place name — never raw coordinates
    setQuery(result.display_name.split(',')[0].trim());
    setResults([]);
    setShowDropdown(false);
    panToRegion(lat, lon, region);
  };

  return (
    <div className="flex flex-col gap-1.5 relative">
      <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Region {region}</span>
      <div className="relative z-50">
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => { setIsFocused(true); if (results.length > 0) setShowDropdown(true); }}
          onBlur={() => { setIsFocused(false); setTimeout(() => setShowDropdown(false), 200); }}
          placeholder="Search for a neighbourhood, or move the map"
          className="w-full h-10 bg-black/20 border border-zinc-800/80 rounded-lg pl-10 pr-10 text-sm text-white outline-none transition-all focus:border-zinc-600 placeholder:text-zinc-600"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" strokeWidth={3} />
        )}
      </div>

      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#121212] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden py-1 max-h-48 overflow-y-auto z-[5000] [&::-webkit-scrollbar]:hidden"
          >
            {results.map((res, idx) => (
              <div
                key={idx}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(res);
                }}
                className="px-4 py-2 hover:bg-zinc-800/50 cursor-pointer flex flex-col gap-0.5 border-b border-zinc-800/50 last:border-0 transition-colors"
              >
                <span className="text-[12px] font-medium text-zinc-200 truncate">{res.display_name.split(',')[0]}</span>
                <span className="text-[10px] text-zinc-500 truncate">{res.display_name.split(',').slice(1).join(',')}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AreaIntelligence({ activeAreaIssues, activeAreaActions = [], activeActionFiltersList = { categories: [], actionTypes: [] }, regionAData, regionBData, impactFilter, setImpactFilter, actionTypeFilter, setActionTypeFilter, ISSUE_CONFIG, setActiveFilters, panToRegion, getMapCenter, mapCenters, onVerifyIssue, resolvedIssueIds = [], isComparing, setIsComparing, onIssueSelect }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showImpactFeed, setShowImpactFeed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Safety');
  const [exploredRegion, setExploredRegion] = useState(null);

  useEffect(() => {
    if (!isComparing) setExploredRegion(null);
  }, [isComparing]);

  const currentIssues = (isComparing && exploredRegion) ? (exploredRegion === 'A' ? regionAData?.issues || [] : regionBData?.issues || []) : activeAreaIssues;
  const currentActions = (isComparing && exploredRegion) ? (exploredRegion === 'A' ? regionAData?.actions || [] : regionBData?.actions || []) : activeAreaActions;
  const currentFilters = (isComparing && exploredRegion) ? (exploredRegion === 'A' ? regionAData?.filters || { categories: [], actionTypes: [] } : regionBData?.filters || { categories: [], actionTypes: [] }) : activeActionFiltersList;

  const assetsRef = useRef(null);
  const challengesRef = useRef(null);

  const scrollToRef = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // ─── Civic Classification Engine ─────────────────────────────────────────
  // Step 1: Get total action count from bounds aggregate
  const actionAggregate = currentIssues.find(issue => issue.subcategory === 'Action' || issue.type === 'Action');
  const totalActionCount = actionAggregate ? actionAggregate.count : currentActions.length;

  // Step 2: Classify actions by civic_class from tileEngine (ASSET / MOMENTUM / CHALLENGE)
  // currentActions is capped at 100 — extrapolate to full viewport count via ratio
  const sampleSize = Math.max(currentActions.length, 1);
  const actionAssetSample   = currentActions.filter(a => a.civic_class === 'ASSET').length;
  const momentumSample      = currentActions.filter(a => a.civic_class === 'MOMENTUM').length;
  const actionChallengeSample = currentActions.filter(a => a.civic_class === 'CHALLENGE' || !a.civic_class).length;

  const totalActionAssets     = Math.round(totalActionCount * (actionAssetSample / sampleSize));
  const momentumCount         = Math.round(totalActionCount * (momentumSample / sampleSize));
  const totalActionChallenges = Math.round(totalActionCount * (actionChallengeSample / sampleSize));

  // Step 3: Exclude Actions AND ANY Ninja-type data — Ninja subcategory in DB is 'Solve Ninjas', not 'Ninja'
  const unresolvedAreaIssues = currentIssues.filter(issue =>
    !resolvedIssueIds.includes(issue.id) &&
    issue.subcategory !== 'Action' && issue.type !== 'Action' &&
    !String(issue.type || '').toLowerCase().includes('ninja') &&
    !String(issue.subcategory || '').toLowerCase().includes('ninja')
  );

  const assetsMap = {};
  const challengesMap = {};
  let totalAssets = 0;
  let totalChallenges = 0;

  unresolvedAreaIssues.forEach(issue => {
    const type = issue.subcategory || issue.type || issue.category || 'Unknown';
    const category = issue.category === 'Cluster Aggregate'
        ? (['Trees', 'Toilets', 'Water', 'Health'].includes(type) ? 'Climate' : 'Other')
        : (issue.category || 'Other');
    const count = issue.count || 1;

    if (category === 'Climate' || category === 'Public Infra' || category === 'Water' || ['Trees', 'Toilets'].includes(type)) {
      assetsMap[type] = (assetsMap[type] || 0) + count;
      totalAssets += count;
    } else {
      challengesMap[type] = (challengesMap[type] || 0) + count;
      totalChallenges += count;
    }
  });

  // Step 4: Inject action contributions per specific type (NOT grouped — show each action type individually)
  // Build per-type sample counts, then extrapolate to full viewport count
  const actionTypeSample = {};
  currentActions.forEach(action => {
    const typeKey = action.actionType || action.intent || 'Civic Action';
    const cls = action.civic_class || 'CHALLENGE';
    if (!actionTypeSample[typeKey]) actionTypeSample[typeKey] = { cls, count: 0 };
    actionTypeSample[typeKey].count++;
  });

  const extrapolationRatio = sampleSize > 0 ? totalActionCount / sampleSize : 0;
  Object.entries(actionTypeSample).forEach(([typeKey, { cls, count }]) => {
    const scaledCount = Math.round(count * extrapolationRatio);
    if (scaledCount === 0) return;
    if (cls === 'ASSET') {
      assetsMap[typeKey] = (assetsMap[typeKey] || 0) + scaledCount;
      totalAssets += scaledCount;
    } else if (cls === 'CHALLENGE') {
      challengesMap[typeKey] = (challengesMap[typeKey] || 0) + scaledCount;
      totalChallenges += scaledCount;
    }
    // MOMENTUM actions are counted separately in momentumCount — not added to Assets/Issues
  });

  const sortedAssets = Object.entries(assetsMap).sort((a, b) => b[1] - a[1]);
  const sortedChallenges = Object.entries(challengesMap).sort((a, b) => b[1] - a[1]);



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
        {(isComparing && !exploredRegion) ? (
          <AreaComparison 
             regionAData={regionAData} 
             regionBData={regionBData} 
             setIsComparing={setIsComparing}
             SearchInputA={<RegionSearchInput region="A" panToRegion={panToRegion} getMapCenter={getMapCenter} mapCenter={mapCenters ? mapCenters.A : null} />}
             SearchInputB={<RegionSearchInput region="B" panToRegion={panToRegion} getMapCenter={getMapCenter} mapCenter={mapCenters ? mapCenters.B : null} />}
             onExplore={(region, filter) => {
               setExploredRegion(region);
               if (filter === 'Action') {
                 setShowImpactFeed(true);
                 setImpactFilter('All Categories');
                 setActionTypeFilter('All Types');
               } else if (filter) {
                 setShowImpactFeed(true);
                 setActiveFilters(prev => prev.includes(filter) ? prev : [...prev, filter]);
                 setImpactFilter(filter);
               }
               if (region === 'A' && mapCenters?.A) panToRegion(mapCenters.A.lat, mapCenters.A.lng, 'A');
               if (region === 'B' && mapCenters?.B) panToRegion(mapCenters.B.lat, mapCenters.B.lng, 'B');
             }}
          />
        ) : showImpactFeed ? (
          <motion.div 
            key="impact-feed-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="p-8 flex flex-col gap-6 h-full overflow-y-auto absolute inset-0 bg-[#0A0A0A] z-40"
          >
            {/* Header / Back Navigation */}
            <div className="flex flex-col gap-6">
              <button 
                onClick={() => {
                  setShowImpactFeed(false);
                  if (exploredRegion) setExploredRegion(null);
                }}
                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors w-max"
              >
                <ArrowLeft className="w-4 h-4" />
                {exploredRegion ? 'Back to Comparison' : 'Back to Dashboard'}
              </button>
              
              <div>
                <h2 className="text-xl font-medium text-white tracking-tight mb-1">
                  Area Impact Feed
                </h2>
                <p className="text-sm text-zinc-400">
                  Live feed of civic actions in this region.
                </p>
              </div>
            </div>

            {/* Enterprise Dual-Dropdown Filters */}
            <div className="flex gap-4 mt-2 pb-6 border-b border-zinc-800/80 -mx-8 px-8">
               <FilterDropdown 
                 label="Category" 
                 options={['All Categories', ...(currentFilters?.categories || []).sort()]} 
                 value={impactFilter} 
                 onChange={(val) => { 
                   setImpactFilter(val); 
                   setActionTypeFilter('All Types'); 
                 }} 
               />
               <FilterDropdown 
                 label="Action Type" 
                 options={['All Types', ...(currentFilters?.actionTypes || []).sort()]} 
                 value={actionTypeFilter} 
                 onChange={setActionTypeFilter} 
               />
            </div>

            {/* Seamless Enterprise Timeline */}
            <div className="relative mt-0 pb-8 pl-1">
              <div className="absolute top-6 bottom-4 left-[13px] w-px bg-zinc-800/80 z-0"></div>
              
              <div className="flex flex-col">
                {currentActions.filter(a => 
                  (impactFilter === 'All Categories' || (a.category || 'Other').toLowerCase() === impactFilter.toLowerCase()) && 
                  (actionTypeFilter === 'All Types' || (a.actionType || a.intent || 'Other').toLowerCase() === actionTypeFilter.toLowerCase())
                ).slice(0, 20).map((action, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={action.id || index}
                    onClick={() => {
                        if (panToRegion) panToRegion(action.lat, action.lng);
                        if (onIssueSelect && action.id) onIssueSelect(action.id);
                    }}
                    className="relative flex items-start gap-4 group cursor-pointer py-4"
                  >
                     {/* The Timeline Dot */}
                     <div className="relative z-10 w-[26px] h-[26px] rounded-full bg-[#0A0A0A] flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-[8px] h-[8px] rounded-full bg-zinc-700 transition-colors group-hover:bg-emerald-500 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"></div>
                     </div>
                     
                     {/* The Content */}
                     <div className="flex-1 flex flex-col pt-0.5">
                        <div className="flex items-center justify-between mb-1.5">
                           <span className="text-[12px] font-bold tracking-wide text-zinc-300 flex items-center gap-2">
                             <User className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                             Ninja #{String(action.id || Math.floor(Math.random()*9000)+1000).slice(-4)}
                           </span>
                           <span className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded uppercase ${action.sentiment === 'Urgent' ? 'text-amber-500 bg-amber-500/10' : action.sentiment === 'Negative' ? 'text-red-500 bg-red-500/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
                              {action.sentiment || 'Positive'}
                           </span>
                        </div>
                        <h4 className="text-[14px] font-medium text-white leading-relaxed mb-1.5 pr-2 group-hover:text-emerald-50 transition-colors">{action.heading || action.headline || action.description || 'Civic Action Recorded'}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                            {action.category && action.category !== 'Other' ? `${action.category} • ` : ''}
                            {action.actionType || action.intent || 'General Audit'}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-medium">{action.date || 'Recently'}</span>
                        </div>
                        {action.keyTags && action.keyTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {action.keyTags.map((tag, i) => (
                              <div key={i} className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wide bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                                {tag}
                              </div>
                            ))}
                          </div>
                        )}
                     </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : !showLeaderboard ? (
          <motion.div 
            key="dashboard-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-8 flex flex-col gap-6 h-full overflow-y-auto absolute inset-0 bg-[#0A0A0A]"
          >
            {/* Header Area */}
            <div className="flex flex-col gap-6">
              {exploredRegion && (
                <button 
                  onClick={() => setExploredRegion(null)}
                  className="flex items-center gap-2 text-xs font-medium text-emerald-500 hover:text-emerald-400 transition-colors w-max"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Comparison
                </button>
              )}
              <div>
                <h2 className="text-xl font-medium text-white tracking-tight">
                  Area Intelligence {exploredRegion && <span className="text-zinc-500 font-normal">| Region {exploredRegion}</span>}
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Metrics for the currently visible map area
                </p>
              </div>

              {/* Primary Action Button */}
              <button 
                onClick={() => setIsComparing(true)}
                className="w-full h-10 rounded-lg bg-white text-black font-semibold text-sm hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-sm"
              >
                + Compare Areas
              </button>

              {/* Vercel-Style Metric Card */}
              <div className="flex flex-col p-5 rounded-[16px] bg-[#121212] border border-[#27272a] shadow-lg">
                <div className="flex items-center justify-between">
                   {/* Assets */}
                   <div className="flex flex-col relative group cursor-pointer shrink-0" onClick={() => scrollToRef(assetsRef)} title={totalAssets.toLocaleString()}>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Assets</span>
                     <span className="text-2xl font-bold text-white flex items-center gap-1 leading-none tracking-tight">
                        {formatMetric(totalAssets)}
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
                     </span>
                   </div>

                   <div className="w-px h-8 bg-[#27272a]"></div>

                   {/* Challenges */}
                   <div className="flex flex-col relative group cursor-pointer" onClick={() => scrollToRef(challengesRef)} title={totalChallenges.toLocaleString()}>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Issues</span>
                     <span className="text-2xl font-bold text-white flex items-center gap-1 leading-none tracking-tight">
                        {formatMetric(totalChallenges)}
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
                     </span>
                   </div>

                   <div className="w-px h-8 bg-[#27272a]"></div>

                   {/* Momentum — Community & Engagement actions */}
                   <div className="flex flex-col relative group cursor-pointer" onClick={() => setShowImpactFeed(true)} title={momentumCount.toLocaleString()}>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-1.5">
                        Momentum
                        <span className="relative flex h-1.5 w-1.5 shrink-0 mt-px">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
                        </span>
                     </span>
                     <span className="text-2xl font-bold text-purple-400 flex items-center gap-1 leading-none tracking-tight group-hover:text-purple-300 transition-colors">
                        {formatMetric(momentumCount)}
                        <Zap className="w-3 h-3 text-purple-600 group-hover:text-purple-400 transition-colors" />
                     </span>
                   </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-[#27272a] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className={`w-1.5 h-1.5 rounded-full ${totalChallenges === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                     <span className="text-[11px] text-zinc-400 font-medium tracking-wide">SYSTEM: <span className={totalChallenges === 0 ? 'text-emerald-400' : 'text-amber-400'}>{totalChallenges === 0 ? 'NOMINAL' : 'ATTENTION'}</span></span>
                  </div>
                  <button onClick={() => setShowLeaderboard(true)} className="text-[10px] text-zinc-400 hover:text-white font-bold tracking-widest flex items-center gap-1 transition-colors uppercase">
                    Rankings <ArrowLeft className="w-3 h-3 rotate-180" />
                  </button>
                </div>
              </div>

            </div>

            <div className="w-full h-px bg-zinc-800/50" />

            {/* Zone: Local Assets */}
            <div className="flex flex-col gap-3 scroll-mt-6" ref={assetsRef}>
              <h3 className="text-xs font-semibold text-zinc-400">
                Verified Assets
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {sortedAssets.length === 0 ? (
                   <div className="col-span-2 p-4 rounded-xl border border-zinc-800 border-dashed flex items-center justify-center">
                     <p className="text-xs text-zinc-500">No assets in viewport.</p>
                   </div>
                ) : (
                  sortedAssets.map(([type, count], index) => {
                    const config = ISSUE_CONFIG[type] || ISSUE_CONFIG['Public Infra'] || { icon: Target, color: '#71717a' };
                    const IconComp = config.icon;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={type}
                        className="flex flex-col gap-2 p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-zinc-800/50 flex items-center justify-center">
                            <IconComp className="w-3.5 h-3.5 text-zinc-400" />
                          </div>
                          <span className="text-xs font-medium text-zinc-300 truncate">{type}</span>
                        </div>
                        <span className="text-xl font-semibold text-zinc-100">{count.toLocaleString()}</span>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Zone: Active Challenges */}
            <div className="flex flex-col gap-3 pb-8 scroll-mt-6" ref={challengesRef}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-zinc-400">
                  Active Challenges
                </h3>
              </div>
              
              <div className="flex flex-col gap-2">
                {sortedChallenges.length === 0 ? (
                   <div className="w-full p-4 rounded-xl border border-zinc-800 border-dashed flex items-center justify-center">
                     <p className="text-xs text-zinc-500">No active challenges detected.</p>
                   </div>
                ) : (
                  sortedChallenges.map(([type, count], index) => {
                    const config = ISSUE_CONFIG[type] || ISSUE_CONFIG['Public Infra'] || { icon: Target, color: '#71717a' };
                    const IconComp = config.icon;
                    const percentage = Math.min(100, (count / Math.max(1, totalChallenges)) * 100);
                    
                    return (
                      <div 
                        key={type} 
                        className="flex flex-col gap-3 p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-800/80 w-full"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                              <IconComp className="w-4 h-4 text-red-400" />
                            </div>
                            <span className="text-sm font-medium text-zinc-200">{type}</span>
                          </div>
                          <span className="text-base font-semibold text-zinc-100">{count.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                            className="h-full bg-red-500/80 rounded-full"
                          />
                        </div>
                      </div>
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
                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors w-max"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
              
              <div>
                <h2 className="text-xl font-medium text-white tracking-tight mb-1">
                  City Grid Rankings
                </h2>
                <p className="text-sm text-zinc-400">
                  Sector-level civic performance scores.
                </p>
              </div>
            </div>

            {/* In Development Placeholder */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-12">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Target className="w-7 h-7 text-zinc-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-zinc-300 mb-2">Rankings In Development</p>
                <p className="text-xs text-zinc-500 max-w-[220px] leading-relaxed">
                  City-wide civic performance ranking engine is being calibrated against real sensor telemetry.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Calibrating</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
