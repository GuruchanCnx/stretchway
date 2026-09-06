import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Droplets, 
  Sparkles, 
  Play, 
  ShieldAlert, 
  Navigation, 
  Car, 
  Bike, 
  Truck,
  Activity,
  Zap,
  Gauge,
  Compass,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routine, TripPitstop, VehicleType, Exercise } from '../types';
import { CURATED_ROUTINES } from '../data/exercises';
import { Exercise3DCharacter } from './Exercise3DCharacter';

interface TripPlannerProps {
  onStartRoutine: (routine: Routine) => void;
  currentVehicle: VehicleType;
}

interface AgenticDiagnostics {
  journeyPhase: string;
  discHydrationStatus: string;
  ischemicRiskMuscles: string[];
  biomechanicalInsight: string;
  hydrationTargetMl: number;
  nextRecommendedStopMiles: number;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  onStartRoutine,
  currentVehicle
}) => {
  // Itinerary inputs
  const [routeFrom, setRouteFrom] = useState('Los Angeles, CA');
  const [routeTo, setRouteTo] = useState('Las Vegas, NV');
  const [totalMiles, setTotalMiles] = useState<number>(270);
  const [totalDriveHours, setTotalDriveHours] = useState<number>(4.5);
  const [distanceAchieved, setDistanceAchieved] = useState<number>(120);
  
  const [vehicle, setVehicle] = useState<'car' | 'two-wheeler' | 'truck'>(
    currentVehicle === 'two-wheeler' ? 'two-wheeler' : currentVehicle === 'truck' ? 'truck' : 'car'
  );
  const [roadConditions, setRoadConditions] = useState<'interstate' | 'mountain' | 'stop-and-go' | 'bumpy-rural'>('interstate');
  const [driverFatigue, setDriverFatigue] = useState<number>(6);

  // Agent State
  const [isGeneratingAgenticRoutine, setIsGeneratingAgenticRoutine] = useState(false);
  const [agenticRoutine, setAgenticRoutine] = useState<Routine | null>(null);
  const [agenticDiagnostics, setAgenticDiagnostics] = useState<AgenticDiagnostics | null>(null);
  const [agenticError, setAgenticError] = useState<string | null>(null);
  const [selectedPreviewExercise, setSelectedPreviewExercise] = useState<Exercise | null>(null);

  // Popular quick route presets
  const popularPresets = [
    { from: 'Los Angeles, CA', to: 'Las Vegas, NV', miles: 270, hours: 4.5 },
    { from: 'San Francisco, CA', to: 'Lake Tahoe, CA', miles: 200, hours: 3.5 },
    { from: 'Chicago, IL', to: 'Indianapolis, IN', miles: 185, hours: 3.2 },
    { from: 'Austin, TX', to: 'Dallas, TX', miles: 195, hours: 3.3 },
    { from: 'Seattle, WA', to: 'Portland, OR', miles: 175, hours: 3.0 }
  ];

  const handleApplyPreset = (preset: typeof popularPresets[0]) => {
    setRouteFrom(preset.from);
    setRouteTo(preset.to);
    setTotalMiles(preset.miles);
    setTotalDriveHours(preset.hours);
    setDistanceAchieved(Math.round(preset.miles * 0.45)); // default ~45% achieved
    setAgenticRoutine(null);
    setAgenticDiagnostics(null);
  };

  // Progress metrics
  const percentComplete = Math.min(100, Math.round((distanceAchieved / Math.max(totalMiles, 1)) * 100));
  const estimatedHoursDriven = ((distanceAchieved / Math.max(totalMiles, 1)) * totalDriveHours).toFixed(1);

  // Call autonomous Agent for itinerary-based routine
  const handleGenerateAgenticRoutine = async () => {
    setIsGeneratingAgenticRoutine(true);
    setAgenticError(null);

    try {
      const res = await fetch('/api/coach/itinerary-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: routeFrom,
          destination: routeTo,
          totalMiles,
          totalHours: totalDriveHours,
          distanceAchieved,
          vehicle,
          roadConditions,
          driverFatigue
        })
      });

      if (!res.ok) {
        throw new Error(`Failed to generate routine: status ${res.status}`);
      }

      const data = await res.json();
      if (data.routine) {
        setAgenticRoutine(data.routine);
        setAgenticDiagnostics(data.diagnosticsReport || null);
        if (data.routine.exercises && data.routine.exercises.length > 0) {
          setSelectedPreviewExercise(data.routine.exercises[0]);
        }
      }
    } catch (err: any) {
      console.error('Error generating itinerary routine:', err);
      setAgenticError(err.message || 'Could not connect to the itinerary agent engine.');
    } finally {
      setIsGeneratingAgenticRoutine(false);
    }
  };

  // Calculate regular pit stops for timeline schedule
  const intervalHours = vehicle === 'two-wheeler' ? 1.5 : 2.0;
  const numStops = Math.max(1, Math.floor(totalDriveHours / intervalHours));

  const pitstops: TripPitstop[] = Array.from({ length: numStops }).map((_, idx) => {
    const stopTimeHours = (idx + 1) * intervalHours;
    const routineOptions = [
      CURATED_ROUTINES[0],
      CURATED_ROUTINES[1],
      CURATED_ROUTINES[2],
      CURATED_ROUTINES[3]
    ];
    const routine = routineOptions[idx % routineOptions.length];

    return {
      id: `stop-${idx + 1}`,
      mileMarker: Math.round(stopTimeHours * (totalMiles / totalDriveHours)),
      driveTimeHours: stopTimeHours,
      stopName: `Ergonomic Rest Stop ${idx + 1} (~${Math.round(stopTimeHours * (totalMiles / totalDriveHours))} mi in)`,
      recommendedDurationMinutes: 8 + (idx * 2),
      hydrationTargetMl: 250 + (idx * 60),
      suggestedRoutine: routine,
      notes: idx === 0 
        ? 'Target hip flexor lengthening and right foot tibialis release before deep lumbar spasm sets in.' 
        : idx === 1 
        ? 'Full spinal decompression + optic eye reset to counteract road vibration fatigue.' 
        : 'Whole body circulatory reactivation and deep diaphragmatic rooting breath.'
    };
  });

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/60 flex items-center gap-1.5 font-mono">
              <Navigation className="w-3.5 h-3.5" />
              <span>Smart Highway Planner</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Agentic Itinerary Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Itinerary & Distance-Calibrated Mobility
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Input your journey and current miles driven. Our AI Ergonomics Agent models cumulative road vibration load to prescribe an exact recovery routine.
          </p>
        </div>

        {/* Vehicle Archetype Toggle */}
        <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          {[
            { id: 'car', label: 'Car', icon: <Car className="w-3.5 h-3.5" /> },
            { id: 'two-wheeler', label: 'Motorcycle', icon: <Bike className="w-3.5 h-3.5" /> },
            { id: 'truck', label: 'Truck', icon: <Truck className="w-3.5 h-3.5" /> }
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setVehicle(v.id as any)}
              className={`py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                vehicle === v.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md border-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {v.icon}
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Route Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono text-slate-500 uppercase shrink-0 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          <span>Presets:</span>
        </span>
        {popularPresets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(preset)}
            className="px-3 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5"
          >
            <span>{preset.from.split(',')[0]} → {preset.to.split(',')[0]}</span>
            <span className="text-[10px] text-cyan-400 font-mono">({preset.miles}mi)</span>
          </button>
        ))}
      </div>

      {/* Itinerary Configuration Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
        <div>
          <label className="text-xs font-mono text-slate-400 block mb-1">Origin City</label>
          <input
            type="text"
            value={routeFrom}
            onChange={(e) => setRouteFrom(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
            placeholder="Starting point"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-slate-400 block mb-1">Destination City</label>
          <input
            type="text"
            value={routeTo}
            onChange={(e) => setRouteTo(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
            placeholder="Destination"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
            <span>Total Route Miles:</span>
            <span className="text-cyan-400 font-bold">{totalMiles} mi</span>
          </div>
          <input
            type="number"
            min="20"
            max="1200"
            value={totalMiles}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTotalMiles(val);
              setTotalDriveHours(Number((val / 60).toFixed(1)));
              if (distanceAchieved > val) setDistanceAchieved(val);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-slate-400 block mb-1">Road Vibration Profile</label>
          <select
            value={roadConditions}
            onChange={(e) => setRoadConditions(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
          >
            <option value="interstate">Smooth Interstate (Low Vibration)</option>
            <option value="mountain">Mountain Passes (Torso Centrifugal Load)</option>
            <option value="stop-and-go">Urban Stop-and-Go (High Ankle/Knee Cycling)</option>
            <option value="bumpy-rural">Bumpy / Concrete Grooves (High Frequency)</option>
          </select>
        </div>
      </div>

      {/* CORE FEATURE: Distance Achieved Slider & Driver Telemetry */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-500/30 shadow-2xl relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Gauge className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-cyan-300 font-mono">
                Real-Time Journey Telemetry
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              Current Distance Achieved: <span className="text-cyan-400 font-mono">{distanceAchieved} Miles</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Traveled ~{estimatedHoursDriven} hours along {routeFrom} → {routeTo} ({percentComplete}% complete)
            </p>
          </div>

          {/* Quick Distance Jump Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'Start (0 mi)', dist: 0 },
              { label: 'Leg 1 (60 mi)', dist: Math.min(60, totalMiles) },
              { label: 'Halfway (~50%)', dist: Math.round(totalMiles * 0.5) },
              { label: 'Deep Fatigue (~80%)', dist: Math.round(totalMiles * 0.8) },
              { label: 'Destination', dist: totalMiles }
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setDistanceAchieved(preset.dist)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                  distanceAchieved === preset.dist
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Distance Slider */}
        <div className="space-y-2 mb-6">
          <input
            type="range"
            min="0"
            max={totalMiles}
            step="5"
            value={distanceAchieved}
            onChange={(e) => setDistanceAchieved(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex justify-between items-center text-xs font-mono text-slate-500">
            <span>{routeFrom} (0 mi)</span>
            <span className="text-cyan-400 font-bold">{percentComplete}% Traveled</span>
            <span>{routeTo} ({totalMiles} mi)</span>
          </div>
        </div>

        {/* Driver Feeling / Tension Level */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6">
          <div>
            <span className="text-xs font-mono text-slate-400 block mb-0.5">
              Current Physical Fatigue / Tension Severity:
            </span>
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className={`w-4 h-4 ${driverFatigue >= 7 ? 'text-red-400' : driverFatigue >= 4 ? 'text-amber-400' : 'text-emerald-400'}`} />
              <span>Level {driverFatigue}/10 — {
                driverFatigue >= 8 ? 'Acute Spasm & Numbness' :
                driverFatigue >= 5 ? 'Noticeable Achiness & Heavy Neck' :
                'Mild Highway Postural Stiffness'
              }</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
              <button
                key={score}
                onClick={() => setDriverFatigue(score)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                  driverFatigue === score
                    ? 'bg-cyan-500 text-slate-950 scale-110 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        {/* Autonomous Agent Trigger Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Agent synthesizes disc decompression protocols tuned to your mileage & vibration exposure.</span>
          </div>

          <button
            onClick={handleGenerateAgenticRoutine}
            disabled={isGeneratingAgenticRoutine}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingAgenticRoutine ? (
              <>
                <Activity className="w-4 h-4 animate-spin text-slate-950" />
                <span>Agent Calculating Biomechanics for {distanceAchieved} mi...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Generate Agentic Routine for {distanceAchieved} Miles</span>
              </>
            )}
          </button>
        </div>

        {agenticError && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs">
            {agenticError}
          </div>
        )}
      </div>

      {/* AGENTIC ROUTINE DISPLAY (If generated) */}
      <AnimatePresence>
        {agenticRoutine && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Agent Diagnostics Audit Report */}
            {agenticDiagnostics && (
              <div className="p-6 rounded-3xl bg-slate-950/90 border border-indigo-500/40 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-700 text-xs font-black uppercase font-mono flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Highway Agent Telemetry Diagnostics</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {agenticDiagnostics.journeyPhase}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-teal-950 text-teal-400 border border-teal-800 text-xs font-bold flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      <span>{agenticDiagnostics.hydrationTargetMl} ml Water Target</span>
                    </span>
                  </div>
                </div>

                {/* Diagnostics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Spinal Disc Hydration Status</div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">
                      {agenticDiagnostics.discHydrationStatus}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Priority Ischemic Musculature</div>
                    <div className="text-sm font-bold text-cyan-300 mt-0.5">
                      {agenticDiagnostics.ischemicRiskMuscles.join(', ')}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Next Recommended Pitstop</div>
                    <div className="text-sm font-bold text-indigo-300 mt-0.5">
                      At Mile Marker ~{agenticDiagnostics.nextRecommendedStopMiles} mi
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-indigo-400 font-bold">Biomechanical Assessment: </span>
                  {agenticDiagnostics.biomechanicalInsight}
                </p>
              </div>
            )}

            {/* Generated Routine & 3D Interactive Viewer Showcase */}
            <div className="p-6 rounded-3xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                      Bespoke Itinerary Routine
                    </span>
                    <span className="text-xs text-slate-400 font-mono">⏱️ {agenticRoutine.durationMinutes} Minutes</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1">
                    {agenticRoutine.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    {agenticRoutine.description}
                  </p>
                </div>

                <button
                  onClick={() => onStartRoutine(agenticRoutine)}
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start AI Itinerary Routine</span>
                </button>
              </div>

              {/* 3D Character Exercise Showcase Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                
                {/* 3D Exercise Previewer */}
                <div className="lg:col-span-5 h-[320px] rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                  {selectedPreviewExercise ? (
                    <Exercise3DCharacter
                      exercise={selectedPreviewExercise}
                      variant="card"
                      isPlaying={true}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                      Select an exercise to preview 3D kinematics
                    </div>
                  )}
                </div>

                {/* Exercises Sequence List */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="text-xs font-mono uppercase text-slate-400 font-bold mb-2">
                    Sequenced Decompression Protocol ({agenticRoutine.exercises.length} Movements)
                  </div>

                  {agenticRoutine.exercises.map((ex, idx) => {
                    const isSelected = selectedPreviewExercise?.id === ex.id;

                    return (
                      <div
                        key={ex.id}
                        onClick={() => setSelectedPreviewExercise(ex)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-slate-900 border-cyan-400/60 shadow-lg'
                            : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                            isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">
                              {ex.name}
                            </h4>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="text-cyan-400">⏱️ {ex.durationSeconds}s</span>
                              <span>•</span>
                              <span>{ex.location}</span>
                              <span>•</span>
                              <span className="text-slate-500 font-mono">{(ex.targetMuscles || []).join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-slate-400 border border-slate-800 hidden sm:inline-block">
                            3D Ready
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Pitstop Timeline Schedule */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Full Route Pitstop Milestones & Hydration Schedule</span>
        </h3>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-6">
          {pitstops.map((stop, idx) => (
            <div key={stop.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-300 shadow-md shadow-cyan-500/20">
                {idx + 1}
              </div>

              {/* Stop Card */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 hover:border-cyan-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h4 className="text-base font-extrabold text-white">
                    {stop.stopName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-teal-950 text-teal-400 border border-teal-800 text-xs font-bold flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      <span>{stop.hydrationTargetMl} ml Water</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono font-bold">
                      ⏱️ {stop.recommendedDurationMinutes} Min Break
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-3">
                  {stop.notes}
                </p>

                {/* Suggested Routine Mini-banner */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                      Preset Protocol:
                    </span>
                    <div className="text-xs font-extrabold text-white">
                      {stop.suggestedRoutine.title}
                    </div>
                  </div>

                  <button
                    onClick={() => onStartRoutine(stop.suggestedRoutine)}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Launch Protocol</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
