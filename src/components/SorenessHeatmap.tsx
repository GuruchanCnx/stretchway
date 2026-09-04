import React, { useState } from 'react';
import { Activity, Sparkles, Bot, Play, RotateCcw, AlertCircle, HeartPulse, ChevronRight, Zap } from 'lucide-react';
import { Routine, VehicleType } from '../types';
import { CURATED_ROUTINES } from '../data/exercises';

export type TensionLevel = 'none' | 'mild' | 'moderate' | 'severe';

export interface BodyPartTension {
  id: string;
  name: string;
  subtitle: string;
  level: TensionLevel;
  cx: number;
  cy: number;
  radius: number;
  biomechanicNote: string;
}

interface SorenessHeatmapProps {
  onConsultCoach?: (prompt: string) => void;
  onStartRoutine?: (routine: Routine) => void;
  currentVehicle?: VehicleType;
}

const INITIAL_BODY_PARTS: BodyPartTension[] = [
  {
    id: 'cervical-neck',
    name: 'Cervical Spine / Neck',
    subtitle: 'Occipital suboccipital tension',
    level: 'mild',
    cx: 150,
    cy: 65,
    radius: 16,
    biomechanicNote: 'Forward-head posture creates 42 lbs of gravitational strain on C4-C7 vertebrae.'
  },
  {
    id: 'upper-traps',
    name: 'Upper Trapezius & Shoulders',
    subtitle: 'Steering elevation tension',
    level: 'mild',
    cx: 150,
    cy: 105,
    radius: 22,
    biomechanicNote: 'Static arm elevation while holding the wheel triggers chronic levator scapulae contracture.'
  },
  {
    id: 'thoracic-spine',
    name: 'Thoracic Mid-Back',
    subtitle: 'Kyphotic chest hunch',
    level: 'none',
    cx: 150,
    cy: 155,
    radius: 20,
    biomechanicNote: 'Bucket-seat curvature compresses rib cage expansion and shallow diaphragmatic breathing.'
  },
  {
    id: 'lumbar-spine',
    name: 'Lumbar L4-S1 (Lower Back)',
    subtitle: 'Disc compression & shear stress',
    level: 'moderate',
    cx: 150,
    cy: 210,
    radius: 24,
    biomechanicNote: 'Road vibration multiplies intervertebral disc pressure by up to 2.4x during highway travel.'
  },
  {
    id: 'hips-psoas',
    name: 'Psoas & Hip Flexors',
    subtitle: 'Shortened sitting angle',
    level: 'none',
    cx: 150,
    cy: 265,
    radius: 22,
    biomechanicNote: 'Continuous 90-degree femoral flexion locks the psoas in chronic shortening, pulling the pelvis anteriorly.'
  },
  {
    id: 'wrists-forearms',
    name: 'Wrists & Forearms (Carpal)',
    subtitle: 'Steering & throttle strain',
    level: 'none',
    cx: 80,
    cy: 220,
    radius: 16,
    biomechanicNote: 'Prolonged static wrist extension increases carpal tunnel pressure, causing thumb and forefinger numbness.'
  },
  {
    id: 'hamstrings-sciatic',
    name: 'Hamstrings & Sciatic Path',
    subtitle: 'Posterior chain compression',
    level: 'none',
    cx: 150,
    cy: 330,
    radius: 24,
    biomechanicNote: 'Seat edge pressure compresses the sciatic nerve and restricts venous drainage from lower limbs.'
  },
  {
    id: 'calves-ankles',
    name: 'Calves & Pedal Ankle',
    subtitle: 'Accelerator pedal fatigue',
    level: 'none',
    cx: 150,
    cy: 405,
    radius: 18,
    biomechanicNote: 'Static plantarflexion on the throttle reduces calf muscle pump action, increasing leg heaviness.'
  }
];

