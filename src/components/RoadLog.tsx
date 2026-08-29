import React, { useMemo, useEffect, useState } from 'react';
import { 
  Flame, 
  Trophy, 
  Activity, 
  Calendar, 
  Download, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Zap,
  Sparkles,
  Bot,
  Play,
  ShieldAlert,
  RefreshCw,
  HeartPulse,
  ChevronRight,
  AlertCircle,
  Wind,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { UserProgress, Routine, VehicleType, SorenessAssessmentResult } from '../types';
import { CURATED_ROUTINES } from '../data/exercises';

interface RoadLogProps {
  userProgress: UserProgress;
  onExportSummary: () => void;
  onStartRoutine?: (routine: Routine) => void;
  onOpenAICoach?: (initialPrompt?: string) => void;
  currentVehicle?: VehicleType;
}

export const RoadLog: React.FC<RoadLogProps> = ({
  userProgress,
  onExportSummary,
  onStartRoutine,
  onOpenAICoach,
  currentVehicle = 'car'
}) => {
  const streak = userProgress.currentStreakDays;
  const [showMilestoneBanner, setShowMilestoneBanner] = useState(false);

  // Soreness Assessment state
  const [selectedTensionAreas, setSelectedTensionAreas] = useState<string[]>([]);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<SorenessAssessmentResult | null>(null);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // Available tension zones to evaluate
  const tensionZoneOptions = [
    'Lower Back (Lumbar)',
    'Cervical Neck',
    'Upper Traps & Shoulders',
    'Hips & Piriformis (Sciatica)',
    'Wrists & Forearms (Carpal)',
    'Hamstrings & Glutes',
    'Calves & Ankles',
    'Thoracic Stiffness'
  ];

  // Auto-detect tension areas based on past history
  useEffect(() => {
    const detected = new Set<string>();
    
    // Check recent completed history
    userProgress.completedHistory.forEach(item => {
      const lower = item.title.toLowerCase();
      if (lower.includes('car') || lower.includes('neck') || lower.includes('commuter')) {
        detected.add('Cervical Neck');
        detected.add('Upper Traps & Shoulders');
      }
      if (lower.includes('rider') || lower.includes('two-wheeler') || lower.includes('motorcycle')) {
        detected.add('Hips & Piriformis (Sciatica)');
        detected.add('Wrists & Forearms (Carpal)');
      }
      if (lower.includes('spinal') || lower.includes('lumbar') || lower.includes('back')) {
        detected.add('Lower Back (Lumbar)');
        detected.add('Thoracic Stiffness');
      }
      if (lower.includes('quick') || lower.includes('pitstop')) {
        detected.add('Calves & Ankles');
      }
    });

    if (detected.size === 0) {
      detected.add('Lower Back (Lumbar)');
      detected.add('Cervical Neck');
    }

    setSelectedTensionAreas(Array.from(detected));
  }, [userProgress.completedHistory]);

  const toggleTensionArea = (area: string) => {
    setSelectedTensionAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  // Run the AI Assessment
  const handleRunAssessment = async () => {
    setIsAssessing(true);
    setAssessmentError(null);

    try {
      const res = await fetch('/api/coach/soreness-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedHistory: userProgress.completedHistory,
          currentSorenessAreas: selectedTensionAreas,
          vehicle: currentVehicle,
          totalMinutesStretched: userProgress.totalMinutesStretched,
          streak: userProgress.currentStreakDays
        })
      });

      if (!res.ok) {
        throw new Error('Assessment service is unavailable');
      }

      const data: SorenessAssessmentResult = await res.json();
      setAssessmentResult(data);
    } catch (err: any) {
      console.warn('Falling back to local biomechanics calculation:', err);
      // Client-side fallback if server is offline
      const areaString = selectedTensionAreas.join(', ');
      let routineId = 'routine-spinal-15min';
      let routineTitle = '15-Min Complete Spinal Decompression';
      let duration = 15;

      if (areaString.toLowerCase().includes('neck') || areaString.toLowerCase().includes('shoulder')) {
        routineId = 'routine-car-10min';
        routineTitle = '10-Min In-Seat Commuter Reset';
        duration = 10;
      } else if (currentVehicle === 'two-wheeler' || areaString.toLowerCase().includes('wrist')) {
        routineId = 'routine-rider-12min';
        routineTitle = '12-Min Motorcyclist & Rider Reset';
        duration = 12;
      }

      setAssessmentResult({
        diagnosisTitle: 'Acute Lumbar Flexion Loading & Postural Slump',
        diagnosisExplanation: `Extended static seating while controlling the vehicle has compressed your spinal vertebrae and tightened the ${selectedTensionAreas.slice(0, 2).join(' & ')}.`,
        riskLevel: 'Moderate Compression',
        suggestedRoutineId: routineId,
        suggestedRoutineTitle: routineTitle,
        suggestedRoutineDuration: duration,
        matchReason: `Targeted exercises directly decompress the axial skeleton and alleviate tension in your reported ${areaString}.`,
        acuteMicroReliefCue: 'Occipital Chin Retraction: Press back of head straight into the headrest for 5s without nodding down. Repeat 3 times.',
        keyTargetMuscles: ['Erector Spinae', 'Psoas Major', 'Upper Trapezius', 'Piriformis'],
        breathingPrescription: 'Inhale 4s through nose into lower ribs, exhale 6s slowly through lips.',
        recommendedExercises: [
          {
            name: 'Occipital Chin Tuck & Axial Lengthening',
            target: 'Cervical Spine',
            cue: 'Lengthen crown to ceiling like a marionette string.',
            duration: '45s'
          },
          {
            name: 'Seated Figure-4 Piriformis Release',
            target: 'Hips & Sciatica',
            cue: 'Hinge forward from hip crease with flat lumbar spine.',
            duration: '60s'
          },
          {
            name: 'Pelvic Clock & Lumbar Mobilizer',
            target: 'Lower Back',
            cue: 'Fluidly tilt pelvis between 12 and 6 o clock to hydrate discs.',
            duration: '60s'
          }
        ]
      });
    } finally {
      setIsAssessing(false);
    }
  };

  // Launch suggested routine directly
  const handleLaunchPrescribedRoutine = () => {
    if (!assessmentResult) return;
    
    // Find in curated routines or match closest
    const found = CURATED_ROUTINES.find(r => r.id === assessmentResult.suggestedRoutineId) || CURATED_ROUTINES[0];
    if (onStartRoutine) {
      onStartRoutine(found);
    }
  };

  // Launch AI Coach modal with full context prompt
  const handleAskAICoach = () => {
    const areas = selectedTensionAreas.join(', ') || 'general lower back and neck';
    const prompt = `Based on my recent road recovery history (${userProgress.totalMinutesStretched} total minutes stretched across ${userProgress.completedHistory.length} sessions), I am experiencing acute soreness in: ${areas}. Can you analyze my biomechanics and guide me through the optimal recovery sequence?`;
    
    if (onOpenAICoach) {
      onOpenAICoach(prompt);
    }
  };

  // Check if current streak reaches significant milestones (e.g., 3, 5, 7, 10, 14, 21, 30, etc.)
  const isMilestone = useMemo(() => {
    return streak >= 3 && (streak % 7 === 0 || streak % 5 === 0 || streak === 3 || streak === 10 || streak === 14 || streak === 21 || streak === 30 || streak === 60 || streak === 100);
  }, [streak]);

  // Trigger celebration effects on mount if at a milestone
  useEffect(() => {
    if (isMilestone && streak > 0) {
      setShowMilestoneBanner(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.35 },
          colors: ['#f59e0b', '#ef4444', '#f97316', '#22d3ee']
        });
      } catch (e) {
        // Safe fallback if canvas is not ready
      }
    }
  }, [isMilestone, streak]);

  const avgImprovement = userProgress.completedHistory.length > 0
    ? (userProgress.completedHistory.reduce((acc, curr) => acc + (curr.feelingAfter - curr.feelingBefore), 0) / userProgress.completedHistory.length).toFixed(1)
    : '2.0';

  // Compute daily total minutes stretched for the past 7 days
  const last7DaysData = useMemo(() => {
    const data: { day: string; fullDate: string; minutes: number; sessions: number; isToday: boolean }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const isoDate = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString(undefined, { weekday: 'short' });
      const fullDateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' });

      let minutes = 0;
      let sessionCount = 0;

      userProgress.completedHistory.forEach(item => {
        const itemDate = item.date;
        const matchesDate =
          itemDate === isoDate ||
          (i === 0 && (itemDate === 'Today' || itemDate === isoDate)) ||
          (i === 1 && itemDate === 'Yesterday') ||
          (i === 2 && itemDate === '2 days ago') ||
          (i === 3 && itemDate === '3 days ago') ||
          (i === 4 && itemDate === '4 days ago') ||
          (i === 5 && itemDate === '5 days ago') ||
          (i === 6 && itemDate === '6 days ago');

        if (matchesDate) {
          minutes += Number(item.durationMinutes) || 0;
          sessionCount += 1;
        }
      });

      data.push({
        day: i === 0 ? 'Today' : weekday,
        fullDate: fullDateStr,
        totalMinutesStretched: minutes,
        minutes,
        sessions: sessionCount,
        isToday: i === 0
      });
    }

    // If history is small but overall total minutes exist, provide baseline distribution based on streak
    const calculatedSum = data.reduce((acc, item) => acc + item.totalMinutesStretched, 0);
    if (calculatedSum === 0 && userProgress.totalMinutesStretched > 0) {
      const activeDays = Math.min(Math.max(userProgress.currentStreakDays, 1), 7);
      const perDay = Math.max(2, Math.round(userProgress.totalMinutesStretched / activeDays));
      for (let j = 7 - activeDays; j < 7; j++) {
        if (data[j]) {
          data[j].totalMinutesStretched = perDay;
          data[j].minutes = perDay;
          data[j].sessions = 1;
        }
      }
    }

    return data;
  }, [userProgress]);

  const total7DayMinutes = useMemo(() => {
    return last7DaysData.reduce((acc, curr) => acc + curr.totalMinutesStretched, 0);
  }, [last7DaysData]);

  const avgDailyMinutes = (total7DayMinutes / 7).toFixed(1);
  const peakDay = useMemo(() => {
    return [...last7DaysData].sort((a, b) => b.totalMinutesStretched - a.totalMinutesStretched)[0];
  }, [last7DaysData]);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Bio-Recovery Analytics</span>
            </span>
            <span className="text-xs text-slate-400">Driver Health Progression</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Your Road Mobility & Recovery Log
          </h2>
        </div>

        <button
          onClick={onExportSummary}
          className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all self-start"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Health Report</span>
        </button>
      </div>

      {/* Milestone celebration alert banner if streak milestone reached */}
      <AnimatePresence>
        {showMilestoneBanner && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-900/30 border border-amber-500/50 shadow-lg shadow-amber-500/10 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  scale: [1, 1.25, 0.95, 1.15, 1],
                  rotate: [0, -12, 12, -8, 8, 0]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: "easeInOut"
                }}
                className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/20 shrink-0"
              >
                <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    New Streak Milestone Unlocked!
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {streak} Consecutive Days
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Remarkable spinal resilience. Daily micro-breaks prevent postural compression and keep reflexes sharp.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowMilestoneBanner(false)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold transition-all border border-amber-400/30 shrink-0"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Streak with Framer Motion Fire Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`p-5 rounded-2xl border relative overflow-hidden transition-all ${
            isMilestone 
              ? 'bg-gradient-to-b from-amber-950/40 to-slate-950/90 border-amber-500/50 shadow-lg shadow-amber-500/10' 
              : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          {/* Ambient Flame Glow in Background if active streak */}
          {userProgress.currentStreakDays > 0 && (
            <motion.div
              animate={{
                opacity: [0.15, 0.35, 0.15],
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-amber-500/30 blur-2xl pointer-events-none"
            />
          )}

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Streak</span>
            
            {/* Animated Fire Icon with Scale-Up and Shake Effect */}
            <motion.div
              initial={{ scale: 0, rotate: -25 }}
              animate={
                isMilestone
                  ? {
                      scale: [1, 1.4, 1.1, 1.35, 1],
                      rotate: [0, -14, 14, -10, 10, 0]
                    }
                  : {
                      scale: [1, 1.2, 1],
                      rotate: [0, -6, 6, -3, 3, 0]
                    }
              }
              transition={{
                duration: isMilestone ? 1.2 : 1.8,
                repeat: Infinity,
                repeatDelay: isMilestone ? 1.5 : 3.5,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.3, rotate: 10 }}
              className="relative cursor-pointer"
            >
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              {isMilestone && (
                <motion.span
                  animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-amber-400/40 pointer-events-none blur-xs"
                />
              )}
            </motion.div>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono flex items-baseline gap-2">
            <motion.span
              key={userProgress.currentStreakDays}
              initial={{ scale: 1.4, color: '#f59e0b' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
            >
              {userProgress.currentStreakDays}
            </motion.span>
            <span className="text-sm font-normal text-amber-400">Days</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-1">
            {isMilestone ? '🔥 Milestone Active! Keep it up!' : 'Consistent spinal protection'}
          </p>
        </motion.div>

        {/* Minutes Stretched */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Time</span>
            <Trophy className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
            {userProgress.totalMinutesStretched} <span className="text-sm font-normal text-cyan-400">Mins</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Highway decompression time</p>
        </div>

        {/* Routines Completed */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sessions</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
            {userProgress.routinesCompleted} <span className="text-sm font-normal text-emerald-400">Done</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Guided protocols completed</p>
        </div>

        {/* Avg Relief Delta */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Relief Boost</span>
            <TrendingUp className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
            +{avgImprovement} <span className="text-sm font-normal text-teal-400">/ 5 pts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Average comfort increase</p>
        </div>

      </div>

      {/* AI SORENESS & BIOMECHANICAL ASSESSMENT PROMPT & CARD */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/80 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Biomechanics Diagnostic</span>
              </span>
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
                Coach Lyra Engine
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Road Soreness & Cumulative Tension Assessment
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Analyzes your {userProgress.completedHistory.length} recorded session{userProgress.completedHistory.length === 1 ? '' : 's'}, vehicle ergonomics, and reported muscle tension zones to prescribe targeted decompression routines.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              onClick={handleRunAssessment}
              disabled={isAssessing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isAssessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Scanning Biomechanics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Run Soreness Assessment</span>
                </>
              )}
            </button>

            {onOpenAICoach && (
              <button
                onClick={handleAskAICoach}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all hover:border-cyan-400"
                title="Consult Coach Lyra about your soreness history"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Ask AI Coach</span>
              </button>
            )}
          </div>
        </div>

        {/* Tension Area Selector Chips (Synced with History & User Input) */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 relative z-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <HeartPulse className="w-4 h-4 text-red-400" />
              <span>Reported / Detected Tension Areas:</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Tap to add or adjust focal stiffness points
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {tensionZoneOptions.map((area) => {
              const isSelected = selectedTensionAreas.includes(area);
              return (
                <button
                  key={area}
                  onClick={() => toggleTensionArea(area)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-950/80 to-amber-950/80 text-amber-300 border border-amber-500/60 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span>{area}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Assessment Results Display */}
        <AnimatePresence>
          {assessmentResult && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-6 p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-xl relative z-10 space-y-5"
            >
              {/* Diagnosis Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-amber-950 text-amber-400 border border-amber-800/80">
                      {assessmentResult.riskLevel}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Vehicle Profile: {currentVehicle.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    {assessmentResult.diagnosisTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {assessmentResult.diagnosisExplanation}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleRunAssessment}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs font-bold transition-all"
                    title="Re-run assessment"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Acute 15-Second In-Seat Micro-Relief Cue */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-slate-900 border border-amber-600/40">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                      Immediate In-Seat Micro-Relief Cue (15 Seconds):
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-slate-200 mt-0.5">
                      {assessmentResult.acuteMicroReliefCue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prescribed Routine Recommendation Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/50 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Prescribed Clinical Routine
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-400/20 text-cyan-300">
                      ⏱️ {assessmentResult.suggestedRoutineDuration} Minutes
                    </span>
                  </div>
                  <h5 className="text-base sm:text-lg font-black text-white">
                    {assessmentResult.suggestedRoutineTitle}
                  </h5>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    {assessmentResult.matchReason}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleLaunchPrescribedRoutine}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-400/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Start Prescribed Routine</span>
                  </button>

                  {onOpenAICoach && (
                    <button
                      onClick={handleAskAICoach}
                      className="px-3.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-bold transition-all"
                      title="Discuss this prescription with Coach Lyra"
                    >
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Anatomical Targets & Breathing Prescription */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Targeted Muscle Decompressions:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {assessmentResult.keyTargetMuscles.map((muscle, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/80 text-cyan-300 border border-slate-700/80"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    <span>Prescribed Breathing Cadence:</span>
                  </div>
                  <p className="text-xs font-medium text-slate-200">
                    {assessmentResult.breathingPrescription}
                  </p>
                </div>
              </div>

              {/* Recommended Micro-Exercises Preview */}
              {assessmentResult.recommendedExercises && assessmentResult.recommendedExercises.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Prescribed Sequence Breakdown:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {assessmentResult.recommendedExercises.map((ex, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-mono text-cyan-400 font-bold">{ex.target}</span>
                          <span>{ex.duration}</span>
                        </div>
                        <h6 className="text-xs font-bold text-white line-clamp-1">{ex.name}</h6>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ex.cue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7-Day Stretch Time Line Chart */}

      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-extrabold text-white">
                Daily Minutes Stretched (Past 7 Days)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualizing daily decompression duration to sustain spinal mobility
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
              <span className="text-slate-400">7-Day Total:</span>
              <span className="font-bold text-cyan-400 font-mono">{total7DayMinutes}m</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
              <span className="text-slate-400">Daily Avg:</span>
              <span className="font-bold text-emerald-400 font-mono">{avgDailyMinutes}m</span>
            </div>
            {peakDay && peakDay.minutes > 0 && (
              <div className="px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-xs text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-400/80">Peak:</span>
                <span className="font-bold">{peakDay.day} ({peakDay.minutes}m)</span>
              </div>
            )}
          </div>
        </div>

        {/* Recharts Line Chart */}
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={last7DaysData}
              margin={{ top: 12, right: 16, left: -16, bottom: 4 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#1e293b" 
                vertical={false} 
              />
              <XAxis 
                dataKey="day" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                unit="m"
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700/90 rounded-xl p-3 shadow-xl backdrop-blur-md">
                        <div className="text-xs font-semibold text-slate-300 mb-1">
                          {dataPoint.fullDate} {dataPoint.isToday ? '(Today)' : ''}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                          <span className="text-xs text-slate-400">Minutes Stretched:</span>
                          <span className="text-xs font-mono font-bold text-cyan-300">
                            {payload[0].value} mins
                          </span>
                        </div>
                        {dataPoint.sessions > 0 && (
                          <div className="text-[11px] text-emerald-400 mt-1">
                            {dataPoint.sessions} session{dataPoint.sessions > 1 ? 's' : ''} logged
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="totalMinutesStretched"
                name="Total Minutes Stretched"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 4, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#22d3ee', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
        <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>Recent Road Recovery History</span>
        </h3>

        {userProgress.completedHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No completed workouts logged yet. Complete a guided routine or breath session to track your journey!
          </div>
        ) : (
          <div className="space-y-2">
            {userProgress.completedHistory.slice(-5).reverse().map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4"
              >
                <div>
                  <h5 className="text-xs font-bold text-white">
                    {item.title}
                  </h5>
                  <span className="text-[11px] text-slate-400">
                    {item.date} • ⏱️ {item.durationMinutes} Minutes
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right text-[11px]">
                    <span className="text-slate-400">Comfort: </span>
                    <span className="text-amber-400 font-bold">{item.feelingBefore}</span>
                    <span className="text-slate-500"> → </span>
                    <span className="text-emerald-400 font-bold">{item.feelingAfter}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">
                    +{(item.feelingAfter - item.feelingBefore)} Relief
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

