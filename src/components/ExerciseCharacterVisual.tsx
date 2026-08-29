import React, { useState } from 'react';
import { Play, Pause, Activity, Eye, Zap, Wind, Sparkles } from 'lucide-react';
import { Exercise } from '../types';

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
  isPlaying: externalIsPlaying
}) => {
  const [internalPlaying, setInternalPlaying] = useState(true);
  const [showAnatomy, setShowAnatomy] = useState(true);
  const [speed, setSpeed] = useState<number>(1);

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalPlaying;

  // Determine movement archetype based on exercise ID, category, and target muscles
  const getMovementType = (ex: Exercise): string => {
    const id = ex.id.toLowerCase();
    const cat = ex.category;
    const muscles = (ex.muscleGroup || []).join(' ');

    if (id.includes('neck') || id.includes('cervical') || muscles.includes('neck')) return 'neck-mobility';
    if (id.includes('wrist') || id.includes('flick') || id.includes('squeeze') || muscles.includes('wrist')) return 'wrist-spiral';
    if (id.includes('hamstring') || id.includes('sciatic')) return 'hamstring-slide';
    if (id.includes('scapular') || id.includes('shoulder') || id.includes('retraction') || id.includes('chest')) return 'chest-opener';
    if (id.includes('pelvic') || id.includes('lumbar') || id.includes('brace')) return 'pelvic-tilt';
    if (id.includes('calf') || id.includes('ankle') || id.includes('venous')) return 'calf-pumps';
    if (id.includes('quad') || id.includes('psoas')) return 'quad-stretch';
    if (id.includes('twist') || id.includes('rotation') || id.includes('thoracic')) return 'seated-twist';
    if (id.includes('cat-cow') || id.includes('spinal')) return 'cat-cow';
    if (id.includes('cloud') || id.includes('taichi')) return 'cloud-hands';
    if (id.includes('root') || id.includes('dan-tian')) return 'rooting-stance';
    if (id.includes('palming') || id.includes('eye')) return 'eye-palming';
    if (id.includes('hip') || id.includes('figure-4') || muscles.includes('hips')) return 'figure-4-hip';
    if (cat === 'yoga' || id.includes('warrior')) return 'warrior-flow';
    return 'general-mobility';
  };

  const movementType = getMovementType(exercise);
  const durationSpeedSec = 4 / speed;

  // Primary accent colors based on exercise category
  const getThemeColor = () => {
    switch (exercise.category) {
      case 'car': return { primary: '#22d3ee', secondary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)', text: 'text-cyan-400' };
      case 'two-wheeler': return { primary: '#fbbf24', secondary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', text: 'text-amber-400' };
      case 'quick': return { primary: '#2dd4bf', secondary: '#14b8a6', glow: 'rgba(20, 184, 166, 0.4)', text: 'text-teal-400' };
      case 'spinal': return { primary: '#818cf8', secondary: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)', text: 'text-indigo-400' };
      case 'taichi': return { primary: '#38bdf8', secondary: '#0284c7', glow: 'rgba(2, 132, 199, 0.4)', text: 'text-sky-400' };
      case 'yoga': return { primary: '#c084fc', secondary: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)', text: 'text-purple-400' };
      default: return { primary: '#38bdf8', secondary: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.4)', text: 'text-cyan-400' };
    }
  };

  const theme = getThemeColor();

  const isCompact = variant === 'mini' || variant === 'card';

  return (
    <div className={`relative overflow-hidden flex flex-col items-center justify-center rounded-2xl bg-slate-950/90 border border-slate-800/80 shadow-inner group ${
      isCompact ? 'w-full h-36' : 'w-full h-72 sm:h-80'
    }`}>
      {/* Background Ambient Grid & Glow */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${theme.glow} 0%, transparent 70%)`
        }}
      />
      
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      />

      {/* Interactive Biomechanics Indicator Badges (Full variant) */}
      {!isCompact && (
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg bg-slate-900/90 border border-slate-700/80 text-cyan-300 flex items-center gap-1 shadow-md">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{exercise.location}</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
              {movementType.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-lg">
            <button
              onClick={() => setShowAnatomy(!showAnatomy)}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                showAnatomy ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Anatomical Highlight Lines"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 0.5 : 1)}
              className="px-2 py-1 rounded-lg text-[10px] font-mono text-slate-300 hover:text-cyan-300 bg-slate-800/80 border border-slate-700/60"
              title="Adjust Animation Tempo"
            >
              {speed}x
            </button>
            <button
              onClick={() => setInternalPlaying(!internalPlaying)}
              className="p-1.5 rounded-lg text-xs text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700/60"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Compact Mini Badge */}
      {isCompact && (
        <div className="absolute top-2 left-2.5 flex items-center gap-1.5 z-10">
          <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-slate-900/90 border border-slate-800 text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            <span>Kinetic Form</span>
          </span>
        </div>
      )}

      {/* SVG Kinetic Character Stage */}
      <div className={`w-full h-full flex items-center justify-center transition-transform duration-300 ${
        isCompact ? 'scale-90' : 'scale-100 sm:scale-105'
      }`}>
        <svg
          viewBox="0 0 240 200"
          className="w-full h-full max-h-72 select-none overflow-visible"
        >
          <defs>
            {/* Custom Gradients */}
            <linearGradient id="charTorsoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="charGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.primary} stopOpacity="0.8" />
              <stop offset="100%" stopColor={theme.secondary} stopOpacity="0.1" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* BASE SEAT OR GROUND PLATFORM */}
          {exercise.location.includes('In-Seat') ? (
            <g id="driver-seat-fixture" opacity="0.6">
              {/* Ergonomic Bucket Seat Contour */}
              <path
                d="M 65 170 Q 75 165 110 165 L 155 165 Q 165 165 170 170"
                stroke="#334155"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 80 165 L 68 85 Q 65 65 72 50"
                stroke="#1e293b"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Headrest outline */}
              <rect x="62" y="32" width="16" height="24" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              {/* Steering Wheel silhouette */}
              <path
                d="M 160 85 Q 170 70 168 115"
                stroke="#334155"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
            </g>
          ) : (
            <g id="ground-platform" opacity="0.4">
              <line x1="30" y1="180" x2="210" y2="180" stroke="#334155" strokeWidth="3" strokeDasharray="4 4" />
              <ellipse cx="120" cy="180" rx="45" ry="5" fill={theme.glow} />
            </g>
          )}

          {/* DYNAMIC BIOMECHANICAL CHARACTER RIG */}
          <g id="character-rig" style={{ transformOrigin: '120px 120px' }}>
            
            {/* 1. NECK MOBILITY & OCCIPITAL ROLLS */}
            {movementType === 'neck-mobility' && (
              <g>
                {/* Seated Body Base */}
                <path d="M 85 160 L 115 160 L 105 105 L 85 105 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <line x1="100" y1="105" x2="105" y2="75" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                {/* Shoulders */}
                <path d="M 75 78 Q 105 72 135 78" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" fill="none" />
                
                {/* Dynamic Head with Roll Orbit */}
                <g className={isPlaying ? 'animate-pulse' : ''}>
                  {/* Orbit guide */}
                  {showAnatomy && (
                    <path
                      d="M 88 52 Q 105 66 122 52 Q 105 38 88 52"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      fill="none"
                      opacity="0.8"
                    />
                  )}
                  {/* Head */}
                  <circle
                    cx="105"
                    cy="48"
                    r="15"
                    fill="#0f172a"
                    stroke="#22d3ee"
                    strokeWidth="3"
                    filter="url(#neonGlow)"
                    style={{
                      animation: isPlaying ? `charNeckRoll ${durationSpeedSec}s ease-in-out infinite` : 'none',
                      transformOrigin: '105px 65px'
                    }}
                  />
                  {/* Face Visor / Direction */}
                  <path
                    d="M 112 45 Q 120 48 112 51"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>

                {/* Suboccipital Tension Release Glow */}
                {showAnatomy && (
                  <g>
                    <circle cx="98" cy="58" r="4" fill="#f43f5e" opacity="0.8" className="animate-ping" />
                    <circle cx="112" cy="58" r="4" fill="#f43f5e" opacity="0.8" className="animate-ping" />
                    <text x="105" y="24" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      C1-C7 Cervical Glides
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* 2. WRIST SPIRALS & FOREARM ROTATION */}
            {movementType === 'wrist-spiral' && (
              <g>
                {/* Torso */}
                <path d="M 88 78 L 122 78 L 115 140 L 92 140 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <circle cx="105" cy="52" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                
                {/* Arms Extended Forward */}
                <line x1="88" y1="82" x2="125" y2="105" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                <line x1="122" y1="82" x2="145" y2="105" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                
                {/* Rotating Hands / Spiral Cues */}
                <g style={{
                  animation: isPlaying ? `charWristRotate ${durationSpeedSec}s linear infinite` : 'none',
                  transformOrigin: '140px 105px'
                }}>
                  {/* Rotation Orbit Arrow */}
                  <circle cx="140" cy="105" r="18" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
                  <polygon points="158,105 154,98 162,98" fill="#22d3ee" />
                  
                  {/* Hand Clench & Splay */}
                  <circle cx="140" cy="105" r="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="140" y1="97" x2="140" y2="92" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                  <line x1="146" y1="100" x2="151" y2="96" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                  <line x1="148" y1="108" x2="153" y2="111" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                </g>

                {showAnatomy && (
                  <text x="140" y="140" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Carpal Tunnel Release
                  </text>
                )}
              </g>
            )}

            {/* 3. SEATED HAMSTRING & SCIATIC SLIDE */}
            {movementType === 'hamstring-slide' && (
              <g>
                {/* Upper Body Hinging */}
                <g style={{
                  animation: isPlaying ? `charHamstringHinge ${durationSpeedSec * 1.2}s ease-in-out infinite` : 'none',
                  transformOrigin: '95px 150px'
                }}>
                  <circle cx="120" cy="70" r="13" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                  <line x1="95" y1="150" x2="115" y2="85" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                  {/* Arms reaching down thigh */}
                  <line x1="110" y1="92" x2="140" y2="135" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
                </g>

                {/* Extended Leg on Heel */}
                <line x1="95" y1="150" x2="170" y2="165" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                {/* Flexed Ankle */}
                <line x1="170" y1="165" x2="175" y2="150" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />

                {/* Sciatic Nerve Pathway Glow Line */}
                {showAnatomy && (
                  <g>
                    <path
                      d="M 95 145 Q 130 152 170 160"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      fill="none"
                      filter="url(#neonGlow)"
                    />
                    <text x="140" y="185" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">
                      ⚡ Sciatic Flossing Line
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* 4. SCAPULAR PINCH & CHEST OPENER */}
            {movementType === 'chest-opener' && (
              <g>
                <circle cx="105" cy="48" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                
                {/* Expanding Ribcage / Retracting Shoulders */}
                <g style={{
                  animation: isPlaying ? `charChestExpand ${durationSpeedSec}s ease-in-out infinite` : 'none',
                  transformOrigin: '105px 95px'
                }}>
                  {/* Spine */}
                  <line x1="105" y1="62" x2="105" y2="145" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                  
                  {/* Expanding chest shield */}
                  <path
                    d="M 80 80 Q 105 68 130 80 L 125 125 Q 105 135 85 125 Z"
                    fill="url(#charGlowGrad)"
                    stroke="#22d3ee"
                    strokeWidth="2"
                  />

                  {/* Scapular Pinch Arrows */}
                  <path d="M 68 85 L 85 85" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 142 85 L 125 85" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                  <polygon points="85,81 92,85 85,89" fill="#38bdf8" />
                  <polygon points="125,81 118,85 125,89" fill="#38bdf8" />
                </g>

                {showAnatomy && (
                  <text x="105" y="165" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Rhomboids Isometric Retraction
                  </text>
                )}
              </g>
            )}

            {/* 5. SEATED CAT-COW & PELVIC TILT */}
            {(movementType === 'cat-cow' || movementType === 'pelvic-tilt') && (
              <g>
                <g style={{
                  animation: isPlaying ? `charSpinalWave ${durationSpeedSec * 1.1}s ease-in-out infinite` : 'none',
                  transformOrigin: '95px 150px'
                }}>
                  <circle cx="105" cy="52" r="13" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                  
                  {/* Articulating Spine Wave */}
                  <path
                    d="M 95 150 Q 120 110 105 65"
                    stroke="#818cf8"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                    filter="url(#neonGlow)"
                  />

                  {/* Pelvic Rocker Pivot */}
                  <ellipse cx="95" cy="150" rx="14" ry="7" fill="#4338ca" stroke="#818cf8" strokeWidth="2" />
                  
                  {/* Arms resting on knees */}
                  <line x1="105" y1="80" x2="135" y2="135" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
                </g>

                {showAnatomy && (
                  <g>
                    <path d="M 80 135 Q 95 120 110 135" stroke="#a5b4fc" strokeWidth="2" strokeDasharray="3 2" fill="none" />
                    <text x="105" y="32" fill="#a5b4fc" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Sagittal Spinal Disc Hydration
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* 6. VENOUS CALF & ANKLE PUMPS */}
            {movementType === 'calf-pumps' && (
              <g>
                {/* Seated Leg Structure */}
                <line x1="90" y1="110" x2="130" y2="110" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
                <line x1="130" y1="110" x2="145" y2="160" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                
                {/* Pumping Foot with Heel Raise */}
                <g style={{
                  animation: isPlaying ? `charCalfPump ${durationSpeedSec * 0.7}s ease-in-out infinite` : 'none',
                  transformOrigin: '145px 160px'
                }}>
                  {/* Foot Sole */}
                  <line x1="145" y1="160" x2="175" y2="168" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="145" cy="160" r="4" fill="#0284c7" />
                </g>

                {/* Venous Blood Flow Upward Pulse */}
                {showAnatomy && (
                  <g>
                    <path
                      d="M 152 155 L 152 105"
                      stroke="#22c55e"
                      strokeWidth="2.5"
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    <polygon points="152,100 148,106 156,106" fill="#22c55e" />
                    <text x="105" y="65" fill="#22c55e" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Venous Return Skeletal Pump
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* 7. STANDING QUAD & PSOAS OPENER */}
            {movementType === 'quad-stretch' && (
              <g>
                {/* Standing Support Leg */}
                <line x1="110" y1="105" x2="110" y2="175" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                
                {/* Torso */}
                <line x1="110" y1="105" x2="110" y2="55" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
                <circle cx="110" cy="40" r="13" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                
                {/* Bent Leg Grasping Ankle */}
                <path
                  d="M 110 105 L 125 140 L 105 140"
                  stroke="#fbbf24"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                
                {/* Arm holding foot */}
                <line x1="110" y1="65" x2="105" y2="140" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />

                {/* Quads Stretch Highlight */}
                {showAnatomy && (
                  <g>
                    <line x1="114" y1="108" x2="124" y2="135" stroke="#ef4444" strokeWidth="3" strokeDasharray="3 2" filter="url(#neonGlow)" />
                    <text x="110" y="20" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Psoas & Rectus Femoris Tension Drop
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* 8. COCKPIT SEATED TWIST */}
            {movementType === 'seated-twist' && (
              <g>
                <circle cx="105" cy="50" r="13" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                
                {/* Twisting Thorax */}
                <g style={{
                  animation: isPlaying ? `charTorsoTwist ${durationSpeedSec * 1.2}s ease-in-out infinite` : 'none',
                  transformOrigin: '105px 100px'
                }}>
                  <line x1="105" y1="63" x2="105" y2="145" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                  {/* Left Arm to Right Knee */}
                  <line x1="85" y1="78" x2="130" y2="125" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
                  {/* Right Arm to Seatback */}
                  <line x1="125" y1="78" x2="68" y2="105" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Rotation guideline */}
                  <ellipse cx="105" cy="95" rx="35" ry="12" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.7" />
                </g>

                {showAnatomy && (
                  <text x="105" y="175" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Thoracic Facet Joint Decompression
                  </text>
                )}
              </g>
            )}

            {/* 9. TAI CHI CLOUD HANDS FLOW */}
            {movementType === 'cloud-hands' && (
              <g>
                {/* Horse stance base */}
                <line x1="105" y1="110" x2="85" y2="175" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                <line x1="105" y1="110" x2="125" y2="175" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                
                {/* Torso */}
                <line x1="105" y1="110" x2="105" y2="60" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round" />
                <circle cx="105" cy="45" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                
                {/* Flowing circular arms */}
                <g style={{
                  animation: isPlaying ? `charCloudHands ${durationSpeedSec * 1.5}s ease-in-out infinite` : 'none',
                  transformOrigin: '105px 85px'
                }}>
                  <path
                    d="M 65 95 Q 105 55 145 95"
                    stroke="#22d3ee"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 145 105 Q 105 135 65 105"
                    stroke="#38bdf8"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Energy Sphere */}
                  <circle cx="105" cy="95" r="16" fill="url(#charGlowGrad)" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
                </g>

                {showAnatomy && (
                  <text x="105" y="25" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Vagus Nerve Parasympathetic Reset
                  </text>
                )}
              </g>
            )}

            {/* 10. EYE PALMING / RELAXATION */}
            {movementType === 'eye-palming' && (
              <g>
                <circle cx="105" cy="65" r="18" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
                {/* Torso */}
                <line x1="105" y1="83" x2="105" y2="155" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                {/* Cupped Hands over eyes */}
                <path d="M 85 110 L 98 65 Q 105 60 102 65" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 125 110 L 112 65 Q 105 60 108 65" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" fill="none" />
                
                {/* Relaxing Optic Waves */}
                {showAnatomy && (
                  <g className="animate-pulse">
                    <circle cx="105" cy="65" r="28" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
                    <text x="105" y="32" fill="#2dd4bf" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Optic Nerve & Ciliary Muscle Cool-Down
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* 11. GENERAL / YOGA WARRIOR / FIGURE 4 DEFAULT */}
            {movementType !== 'neck-mobility' &&
             movementType !== 'wrist-spiral' &&
             movementType !== 'hamstring-slide' &&
             movementType !== 'chest-opener' &&
             movementType !== 'cat-cow' &&
             movementType !== 'pelvic-tilt' &&
             movementType !== 'calf-pumps' &&
             movementType !== 'quad-stretch' &&
             movementType !== 'seated-twist' &&
             movementType !== 'cloud-hands' &&
             movementType !== 'eye-palming' && (
              <g>
                {/* Universal Athletic Mobility Rig */}
                <circle cx="105" cy="45" r="14" fill="#0f172a" stroke={theme.primary} strokeWidth="2" filter="url(#neonGlow)" />
                <line x1="105" y1="59" x2="105" y2="125" stroke={theme.primary} strokeWidth="6" strokeLinecap="round" />
                
                {/* Fluid moving limbs */}
                <g style={{
                  animation: isPlaying ? `charGeneralFlow ${durationSpeedSec}s ease-in-out infinite` : 'none',
                  transformOrigin: '105px 95px'
                }}>
                  <line x1="105" y1="75" x2="65" y2="95" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                  <line x1="105" y1="75" x2="145" y2="95" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                  <line x1="105" y1="125" x2="80" y2="175" stroke="#0ea5e9" strokeWidth="5" strokeLinecap="round" />
                  <line x1="105" y1="125" x2="130" y2="175" stroke="#0ea5e9" strokeWidth="5" strokeLinecap="round" />
                </g>

                {showAnatomy && (
                  <text x="105" y="24" fill={theme.primary} fontSize="9" fontWeight="bold" textAnchor="middle">
                    Active Joint Mobilization
                  </text>
                )}
              </g>
            )}

          </g>

          {/* INHALE / EXHALE RHYTHM INDICATOR AT BOTTOM */}
          {!isCompact && (
            <g transform="translate(45, 175)">
              <rect x="0" y="0" width="150" height="18" rx="9" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <g className={isPlaying ? 'animate-pulse' : ''}>
                <circle cx="16" cy="9" r="4" fill={theme.primary} />
                <text x="30" y="12.5" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                  BREATH SYNC: 4s INHALE / 4s EXHALE
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Embedded Animation Keyframes */}
      <style>{`
        @keyframes charNeckRoll {
          0%, 100% { transform: rotate(0deg) translate(0, 0); }
          25% { transform: rotate(-12deg) translate(-4px, 2px); }
          75% { transform: rotate(12deg) translate(4px, 2px); }
        }
        @keyframes charWristRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes charHamstringHinge {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(18deg); }
        }
        @keyframes charChestExpand {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08) translate(0, -2px); }
        }
        @keyframes charSpinalWave {
          0%, 100% { transform: scaleX(1) rotate(0deg); }
          50% { transform: scaleX(0.92) rotate(-8deg); }
        }
        @keyframes charCalfPump {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-22deg); }
        }
        @keyframes charTorsoTwist {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(-14deg); }
          70% { transform: rotate(14deg); }
        }
        @keyframes charCloudHands {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          30% { transform: rotate(12deg) translateX(6px); }
          70% { transform: rotate(-12deg) translateX(-6px); }
        }
        @keyframes charGeneralFlow {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.04) translateY(-3px); }
        }
      `}</style>
    </div>
  );
};
