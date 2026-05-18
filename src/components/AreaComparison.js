import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Activity, Sparkles,
  Zap, TreePine, Droplet, Target, ShieldCheck
} from 'lucide-react';

const fmt = (n) => {
  if (!n || n === 0) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 10_000)   return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
};

// ─── Head-to-head relative scoring ────────────────────────────────────────────
// Both regions scored simultaneously so the radar always shows WHICH IS BETTER.
// max(A, B) = 80. Works at any zoom level because it's comparative, not absolute.
const AXES = ['Green Cover', 'Sanitation', 'Health Infra', 'Field Activity', 'Resilience'];

const computeRelativeAxes = (rdA, rdB) => {
  const cA = rdA.counts || {};
  const cB = rdB.counts || {};
  const clamp = (v) => Math.max(5, Math.min(85, Math.round(v)));

  const norm = (a, b) => {
    const mx = Math.max(a, b, 1);
    return [clamp((a / mx) * 80), clamp((b / mx) * 80)];
  };

  const [gA, gB] = norm(cA['Trees']   || 0, cB['Trees']   || 0);
  const [sA, sB] = norm(cA['Toilets'] || 0, cB['Toilets'] || 0);
  const [hA, hB] = norm(cA['Health']  || 0, cB['Health']  || 0);
  const [fA, fB] = norm(cA['Action']  || 0, cB['Action']  || 0);

  // Resilience = inverted challenges — fewer issues = higher score
  const SKIP = ['Trees', 'Toilets', 'Health', 'Climate', 'Public Infra', 'Action'];
  const challA = Object.entries(cA).filter(([k]) => !SKIP.includes(k)).reduce((s,[,v]) => s+v, 0);
  const challB = Object.entries(cB).filter(([k]) => !SKIP.includes(k)).reduce((s,[,v]) => s+v, 0);
  const mx = Math.max(challA, challB, 1);
  const rA = clamp(80 - (challA / mx) * 75);
  const rB = clamp(80 - (challB / mx) * 75);

  return {
    A: { 'Green Cover': gA, 'Sanitation': sA, 'Health Infra': hA, 'Field Activity': fA, 'Resilience': rA },
    B: { 'Green Cover': gB, 'Sanitation': sB, 'Health Infra': hB, 'Field Activity': fB, 'Resilience': rB },
  };
};

// ─── Classification (unchanged — mirrors AreaIntelligence) ───────────────────
const ASSET_CATS  = ['Climate', 'Public Infra', 'Water'];
const ASSET_TYPES = ['Trees', 'Toilets'];

const classifyRegion = (rd) => {
  const counts  = rd.counts  || {};
  const actions = rd.actions || [];
  let facilityAssets = 0, facilityChallenges = 0;
  Object.entries(counts).forEach(([k, v]) => {
    if (k === 'Action') return;
    if (ASSET_CATS.includes(k) || ASSET_TYPES.includes(k)) facilityAssets += v;
    else facilityChallenges += v;
  });
  const totalActions = counts['Action'] || 0;
  const sample = Math.max(actions.length, 1);
  const ratio  = totalActions / sample;
  const assetA   = Math.round(actions.filter(a => a.civic_class === 'ASSET').length     * ratio);
  const momCount = Math.round(actions.filter(a => a.civic_class === 'MOMENTUM').length  * ratio);
  const challA   = Math.round(actions.filter(a => a.civic_class === 'CHALLENGE' || !a.civic_class).length * ratio);
  return {
    totalAssets:     facilityAssets + assetA,
    totalChallenges: facilityChallenges + challA,
    momentumCount:   momCount,
    totalActions,
    actionAssets:    assetA,
    actionChallenges:challA,
  };
};

// ─── Civic Score (0–100 composite for scoreboard) ────────────────────────────
const civicScore = (rd) => {
  const c = classifyRegion(rd);
  const total = Math.max(c.totalAssets + c.totalChallenges + c.totalActions, 1);
  const score = Math.round(
    ((c.totalAssets * 1.0) - (c.totalChallenges * 0.5) + (c.totalActions * 0.3)) / total * 100
  );
  return Math.max(0, Math.min(100, score));
};

