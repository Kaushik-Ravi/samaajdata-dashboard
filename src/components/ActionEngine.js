import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';
import { 
  X, ChevronRight, Mail, Share2, Camera, CheckCircle2, 
  AlertTriangle, ShieldAlert, PackageSearch, PenTool, Check, ArrowLeft, Sparkles, MapPin
} from 'lucide-react';

export default function ActionEngine({ selectedIssue, closeCard, ISSUE_CONFIG, onActionComplete }) {
  const [actionLevel, setActionLevel] = useState(null);
  const [civicPoints, setCivicPoints] = useState(0);
  const [actionCompleted, setActionCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [shareFile, setShareFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef(null);

  // Heavy Lifter Pipeline State
  const [activePipelineStep, setActivePipelineStep] = useState(0);

  useEffect(() => {
    // For Confetti
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const completeAction = (points) => {
    setCivicPoints(points);
    setActionCompleted(true);
    setShowConfetti(true);
    if (onActionComplete) {
      onActionComplete(selectedIssue.id);
    }
  };

  useEffect(() => {
    if (actionCompleted && certificateRef.current) {
      setIsGenerating(true);
      // Small delay to ensure the DOM has fully rendered the certificate
      const timer = setTimeout(async () => {
        try {
          const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true, backgroundColor: '#09090b' });
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], 'samaajdata-impact.png', { type: 'image/png' });
              setShareFile(file);
            }
            setIsGenerating(false);
          }, 'image/png');
        } catch (err) {
          console.error('Pre-generating certificate failed', err);
          setIsGenerating(false);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [actionCompleted]);

  const handleShare = async () => {
    let finalShareFile = shareFile;
    if (!finalShareFile) {
      if (!certificateRef.current) return;
      setIsGenerating(true);
      try {
        const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true, backgroundColor: '#09090b' });
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error('Canvas to Blob failed');
        finalShareFile = new File([blob], 'samaajdata-impact.png', { type: 'image/png' });
        setShareFile(finalShareFile);
      } catch (err) {
        console.error('Synchronous generation failed', err);
        setIsGenerating(false);
        return;
      }
      setIsGenerating(false);
    }

    try {
      if (navigator.canShare && navigator.canShare({ files: [finalShareFile] })) {
        await navigator.share({
          files: [finalShareFile],
          title: 'Civic Impact Certificate',
          text: `I just resolved a ${selectedIssue.threatLevel.toLowerCase()} ${selectedIssue.type.toLowerCase()} issue in my city. Join me on SamaajData!`,
        });
      } else {
        // Fallback if browser doesn't support file sharing
        const link = document.createElement('a');
        link.href = URL.createObjectURL(finalShareFile);
        link.download = 'samaajdata-impact.png';
        link.click();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Sharing failed, falling back to download', err);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(finalShareFile);
        link.download = 'samaajdata-impact.png';
        link.click();
      }
    }
  };

  const IssueIcon = ISSUE_CONFIG[selectedIssue.type]?.icon || AlertTriangle;
  const issueColor = ISSUE_CONFIG[selectedIssue.type]?.color || '#ffffff';

  return (
    <motion.div 
      key={`issue-${selectedIssue.id}`}
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full overflow-y-auto absolute inset-0 bg-[#121212] z-10"
    >
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[5000]">
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.15}
            colors={['#10b981', '#fcd34d', '#3b82f6', '#f43f5e']}
          />
        </div>
      )}

      {/* Header Image (Animates to thumbnail when actionLevel is set) */}
      <motion.div 
        layout
        className={`relative w-full bg-zinc-800 shrink-0 overflow-hidden ${actionLevel ? 'h-28 rounded-b-3xl' : 'h-64'}`}
      >
        <img src={selectedIssue.img} alt="Issue" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-black/20 opacity-90" />
        <button 
          onClick={closeCard}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black transition-colors z-10 shadow-lg shadow-black/20"
        >
          <X className="w-4 h-4" />
        </button>
        <motion.div layout className={`absolute left-6 ${actionLevel ? 'bottom-4' : 'bottom-6'}`}>
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-2 backdrop-blur-sm border border-white/10"
            style={{ backgroundColor: `${issueColor}cc` }} // slight transparency for premium feel
          >
            <IssueIcon className="w-3.5 h-3.5" />
            {selectedIssue.type}
          </div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div layout className="p-6 flex flex-col gap-6">
        <motion.div layout>
          <motion.h2 layout className={`${actionLevel ? 'text-xl' : 'text-3xl'} font-semibold text-white tracking-tight mb-2 leading-snug`}>
            {selectedIssue.heading}
          </motion.h2>
          <motion.p layout className="text-sm text-zinc-400 leading-relaxed">
            {actionLevel ? "Resolution mode active." : selectedIssue.description}
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!actionLevel && (
            <motion.div 
              key="initial-state"
              initial={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden', marginTop: -24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Date Captured</span>
                  <span className="text-sm font-medium text-zinc-200">{selectedIssue.date}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Threat Level</span>
                  <span className={`text-sm font-bold ${
                    selectedIssue.threatLevel === 'Critical' ? 'text-red-400' :
                    selectedIssue.threatLevel === 'High' ? 'text-orange-400' :
                    selectedIssue.threatLevel === 'Moderate' ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>
                    {selectedIssue.threatLevel}
                  </span>
                </div>
              </div>

              {/* Action Engine: Gamified Effort Levers with Google Tonal Tints */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">How much time can you spare?</h3>
                
                {/* 10 Seconds - Emerald Tint */}
                <button 
                  onClick={() => setActionLevel('10s')}
                  className="group relative w-full flex items-center justify-between p-5 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/30 transition-all text-left overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <div className="relative z-10">
                    <div className="text-base font-bold text-emerald-100 mb-0.5">10 Seconds</div>
                    <div className="text-xs text-emerald-500/80 font-medium">Verify issue status</div>
                  </div>
                  <div className="relative z-10 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-black tracking-wide border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    +2 XP
                  </div>
                </button>
                
                {/* 2 Minutes - Indigo Tint */}
                <button 
                  onClick={() => setActionLevel('2m')}
                  className="group relative w-full flex items-center justify-between p-5 rounded-2xl bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 hover:border-indigo-500/30 transition-all text-left overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <div className="relative z-10">
                    <div className="text-base font-bold text-indigo-100 mb-0.5">2 Minutes</div>
                    <div className="text-xs text-indigo-500/80 font-medium">Escalate officially</div>
                  </div>
                  <div className="relative z-10 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black tracking-wide border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                    +10 XP
                  </div>
                </button>

                {/* Heavy Lifter - Amber Tint */}
                <button 
                  onClick={() => setActionLevel('heavy')}
                  className="group relative w-full flex items-center justify-between p-5 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/30 transition-all text-left overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <div className="relative z-10">
                    <div className="text-base font-bold text-amber-100 mb-0.5">Heavy Lifter</div>
                    <div className="text-xs text-amber-500/80 font-medium">Pipeline resolution</div>
                  </div>
                  <div className="relative z-10 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-black tracking-wide border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                    +30 XP
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Solution Paths Based on Effort Level */}
          {actionLevel && !actionCompleted && (
            <motion.div
              key="action-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6"
            >
              <button 
                onClick={() => setActionLevel(null)}
                className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-1.5 w-max transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Select Different Effort
              </button>

              {/* 10 Seconds Path (Verify) */}
              {actionLevel === '10s' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Verify Status</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">Based on current intelligence, is this <strong className="text-zinc-200">{selectedIssue.type.toLowerCase()}</strong> hazard still active at this exact coordinate?</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => completeAction(2)}
                      className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Yes, still active
                    </button>
                    <button 
                      onClick={() => completeAction(2)}
                      className="flex-1 h-14 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm shadow-lg shadow-black/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4 text-zinc-400" /> No, it's resolved
                    </button>
                  </div>
                </div>
              )}

              {/* 2 Minutes Path (Official Report) */}
              {actionLevel === '2m' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Official Escalation</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">This will dispatch an automated, geo-tagged threat dossier to the regional civic authority.</p>
                  </div>
                  
                  {/* Google Workspace Style Document Preview */}
                  <div className="p-5 rounded-2xl bg-[#1e1e1e] border border-zinc-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800/60">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-300">To: Ward 44 Civic Board</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">system@samaajdata.org</div>
                      </div>
                    </div>
                    <div className="text-sm text-zinc-300 leading-relaxed font-serif">
                      <strong className="text-white">URGENT:</strong> Verified {selectedIssue.threatLevel.toLowerCase()} threat level incident regarding {selectedIssue.type.toLowerCase()} at exact coordinates [{selectedIssue.lat.toFixed(4)}, {selectedIssue.lng.toFixed(4)}]. Immediate intervention required.
                    </div>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
                      <Camera className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-xs font-medium text-zinc-300">evidence_img.jpg attached</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => completeAction(10)}
                    className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Dispatch Official Report
                  </button>
                </div>
              )}

              {/* Heavy Lifter Path (Horizontal Pipeline) */}
              {actionLevel === 'heavy' && (
                <div className="flex flex-col gap-6 overflow-hidden">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Ground Operations</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">Swipe through the operational pipeline for physical resolution.</p>
                  </div>
                  
                  {/* Pipeline Carousel */}
                  <div className="relative w-full h-[220px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activePipelineStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex flex-col items-center justify-center text-center gap-4"
                      >
                        {activePipelineStep === 0 && (
                          <>
                            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                              <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h5 className="text-base font-bold text-white">Phase 1: Assess & Secure</h5>
                            <p className="text-xs text-zinc-400 px-4">Establish a 2-meter safety perimeter. Ensure personal protective equipment (PPE) is worn before approaching.</p>
                          </>
                        )}
                        {activePipelineStep === 1 && (
                          <>
                            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                              <PackageSearch className="w-8 h-8" />
                            </div>
                            <h5 className="text-base font-bold text-white">Phase 2: Procure Materials</h5>
                            <p className="text-xs text-zinc-400 px-4">Locate the nearest civic hardware depot. For {selectedIssue.type.toLowerCase()}, specific industrial binders are required.</p>
                          </>
                        )}
                        {activePipelineStep === 2 && (
                          <>
                            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                              <PenTool className="w-8 h-8" />
                            </div>
                            <h5 className="text-base font-bold text-white">Phase 3: Execute & Log</h5>
                            <p className="text-xs text-zinc-400 px-4">Apply the fix. Capture 'After' evidence. Log the completion to close the threat ticket.</p>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Dots */}
                    <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
                      {[0, 1, 2].map(step => (
                        <div 
                          key={step} 
                          className={`w-2 h-2 rounded-full transition-all ${activePipelineStep === step ? 'bg-amber-400 w-4' : 'bg-zinc-700'}`}
                        />
                      ))}
                    </div>

                    {/* Invisible Hitboxes for Swiping/Clicking */}
                    <div className="absolute inset-0 flex">
                      <button 
                        className="flex-1 h-full cursor-w-resize" 
                        onClick={() => setActivePipelineStep(prev => Math.max(0, prev - 1))}
                      />
                      <button 
                        className="flex-1 h-full cursor-e-resize" 
                        onClick={() => setActivePipelineStep(prev => Math.min(2, prev + 1))}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (activePipelineStep < 2) {
                        setActivePipelineStep(prev => prev + 1);
                      } else {
                        completeAction(30);
                      }
                    }}
                    className="w-full h-14 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {activePipelineStep < 2 ? 'Next Phase' : 'Initiate Ground Ops'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Action Completed & Flex Engine */}
          {actionCompleted && (
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
              className="flex flex-col gap-6"
            >
              {/* Golden XP Reward Banner */}
              <div className="relative overflow-hidden flex flex-col items-center text-center gap-2 p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.1),transparent_70%)]" />
                <motion.div 
                  initial={{ y: 50, scale: 0 }}
                  animate={{ y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-500 to-yellow-200 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(234,179,8,0.4)] border-2 border-yellow-100"
                >
                  <Check className="w-8 h-8 text-yellow-900" strokeWidth={3} />
                </motion.div>
                <h4 className="text-xl font-bold text-white tracking-tight relative z-10">Issue Resolved</h4>
                <p className="text-sm text-zinc-400 relative z-10">
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                    +{civicPoints} Civic XP
                  </span> acquired.
                </p>
              </div>

              {/* Flex Preview Canvas */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-2">Your Impact Certificate</h3>
                
                {/* Certificate DOM to be captured */}
                <div 
                  ref={certificateRef}
                  className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-zinc-950 border border-zinc-800 flex flex-col"
                >
                  <div className="relative h-[45%] w-full">
                    <img src={`${selectedIssue.img}?t=${Date.now()}`} crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-zinc-950/60 to-zinc-950" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-white flex items-center justify-center font-black text-black text-xs">SD</div>
                      <span className="text-white font-bold text-xs tracking-widest uppercase shadow-black/50 drop-shadow-md">SamaajData</span>
                    </div>
                  </div>
                  
                  <div className="relative flex-1 p-6 flex flex-col justify-between -mt-6 z-10">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/30 mb-3 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-[10px] font-black text-yellow-400 tracking-wider">+{civicPoints} XP EARNED</span>
                      </div>
                      <h5 className="text-2xl font-black text-white leading-tight mb-2 tracking-tight">
                        {selectedIssue.type} Resolved
                      </h5>
                      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                        "{selectedIssue.heading}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-6">
                      <div>
                        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Agent</div>
                        <div className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                          Civic Ninja
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Date</div>
                        <div className="text-sm font-bold text-zinc-200">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Coordinates</div>
                        <div className="text-xs font-mono text-zinc-300 flex items-center gap-1.5 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                          {selectedIssue.lat.toFixed(6)}, {selectedIssue.lng.toFixed(6)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <button 
                    onClick={handleShare}
                    disabled={isGenerating}
                    className="w-full h-14 rounded-2xl bg-white text-black font-bold text-sm shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isGenerating ? (
                      <span className="animate-pulse flex items-center gap-2">
                        Generating Certificate...
                      </span>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5" /> Share Impact Certificate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
