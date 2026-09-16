import React, { useState } from 'react';
import { 
  Sparkles, 
  Shield, 
  Zap, 
  HeartPulse, 
  Activity, 
  Wind, 
  Trophy, 
  Flame, 
  Crown, 
  Check, 
  Lock, 
  Layers, 
  RotateCcw,
  Shirt,
  Eye,
  Sliders,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { UserProgress, CoachId, Exercise } from '../types';
import { AVATAR_FLAIR_ITEMS, isFlairUnlocked, getFlairProgress } from '../data/avatarFlair';
import { COACH_PROFILES, getCoach } from '../data/coaches';
import { AnimatedCharacterRig } from './AnimatedCharacterRig';
import { ALL_EXERCISES } from '../data/exercises';

interface AvatarFlairLockerProps {
  userProgress: UserProgress;
  onEquipFlair?: (flairId: string) => void;
}

export const AvatarFlairLocker: React.FC<AvatarFlairLockerProps> = ({
  userProgress,
  onEquipFlair
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('all');
  const [equippedFlairs, setEquippedFlairs] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('stretchway_equipped_flair');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return userProgress.equippedFlairIds || ['flair-wraps'];
  });

  const [activeCoachId, setActiveCoachId] = useState<CoachId>(() => {
    return (localStorage.getItem('stretchway_selected_coach') as CoachId) || 'olympic';
  });

  // Showcase drill
  const demoExercise: Exercise = ALL_EXERCISES[0] || {
    id: 'demo-chest',
    name: 'Seated Thoracic Expansion',
    category: 'car',
    durationSeconds: 45,
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids'],
    intensity: 'Gentle',
    location: 'Driver Seat',
    formCues: 'Draw elbows back, open ribcage without hyper-extending lower back.',
    avoidMistake: 'Do not shrug shoulders toward ears.',
    biomechanicsRationale: 'Reverses forward slouched postures.',
    steps: ['Interlace fingers behind head', 'Gently draw elbows backward']
  };

  const currentCoach = getCoach(activeCoachId);

  const handleToggleFlair = (flairId: string, unlocked: boolean) => {
    if (!unlocked) return;

    let updated: string[];
    if (equippedFlairs.includes(flairId)) {
      updated = equippedFlairs.filter(id => id !== flairId);
    } else {
      updated = [...equippedFlairs, flairId];
      // Celebrate equipping!
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    setEquippedFlairs(updated);
    localStorage.setItem('stretchway_equipped_flair', JSON.stringify(updated));

    if (onEquipFlair) {
      onEquipFlair(flairId);
    }
  };

  const filteredItems = selectedSlot === 'all'
    ? AVATAR_FLAIR_ITEMS
    : AVATAR_FLAIR_ITEMS.filter(item => item.slot === selectedSlot);

  const slots = [
    { id: 'all', label: 'All Gear', icon: Layers },
    { id: 'headwear', label: 'Headwear', icon: Crown },
    { id: 'apparel', label: 'Apparel', icon: Shirt },
    { id: 'wrist', label: 'Wrist & Hands', icon: Activity },
    { id: 'gear', label: 'Exo-Gear', icon: Shield },
    { id: 'aura', label: 'Kinetic Auras', icon: Flame }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Character Stage & Active Coach */}
      <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Rig Stage (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[280px] h-64 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-cyan-500/30 p-2 shadow-2xl flex items-center justify-center overflow-hidden">
            <AnimatedCharacterRig
              exercise={demoExercise}
              coachId={activeCoachId}
              variant="card"
              isPlaying={true}
              equippedFlairIds={equippedFlairs}
              showBiomechanicsHUD={true}
            />
            
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 border border-cyan-500/40 text-[9px] font-black uppercase text-cyan-300">
              Live Biomechanical Rig
            </div>

            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[10px] text-slate-400 px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-800">
              <span>Equipped Accessories:</span>
              <span className="font-bold text-cyan-400 font-mono">{equippedFlairs.length} active</span>
            </div>
          </div>
        </div>

        {/* Right Info & Coach Quick Switcher (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-extrabold text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Milestone Avatar Flair System</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Evolve Your Character on the Highway
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
              As you log road mobility routines, maintain daily streaks, and practice diaphragmatic pitstops, your animated character earns visual gear, bionic lumbar supports, and kinetic auras.
            </p>
          </div>

          {/* Quick Coach Lead Switcher */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Current Coach Archetype:
              </span>
              <span className="text-xs font-bold text-amber-400">
                {currentCoach.title}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(COACH_PROFILES).map((coach) => {
                const isActive = activeCoachId === coach.id;
                return (
                  <button
                    key={coach.id}
                    onClick={() => {
                      setActiveCoachId(coach.id);
                      localStorage.setItem('stretchway_selected_coach', coach.id);
                    }}
                    className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg">{coach.avatarEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-white truncate">{coach.name}</p>
                      <p className="text-[9px] text-slate-400 truncate">{coach.formCueTone}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Milestone Quick Summary Pills */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Streak</span>
              <span className="text-sm font-black text-amber-400 font-mono">
                {userProgress.currentStreakDays || 0} Days
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sessions</span>
              <span className="text-sm font-black text-cyan-400 font-mono">
                {userProgress.routinesCompleted || userProgress.completedHistory.length || 0} Done
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Mins</span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {userProgress.totalMinutesStretched || 0}m
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Slot Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {slots.map((s) => {
          const Icon = s.icon;
          const isCurrent = selectedSlot === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSlot(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isCurrent
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Flair Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((flair) => {
          const unlocked = isFlairUnlocked(flair, userProgress);
          const isEquipped = equippedFlairs.includes(flair.id);
          const progress = getFlairProgress(flair, userProgress);

          return (
            <div
              key={flair.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                isEquipped
                  ? 'bg-slate-900/90 border-cyan-400 ring-1 ring-cyan-400/40 shadow-lg shadow-cyan-500/10'
                  : unlocked
                    ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-inner"
                      style={{ backgroundColor: flair.visualPreview.color + '25', border: `1px solid ${flair.visualPreview.color}60` }}
                    >
                      <Sparkles className="w-5 h-5" style={{ color: flair.visualPreview.color }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white leading-snug">
                        {flair.name}
                      </h4>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {flair.visualPreview.badgeLabel}
                      </span>
                    </div>
                  </div>

                  {unlocked ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                      Unlocked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 bg-slate-900 border border-slate-800 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {flair.description}
                </p>

                {/* Milestone Requirement */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 font-semibold block mb-1">
                    🎯 Milestone: {flair.milestoneDescription}
                  </span>
                  {!unlocked && (
                    <div className="space-y-1 mt-1.5">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Progress:</span>
                        <span className="font-mono text-cyan-400 font-bold">
                          {progress.current} / {progress.target}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  Slot: {flair.slot}
                </span>

                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => handleToggleFlair(flair.id, unlocked)}
                  className={`py-1.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    isEquipped
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : unlocked
                        ? 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white'
                        : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  {isEquipped ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Equipped</span>
                    </>
                  ) : unlocked ? (
                    <span>Equip Flair</span>
                  ) : (
                    <span>Locked</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
