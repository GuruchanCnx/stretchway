import React, { useState } from 'react';
import { Play, Sparkles, AlertCircle, CheckCircle, ChevronRight, Activity } from 'lucide-react';
import { MuscleGroup, Exercise, Routine } from '../types';
import { ALL_EXERCISES } from '../data/exercises';

interface BodyMapProps {
  onStartTargetedRoutine: (routine: Routine) => void;
  onFilterMuscle: (muscle: MuscleGroup) => void;
}

interface MuscleZoneInfo {
  id: MuscleGroup;
  title: string;
  driverRisk: string;
  solution: string;
  recommendedExercises: Exercise[];
}

export const BodyMap: React.FC<BodyMapProps> = ({
  onStartTargetedRoutine,
  onFilterMuscle
}) => {
  const [selectedZone, setSelectedZone] = useState<MuscleGroup>('neck');
  const [viewAngle, setViewAngle] = useState<'posterior' | 'anterior'>('posterior');

  const zoneDetails: Record<MuscleGroup, MuscleZoneInfo> = {
    neck: {
      id: 'neck',
      title: 'Cervical Spine & Suboccipitals',
      driverRisk: 'Forward-head craning to view road creates 40+ lbs of shear force on C5-C7 vertebrae.',
      solution: 'Axial chin tucks + occipital lengthening to restore natural cervical lordosis.',
      recommendedExercises: ALL_EXERCISES.filter(e => e.muscleGroup.includes('neck'))
    },
    shoulders: {
      id: 'shoulders',
      title: 'Trapezius & Rotator Cuff',
      driverRisk: 'Elevated steering grip and helmet wind drag keep upper traps in chronic ischemia.',
      solution: 'Scapular depression, chest opening, and rotator cuff spirals.',
      recommendedExercises: ALL_EXERCISES.filter(e => e.muscleGroup.includes('shoulders'))
    },
    'upper-back': {
      id: 'upper-back',
      title: 'Thoracic Spine & Rhomboids',
      driverRisk: 'Slouching over steering wheel flattens thoracic extension and restricts ribcage expansion.',
      solution: 'Thoracic basket rotations, eagle arms, and bumper downward-dog traction.',
      recommendedExercises: ALL_EXERCISES.filter(e => e.muscleGroup.includes('upper-back'))
    },
    'lower-back': {
      id: 'lower-back',
      title: 'Lumbar Spine (L4-S1) & QL',
      driverRisk: 'Bucket seats rotate pelvis posterior, doubling intervertebral disc pressure.',
      solution: 'Pelvic clock micro-movements, lumbar core bracing, and psoas release.',
      recommendedExercises: ALL_EXERCISES.filter(e => e.muscleGroup.includes('lower-back'))
    },
    hips: {
      id: 'hips',
      title: 'Hip Flexors, Psoas & Piriformis',
      driverRisk: 'Prolonged 90° hip angle shortens psoas; piriformis spasm compresses sciatic nerve.',
      solution: 'Seated Figure-4 release, standing quad stretches, and deep hip openers.',
      recommendedExercises: ALL_EXERCISES.filter(e => e.muscleGroup.includes('hips'))
    },
    wrists: {
      id: 'wrists',
      title: 'Forearm Flexors & Carpal Tunnel',
      driverRisk: 'Continuous throttle modulation and firm steering grip cause median nerve tingling.',
      solution: 'Neuro-flick drills, wrist spirals, and palmar fascia fans.',
      recommendedExercises: ALL_EXERCISES.filter(e => e.muscleGroup.includes('wrists'))
    },
    hamstrings: {
      id: 'hamstrings',
      title: 'Hamstrings & Posterior Chain',
      driverRisk: 'Seat edge cuts off arterial flow under thighs, locking hamstrings short.',
      solution: 'Seated sciatic slides and tabletop bumper hinges.',
      recommendedExercises: ALL_EXERCISES.filter(e => e.muscleGroup.includes('hamstrings'))
    },
    calves: {
      id: 'calves',
      title: 'Calf Muscle Pump & Ankles',
      driverRisk: 'Static foot positioning pools venous blood, causing heavy legs and cramp risk.',
      solution: 'Venous return pumps and calcaneus circular mobilizations.',
      recommendedExercises: ALL_EXERCISES.filter(e => e.muscleGroup.includes('calves'))
    },
    core: {
      id: 'core',
      title: 'Transverse Core & Diaphragm',
      driverRisk: 'Shallow breathing weakens intra-abdominal stabilization during sudden road bumps.',
      solution: 'Dan Tian diaphragmatic rooting and isometric lumbar bracing.',
      recommendedExercises: ALL_EXERCISES.filter(e => e.muscleGroup.includes('core'))
    },
    chest: {
      id: 'chest',
      title: 'Pectoralis Major & Minor',
      driverRisk: 'Shoulders rolled forward shorten pectorals, pulling clavicles downward.',
      solution: 'Steering wheel sternum lifts and doorway chest expansions.',
      recommendedExercises: ALL_EXERCISES.filter(e => e.muscleGroup.includes('chest'))
    }
  };

  const currentInfo = zoneDetails[selectedZone];

  const handleLaunchTargetedRoutine = () => {
    const routine: Routine = {
      id: `targeted-${selectedZone}`,
      title: `Instant ${currentInfo.title} Relief`,
      subtitle: `Targeted biomechanical decompression for ${currentInfo.title}`,
      category: 'quick',
      vehicle: 'all',
      durationMinutes: Math.min(8, currentInfo.recommendedExercises.length * 1.5),
      intensity: 'Moderate',
      targetAreas: [currentInfo.title],
      coachRationale: currentInfo.solution,
      bannerGradient: 'from-cyan-500 to-sky-600',
      exercises: currentInfo.recommendedExercises.slice(0, 4)
    };
    onStartTargetedRoutine(routine);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              Interactive Anatomy
            </span>
            <span className="text-xs text-slate-400">Click any muscle zone for instant diagnosis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Targeted Pain & Ergonomic Body Map
          </h2>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setViewAngle('posterior')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewAngle === 'posterior' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Spine & Back View
          </button>
          <button
            onClick={() => setViewAngle('anterior')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewAngle === 'anterior' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Front & Joint View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Interactive SVG Body Silhouette (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl relative">
          
          <svg viewBox="0 0 300 500" className="w-full max-w-[260px] h-auto drop-shadow-2xl">
            {/* Body Outline Silhouette */}
            <g className="stroke-slate-800 fill-slate-900/80" strokeWidth="2">
              {/* Head */}
              <circle cx="150" cy="50" r="30" />
              {/* Torso */}
              <path d="M120 85 C100 95, 90 120, 95 200 C95 240, 110 260, 120 270 L180 270 C190 260, 205 240, 205 200 C210 120, 200 95, 180 85 Z" />
              {/* Arms */}
              <path d="M95 100 L55 180 L40 260 L55 265 L70 190 L100 120 Z" />
              <path d="M205 100 L245 180 L260 260 L245 265 L230 190 L200 120 Z" />
              {/* Legs */}
              <path d="M120 270 L115 370 L110 470 L135 470 L140 370 L145 270 Z" />
              <path d="M180 270 L185 370 L190 470 L165 470 L160 370 L155 270 Z" />
            </g>

            {/* Clickable Muscle Hotspots */}
            {/* 1. Neck / Suboccipital */}
            <g 
              className="cursor-pointer group"
              onClick={() => setSelectedZone('neck')}
            >
              <ellipse 
                cx="150" cy="78" rx="22" ry="12" 
                className={`transition-all duration-300 ${
                  selectedZone === 'neck' 
                    ? 'fill-cyan-400/80 stroke-cyan-200 stroke-2' 
                    : 'fill-cyan-500/20 stroke-cyan-500/50 group-hover:fill-cyan-500/50'
                }`}
              />
              <text x="150" y="81" textAnchor="middle" className="text-[10px] font-bold fill-white pointer-events-none">Neck</text>
            </g>

            {/* 2. Trapezius / Shoulders */}
            <g 
              className="cursor-pointer group"
              onClick={() => setSelectedZone('shoulders')}
            >
              <path 
                d="M105 92 Q150 110 195 92 L185 118 Q150 130 115 118 Z"
                className={`transition-all duration-300 ${
                  selectedZone === 'shoulders' 
                    ? 'fill-cyan-400/80 stroke-cyan-200 stroke-2' 
                    : 'fill-cyan-500/20 stroke-cyan-500/50 group-hover:fill-cyan-500/50'
                }`}
              />
              <text x="150" y="113" textAnchor="middle" className="text-[10px] font-bold fill-white pointer-events-none">Shoulders</text>
            </g>

            {/* 3. Upper Back / Thoracic */}
            <g 
              className="cursor-pointer group"
              onClick={() => setSelectedZone('upper-back')}
            >
              <rect 
                x="122" y="130" width="56" height="45" rx="8"
                className={`transition-all duration-300 ${
                  selectedZone === 'upper-back' 
                    ? 'fill-cyan-400/80 stroke-cyan-200 stroke-2' 
                    : 'fill-cyan-500/20 stroke-cyan-500/50 group-hover:fill-cyan-500/50'
                }`}
              />
              <text x="150" y="156" textAnchor="middle" className="text-[10px] font-bold fill-white pointer-events-none">Upper Back</text>
            </g>

            {/* 4. Lower Back / Lumbar */}
            <g 
              className="cursor-pointer group"
              onClick={() => setSelectedZone('lower-back')}
            >
              <rect 
                x="122" y="185" width="56" height="40" rx="8"
                className={`transition-all duration-300 ${
                  selectedZone === 'lower-back' 
                    ? 'fill-cyan-400/80 stroke-cyan-200 stroke-2' 
                    : 'fill-cyan-500/20 stroke-cyan-500/50 group-hover:fill-cyan-500/50'
                }`}
              />
              <text x="150" y="210" textAnchor="middle" className="text-[10px] font-bold fill-white pointer-events-none">Lower Back</text>
            </g>

            {/* 5. Hips / Piriformis */}
            <g 
              className="cursor-pointer group"
              onClick={() => setSelectedZone('hips')}
            >
              <ellipse 
                cx="150" cy="250" rx="38" ry="18"
                className={`transition-all duration-300 ${
                  selectedZone === 'hips' 
                    ? 'fill-cyan-400/80 stroke-cyan-200 stroke-2' 
                    : 'fill-cyan-500/20 stroke-cyan-500/50 group-hover:fill-cyan-500/50'
                }`}
              />
              <text x="150" y="254" textAnchor="middle" className="text-[10px] font-bold fill-white pointer-events-none">Hips & Glutes</text>
            </g>

            {/* 6. Wrists / Forearms */}
            <g 
              className="cursor-pointer group"
              onClick={() => setSelectedZone('wrists')}
            >
              <circle cx="45" cy="255" r="14" className={selectedZone === 'wrists' ? 'fill-cyan-400/80' : 'fill-cyan-500/20 stroke-cyan-500/50'} />
              <circle cx="255" cy="255" r="14" className={selectedZone === 'wrists' ? 'fill-cyan-400/80' : 'fill-cyan-500/20 stroke-cyan-500/50'} />
              <text x="45" y="259" textAnchor="middle" className="text-[9px] font-bold fill-white pointer-events-none">Wrist</text>
              <text x="255" y="259" textAnchor="middle" className="text-[9px] font-bold fill-white pointer-events-none">Wrist</text>
            </g>

            {/* 7. Hamstrings / Thighs */}
            <g 
              className="cursor-pointer group"
              onClick={() => setSelectedZone('hamstrings')}
            >
              <rect x="110" y="290" width="28" height="60" rx="8" className={selectedZone === 'hamstrings' ? 'fill-cyan-400/80' : 'fill-cyan-500/20 stroke-cyan-500/50'} />
              <rect x="162" y="290" width="28" height="60" rx="8" className={selectedZone === 'hamstrings' ? 'fill-cyan-400/80' : 'fill-cyan-500/20 stroke-cyan-500/50'} />
              <text x="124" y="325" textAnchor="middle" className="text-[9px] font-bold fill-white pointer-events-none">Leg</text>
              <text x="176" y="325" textAnchor="middle" className="text-[9px] font-bold fill-white pointer-events-none">Leg</text>
            </g>

            {/* 8. Calves / Ankles */}
            <g 
              className="cursor-pointer group"
              onClick={() => setSelectedZone('calves')}
            >
              <rect x="105" y="380" width="26" height="60" rx="8" className={selectedZone === 'calves' ? 'fill-cyan-400/80' : 'fill-cyan-500/20 stroke-cyan-500/50'} />
              <rect x="169" y="380" width="26" height="60" rx="8" className={selectedZone === 'calves' ? 'fill-cyan-400/80' : 'fill-cyan-500/20 stroke-cyan-500/50'} />
              <text x="118" y="415" textAnchor="middle" className="text-[9px] font-bold fill-white pointer-events-none">Calf</text>
              <text x="182" y="415" textAnchor="middle" className="text-[9px] font-bold fill-white pointer-events-none">Calf</text>
            </g>
          </svg>

          {/* Quick Zone Chips */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-4">
            {(Object.keys(zoneDetails) as MuscleGroup[]).slice(0, 6).map((k) => (
              <button
                key={k}
                onClick={() => setSelectedZone(k)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                  selectedZone === k 
                    ? 'bg-cyan-500 text-slate-950 shadow-sm' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {k.replace('-', ' ')}
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Biomechanical Analysis & Targeted Drills (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>Selected Focus Area</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentInfo.recommendedExercises.length} Drills Available
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {currentInfo.title}
            </h3>

            <div className="mt-3 space-y-2.5 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-amber-200">
                <span className="font-bold text-amber-300 block mb-0.5">⚠️ Driving Pathology:</span>
                {currentInfo.driverRisk}
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/30 text-cyan-200">
                <span className="font-bold text-cyan-300 block mb-0.5">✅ Olympic Biomechanics Fix:</span>
                {currentInfo.solution}
              </div>
            </div>

            {/* Launch Targeted Routine Button */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleLaunchTargetedRoutine}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch {currentInfo.title} Relief Routine</span>
              </button>

              <button
                onClick={() => onFilterMuscle(selectedZone)}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all"
              >
                View Individual Drills
              </button>
            </div>
          </div>

          {/* Recommended Exercise Previews */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Targeted Drills in this Protocol:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentInfo.recommendedExercises.slice(0, 4).map((ex) => (
                <div 
                  key={ex.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-2"
                >
                  <div>
                    <h5 className="text-xs font-bold text-white leading-snug">
                      {ex.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>⏱️ {ex.durationSeconds}s</span>
                      <span>•</span>
                      <span className="text-cyan-400">{ex.location}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-800 text-slate-300">
                    {ex.intensity}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
