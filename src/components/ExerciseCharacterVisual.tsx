import React from 'react';
import { Exercise } from '../types';
import { Exercise3DCharacter } from './Exercise3DCharacter';

interface ExerciseCharacterVisualProps {
  exercise: Exercise;
  variant?: 'mini' | 'card' | 'player' | 'modal';
  interactive?: boolean;
  isPlaying?: boolean;
}

export const ExerciseCharacterVisual: React.FC<ExerciseCharacterVisualProps> = ({
  exercise,
  variant = 'card',
  interactive = true,
  isPlaying = true
}) => {
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

  return (
    <Exercise3DCharacter
      exercise={exercise}
      variant={variant}
      isPlaying={isPlaying}
      themeColor={getThemeColor()}
    />
  );
};
