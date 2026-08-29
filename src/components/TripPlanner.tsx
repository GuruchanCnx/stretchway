import React, { useState } from 'react';
import { MapPin, Clock, Droplets, Sparkles, Play, ShieldAlert, Navigation, Car, Bike, Truck } from 'lucide-react';
import { Routine, TripPitstop, VehicleType } from '../types';
import { CURATED_ROUTINES, ALL_EXERCISES } from '../data/exercises';

interface TripPlannerProps {
  onStartRoutine: (routine: Routine) => void;
  currentVehicle: VehicleType;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  onStartRoutine,
  currentVehicle
}) => {
  const [totalDriveHours, setTotalDriveHours] = useState<number>(4);
  const [vehicle, setVehicle] = useState<'car' | 'two-wheeler' | 'truck'>(
    currentVehicle === 'two-wheeler' ? 'two-wheeler' : currentVehicle === 'truck' ? 'truck' : 'car'
  );
  const [routeFrom, setRouteFrom] = useState('Los Angeles, CA');
  const [routeTo, setRouteTo] = useState('Las Vegas, NV');

  // Calculate pit stops
  const intervalHours = vehicle === 'two-wheeler' ? 1.5 : 2.0;
  const numStops = Math.max(1, Math.floor(totalDriveHours / intervalHours));

  const pitstops: TripPitstop[] = Array.from({ length: numStops }).map((_, idx) => {
    const stopTimeHours = (idx + 1) * intervalHours;
    const routineOptions = [
      CURATED_ROUTINES[0], // 10-min car
      CURATED_ROUTINES[1], // 12-min rider
      CURATED_ROUTINES[2], // 5-min quick
      CURATED_ROUTINES[3]  // 15-min spinal
    ];
    const routine = routineOptions[idx % routineOptions.length];

    return {
      id: `stop-${idx + 1}`,
      mileMarker: Math.round(stopTimeHours * 60),
      driveTimeHours: stopTimeHours,
      stopName: `Ergonomic Rest Stop ${idx + 1} (~${stopTimeHours.toFixed(1)} hrs in)`,
      recommendedDurationMinutes: 10 + (idx * 2),
      hydrationTargetMl: 250 + (idx * 50),
      suggestedRoutine: routine,
      notes: idx === 0 
        ? 'Target hip flexor lengthening and sciatic nerve flossing before deep spasm sets in.' 
        : idx === 1 
        ? 'Full spinal decompression + optic eye reset to combat highway hypnosis.' 
        : 'Whole body circulatory reactivation and deep diaphragmatic rooting breath.'
    };
  });

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/60 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" />
              <span>Smart Highway Planner</span>
            </span>
            <span className="text-xs text-slate-400">Fatigue Prevention System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Ergonomic Pitstop & Recovery Route Scheduler
          </h2>
        </div>
      </div>

      {/* Input Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-8">
        
        {/* Drive Duration Slider */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
            <span>Total Drive Time:</span>
            <span className="text-cyan-400 font-mono text-sm">{totalDriveHours} Hours</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            step="0.5"
            value={totalDriveHours}
            onChange={(e) => setTotalDriveHours(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>2 hrs</span>
            <span>6 hrs</span>
            <span>12 hrs</span>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div>
          <span className="text-xs font-bold text-slate-300 block mb-1.5">Vehicle Archetype:</span>
          <div className="flex gap-2">
            {[
              { id: 'car', label: 'Car / SUV', icon: <Car className="w-3.5 h-3.5" /> },
              { id: 'two-wheeler', label: 'Motorcycle', icon: <Bike className="w-3.5 h-3.5" /> },
              { id: 'truck', label: 'Truck', icon: <Truck className="w-3.5 h-3.5" /> }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setVehicle(v.id as any)}
                className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  vehicle === v.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {v.icon}
                <span>{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Route Snapshot */}
        <div>
          <span className="text-xs font-bold text-slate-300 block mb-1.5">Trip Overview:</span>
          <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-cyan-400 font-bold">~{Math.round(totalDriveHours * 60)} Miles</span>
            <span className="text-slate-400">•</span>
            <span className="text-teal-400 font-bold">{numStops} Pitstop Breaks</span>
          </div>
        </div>

      </div>

      {/* Generated Pitstop Timeline */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Recommended Ergonomic Rest Schedule</span>
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Recommended Routine:
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
