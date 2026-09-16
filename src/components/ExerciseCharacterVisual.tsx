import React, { useState } from 'react';
import { Exercise, CoachId } from '../types';
import { Exercise3DCharacter } from './Exercise3DCharacter';
import { AnimatedCharacterRig } from './AnimatedCharacterRig';
import { Activity, Sparkles } from 'lucide-react';

interface ExerciseCharacterVisualProps {
  exercise: Exercise;
  variant?: 'mini' | 'card' | 'player' | 'modal';
  interactive?: boolean;
  isPlaying?: boolean;
  coachId?: CoachId;
  equippedFlairIds?: string[];
  initialMode?: 'rig' | '3d';
}

export const ExerciseCharacterVisual: React.FC<ExerciseCharacterVisualProps> = ({
  exercise,
  variant = 'card',
  interactive = true,
  isPlaying = true,
  coachId,
  equippedFlairIds = [],
  initialMode = 'rig'
}) => {
  const [renderMode, setRenderMode] = useState<'rig' | '3d'>(initialMode);
  
  // Read active coach from localStorage if not passed
  const activeCoachId = coachId || (typeof window !== 'undefined' ? (localStorage.getItem('stretchway_selected_coach') as CoachId) || 'olympic' : 'olympic');

  // Determine primary theme color by category
  const getThemeColor = () => {
    switch (exercise.category) {
      case 'car': return '#06b6d4';
      case 'two-wheeler': return '#f59e0b';
      case 'quick': return '#14b8a6';
      case 'spinal': return '#6366f1';
      case 'taichi': return '#0284c7';
      case 'yoga': return '#a855f7';
      default: return '#06b6d4';
    }
  };

  const isMini = variant === 'mini';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Mode Switcher Pill (for card/player variants) */}
      {!isMini && interactive && (
        <div className="absolute top-2 right-2 z-20 flex items-center p-0.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setRenderMode('rig')}
            className={`px-2 py-1 rounded-lg text-[9px] font-extrabold uppercase transition-all flex items-center gap-1 ${
              renderMode === 'rig'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Animated Coach Rig"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Coach Rig</span>
          </button>
          <button
            type="button"
            onClick={() => setRenderMode('3d')}
            className={`px-2 py-1 rounded-lg text-[9px] font-extrabold uppercase transition-all flex items-center gap-1 ${
              renderMode === '3d'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to 3D Mannequin"
          >
            <Activity className="w-2.5 h-2.5" />
            <span>3D Model</span>
          </button>
        </div>
      )}

      {/* Primary Visual Output */}
      {renderMode === 'rig' ? (
        <AnimatedCharacterRig
          exercise={exercise}
          coachId={activeCoachId}
          variant={variant}
          isPlaying={isPlaying}
          equippedFlairIds={equippedFlairIds}
          showBiomechanicsHUD={!isMini}
        />
      ) : (
        <Exercise3DCharacter
          exercise={exercise}
          variant={variant}
          isPlaying={isPlaying}
          themeColor={getThemeColor()}
        />
      )}
    </div>
  );
};
