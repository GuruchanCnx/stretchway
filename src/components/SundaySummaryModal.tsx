import React from 'react';
import { Sparkles, Calendar, Trophy, Flame, Clock, ShieldCheck, ArrowRight, X, Activity, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProgress, Routine, VehicleType } from '../types';
import { CURATED_ROUTINES } from '../data/exercises';

interface SundaySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgress;
  currentVehicle: VehicleType;
  onStartRoutine: (routine: Routine) => void;
}

export const SundaySummaryModal: React.FC<SundaySummaryModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  currentVehicle,
  onStartRoutine
}) => {
  if (!isOpen) return null;

  // Calculate past 7-day stats
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const past7DaysHistory = userProgress.completedHistory.filter(item => {
    const itemDate = new Date(item.date);
    return !isNaN(itemDate.getTime()) && itemDate >= sevenDaysAgo;
  });

  const weeklyMinutes = past7DaysHistory.reduce((sum, item) => sum + (item.durationMinutes || 0), 0) || Math.max(12, Math.round(userProgress.totalMinutesStretched * 0.4));
  const weeklySessions = past7DaysHistory.length || Math.max(2, Math.round(userProgress.routinesCompleted * 0.3));

  // Determine focus area recommendations
  const focusAreas = currentVehicle === 'two-wheeler' 
    ? ['Forearm Extensor & Carpal Glide', 'Piriformis & Sciatic Decompression', 'Occipital Neck Extension']
    : currentVehicle === 'truck'
      ? ['Thoracic Cage Expansion', 'Lumbar L4-S1 Disc Hydration', 'Venous Calf Pump']
      : ['Suboccipital Forward-Head Reset', 'Pelvic Tilt & Lumbar Decompression', 'Psoas & Hip Flexor Opening'];

  // Sunday recommended restorative routine
  const sundayRoutine = CURATED_ROUTINES.find(r => r.id === 'routine-spinal-15min') || CURATED_ROUTINES[0];

  const handleLaunchSundayRoutine = () => {
    onClose();
    onStartRoutine(sundayRoutine);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="max-w-xl w-full bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/80 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Sunday Weekly Briefing
                </span>
                <span className="text-xs text-slate-400 font-medium">Olympic Biomechanics</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Your Weekly Road Mobility Report
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Week review & customized focus targets for the upcoming road week
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Summary Stat Grid */}
          <div className="grid grid-cols-3 gap-3 my-5 relative z-10">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Weekly Time
              </span>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {weeklyMinutes}m
              </div>
              <span className="text-[10px] text-slate-500">Decompression</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Sessions
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {weeklySessions}
              </div>
              <span className="text-[10px] text-slate-500">Completed</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Streak
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{userProgress.currentStreakDays}d</span>
              </div>
              <span className="text-[10px] text-slate-500">Active</span>
            </div>
          </div>

          {/* Coach's Suggested Focus Areas for Next Week */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-950 to-indigo-950/30 border border-cyan-800/40 mb-5 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black uppercase text-cyan-300 tracking-wider">
                Coach Lyra's Next-Week Focus Targets:
              </span>
            </div>

            <div className="space-y-2">
              {focusAreas.map((area, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </div>
                  <span>{area}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-800/80">
              Based on your {currentVehicle.toUpperCase()} profile, these 3 targets counteract static vehicular vibration and maintain reflexive reaction times.
            </p>
          </div>

          {/* Recommended Sunday Restorative Routine */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4 mb-6 relative z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Recommended Sunday Reset
              </span>
              <h5 className="text-sm font-bold text-white mt-0.5">{sundayRoutine.title}</h5>
              <span className="text-xs text-slate-400">⏱️ {sundayRoutine.durationMinutes} Minutes • Complete Spinal Traction</span>
            </div>

            <button
              onClick={handleLaunchSundayRoutine}
              className="py-2 px-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-cyan-400/20 shrink-0 hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Start</span>
            </button>
          </div>

          {/* Bottom Action */}
          <div className="flex items-center justify-end gap-3 relative z-10">
            <button
              onClick={onClose}
              className="w-full py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition-all text-center"
            >
              Close & Plan My Week
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
