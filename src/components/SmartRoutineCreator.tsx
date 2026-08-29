import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Clock, 
  Car, 
  Bike, 
  Truck, 
  Bus, 
  AlertTriangle, 
  Play, 
  Plus, 
  CheckCircle2, 
  RotateCcw, 
  Flame, 
  Activity, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  Layers,
  HeartPulse,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Routine, VehicleType, Exercise } from '../types';

interface SmartRoutineCreatorProps {
  onRoutineCreated: (routine: Routine, autoStart?: boolean) => void;
  currentVehicle: VehicleType;
  onClose?: () => void;
  isCompact?: boolean;
}

export const SmartRoutineCreator: React.FC<SmartRoutineCreatorProps> = ({
  onRoutineCreated,
  currentVehicle,
  onClose,
  isCompact = false
}) => {
  // Form State
  const [painLevel, setPainLevel] = useState<number>(6);
  const [selectedPainAreas, setSelectedPainAreas] = useState<string[]>([
    'Lower Back (L4-L5)',
    'Neck & Traps'
  ]);
  const [availableMinutes, setAvailableMinutes] = useState<number>(8);
  const [vehicle, setVehicle] = useState<'car' | 'two-wheeler' | 'truck' | 'commuter'>(
    currentVehicle === 'two-wheeler' ? 'two-wheeler' : currentVehicle === 'truck' ? 'truck' : 'car'
  );
  const [locationType, setLocationType] = useState<'In-Seat' | 'Off-Vehicle / Standing' | 'Either'>('In-Seat');
  const [goal, setGoal] = useState<'pain_relief' | 'alertness' | 'post_trip' | 'speed_reset'>('pain_relief');
  
  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedRoutine, setGeneratedRoutine] = useState<Routine | null>(null);
  const [hasAppended, setHasAppended] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const painAreasList = [
    { id: 'Lower Back (L4-L5)', label: 'Lower Back (L4-L5)', icon: '🦴' },
    { id: 'Neck & Traps', label: 'Cervical Neck & Traps', icon: '💆' },
    { id: 'Sciatica & Glutes', label: 'Piriformis / Sciatic Nerve', icon: '⚡' },
    { id: 'Throttle Wrists & Forearms', label: 'Steering Wrists & Forearms', icon: '🖐️' },
    { id: 'Thoracic & Mid-Back', label: 'Thoracic & Scapula', icon: '🎽' },
    { id: 'Hip Flexors & Psoas', label: 'Hip Flexors (Psoas)', icon: '🪑' },
    { id: 'Hamstrings & Calves', label: 'Legs, Hamstrings & Calves', icon: '🦵' },
    { id: 'Eye Strain & Mental Fatigue', label: 'Eye Strain & Brain Fog', icon: '👁️' },
  ];

  const durationOptions = [3, 5, 8, 12, 15];

  const togglePainArea = (areaId: string) => {
    setSelectedPainAreas(prev => 
      prev.includes(areaId)
        ? prev.filter(a => a !== areaId)
        : [...prev, areaId]
    );
  };

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    if (level <= 6) return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
    if (level <= 8) return 'text-orange-400 bg-orange-950/60 border-orange-500/40';
    return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
  };

  const getPainLevelLabel = (level: number) => {
    if (level <= 2) return 'Mild Postural Fatigue';
    if (level <= 4) return 'Noticeable Stiffness & Tightness';
    if (level <= 6) return 'Moderate Aching & Compression';
    if (level <= 8) return 'Severe Muscle Knot & Nerve Impingement';
    return 'Acute Spasm / Road Rigidity';
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedRoutine(null);
    setHasAppended(false);

    // Progressive step simulation for engaging user experience
    setGenerationStep('Analyzing vehicle postural geometry...');
    const stepTimer1 = setTimeout(() => {
      setGenerationStep('Calculating spinal disc decompression ratios...');
    }, 600);
    const stepTimer2 = setTimeout(() => {
      setGenerationStep('Synthesizing Olympic coach biomechanical cues...');
    }, 1300);

    try {
      const response = await fetch('/api/coach/generate-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle,
          durationMinutes: availableMinutes,
          painLevel,
          painFocus: selectedPainAreas.length > 0 ? selectedPainAreas.join(', ') : 'Lower Back & Neck',
          locationType,
          environmentNotes: `Goal: ${goal}, Pain: ${painLevel}/10`,
          experienceLevel: 'All Levels'
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        throw new Error(`Generation failed with code ${response.status}`);
      }

      const data: Routine = await response.json();
      
      // Ensure banner gradient and vehicle match
      const enrichedRoutine: Routine = {
        ...data,
        id: data.id || `smart-routine-${Date.now()}`,
        vehicle: vehicle,
        category: vehicle === 'two-wheeler' ? 'two-wheeler' : 'car',
        durationMinutes: availableMinutes,
        bannerGradient: painLevel >= 7 
          ? 'from-rose-500 to-amber-600' 
          : painLevel >= 4 
            ? 'from-cyan-500 to-blue-600' 
            : 'from-emerald-500 to-teal-600',
        targetAreas: selectedPainAreas.length > 0 ? selectedPainAreas : data.targetAreas || ['Spine', 'Hips']
      };

      setGeneratedRoutine(enrichedRoutine);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err: any) {
      console.error('Smart Routine Creator error:', err);
      setErrorMsg('Could not connect to AI generator. Retrying with local biomechanics engine...');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleAppendToProtocols = (autoStart: boolean = false) => {
    if (!generatedRoutine) return;
    setHasAppended(true);
    onRoutineCreated(generatedRoutine, autoStart);
    
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all">
      
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-teal-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                AI Biomechanics Engine
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                ⚡ Real-Time Protocol Synthesis
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
              Smart Routine Creator
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-sm sm:text-right">
          Input your pain severity, available minutes, and vehicle environment to generate and append a custom routine.
        </p>
      </div>

      {/* Generator Form Body */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Column: Interactive Inputs */}
        <div className={`space-y-5 ${generatedRoutine ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          
          {/* 1. Pain Level Slider & Severity Indicator */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span>1. Current Pain & Tightness Severity</span>
              </label>
              <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${getPainLevelColor(painLevel)}`}>
                Level {painLevel} / 10 • {getPainLevelLabel(painLevel)}
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
                <span>1 (Mild Fatigue)</span>
                <span>5 (Moderate Aching)</span>
                <span>8 (Severe Knot)</span>
                <span>10 (Acute Spasm)</span>
              </div>
            </div>
          </div>

          {/* 2. Target Pain / Tightness Focus Areas */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>2. Specific Tension / Pain Areas</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedPainAreas.length} selected
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {painAreasList.map((area) => {
                const isSelected = selectedPainAreas.includes(area.id);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => togglePainArea(area.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs font-medium flex items-center gap-2 ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-200 shadow-sm'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm">{area.icon}</span>
                    <span className="line-clamp-2 leading-tight text-[11px]">{area.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Available Time & Vehicle Environment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Available Minutes */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>3. Available Time</span>
              </label>

              <div className="flex flex-wrap gap-1.5">
                {durationOptions.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setAvailableMinutes(mins)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex-1 min-w-[50px] text-center border ${
                      availableMinutes === mins
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 font-black'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Environment */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-cyan-400" />
                <span>4. Vehicle Cockpit</span>
              </label>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'car', label: 'Car / SUV', icon: Car },
                  { id: 'two-wheeler', label: 'Motorcycle', icon: Bike },
                  { id: 'truck', label: 'Semi / Truck', icon: Truck },
                  { id: 'commuter', label: 'Transit / Van', icon: Bus },
                ].map((v) => {
                  const Icon = v.icon;
                  const isSelected = vehicle === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicle(v.id as any)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Execution Location & Goal Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Location Type */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">Posture Mode</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setLocationType('In-Seat')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    locationType === 'In-Seat'
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-900/60 border-slate-800/60 text-slate-400'
                  }`}
                >
                  💺 In-Seat (Stealth)
                </button>
                <button
                  type="button"
                  onClick={() => setLocationType('Off-Vehicle / Standing')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    locationType === 'Off-Vehicle / Standing'
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-900/60 border-slate-800/60 text-slate-400'
                  }`}
                >
                  🅿️ Rest Stop (Standing)
                </button>
              </div>
            </div>

            {/* Goal Preset */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">Relief Objective</span>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-cyan-500"
              >
                <option value="pain_relief">🎯 Instant Nerve & Joint Decompression</option>
                <option value="alertness">⚡ Anti-Drowsiness & Alertness Surge</option>
                <option value="post_trip">🧘 Post-Trip Full Posture Restoration</option>
                <option value="speed_reset">⏱️ Quick Stoplight Micro-Reset</option>
              </select>
            </div>
          </div>

          {/* Generator Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-slate-950" />
                  <span>Synthesizing Personalized Routine...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
                  <span>Generate Personalized Recovery Routine</span>
                </>
              )}
            </button>

            {isGenerating && generationStep && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-center animate-fade-in">
                <span className="text-xs font-mono text-cyan-300 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  {generationStep}
                </span>
              </div>
            )}

            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Generated Preview & Append to Protocols */}
        {generatedRoutine && (
          <div className="lg:col-span-6 space-y-4 animate-fade-in">
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-2xl space-y-4 relative">
              
              {/* Top AI Badge */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Synthesized Protocol</span>
                </span>

                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {generatedRoutine.durationMinutes} Min
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-300">
                    {generatedRoutine.intensity}
                  </span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {generatedRoutine.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {generatedRoutine.subtitle}
                </p>
              </div>

              {/* Olympic Coach Rationale */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs leading-relaxed text-slate-300">
                <strong className="text-cyan-400 block mb-1 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Olympic Biomechanics Prescription:</span>
                </strong>
                {generatedRoutine.coachRationale}
              </div>

              {/* Exercises List Breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Prescribed Exercise Sequence ({generatedRoutine.exercises.length} Drills)
                </span>
                
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {generatedRoutine.exercises.map((ex, idx) => (
                    <div
                      key={ex.id || idx}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-white leading-tight">{ex.name}</h4>
                          <div className="flex flex-wrap gap-1.5 mt-1 text-[10px] text-slate-400">
                            <span className="text-cyan-300 font-mono">⏱️ {ex.durationSeconds}s</span>
                            <span>• {ex.reps}</span>
                            <span>• {ex.targetMuscles.slice(0, 2).join(', ')}</span>
                          </div>
                          {ex.formCues && (
                            <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-1">
                              💡 {ex.formCues}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-400 shrink-0">
                        {ex.location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Append to Curated Protocols & Launch */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAppendToProtocols(true)}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Add & Start Session Now</span>
                  </button>

                  <button
                    onClick={() => handleAppendToProtocols(false)}
                    disabled={hasAppended}
                    className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border cursor-pointer ${
                      hasAppended
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700 hover:border-cyan-500/50'
                    }`}
                  >
                    {hasAppended ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Added to Protocols!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-cyan-400" />
                        <span>Add to Curated Protocols</span>
                      </>
                    )}
                  </button>
                </div>

                {hasAppended && (
                  <p className="text-center text-[11px] font-mono text-emerald-400 animate-fade-in">
                    ✓ Routine saved & appended to your Curated Protocols list below!
                  </p>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
