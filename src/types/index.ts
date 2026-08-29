export type VehicleType = 'all' | 'car' | 'two-wheeler' | 'truck' | 'commuter';

export type ExerciseCategory = 
  | 'car' 
  | 'two-wheeler' 
  | 'quick' 
  | 'spinal' 
  | 'taichi' 
  | 'yoga' 
  | 'breathing' 
  | 'full';

export type MuscleGroup = 
  | 'neck' 
  | 'shoulders' 
  | 'upper-back' 
  | 'lower-back' 
  | 'hips' 
  | 'hamstrings' 
  | 'wrists' 
  | 'calves' 
  | 'core' 
  | 'chest';

export type IntensityLevel = 'Gentle' | 'Moderate' | 'Deep Release';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  vehicle: ('car' | 'two-wheeler' | 'truck' | 'commuter')[];
  durationSeconds: number;
  reps: string;
  intensity: IntensityLevel;
  targetMuscles: string[];
  muscleGroup: MuscleGroup[];
  location: 'In-Seat' | 'Off-Vehicle / Standing' | 'Either';
  steps: string[];
  formCues: string;
  avoidMistake: string;
  biomechanicsRationale: string;
  breathPattern?: string;
  imageIcon?: string;
  videoClip?: {
    veoPrompt: string;
    cameraAngle: string;
    biomechanicalFocus: string;
    thumbnailColor: string;
    accentBadge: string;
  };
}

export interface Routine {
  id: string;
  title: string;
  subtitle: string;
  category: ExerciseCategory;
  vehicle: VehicleType;
  durationMinutes: number;
  intensity: IntensityLevel;
  exercises: Exercise[];
  coachRationale: string;
  targetAreas: string[];
  bannerGradient?: string;
}

export interface BreathProtocol {
  id: string;
  name: string;
  tagline: string;
  description: string;
  inhaleSec: number;
  holdInSec: number;
  exhaleSec: number;
  holdOutSec: number;
  totalCycles: number;
  category: 'calm' | 'focus' | 'energize' | 'sleep';
  benefits: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'coach' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    routineId?: string;
    actionType: 'start_routine' | 'open_breath' | 'open_cockpit';
  };
}

export interface TripPitstop {
  id: string;
  mileMarker: number;
  driveTimeHours: number;
  stopName: string;
  recommendedDurationMinutes: number;
  hydrationTargetMl: number;
  suggestedRoutine: Routine;
  notes: string;
}

export interface ErgonomicTip {
  id: string;
  area: string;
  vehicle: 'car' | 'two-wheeler' | 'truck';
  rule: string;
  angleOrDistance: string;
  why: string;
  correctionSteps: string[];
}

export interface UserProgress {
  totalMinutesStretched: number;
  routinesCompleted: number;
  breathSessionsCompleted: number;
  currentStreakDays: number;
  lastSessionDate: string;
  completedHistory: {
    id: string;
    title: string;
    date: string;
    durationMinutes: number;
    feelingBefore: number; // 1-5
    feelingAfter: number; // 1-5
  }[];
  favoriteExerciseIds: string[];
}

export interface SorenessAssessmentResult {
  diagnosisTitle: string;
  diagnosisExplanation: string;
  riskLevel: 'Mild Stiffness' | 'Moderate Compression' | 'High Tension Knot';
  suggestedRoutineId: string;
  suggestedRoutineTitle: string;
  suggestedRoutineDuration: number;
  matchReason: string;
  acuteMicroReliefCue: string;
  keyTargetMuscles: string[];
  breathingPrescription: string;
  recommendedExercises: {
    name: string;
    target: string;
    cue: string;
    duration: string;
  }[];
}

export type DriverPrimaryIssue = 
  | 'lower-back'
  | 'neck-shoulders'
  | 'sciatica-hips'
  | 'wrist-hand'
  | 'fatigue-brainfog'
  | 'slouch-posture';

export type DrivingDuration = 'short' | 'moderate' | 'long' | 'heavy';

export type DriverGoal = 'instant-relief' | 'endurance' | 'spine-health' | 'alertness';

export interface UserAssessmentProfile {
  primaryIssue: DriverPrimaryIssue;
  vehicle: VehicleType;
  duration: DrivingDuration;
  goal: DriverGoal;
  completedAt: string;
  customRoutineTitle: string;
  prescribedRoutineId: string;
  keyInsights: string[];
}

export type AccentColorTheme = 'ocean' | 'sunset' | 'forest' | 'aurora' | 'amber';

export interface ThemeConfig {
  id: AccentColorTheme;
  name: string;
  description: string;
  primaryColor: string;
  accentGradient: string;
  badgeBg: string;
  activeRing: string;
  palette: {
    50: string;
    400: string;
    500: string;
    600: string;
    glow: string;
  };
}