export const SorenessHeatmap: React.FC<SorenessHeatmapProps> = ({
  onConsultCoach,
  onStartRoutine,
  currentVehicle = 'car'
}) => {
  const [bodyParts, setBodyParts] = useState<BodyPartTension[]>(INITIAL_BODY_PARTS);
  const [selectedPartId, setSelectedPartId] = useState<string>('lumbar-spine');

  const selectedPart = bodyParts.find((b) => b.id === selectedPartId) || bodyParts[0];

  const cycleLevel = (id: string) => {
    setBodyParts((prev) =>
      prev.map((part) => {
        if (part.id !== id) return part;
        let nextLevel: TensionLevel = 'none';
        if (part.level === 'none') nextLevel = 'mild';
        else if (part.level === 'mild') nextLevel = 'moderate';
        else if (part.level === 'moderate') nextLevel = 'severe';
        else nextLevel = 'none';
        return { ...part, level: nextLevel };
      })
    );
    setSelectedPartId(id);
  };

  const setSpecificLevel = (level: TensionLevel) => {
    setBodyParts((prev) =>
      prev.map((part) => (part.id === selectedPartId ? { ...part, level } : part))
    );
  };

  const handleReset = () => {
    setBodyParts((prev) => prev.map((p) => ({ ...p, level: 'none' })));
  };

  const activeTensionCount = bodyParts.filter((p) => p.level !== 'none').length;

  const handleConsultCoach = () => {
    if (!onConsultCoach) return;
    const tensionReport = bodyParts
      .filter((p) => p.level !== 'none')
      .map((p) => `${p.name} (${p.level.toUpperCase()} tension)`)
      .join(', ');

    const prompt = `I have logged current tension points on my Soreness Heatmap: ${tensionReport || 'General neck & lumbar tightness'}. As an Olympic and yoga biomechanics doctor for ${currentVehicle} operators, analyze my postural overload and prescribe an exact release sequence.`;
    onConsultCoach(prompt);
  };

  const handleLaunchTargetedRoutine = () => {
    if (!onStartRoutine) return;
    const target = CURATED_ROUTINES.find((r) => r.id === 'routine-spinal-15min') || CURATED_ROUTINES[0];
    onStartRoutine(target);
  };

  const getColorForLevel = (level: TensionLevel) => {
    switch (level) {
      case 'severe':
        return '#ef4444'; // Red
      case 'moderate':
        return '#f97316'; // Orange
      case 'mild':
        return '#eab308'; // Amber
      default:
        return '#334155'; // Slate
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800/90 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-red-950 text-red-400 border border-red-800/80 flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Interactive Soreness Heatmap</span>
            </span>
            <span className="text-xs text-slate-400">Click Zones to Adjust Tension</span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white">
            Targeted Musculoskeletal Tension Map
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive Anatomical SVG Stage (Left Column) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 relative">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Click Body Nodes to Cycle Tension Level (None &rarr; Mild &rarr; Mod &rarr; Severe)
          </span>

          <div className="relative w-[280px] h-[460px]">
            {/* Stylized Human Silhouette */}
            <svg
              className="w-full h-full"
              viewBox="0 0 300 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Silhouette Body Line */}
              <path
                d="M 150 40 C 135 40 125 55 125 70 C 125 85 135 95 140 100 C 120 105 90 120 80 180 C 75 210 70 260 70 290 C 75 295 85 295 90 285 C 95 240 100 200 110 180 C 110 240 115 280 120 320 C 125 360 125 430 130 460 C 135 465 145 465 148 450 C 150 420 150 380 150 330 C 150 380 150 420 152 450 C 155 465 165 465 170 460 C 175 430 175 360 180 320 C 185 280 190 240 190 180 C 200 200 205 240 210 285 C 215 295 225 295 230 290 C 230 260 225 210 220 180 C 210 120 180 105 160 100 C 165 95 175 85 175 70 C 175 55 165 40 150 40 Z"
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="2.5"
              />

              {/* Spine Vertebral Center Line */}
              <line
                x1="150"
                y1="70"
                x2="150"
                y2="280"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Clickable Tension Nodes */}
              {bodyParts.map((part) => {
                const isSelected = part.id === selectedPartId;
                const color = getColorForLevel(part.level);
                const hasTension = part.level !== 'none';

                return (
                  <g
                    key={part.id}
                    onClick={() => cycleLevel(part.id)}
                    className="cursor-pointer transition-all hover:opacity-90"
                  >
                    {/* Glowing outer ring when active */}
                    {hasTension && (
                      <circle
                        cx={part.cx}
                        cy={part.cy}
                        r={part.radius + 6}
                        fill={color}
                        opacity={part.level === 'severe' ? 0.35 : 0.2}
                        className={part.level === 'severe' ? 'animate-ping' : ''}
                      />
                    )}

                    {/* Selection border ring */}
                    {isSelected && (
                      <circle
                        cx={part.cx}
                        cy={part.cy}
                        r={part.radius + 3}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Core node circle */}
                    <circle
                      cx={part.cx}
                      cy={part.cy}
                      r={part.radius}
                      fill={color}
                      stroke={isSelected ? '#38bdf8' : '#0f172a'}
                      strokeWidth="2"
                      className="transition-colors duration-300"
                    />

                    {/* Text initial inside node */}
                    <text
                      x={part.cx}
                      y={part.cy + 4}
                      textAnchor="middle"
                      fill={hasTension ? '#0f172a' : '#94a3b8'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      pointerEvents="none"
                    >
                      {part.level === 'none' ? '0' : part.level === 'mild' ? '1' : part.level === 'moderate' ? '2' : '3'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400 font-bold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" /> None
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Mild
            </span>
            <span className="flex items-center gap-1 text-orange-400">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Moderate
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Severe
            </span>
          </div>
        </div>

        {/* Selected Zone Biomechanics & Action Panel (Right Column) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-black tracking-wider">
                  Active Focus Point
                </span>
                <h5 className="text-base sm:text-lg font-black text-white">{selectedPart.name}</h5>
                <p className="text-xs text-slate-400">{selectedPart.subtitle}</p>
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                  selectedPart.level === 'severe'
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : selectedPart.level === 'moderate'
                    ? 'bg-orange-950 text-orange-300 border border-orange-800'
                    : selectedPart.level === 'mild'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {selectedPart.level}
              </span>
            </div>

            {/* Level Selector Buttons */}
            <div className="grid grid-cols-4 gap-2 my-4">
              {(['none', 'mild', 'moderate', 'severe'] as TensionLevel[]).map((lvl) => {
                const isActive = selectedPart.level === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpecificLevel(lvl)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold uppercase transition-all border ${
                      isActive
                        ? lvl === 'severe'
                          ? 'bg-red-500 text-slate-950 border-red-400 font-black'
                          : lvl === 'moderate'
                          ? 'bg-orange-500 text-slate-950 border-orange-400 font-black'
                          : lvl === 'mild'
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                          : 'bg-slate-700 text-white border-slate-600'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>

            {/* Biomechanical Clinical Explanation */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 block mb-0.5">Biomechanical Diagnostic:</strong>
                {selectedPart.biomechanicNote}
              </div>
            </div>
          </div>

          {/* Action Triggers: Feed AI Coach & Start Protocol */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-950 to-slate-900 border border-cyan-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black uppercase text-cyan-300 tracking-wider">
                  AI Coach Prescription Engine
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {activeTensionCount} Zone{activeTensionCount === 1 ? '' : 's'} Active
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Feed this heatmap telemetry directly into Coach Lyra to compute a custom decompressor sequence based on your {currentVehicle.toUpperCase()} cabin ergonomics.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleConsultCoach}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Bot className="w-4 h-4" />
                <span>Prescribe with AI Coach</span>
              </button>

              <button
                type="button"
                onClick={handleLaunchTargetedRoutine}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Instant Decompression</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
