import React, { useState, useMemo, useEffect } from 'react';
import {
  Play,
  Sparkles,
  Activity,
  Car,
  Bike,
  Truck,
  ArrowRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Zap,
  Clock,
  Video,
  UserCheck,
  RotateCcw,
  ShoppingBag,
  OctagonAlert
} from 'lucide-react';
import { Routine, VehicleType, UserProgress, UserAssessmentProfile } from '../types';
import { Veo3ExerciseViewer } from './Veo3ExerciseViewer';
import { triggerHaptic } from '../utils/haptics';

interface HeroWallProps {
  currentVehicle: VehicleType;
  onSelectVehicle: (v: VehicleType) => void;
  userProgress: UserProgress;
  assessmentProfile: UserAssessmentProfile | null;
  onStartRoutine: (routine: Routine) => void;
  onOpenQuickDecompress: () => void;
  onOpenOnboarding: () => void;
  onOpenAICoach: (prompt?: string) => void;
  onOpenBreath: () => void;
  onSelectTab: (tab: 'routines' | 'bodymap' | 'breath' | 'cockpit' | 'trip' | 'log' | 'library' | 'store') => void;
  curatedRoutines: Routine[];
  allRoutines?: Routine[];
  onOpenRedLightMode?: () => void;
  onOpenStore?: () => void;
}

