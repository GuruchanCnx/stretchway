import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Wind, Heart, Sparkles, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { BreathProtocol } from '../types';
import { BREATH_PROTOCOLS } from '../data/exercises';
import { playBreathChime } from '../utils/audio';

interface BreathEngineProps {
  initialProtocolId?: string;
  onCompleteSession?: (protocolName: string, cycles: number) => void;
}

type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

export const BreathEngine: React.FC<BreathEngineProps> = ({
  initialProtocolId = 'box-breathing',
  onCompleteSession
}) => {
  const [selectedProtocol, setSelectedProtocol] = useState<BreathProtocol>(
    BREATH_PROTOCOLS.find(p => p.id === initialProtocolId) || BREATH_PROTOCOLS[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(selectedProtocol.inhaleSec);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Switch protocol resets
  const handleSelectProtocol = (p: BreathProtocol) => {
    setSelectedProtocol(p);
    setIsPlaying(false);
    setCurrentCycle(1);
    setPhase('inhale');
    setPhaseTimeLeft(p.inhaleSec);
  };

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Play initial chime for the starting phase
    if (soundEnabled) {
      playBreathChime(phase === 'inhale' ? 'inhale' : phase === 'exhale' ? 'exhale' : 'hold');
    }

    timerRef.current = setInterval(() => {
      setPhaseTimeLeft((prev) => {
        if (prev <= 1) {
          // Switch to next phase
          if (phase === 'inhale') {
            if (selectedProtocol.holdInSec > 0) {
              setPhase('holdIn');
              if (soundEnabled) playBreathChime('hold');
              return selectedProtocol.holdInSec;
            } else {
              setPhase('exhale');
              if (soundEnabled) playBreathChime('exhale');
              return selectedProtocol.exhaleSec;
            }
          } else if (phase === 'holdIn') {
            setPhase('exhale');
            if (soundEnabled) playBreathChime('exhale');
            return selectedProtocol.exhaleSec;
          } else if (phase === 'exhale') {
            if (selectedProtocol.holdOutSec > 0) {
              setPhase('holdOut');
              if (soundEnabled) playBreathChime('hold');
              return selectedProtocol.holdOutSec;
            } else {
              // End of cycle
              advanceCycle();
              setPhase('inhale');
              if (soundEnabled) playBreathChime('inhale');
              return selectedProtocol.inhaleSec;
            }
          } else if (phase === 'holdOut') {
            // End of cycle
            advanceCycle();
            setPhase('inhale');
            if (soundEnabled) playBreathChime('inhale');
            return selectedProtocol.inhaleSec;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, phase, selectedProtocol, soundEnabled]);

  const advanceCycle = () => {
    setCurrentCycle((c) => {
      if (c >= selectedProtocol.totalCycles) {
        setIsPlaying(false);
        if (onCompleteSession) {
          onCompleteSession(selectedProtocol.name, selectedProtocol.totalCycles);
        }
        return 1;
      }
      return c + 1;
    });
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return { text: 'Inhale through nose', sub: 'Fill diaphragm & lower ribs', scale: 'scale-125' };
      case 'holdIn':
        return { text: 'Hold Breath Full', sub: 'Relax shoulders & jaw', scale: 'scale-125' };
      case 'exhale':
        return { text: 'Exhale smoothly', sub: 'Release all chest tension', scale: 'scale-75' };
      case 'holdOut':
        return { text: 'Hold Breath Empty', sub: 'Settle in stillness', scale: 'scale-75' };
    }
  };

  const currentInstruction = getPhaseInstruction();

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-teal-950 text-teal-400 border border-teal-800/60 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5" />
              <span>Olympic Breath Mastery</span>
            </span>
            <span className="text-xs text-slate-400">Autonomic Nervous System Regulation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Driver Alertness & Calm Breath Engine
          </h2>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2.5 rounded-xl border self-start transition-all ${
            soundEnabled ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
          title={soundEnabled ? 'Harmonic Chimes On' : 'Chimes Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Protocol Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {BREATH_PROTOCOLS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectProtocol(p)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedProtocol.id === p.id
                ? 'bg-teal-950/60 border-teal-500/60 text-white shadow-lg shadow-teal-500/10'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <div className="text-xs font-extrabold truncate">{p.name.split('(')[0]}</div>
            <div className="text-[11px] text-teal-400 font-mono mt-0.5">
              {p.inhaleSec}s - {p.holdInSec}s - {p.exhaleSec}s - {p.holdOutSec}s
            </div>
          </button>
        ))}
      </div>

      {/* Main Breathing Pacer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Visual Breathing Sphere (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 bg-slate-950/80 border border-slate-800/80 rounded-3xl relative min-h-[340px] overflow-hidden">
          
          {/* Animated Ambient Rings */}
          <div className={`absolute w-64 h-64 rounded-full bg-teal-500/10 blur-2xl transition-all duration-1000 ${isPlaying ? 'scale-110 opacity-70' : 'scale-90 opacity-20'}`} />
          
          {/* Pulsing Concentric Circles */}
          <div className="relative flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64">
            
            {/* Outer Expanding Ring */}
            <div 
              className={`absolute inset-0 rounded-full border-2 border-teal-400/30 transition-transform duration-1000 ease-in-out ${
                isPlaying && (phase === 'inhale' || phase === 'holdIn') ? 'scale-110' : 'scale-90'
              }`} 
            />

            {/* Core Breathing Sphere */}
            <div 
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-teal-500 via-cyan-400 to-sky-400 p-1 flex items-center justify-center shadow-2xl shadow-teal-500/40 transition-all duration-1000 ease-in-out ${
                isPlaying ? currentInstruction.scale : 'scale-100'
              }`}
            >
              <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center text-center p-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                  {phaseTimeLeft}s
                </span>
                <span className="text-[11px] uppercase tracking-widest text-teal-300 font-extrabold mt-0.5">
                  {phase.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Phase Guidance Text */}
          <div className="text-center mt-6 z-10">
            <h4 className="text-base sm:text-lg font-extrabold text-white">
              {isPlaying ? currentInstruction.text : 'Ready to Begin'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPlaying ? currentInstruction.sub : `Cycle: ${currentCycle} of ${selectedProtocol.totalCycles}`}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-5 z-10">
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentCycle(1);
                setPhase('inhale');
                setPhaseTimeLeft(selectedProtocol.inhaleSec);
              }}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
              <span>{isPlaying ? 'Pause Pacer' : 'Start Breathing'}</span>
            </button>
          </div>

        </div>

        {/* Right Info Card (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {selectedProtocol.name}
            </h3>
            <p className="text-xs text-teal-400 font-medium mt-1">
              {selectedProtocol.tagline}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3">
              {selectedProtocol.description}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Proven Biomechanical Benefits:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedProtocol.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-800/30 flex items-start gap-3">
            <Heart className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div className="text-xs text-teal-200/90 leading-relaxed">
              <strong>Highway Safety Rule:</strong> Only perform deep breath holds while safely parked with the vehicle in park and handbrake engaged. Never hyperventilate while driving.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