// ─── Radar ────────────────────────────────────────────────────────────────────
const RadarChart = ({ dataA, dataB }) => {
  // SIZE 220 + viewBox padding 75 each side = 370 total — labels have safe clearance at all sides
  const SIZE = 220; const C = SIZE / 2; const R = SIZE * 0.36;
  const step = (Math.PI * 2) / AXES.length;
  const pt = (val, i) => {
    const a = i * step - Math.PI / 2;
    return { x: C + R * (val/100) * Math.cos(a), y: C + R * (val/100) * Math.sin(a) };
  };
  const pA = AXES.map((ax, i) => pt(dataA[ax] || 5, i));
  const pB = AXES.map((ax, i) => pt(dataB[ax] || 5, i));
  const pathOf = pts => pts.map((p,i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="relative flex items-center justify-center w-full h-[300px] my-2">
      <svg viewBox={`-75 -75 ${SIZE+150} ${SIZE+150}`} className="w-full h-full overflow-visible">
        {[0.25,0.5,0.75,1].map((s,i) => (
          <polygon key={i}
            points={AXES.map((_,j) => { const p=pt(s*100,j); return `${p.x},${p.y}`; }).join(' ')}
            fill="none" stroke="#27272a" strokeWidth="1"
          />
        ))}
        {AXES.map((_,i) => { const p=pt(100,i); return <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke="#27272a" strokeWidth="1"/>; })}
        {AXES.map((ax,i) => {
          const p = pt(142,i);
          const angle = i * step - Math.PI / 2;
          const anchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';
          return (
            <text key={ax} x={p.x} y={p.y} textAnchor={anchor} dominantBaseline="middle"
              fill="#a1a1aa" fontSize="8.5" fontWeight="bold" letterSpacing="1.2">
              {ax.toUpperCase()}
            </text>
          );
        })}
        <path d={pathOf(pB)} fill="rgba(168,85,247,0.09)" stroke="#a855f7" strokeWidth="1.5" strokeLinejoin="round"/>
        {pB.map((p,i) => <circle key={`b${i}`} cx={p.x} cy={p.y} r="3" fill="#a855f7"/>)}
        <path d={pathOf(pA)} fill="rgba(59,130,246,0.09)" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round"/>
        {pA.map((p,i) => <circle key={`a${i}`} cx={p.x} cy={p.y} r="3" fill="#3b82f6"/>)}
      </svg>
    </div>
  );
};

// ─── Metric Bar with optional composition strip ───────────────────────────────
const MetricBar = ({ label, sublabel, valueA, valueB, colorA, colorB, compA, compB }) => {
  const max = Math.max(valueA, valueB, 1);
  const pA  = Math.min(100, (valueA / max) * 100);
  const pB  = Math.min(100, (valueB / max) * 100);
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-300">{fmt(valueA)}</span>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
          {sublabel && <span className="text-[8px] text-zinc-400">{sublabel}</span>}
        </div>
        <span className="text-xs font-mono text-zinc-300">{fmt(valueB)}</span>
      </div>
      <div className="flex items-center gap-1 w-full h-1.5">
        <div className="flex-1 h-full bg-zinc-900 rounded-l-full overflow-hidden flex justify-end">
          <motion.div initial={{width:0}} animate={{width:`${pA}%`}} transition={{duration:0.8,ease:'easeOut'}} className={`h-full ${colorA} rounded-l-full`}/>
        </div>
        <div className="w-px h-3 bg-zinc-700 shrink-0"/>
        <div className="flex-1 h-full bg-zinc-900 rounded-r-full overflow-hidden">
          <motion.div initial={{width:0}} animate={{width:`${pB}%`}} transition={{duration:0.8,ease:'easeOut'}} className={`h-full ${colorB} rounded-r-full`}/>
        </div>
      </div>
      {/* Composition strip — only for Field Actions */}
      {compA && compB && (valueA > 0 || valueB > 0) && (
        <div className="flex gap-3 mt-0.5">
          <div className="flex-1 flex gap-1 items-center justify-end">
            {compA.map(({ label: l, pct, color }) => pct > 0 && (
              <span key={l} className={`text-[8px] font-bold tracking-wide px-1 py-px rounded ${color}`}>{l} {pct}%</span>
            ))}
          </div>
          <div className="w-px shrink-0"/>
          <div className="flex-1 flex gap-1 items-center">
            {compB.map(({ label: l, pct, color }) => pct > 0 && (
              <span key={l} className={`text-[8px] font-bold tracking-wide px-1 py-px rounded ${color}`}>{l} {pct}%</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Scoreboard row ───────────────────────────────────────────────────────────
const ScoreRow = ({ label, color, assets, issues, actions }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#121212] border border-[#27272a]">
    <div className={`w-2.5 h-2.5 rounded-full ${color} shrink-0`}/>
    <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase w-16 shrink-0">{label}</span>
    <div className="flex-1 flex gap-3">
      <div className="flex flex-col items-center">
        <span className="text-[8px] text-zinc-400 uppercase tracking-widest">Assets</span>
        <span className="text-sm font-bold text-emerald-400">{fmt(assets)}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[8px] text-zinc-400 uppercase tracking-widest">Issues</span>
        <span className="text-sm font-bold text-red-400">{fmt(issues)}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[8px] text-zinc-400 uppercase tracking-widest">Actions</span>
        <span className="text-sm font-bold text-blue-400">{fmt(actions)}</span>
      </div>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AreaComparison({ regionAData, regionBData, onExplore, SearchInputA, SearchInputB, setIsComparing }) {
  const axes   = computeRelativeAxes(regionAData, regionBData);
  const aggA   = classifyRegion(regionAData);
  const aggB   = classifyRegion(regionBData);
  const scoreA = civicScore(regionAData);
  const scoreB = civicScore(regionBData);

  const treesA   = regionAData.counts?.['Trees']   || 0;
  const treesB   = regionBData.counts?.['Trees']   || 0;
  const toiletsA = regionAData.counts?.['Toilets'] || 0;
  const toiletsB = regionBData.counts?.['Toilets'] || 0;

  // Action composition strips (% of total actions per region)
  const mkComp = (agg) => {
    const total = Math.max(agg.totalActions, 1);
    return [
      { label: 'Hands-on', pct: Math.round((agg.actionAssets    / total) * 100), color: 'text-emerald-400 bg-emerald-500/10' },
      { label: 'Community',pct: Math.round((agg.momentumCount   / total) * 100), color: 'text-purple-400 bg-purple-500/10' },
      { label: 'Audits',   pct: Math.round((agg.actionChallenges/ total) * 100), color: 'text-amber-400 bg-amber-500/10' },
    ];
  };

  const aLeadsGreenery   = treesA   > treesB   * 1.2 && treesA   > 0;
  const bLeadsGreenery   = treesB   > treesA   * 1.2 && treesB   > 0;
  const aLeadsSanitation = toiletsA > toiletsB * 1.2 && toiletsA > 0;
  const bLeadsSanitation = toiletsB > toiletsA * 1.2 && toiletsB > 0;
  const aMoreActions     = aggA.totalActions > aggB.totalActions && aggA.totalActions > 0;
  const bMoreActions     = aggB.totalActions > aggA.totalActions && aggB.totalActions > 0;
  const aMoreChallenges  = aggA.totalChallenges > aggB.totalChallenges && aggA.totalChallenges > 0;
  const bMoreChallenges  = aggB.totalChallenges > aggA.totalChallenges && aggB.totalChallenges > 0;
  const hasInsights = aLeadsGreenery || bLeadsGreenery || aLeadsSanitation || bLeadsSanitation ||
                      aMoreActions   || bMoreActions   || aMoreChallenges  || bMoreChallenges;

  return (
    <motion.div
      key="comparison-view"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
      className="p-8 flex flex-col gap-6 h-full overflow-y-auto absolute inset-0 bg-[#0A0A0A] z-[60] [&::-webkit-scrollbar]:hidden"
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button onClick={() => setIsComparing(false)} className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors w-max">
          <ArrowLeft className="w-4 h-4"/> Exit Comparison
        </button>
        <div>
          <h2 className="text-xl font-medium text-white tracking-tight mb-1">Civic Pulse</h2>
          <p className="text-sm text-zinc-400">Head-to-head neighborhood performance.</p>
        </div>
      </div>

      {/* Search inputs */}
      <div className="flex flex-col gap-3">{SearchInputA}{SearchInputB}</div>

      {/* Legend */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"/>
          <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Region A</span>
        </div>
        <span className="text-[9px] text-zinc-400 font-medium">Bigger polygon = better area</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Region B</span>
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500"/>
        </div>
      </div>

      {/* Radar — head-to-head relative axes */}
      <RadarChart dataA={axes.A} dataB={axes.B}/>

      {/* Axis legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-2 -mt-3">
        {[
          { name: 'Green Cover',   desc: 'Tree density' },
          { name: 'Sanitation',    desc: 'Public toilet access' },
          { name: 'Health Infra',  desc: 'Health facility coverage' },
          { name: 'Field Activity',desc: 'Ninja action density' },
          { name: 'Resilience',    desc: 'Fewer active issues' },
        ].map(({ name, desc }) => (
          <div key={name} className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">{name}</span>
            <span className="text-[8px] text-zinc-400">{desc}</span>
          </div>
        ))}
      </div>

      {/* Metric bars */}
      <div className="flex flex-col gap-5 pt-5 border-t border-zinc-800/60">
        <MetricBar label="Assets"        sublabel="Trees + Toilets + civic infra"
          valueA={aggA.totalAssets}     valueB={aggB.totalAssets}
          colorA="bg-emerald-500"       colorB="bg-emerald-400"/>
        <MetricBar label="Issues"        sublabel="Active civic challenges"
          valueA={aggA.totalChallenges} valueB={aggB.totalChallenges}
          colorA="bg-red-500"           colorB="bg-red-400"/>
        <MetricBar
          label="Field Actions"
          sublabel="Hands-on · Community · Audit"
          valueA={aggA.totalActions} valueB={aggB.totalActions}
          colorA="bg-blue-500"       colorB="bg-blue-400"
          compA={mkComp(aggA)}       compB={mkComp(aggB)}
        />
      </div>

      {/* Scoreboard — 2-row summary */}
      <div className="flex flex-col gap-2">
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
          <ShieldCheck className="w-3 h-3"/> Civic Scorecard
        </span>
        <ScoreRow label="Region A" color="bg-blue-500" 
          assets={aggA.totalAssets} issues={aggA.totalChallenges} actions={aggA.totalActions}/>
        <ScoreRow label="Region B" color="bg-purple-500" 
          assets={aggB.totalAssets} issues={aggB.totalChallenges} actions={aggB.totalActions}/>
      </div>

      {/* Intelligence Insights */}
      <div className="flex flex-col gap-3">
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500"/> Intelligence Insights
        </span>
        {aLeadsGreenery && (
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <TreePine className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"/>
            <div>
              <p className="text-sm text-white font-medium">Region A has more green cover</p>
              <p className="text-xs text-zinc-500 mt-0.5">{fmt(treesA)} trees vs {fmt(treesB)} in Region B.</p>
            </div>
          </div>
        )}
        {bLeadsGreenery && (
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <TreePine className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"/>
            <div>
              <p className="text-sm text-white font-medium">Region B has more green cover</p>
              <p className="text-xs text-zinc-500 mt-0.5">{fmt(treesB)} trees vs {fmt(treesA)} in Region A.</p>
            </div>
          </div>
        )}
        {aLeadsSanitation && (
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <Droplet className="w-4 h-4 text-blue-400 mt-0.5 shrink-0"/>
            <div>
              <p className="text-sm text-white font-medium">Better sanitation in Region A</p>
              <p className="text-xs text-zinc-500 mt-0.5">{fmt(toiletsA)} facilities vs {fmt(toiletsB)} in Region B.</p>
            </div>
          </div>
        )}
        {bLeadsSanitation && (
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <Droplet className="w-4 h-4 text-blue-400 mt-0.5 shrink-0"/>
            <div>
              <p className="text-sm text-white font-medium">Better sanitation in Region B</p>
              <p className="text-xs text-zinc-500 mt-0.5">{fmt(toiletsB)} facilities vs {fmt(toiletsA)} in Region A.</p>
            </div>
          </div>
        )}
        {aMoreActions && (
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <Zap className="w-4 h-4 text-purple-400 mt-0.5 shrink-0"/>
            <div>
              <p className="text-sm text-white font-medium">Higher field activity in Region A</p>
              <p className="text-xs text-zinc-500 mt-0.5">{fmt(aggA.totalActions)} civic actions recorded.</p>
            </div>
          </div>
        )}
        {bMoreActions && (
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <Zap className="w-4 h-4 text-purple-400 mt-0.5 shrink-0"/>
            <div>
              <p className="text-sm text-white font-medium">Higher field activity in Region B</p>
              <p className="text-xs text-zinc-500 mt-0.5">{fmt(aggB.totalActions)} civic actions recorded.</p>
            </div>
          </div>
        )}
        {aMoreChallenges && (
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <Target className="w-4 h-4 text-amber-400 mt-0.5 shrink-0"/>
            <div>
              <p className="text-sm text-white font-medium">Region A needs more attention</p>
              <p className="text-xs text-zinc-500 mt-0.5">{fmt(aggA.totalChallenges)} unresolved challenges detected.</p>
            </div>
          </div>
        )}
        {bMoreChallenges && (
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <Target className="w-4 h-4 text-amber-400 mt-0.5 shrink-0"/>
            <div>
              <p className="text-sm text-white font-medium">Region B needs more attention</p>
              <p className="text-xs text-zinc-500 mt-0.5">{fmt(aggB.totalChallenges)} unresolved challenges detected.</p>
            </div>
          </div>
        )}
        {!hasInsights && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-zinc-800/80">
            <Activity className="w-4 h-4 text-zinc-600 animate-pulse"/>
            <span className="text-xs text-zinc-500 font-medium">Monitoring region telemetry for anomalies…</span>
          </div>
        )}
      </div>

      <div className="pb-8"/>
    </motion.div>
  );
}
