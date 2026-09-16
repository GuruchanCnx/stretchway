import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  Activity, 
  Wind, 
  Compass, 
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
  Layers
} from 'lucide-react';
import { Routine, VehicleType, UserProgress, UserAssessmentProfile, Exercise } from '../types';
import { THEME_CONFIGS } from '../data/themes';
import { ALL_EXERCISES } from '../data/exercises';
import { ExerciseCharacterVisual } from './ExerciseCharacterVisual';

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
  onSelectTab: (tab: 'routines' | 'bodymap' | 'breath' | 'cockpit' | 'trip' | 'log' | 'library') => void;
  curatedRoutines: Routine[];
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
  curatedRoutines
}) => {
  // Find quick instant routine
  const quickRoutine = curatedRoutines.find(r => r.id === 'car-quick-pitstop' || r.durationMinutes <= 5) || curatedRoutines[0];
  const commuterRoutine = curatedRoutines.find(r => r.id === 'car-in-seat-commuter') || curatedRoutines[0];

  // Curated movement demo exercises for the live 3D previewer in Hero
  const demoExercises: Exercise[] = [
    ALL_EXERCISES.find(e => e.id === 'car-neck-rolls') || ALL_EXERCISES[0],
    ALL_EXERCISES.find(e => e.id === 'car-hamstring-slide') || ALL_EXERCISES[1],
    ALL_EXERCISES.find(e => e.id === 'car-chest-opener') || ALL_EXERCISES[2],
    ALL_EXERCISES.find(e => e.id === 'car-wrist-rotations') || ALL_EXERCISES[3]
  ];
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const activeDemoExercise = demoExercises[selectedDemoIndex];

  const vehiclePills: { id: VehicleType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Modes', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'car', label: 'Car / Sedan / SUV', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'two-wheeler', label: 'Motorcycle / Bike', icon: <Bike className="w-3.5 h-3.5" /> },
    { id: 'truck', label: 'Long-Haul Truck', icon: <Truck className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 lg:p-10 mb-8">
      
      {/* Background Ambient Glow FX */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-primary, #06b6d4) 0%, transparent 70%)'
        }}
      />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full blur-3xl opacity-15 bg-emerald-500 pointer-events-none" />

      {/* Grid Pattern Subtle Background */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 space-y-8">
        
        {/* Top Header Badge & Live Road Stats Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Olympic Biomechanics & Yoga on the Road
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium">
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              Veo-3 4K Clips
            </span>
          </div>

          {/* User Quick Progress Stats */}
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{userProgress.currentStreakDays} Day Streak</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1 text-cyan-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{userProgress.totalMinutesStretched}m Stretched</span>
            </div>
          </div>
        </div>

        {/* Hero Main Copy & Headlines */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Eradicate Driver Stiffness & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">
              Restore Spinal Health on the Road.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
            Precision in-seat micro-drills, highway rest-stop traction, and diaphragmatic breathwork engineered by sports therapists to decompress vertebrae, eliminate throttle numbness, and prevent fatigue.
          </p>
        </div>

        {/* Vehicle Mode Switcher Pills */}
        <div className="space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>Select Your Cockpit / Vehicle:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {vehiclePills.map((pill) => {
              const isSelected = currentVehicle === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => onSelectVehicle(pill.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-[1.02]'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {pill.icon}
                  <span>{pill.label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Call to Actions (CTAs) Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Primary CTA 1: Instant Quick Decompress */}
          <button
            onClick={() => onStartRoutine(quickRoutine)}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-3.5 h-3.5 fill-slate-950" />
            </div>
            <span>Start 5-Min Instant Pitstop</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Primary CTA 2: Tailor to My Issue (Onboarding Wizard) */}
          <button
            onClick={onOpenOnboarding}
            className="py-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-extrabold text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/10 active:scale-95"
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>
              {assessmentProfile ? 'Update Tailored Profile' : 'Tailor Plan to My Issues'}
            </span>
          </button>

          {/* Primary CTA 3: AI Olympic Coach */}
          <button
            onClick={() => onOpenAICoach()}
            className="py-3.5 px-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Ask Coach Lyra</span>
          </button>
        </div>

        {/* Live 3D Kinetic Biomechanics Demonstrator Stage */}
        <div className="rounded-3xl bg-slate-950/80 border border-cyan-500/30 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400 font-mono">
                  Live 3D Kinetic Biomechanics Engine
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                  Interactive 360°
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Real-Time 3D Movement Demonstrations
              </h3>
              <p className="text-xs text-slate-400">
                Click any driver stretch below to preview anatomical kinematics, rotate 360°, and inspect joint mechanics.
              </p>
            </div>

            {/* Drill Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
              {demoExercises.map((ex, idx) => {
                const isActive = selectedDemoIndex === idx;
                return (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedDemoIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Activity className="w-3 h-3" />
                    <span>{ex.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* 3D Character Canvas Stage */}
            <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-inner relative">
              <ExerciseCharacterVisual
                exercise={activeDemoExercise}
                variant="card"
                isPlaying={true}
              />
            </div>

            {/* Exercise Details & Quick Launcher */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    {activeDemoExercise.location}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ⏱️ {activeDemoExercise.durationSeconds}s • {activeDemoExercise.intensity}
                  </span>
                </div>
                <h4 className="text-lg font-black text-white">
                  {activeDemoExercise.name}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeDemoExercise.biomechanicsRationale}
                </p>
              </div>

              {/* Form Cues */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="text-[10px] uppercase font-mono text-cyan-400 font-bold mb-1">
                  Coach Lyra's Alignment Cue:
                </div>
                <div className="text-slate-200">
                  {activeDemoExercise.formCues}
                </div>
              </div>

              {/* Target Muscles */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Targets:</span>
                {activeDemoExercise.targetMuscles.map(m => (
                  <span key={m} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900 border border-slate-800 text-cyan-300">
                    {m}
                  </span>
                ))}
              </div>

              {/* Action: Launch this drill as single routine */}
              <button
                onClick={() => {
                  const singleRoutine: Routine = {
                    id: `demo-${activeDemoExercise.id}`,
                    title: activeDemoExercise.name,
                    subtitle: `${activeDemoExercise.location} drill for ${activeDemoExercise.targetMuscles.join(', ')}`,
                    category: activeDemoExercise.category,
                    vehicle: 'all',
                    durationMinutes: Math.ceil(activeDemoExercise.durationSeconds / 60),
                    intensity: activeDemoExercise.intensity,
                    targetAreas: activeDemoExercise.targetMuscles,
                    coachRationale: activeDemoExercise.biomechanicsRationale,
                    exercises: [activeDemoExercise]
                  };
                  onStartRoutine(singleRoutine);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Start Interactive Drill Guided Session</span>
              </button>
            </div>
          </div>
        </div>

        {/* Personalized Tailored Prescription Banner (If Assessment Completed) */}
        {assessmentProfile ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-slate-900/60 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider">
                    Your Tailored Driver Rx
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase font-mono">
                    {assessmentProfile.primaryIssue.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {assessmentProfile.customRoutineTitle}
                </div>
                <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  {assessmentProfile.keyInsights[0] || 'Targeted biomechanical recovery configured for your commute.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  const matching = curatedRoutines.find(r => r.id === assessmentProfile.prescribedRoutineId) || curatedRoutines[0];
                  onStartRoutine(matching);
                }}
                className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Launch Tailored Rx</span>
              </button>
              <button
                onClick={onOpenOnboarding}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Retake Tailored Assessment"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Micro-Assessment Teaser Card */
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-slate-300">
                Experiencing lower back pain, stiff neck, or road numbness? Take the <strong className="text-white">60-second Driver Assessment</strong> to tailor an instant routine.
              </span>
            </div>
            <button
              onClick={onOpenOnboarding}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold whitespace-nowrap flex items-center gap-1 transition-all"
            >
              <span>Tailor Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Functional Pillars Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          
          <button
            onClick={() => onSelectTab('bodymap')}
            className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase text-cyan-400">Anatomy Map</span>
              <Activity className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
              Target Muscle Knots
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Spine, Sciatica, Traps
            </div>
          </button>

          <button
            onClick={() => onSelectTab('breath')}
            className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase text-teal-400">Vagal Pacing</span>
              <Wind className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
              Anti-Fatigue Breath
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Box, 4-7-8, Alertness
            </div>
          </button>

          <button
            onClick={() => onSelectTab('cockpit')}
            className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase text-sky-400">Seat Alignment</span>
              <Compass className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
              Cockpit Ergonomics
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Lumbar Angle & Headrest
            </div>
          </button>

          <button
            onClick={() => onSelectTab('trip')}
            className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase text-purple-400">Highway Itinerary</span>
              <Zap className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
              Smart Pitstop Planner
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              100-Mile Staging
            </div>
          </button>

        </div>

      </div>

    </div>
  );
};