export const HeroWall: React.FC<HeroWallProps> = ({
  currentVehicle,
  onSelectVehicle,
  userProgress,
  assessmentProfile,
  onStartRoutine,
  onOpenQuickDecompress,
  onOpenOnboarding,
  onOpenAICoach,
  onOpenBreath,
  onSelectTab,
  curatedRoutines,
  allRoutines,
  onOpenRedLightMode,
  onOpenStore
}) => {
  const routinesPool = useMemo(() => {
    const combined = allRoutines && allRoutines.length > 0 ? allRoutines : curatedRoutines;
    return combined.filter((r) => r.exercises && r.exercises.length > 0);
  }, [allRoutines, curatedRoutines]);

  // Fixed matching IDs
  const quickRoutine =
    routinesPool.find((r) => r.id === 'routine-quick-5min' || r.durationMinutes <= 5) || routinesPool[0];

  // Selected Routine & Drill for Live 3D Animated Character + Veo-3 Hero Stage
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>(routinesPool[0]?.id || 'routine-car-10min');
  const [selectedDrillIdx, setSelectedDrillIdx] = useState<number>(0);

  const activeShowcaseRoutine = useMemo(() => {
    return routinesPool.find((r) => r.id === selectedRoutineId) || routinesPool[0];
  }, [routinesPool, selectedRoutineId]);

  useEffect(() => {
    setSelectedDrillIdx(0);
  }, [activeShowcaseRoutine?.id]);

  const activeShowcaseExercise = useMemo(() => {
    if (!activeShowcaseRoutine || !activeShowcaseRoutine.exercises?.length) return null;
    return activeShowcaseRoutine.exercises[selectedDrillIdx] || activeShowcaseRoutine.exercises[0];
  }, [activeShowcaseRoutine, selectedDrillIdx]);

  const vehiclePills: { id: VehicleType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Modes', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'car', label: 'Car / Sedan', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'two-wheeler', label: 'Motorcycle', icon: <Bike className="w-3.5 h-3.5" /> },
    { id: 'truck', label: 'Truck / Van', icon: <Truck className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 shadow-2xl p-5 sm:p-8 mb-8">
      {/* Ambient Glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-primary, #06b6d4) 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10 space-y-6">
        {/* Compact Top Bar: Brand Status + Streak Stats + Instant Red-Light Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Driver Mobility & Veo-3 3D Studio</span>
            </span>

            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800 text-xs text-slate-300">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-amber-300">{userProgress.currentStreakDays}d Streak</span>
              <span className="text-slate-600">•</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-cyan-300">{userProgress.totalMinutesStretched}m</span>
            </div>
          </div>

          {onOpenRedLightMode && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onOpenRedLightMode();
              }}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <OctagonAlert className="w-4 h-4 shrink-0" />
              <span>Traffic Light Quick-Stop</span>
            </button>
          )}
        </div>

        {/* Simplified Hero Copy + High-Access Primary Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Instant Relief for Every Mile.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Tap into 25-second traffic-light micro-drills, 3D biomechanical coaches, and Veo-3 4K demonstrations engineered for tight cabins.
            </p>
          </div>

          {/* Vehicle Mode Quick Switcher */}
          <div className="flex flex-wrap items-center gap-1.5">
            {vehiclePills.map((pill) => {
              const isSelected = currentVehicle === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => {
                    triggerHaptic('light');
                    onSelectVehicle(pill.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {pill.icon}
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean High-Contrast Quick Access Action Bar (Easy tap targets for stops/halts) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {onOpenRedLightMode ? (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onOpenRedLightMode();
              }}
              className="min-h-[54px] px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-2 text-left">
                <OctagonAlert className="w-5 h-5 shrink-0" />
                <div>
                  <div className="leading-tight">Red-Light Quick Drills</div>
                  <div className="text-[10px] font-bold opacity-80">1-Tap 25s In-Seat Relief</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenQuickDecompress}
              className="min-h-[54px] px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between gap-2 shadow-xl cursor-pointer"
            >
              <span>Quick Pitstop</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              if (quickRoutine) onStartRoutine(quickRoutine);
              else onOpenQuickDecompress();
            }}
            className="min-h-[54px] px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between gap-2 shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-2 text-left">
              <Play className="w-4 h-4 fill-slate-950 shrink-0" />
              <div>
                <div className="leading-tight">5-Min Highway Pitstop</div>
                <div className="text-[10px] font-bold opacity-80">Full Guided Session</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onOpenOnboarding();
            }}
            className="min-h-[54px] px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-white font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 text-left">
              <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="leading-tight text-cyan-300 font-extrabold">
                  {assessmentProfile ? 'Tailored Driver Rx' : 'Tailor My Plan'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {assessmentProfile ? assessmentProfile.primaryIssue.replace('-', ' ') : '60s Pain Assessment'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onOpenAICoach();
              }}
              className="flex-1 min-h-[54px] px-3 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>AI Coach</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                if (onOpenStore) onOpenStore();
                else onSelectTab('store');
              }}
              className="flex-1 min-h-[54px] px-3 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ergo Gear</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO WALL: 3D ANIMATED CHARACTERS & VEO-3 FEATURE FOR EVERY ROUTINE       */}
        {/* ========================================================================= */}
        {activeShowcaseRoutine && activeShowcaseExercise && (
          <div className="rounded-3xl bg-slate-950/90 border border-cyan-500/30 p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400 font-mono">
                    3D Character + Veo-3 4K Routine Showcase
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                  Preview Every Routine in 3D & Veo-3
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  onStartRoutine(activeShowcaseRoutine);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 self-start md:self-auto shadow-md transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Start "{activeShowcaseRoutine.title}"</span>
              </button>
            </div>

            {/* Routine Selector Pills across ALL routines */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {routinesPool.map((routine) => {
                const isSelected = routine.id === activeShowcaseRoutine.id;
                return (
                  <button
                    key={routine.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedRoutineId(routine.id);
                    }}
                    className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 border-cyan-400 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{routine.title}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                      ({routine.exercises.length} drills)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Drill Pills inside Selected Routine */}
            <div className="flex flex-wrap items-center gap-1.5">
              {activeShowcaseRoutine.exercises.map((ex, idx) => {
                const isActive = idx === selectedDrillIdx;
                return (
                  <button
                    key={ex.id || idx}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedDrillIdx(idx);
                    }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span className="font-mono text-[10px]">#{idx + 1}</span>
                    <span>{ex.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* 3D Animated Character + Veo-3 4K Viewer */}
              <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <Veo3ExerciseViewer
                  key={activeShowcaseExercise.id}
                  exercise={activeShowcaseExercise}
                  variant="card"
                  autoPlay={true}
                  initialRenderMode="3d"
                />
              </div>

              {/* Drill Details */}
              <div className="lg:col-span-5 space-y-3.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                      {activeShowcaseExercise.location}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {activeShowcaseExercise.durationSeconds}s • {activeShowcaseExercise.intensity}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">{activeShowcaseExercise.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {activeShowcaseExercise.biomechanicsRationale}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="text-[10px] uppercase font-mono text-cyan-400 font-bold mb-1">
                    Alignment & Breath Cue
                  </div>
                  <div className="text-slate-200">{activeShowcaseExercise.formCues}</div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {activeShowcaseExercise.targetMuscles.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900 border border-slate-800 text-cyan-300"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personalized Profile Banner if assessment exists */}
        {assessmentProfile && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-slate-900/60 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-black text-cyan-300 uppercase">
                  Tailored Driver Rx • {assessmentProfile.customRoutineTitle}
                </div>
                <div className="text-xs text-slate-400 line-clamp-1">
                  {assessmentProfile.keyInsights[0] || 'Targeted biomechanical recovery configured for your commute.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const matching =
                    routinesPool.find((r) => r.id === assessmentProfile.prescribedRoutineId) || routinesPool[0];
                  if (matching) onStartRoutine(matching);
                }}
                className="py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Launch Rx</span>
              </button>
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Retake Tailored Assessment"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Quick Functional Pillars Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => onSelectTab('bodymap')}
            className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-left transition-all group cursor-pointer"
          >
            <div className="text-[10px] font-black uppercase text-cyan-400">Anatomy Map</div>
            <div className="text-xs font-bold text-white mt-0.5">Target Muscle Knots</div>
          </button>

          <button
            type="button"
            onClick={() => onOpenBreath()}
            className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-left transition-all group cursor-pointer"
          >
            <div className="text-[10px] font-black uppercase text-teal-400">Vagal Pacing</div>
            <div className="text-xs font-bold text-white mt-0.5">Anti-Fatigue Breath</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('cockpit')}
            className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-left transition-all group cursor-pointer"
          >
            <div className="text-[10px] font-black uppercase text-sky-400">Seat Alignment</div>
            <div className="text-xs font-bold text-white mt-0.5">Cockpit Ergonomics</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('trip')}
            className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-left transition-all group cursor-pointer"
          >
            <div className="text-[10px] font-black uppercase text-purple-400">Highway Plan</div>
            <div className="text-xs font-bold text-white mt-0.5">Smart Pitstop Planner</div>
          </button>
        </div>
      </div>
    </div>
  );
};
