import React from 'react';
import { X, Play, Sparkles, ShieldAlert, CheckCircle2, Wind, Activity, ArrowLeft } from 'lucide-react';
import { Exercise, Routine } from '../types';
import { Veo3ExerciseViewer } from './Veo3ExerciseViewer';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onStartSingleExercise: (routine: Routine) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onStartSingleExercise
}) => {
  if (!exercise) return null;

  const handleStart = () => {
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
    onStartSingleExercise(singleRoutine);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[88vh] overflow-y-auto">
        
        {/* Header with Back & Close Buttons */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800 transition-all flex items-center gap-1 text-xs font-bold"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Back</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  {exercise.location}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ⏱️ {exercise.durationSeconds}s • {exercise.reps}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                {exercise.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 my-5">
          
          {/* Veo-3 Cinema Clip / Character Stage with Biomechanics Controls */}
          <div className="rounded-2xl overflow-hidden border border-slate-800">
            <Veo3ExerciseViewer 
              exercise={exercise}
              variant="modal"
              autoPlay={true}
              onBack={onClose}
            />
          </div>

          {/* Olympic Coach Form Cue */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 to-slate-900 border border-cyan-800/60">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">
                  Olympic Coach Biomechanical Alignment
                </h5>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed font-medium">
                  {exercise.formCues}
                </p>
                {exercise.breathPattern && (
                  <div className="mt-2 text-xs text-cyan-300/90 font-mono">
                    🌬️ Breath: {exercise.breathPattern}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Common Mistake */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200">
              <strong className="text-amber-300">Mistake to Avoid: </strong>
              {exercise.avoidMistake}
            </div>
          </div>

          {/* Step-by-Step Movement Instructions */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Step-by-Step Instructions:
            </h5>
            <div className="space-y-2">
              {exercise.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Muscles */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-400">Target Muscles:</span>
            <div className="flex flex-wrap gap-1">
              {exercise.targetMuscles.map((m, i) => (
                <span key={i} className="px-2 py-0.5 text-[11px] rounded-md bg-slate-800 text-slate-300 font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Launch Single Guided Drill</span>
        </button>

      </div>
    </div>
  );
};
