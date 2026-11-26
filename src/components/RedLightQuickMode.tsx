import React, { useState, useEffect } from 'react';
import { ShieldAlert, Play, Pause, X, CheckCircle2, Clock, Eye, Zap } from 'lucide-react';
import { Exercise } from '../types';
import { ALL_EXERCISES } from '../data/exercises';
import { triggerHaptic } from '../utils/haptics';
import { playTick, playGong } from '../utils/audio';
import { ExerciseCharacterVisual } from './ExerciseCharacterVisual';

interface RedLightQuickModeProps {
  isOpen: boolean;
  onClose: () => void;
  onLogQuickDrill?: (exerciseName: string, seconds: number) => void;
}

const QUICK_STOP_DRILL_IDS = [
  'car-neck-rolls',
  'car-shoulder-retraction',
  'car-wrist-rotations',
  'car-pelvic-clock',
  'quick-eye-palming'
];

export const RedLightQuickMode: React.FC<RedLightQuickModeProps> = ({
  isOpen,
  onClose,
  onLogQuickDrill
}) => {
  const quickDrills: Exercise[] = QUICK_STOP_DRILL_IDS
    .map((id) => ALL_EXERCISES.find((e) => e.id === id))
    .filter((e): e is Exercise => Boolean(e));

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [doneCount, setDoneCount] = useState(0);

  const activeDrill = quickDrills[selectedIdx] || ALL_EXERCISES[0];

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      return;
    }
    setSecondsLeft(Math.min(30, activeDrill?.durationSeconds || 25));
  }, [isOpen, selectedIdx, activeDrill?.durationSeconds]);

  useEffect(() => {
    if (!isOpen || !isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          playGong();
          triggerHaptic('success');
          setDoneCount((c) => c + 1);
          if (onLogQuickDrill && activeDrill) {
            onLogQuickDrill(activeDrill.name, Math.min(30, activeDrill.durationSeconds || 25));
          }
          return 0;
        }
        if (prev <= 4) {
          playTick(540, 0.06, 0.1);
          triggerHaptic('light');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isRunning, activeDrill, onLogQuickDrill]);

  if (!isOpen) return null;

  const handleEmergencyDismiss = () => {
    setIsRunning(false);
    triggerHaptic('heavy');
    onClose();
  };

  const handleSelectDrill = (idx: number) => {
    triggerHaptic('light');
    setSelectedIdx(idx);
    setIsRunning(true);
  };

  return (
    <div
      id="red-light-quick-mode"
      className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 overflow-y-auto"
    >
      {/* Top Emergency 1-Tap Exit Bar */}
      <div className="max-w-3xl w-full mx-auto space-y-3">
        <button
          type="button"
          onClick={handleEmergencyDismiss}
          className="w-full min-h-[56px] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/30 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Eye className="w-6 h-6 stroke-[2.5]" />
          <span>GREEN LIGHT — STOP &amp; EYES ON ROAD</span>
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Red-Light / Parked Quick Mode:</strong> Only use when fully stopped or parked. Both feet stay near brake/ground.
            </span>
          </div>
          {doneCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold shrink-0">
              {doneCount} Done
            </span>
          )}
        </div>
      </div>

      {/* Center Minimalist High-Contrast Stage */}
      <div className="max-w-3xl w-full mx-auto my-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Compact 3D / Coach Preview */}
        <div className="md:col-span-5 h-56 sm:h-64 rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-900 relative">
          <ExerciseCharacterVisual
            exercise={activeDrill}
            variant="card"
            isPlaying={isRunning}
            initialMode="3d"
          />
        </div>

        {/* Big Timer & Single Essential Cue */}
        <div className="md:col-span-7 p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-black uppercase">
              25s Quick Micro-Drill
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {activeDrill.location}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {activeDrill.name}
          </h2>

          <p className="text-sm text-cyan-200 font-semibold leading-relaxed bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl">
            {activeDrill.formCues}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                if (secondsLeft === 0) {
                  setSecondsLeft(Math.min(30, activeDrill.durationSeconds || 25));
                  setIsRunning(true);
                } else {
                  setIsRunning((r) => !r);
                }
              }}
              className={`flex-1 min-h-[56px] px-5 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-[0.98] cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950" />}
              <span>{secondsLeft === 0 ? 'Restart 25s Drill' : isRunning ? `Pause (${secondsLeft}s)` : `Start (${secondsLeft}s)`}</span>
            </button>

            <div className="min-w-[84px] min-h-[56px] rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center font-mono">
              <span className="text-2xl font-black text-white leading-none">{secondsLeft}</span>
              <span className="text-[10px] text-slate-400 uppercase mt-0.5">sec</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Oversized 1-Tap Drill Selector */}
      <div className="max-w-3xl w-full mx-auto space-y-2">
        <div className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>1-Tap Seated Micro-Resets</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {quickDrills.map((drill, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={drill.id}
                type="button"
                onClick={() => handleSelectDrill(idx)}
                className={`min-h-[54px] p-3 rounded-2xl border text-left transition-all flex flex-col justify-center cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-lg'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 font-bold'
                }`}
              >
                <span className="text-xs leading-tight line-clamp-2">{drill.name.split('&')[0].trim()}</span>
                <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-slate-900' : 'text-cyan-400'}`}>
                  25s Seated
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
