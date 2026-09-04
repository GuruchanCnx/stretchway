import React, { useState } from 'react';
import { Play, Sparkles, Clock, MapPin, ChevronRight, Activity, Video } from 'lucide-react';
import { Exercise, Routine } from '../types';
import { ExerciseCharacterVisual } from './ExerciseCharacterVisual';
import { Veo3ExerciseViewer } from './Veo3ExerciseViewer';
import { getVeoClipForExercise } from '../data/veoClips';

interface ExerciseCardProps {
  exercise: Exercise;
  onOpenDetail: (exercise: Exercise) => void;
  onStartSingle: (routine: Routine) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onOpenDetail,
  onStartSingle
}) => {
  const [viewMode, setViewMode] = useState<'kinetic' | 'veo3'>('kinetic');
  const clipMeta = getVeoClipForExercise(exercise);

  const handleQuickStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const singleRoutine: Routine = {
      id: `single-${exercise.id}`,
      title: exercise.name,
      subtitle: `${exercise.location} drill for ${exercise.targetMuscles.join(', ')}`,
      category: exercise.category,
      vehicle: 'all',
      durationMinutes: Math.ceil(exercise.durationSeconds / 60),
      intensity: exercise.intensity,
      targetAreas: exercise.targetMuscles,
      coachRationale: exercise.biomechanicsRationale,
      exercises: [exercise]
    };
    onStartSingle(singleRoutine);
  };

  const getCategoryBadgeColor = () => {
    switch (exercise.category) {
      case 'car': return 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60';
      case 'two-wheeler': return 'bg-amber-950/80 text-amber-400 border-amber-800/60';
      case 'quick': return 'bg-teal-950/80 text-teal-400 border-teal-800/60';
      case 'spinal': return 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60';
      case 'taichi': return 'bg-sky-950/80 text-sky-400 border-sky-800/60';
      case 'yoga': return 'bg-purple-950/80 text-purple-400 border-purple-800/60';
      default: return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div 
      onClick={() => onOpenDetail(exercise)}
      className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-0.5"
    >
      <div>
        {/* Visual Stage with Kinetic vs Veo-3 4K Switcher */}
        <div className="mb-3 relative">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md border ${getCategoryBadgeColor()}`}>
              {exercise.category}
            </span>

            {/* Toggle between Kinetic Rig & Veo-3 4K Demo */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800"
            >
              <button
                type="button"
                onClick={() => setViewMode('kinetic')}
                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-all flex items-center gap-1 ${
                  viewMode === 'kinetic'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Activity className="w-2.5 h-2.5" />
                <span>Rig</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('veo3')}
                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-all flex items-center gap-1 ${
                  viewMode === 'veo3'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Video className="w-2.5 h-2.5" />
                <span>Veo-3</span>
              </button>
            </div>
          </div>

          {viewMode === 'kinetic' ? (
            <ExerciseCharacterVisual 
              exercise={exercise} 
              variant="mini" 
              interactive={false}
            />
          ) : (
            <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-800/80 relative group/video">
              <Veo3ExerciseViewer
                exercise={exercise}
                variant="mini"
                autoPlay={false}
              />
            </div>
          )}
        </div>

        {/* Duration & Intensity */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{exercise.durationSeconds}s</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase">
            {clipMeta.badgeText}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
          {exercise.name}
        </h4>

        {/* Form Cue Snippet */}
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {exercise.formCues}
        </p>

        {/* Target Muscles */}
        <div className="flex flex-wrap gap-1 mt-3">
          {exercise.targetMuscles.slice(0, 2).map((m, i) => (
            <span key={i} className="px-2 py-0.5 text-[10px] rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-medium">
              {m}
            </span>
          ))}
          {exercise.targetMuscles.length > 2 && (
            <span className="px-1.5 py-0.5 text-[10px] text-slate-500 font-medium">
              +{exercise.targetMuscles.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-slate-800/60">
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3 text-teal-400" />
          <span>{exercise.location}</span>
        </span>

        <button
          onClick={handleQuickStart}
          className="py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 text-xs font-bold border border-cyan-500/30 flex items-center gap-1 transition-all"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Start Drill</span>
        </button>
      </div>

    </div>
  );
};

