import React from 'react';
import { Play, Sparkles, Clock, MapPin, ChevronRight, Activity } from 'lucide-react';
import { Exercise, Routine } from '../types';
import { ExerciseCharacterVisual } from './ExerciseCharacterVisual';

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
      className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-0.5"
    >
      <div>
        {/* Animated Character Mini-Clip Stage */}
        <div className="mb-3">
          <ExerciseCharacterVisual 
            exercise={exercise} 
            variant="mini" 
            interactive={false}
          />
        </div>

        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md border ${getCategoryBadgeColor()}`}>
            {exercise.category}
          </span>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{exercise.durationSeconds}s</span>
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
          {exercise.name}
        </h4>

        {/* Form Cue Snippet */}
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
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
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/60">
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
