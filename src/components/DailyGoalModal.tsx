import React, { useState } from 'react';
import { Target, X, Check, Flame, Trophy, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoalMinutes: number;
  todayMinutes: number;
  onSaveGoal: (minutes: number) => void;
}

export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({
  isOpen,
  onClose,
  currentGoalMinutes,
  todayMinutes,
  onSaveGoal
}) => {
  const [targetMinutes, setTargetMinutes] = useState<number>(currentGoalMinutes);
  const presets = [5, 10, 15, 20, 30, 45];
  const progressPercent = Math.min(100, Math.round((todayMinutes / Math.max(1, targetMinutes)) * 100));
  const isAchieved = todayMinutes >= targetMinutes && targetMinutes > 0;

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveGoal(targetMinutes);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-500 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Daily Mobility Goal</h3>
                <p className="text-xs text-slate-400">Target daily stretching duration</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Today's Live Circular Progress Ring */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-6 flex items-center gap-5 relative z-10">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`transition-all duration-700 ${isAchieved ? 'text-emerald-400' : 'text-cyan-400'}`}
                  strokeWidth="3.5"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-sm font-black text-white font-mono">{progressPercent}%</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">Today</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                {isAchieved ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> Goal Achieved Today!
                  </span>
                ) : (
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Progress Today
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {todayMinutes} <span className="text-xs text-slate-400 font-normal">of</span> {targetMinutes} <span className="text-xs text-cyan-400 font-normal">mins</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isAchieved
                  ? "Outstanding commitment to spinal health and alert driving."
                  : `${Math.max(0, targetMinutes - todayMinutes)} more minutes needed to hit today's decompression goal.`}
              </p>
            </div>
          </div>

          {/* Quick Target Presets */}
          <div className="space-y-3 mb-6 relative z-10">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Choose Target Minutes per Day
            </label>

            <div className="grid grid-cols-3 gap-2">
              {presets.map((min) => {
                const isSelected = targetMinutes === min;
                return (
                  <button
                    key={min}
                    type="button"
                    onClick={() => setTargetMinutes(min)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 font-black scale-[1.02]'
                        : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-mono">{min}m</span>
                    <span className={`text-[9px] uppercase ${isSelected ? 'text-slate-950/80' : 'text-slate-500'}`}>
                      {min <= 10 ? 'Quick' : min <= 20 ? 'Optimal' : 'Deep'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 whitespace-nowrap">Custom target:</span>
              <input
                type="number"
                min="3"
                max="120"
                value={targetMinutes}
                onChange={(e) => setTargetMinutes(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm text-center focus:outline-none focus:border-cyan-400"
              />
              <span className="text-xs text-cyan-400 font-bold">Minutes / Day</span>
            </div>
          </div>

          {/* Biomechanics Tip */}
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-slate-300 mb-6 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-cyan-300">Olympic Coach Tip:</strong> 10 to 15 minutes of divided micro-stretches (e.g. 5m before driving, 5m at rest stop) lowers spinal shear stress by up to 60% compared to sitting continuously.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 relative z-10">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Target</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
