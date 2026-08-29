import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  X, 
  ShieldAlert, 
  Heart,
  ChevronRight,
  Flame,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Routine, Exercise } from '../types';
import { playTick, playGong, speakCoachCue, stopVoiceCoach } from '../utils/audio';
import { Veo3ExerciseViewer } from './Veo3ExerciseViewer';

interface InteractivePlayerProps {
  routine: Routine;
  onClose: () => void;
  onComplete: (data: {
    routineId: string;
    routineTitle: string;
    durationMinutes: number;
    feelingBefore: number;
    feelingAfter: number;
  }) => void;
}

export const InteractivePlayer: React.FC<InteractivePlayerProps> = ({
  routine,
  onClose,
  onComplete
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(routine.exercises[0]?.durationSeconds || 45);
  const [isPlaying, setIsPlaying] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feelingBefore, setFeelingBefore] = useState(3);
  const [feelingAfter, setFeelingAfter] = useState(5);
  const [stepChecked, setStepChecked] = useState<Record<number, boolean>>({});

  const currentExercise: Exercise = routine.exercises[currentIdx] || routine.exercises[0];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger voice cue on new exercise
  useEffect(() => {
    if (!currentExercise || isCompleted) return;
    setTimeLeft(currentExercise.durationSeconds);
    setStepChecked({});
    
    if (voiceEnabled) {
      const cue = `Next: ${currentExercise.name}. ${currentExercise.formCues}`;
      speakCoachCue(cue, true);
    }
  }, [currentIdx, routine, voiceEnabled, isCompleted]);

  // Timer countdown loop
  useEffect(() => {
    if (!isPlaying || isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Play sound and advance to next exercise or complete
          if (soundEnabled) playTick(880, 0.15, 0.25);

          if (currentIdx < routine.exercises.length - 1) {
            setCurrentIdx((c) => c + 1);
            return routine.exercises[currentIdx + 1].durationSeconds;
          } else {
            // Completed all exercises
            clearInterval(timerRef.current!);
            setIsCompleted(true);
            playGong();
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
            return 0;
          }
        }

        // Play tick on final 3 seconds
        if (prev <= 4 && soundEnabled) {
          playTick(520, 0.08, 0.12);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIdx, isCompleted, routine.exercises, soundEnabled]);

  const handleNext = () => {
    if (currentIdx < routine.exercises.length - 1) {
      setCurrentIdx((c) => c + 1);
    } else {
      setIsCompleted(true);
      playGong();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((c) => c - 1);
    }
  };

  const handleRestart = () => {
    setTimeLeft(currentExercise.durationSeconds);
  };

  const handleAdjustTime = (delta: number) => {
    setTimeLeft((t) => Math.max(5, t + delta));
  };

  const handleFinishSession = () => {
    stopVoiceCoach();
    onComplete({
      routineId: routine.id,
      routineTitle: routine.title,
      durationMinutes: routine.durationMinutes,
      feelingBefore,
      feelingAfter
    });
  };

  const progressPercent = ((currentIdx + 1) / routine.exercises.length) * 100;
  const timerPercent = (timeLeft / (currentExercise?.durationSeconds || 45)) * 100;

  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
        <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            Recovery Complete!
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            You successfully completed the <span className="text-cyan-400 font-semibold">{routine.title}</span>. Your spine, joints, and nervous system are reset.
          </p>

          {/* Quick Relief Rating */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-6 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Bio-Feedback: How do you feel now?</span>
            </h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Physical Comfort Before:</span>
                  <span className="font-bold text-amber-400">{feelingBefore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={feelingBefore}
                  onChange={(e) => setFeelingBefore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Physical Comfort After:</span>
                  <span className="font-bold text-emerald-400">{feelingAfter} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={feelingAfter}
                  onChange={(e) => setFeelingAfter(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleFinishSession}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Save to Road Log & Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Prominent Back / Exit Button */}
          <button
            onClick={() => {
              stopVoiceCoach();
              onClose();
            }}
            className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm active:scale-95 group"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
              Active Routine • Step {currentIdx + 1} of {routine.exercises.length}
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-white truncate max-w-xs sm:max-w-md">
              {routine.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Voice Coach Toggle */}
          <button
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              if (voiceEnabled) stopVoiceCoach();
            }}
            className={`p-2.5 rounded-xl border transition-all ${
              voiceEnabled 
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={voiceEnabled ? 'Voice Coach Active' : 'Voice Coach Muted'}
          >
            {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Sound Tick Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-all ${
              soundEnabled 
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={soundEnabled ? 'Chime Sounds On' : 'Chime Sounds Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          <button
            onClick={() => {
              stopVoiceCoach();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Exit Workout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Routine Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5">
        <div 
          className="bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400 h-full transition-all duration-500" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Player Body */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto items-center">
        
        {/* Left Column: Timer & Controls (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl relative">
          
          {/* Location Badge */}
          <div className="mb-4 flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-950 border border-cyan-800/60 text-cyan-300">
              {currentExercise.location}
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300">
              {currentExercise.intensity}
            </span>
          </div>

          {/* Circular Countdown Timer */}
          <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-800"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-cyan-400 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * timerPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl sm:text-6xl font-black tracking-tighter text-white font-mono">
                {timeLeft}
              </span>
              <span className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-semibold">
                seconds remaining
              </span>
              <span className="text-[11px] text-cyan-400 font-medium mt-1">
                {currentExercise.reps}
              </span>
            </div>
          </div>

          {/* Time Adjustment Controls */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => handleAdjustTime(-10)}
              className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/50 transition-all"
            >
              -10s
            </button>
            <button
              onClick={handleRestart}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/50 transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleAdjustTime(10)}
              className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/50 transition-all"
            >
              +10s
            </button>
          </div>

          {/* Primary Playback Bar */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="p-3.5 rounded-2xl bg-slate-800/90 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all hover:bg-slate-800"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 shadow-xl shadow-cyan-500/30 transition-all transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-slate-950" /> : <Play className="w-7 h-7 fill-slate-950 ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-3.5 rounded-2xl bg-slate-800/90 text-slate-300 hover:text-white transition-all hover:bg-slate-800"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Exercise Detail & Biomechanics Cues (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {currentExercise.category.toUpperCase()} PROTOCOL
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">
                {currentExercise.targetMuscles.join(', ')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {currentExercise.name}
            </h1>
          </div>

          {/* Veo-3 4K Motion Demonstration with View Switcher */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <Veo3ExerciseViewer
              exercise={currentExercise}
              variant="player"
              autoPlay={isPlaying}
              onBack={() => {
                stopVoiceCoach();
                onClose();
              }}
            />
          </div>

          {/* Olympic Coach Form Cue (Gold/Cyan Banner) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 to-slate-900 border border-cyan-800/60 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 mb-1">
                  Olympic Coach Biomechanical Cue
                </h4>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">
                  {currentExercise.formCues}
                </p>
                {currentExercise.breathPattern && (
                  <div className="mt-2 text-xs text-cyan-300/80 font-mono bg-cyan-950/60 px-2.5 py-1 rounded-lg inline-block">
                    🌬️ Breath: {currentExercise.breathPattern}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Common Mistake to Avoid */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                Common Mistake to Avoid:
              </span>
              <p className="text-xs text-amber-200/90 mt-0.5">
                {currentExercise.avoidMistake}
              </p>
            </div>
          </div>

          {/* Step-by-Step Movement Checklist */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Movement Execution Steps
            </h4>
            <div className="space-y-2">
              {currentExercise.steps.map((step, idx) => (
                <div 
                  key={idx}
                  onClick={() => setStepChecked(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                    stepChecked[idx] ? 'bg-cyan-950/40 border border-cyan-800/40 text-cyan-200' : 'bg-slate-950/40 border border-slate-800/40 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="mt-0.5 text-cyan-400">
                    <CheckCircle2 className={`w-4 h-4 ${stepChecked[idx] ? 'fill-cyan-500 text-slate-950' : 'text-slate-600'}`} />
                  </div>
                  <span className="text-xs leading-relaxed font-medium">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Biomechanics Rationale */}
          <div className="text-[11px] text-slate-400 italic bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
            <strong>Why it works:</strong> {currentExercise.biomechanicsRationale}
          </div>

        </div>

      </div>

    </div>
  );
};
