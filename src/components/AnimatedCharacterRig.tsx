import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lottie } from 'lottie-react';
import { Exercise, CoachId } from '../types';
import { getCoach } from '../data/coaches';
import { AVATAR_FLAIR_ITEMS } from '../data/avatarFlair';

interface AnimatedCharacterRigProps {
  exercise: Exercise;
  coachId?: CoachId;
  variant?: 'mini' | 'card' | 'player' | 'modal' | 'hero';
  isPlaying?: boolean;
  equippedFlairIds?: string[];
  showBiomechanicsHUD?: boolean;
}

// Procedurally generated Lottie animation JSON for biomechanical kinetic energy loop
const generateLottieBiomechanicalData = (primaryColor: string) => {
  return {
    v: '5.5.7',
    fr: 60,
    ip: 0,
    op: 120,
    w: 300,
    h: 300,
    nm: 'BiomechanicalPulse',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'Kinetic Ring Outer',
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              { t: 0, s: [30], e: [70] },
              { t: 60, s: [70], e: [30] },
              { t: 120, s: [30] }
            ]
          },
          r: {
            a: 1,
            k: [
              { t: 0, s: [0], e: [360] },
              { t: 120, s: [360] }
            ]
          },
          p: { a: 0, k: [150, 150, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [95, 95], e: [110, 110] },
              { t: 60, s: [110, 110], e: [95, 95] },
              { t: 120, s: [95, 95] }
            ]
          }
        },
        shapes: [
          {
            ty: 'el',
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [220, 220] }
          },
          {
            ty: 'st',
            c: { a: 0, k: [0.02, 0.71, 0.83, 1] }, // cyan tone
            w: { a: 0, k: 2 },
            d: [
              { n: 'd', v: { a: 0, k: 12 } },
              { n: 'g', v: { a: 0, k: 8 } }
            ]
          }
        ]
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: 'Core Biomechanical Node',
        sr: 1,
        ks: {
          o: { a: 0, k: 40 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [150, 150, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [80, 80], e: [100, 100] },
              { t: 60, s: [100, 100], e: [80, 80] },
              { t: 120, s: [80, 80] }
            ]
          }
        },
        shapes: [
          {
            ty: 'el',
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [150, 150] }
          },
          {
            ty: 'st',
            c: { a: 0, k: [0.96, 0.62, 0.04, 1] }, // gold tone
            w: { a: 0, k: 1.5 }
          }
        ]
      }
    ]
  };
};

export const AnimatedCharacterRig: React.FC<AnimatedCharacterRigProps> = ({
  exercise,
  coachId = 'olympic',
  variant = 'card',
  isPlaying = true,
  equippedFlairIds = [],
  showBiomechanicsHUD = true
}) => {
  const coach = getCoach(coachId);
  const isMini = variant === 'mini';
  const isPlayer = variant === 'player';

  // Check equipped flairs
  const hasVisor = equippedFlairIds.includes('flair-visor');
  const hasHeadband = equippedFlairIds.includes('flair-headband');
  const hasSinglet = equippedFlairIds.includes('flair-singlet');
  const hasHoodie = equippedFlairIds.includes('flair-hoodie');
  const hasExosuit = equippedFlairIds.includes('flair-exosuit');
  const hasWraps = equippedFlairIds.includes('flair-wraps') || equippedFlairIds.length === 0;
  const hasSleeves = equippedFlairIds.includes('flair-sleeves');
  const hasFlameAura = equippedFlairIds.includes('flair-aura-amber');
  const hasCosmicHalo = equippedFlairIds.includes('flair-aura-cosmic');

  // Exercise kinetic kinematic styles
  const exType = useMemo(() => {
    const name = (exercise?.name || '').toLowerCase();
    const cat = exercise?.category || '';
    if (name.includes('neck') || name.includes('occipital')) return 'neck';
    if (name.includes('twist') || name.includes('spinal') || name.includes('torso')) return 'twist';
    if (name.includes('wrist') || name.includes('forearm') || name.includes('grip')) return 'wrist';
    if (name.includes('shoulder') || name.includes('scapular') || name.includes('shrug')) return 'shoulder';
    if (name.includes('hamstring') || name.includes('leg') || name.includes('quad') || name.includes('calf')) return 'legs';
    if (cat === 'yoga' || name.includes('breath') || name.includes('chest') || name.includes('expansion')) return 'chest';
    return 'general';
  }, [exercise]);

  // Procedural Lottie data
  const lottieData = useMemo(() => {
    return generateLottieBiomechanicalData(coach.themeColor);
  }, [coach.themeColor]);

  // Dynamic colors by coach
  const coachPalette = useMemo(() => {
    switch (coach.characterStyle) {
      case 'athletic':
        return {
          primary: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.4)',
          body: '#d97706',
          suit: '#1e293b',
          accent: '#fbbf24',
          spineGlow: '#fef08a'
        };
      case 'zen':
        return {
          primary: '#10b981',
          glow: 'rgba(16, 185, 129, 0.4)',
          body: '#059669',
          suit: '#0f172a',
          accent: '#34d399',
          spineGlow: '#a7f3d0'
        };
      case 'clinical':
        return {
          primary: '#06b6d4',
          glow: 'rgba(6, 182, 212, 0.4)',
          body: '#0891b2',
          suit: '#0f172a',
          accent: '#38bdf8',
          spineGlow: '#bae6fd'
        };
      case 'road-pro':
      default:
        return {
          primary: '#8b5cf6',
          glow: 'rgba(139, 92, 246, 0.4)',
          body: '#7c3aed',
          suit: '#1e1b4b',
          accent: '#a78bfa',
          spineGlow: '#ddd6fe'
        };
    }
  }, [coach.characterStyle]);

  // Kinetic joint rotations for Framer Motion skeletal animation
  const headMotion = useMemo(() => {
    if (!isPlaying) return { rotate: 0, y: 0 };
    switch (exType) {
      case 'neck':
        return {
          rotate: [-18, 0, 18, 0, -18],
          y: [-2, 0, -2, 0, -2],
          transition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' }
        };
      case 'twist':
        return {
          rotate: [-12, 12, -12],
          transition: { repeat: Infinity, duration: 5, ease: 'easeInOut' }
        };
      case 'chest':
        return {
          rotate: [-4, 4, -4],
          y: [-4, 0, -4],
          transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
        };
      default:
        return {
          rotate: [-3, 3, -3],
          transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
        };
    }
  }, [isPlaying, exType]);

  const torsoMotion = useMemo(() => {
    if (!isPlaying) return { rotate: 0, scale: 1 };
    switch (exType) {
      case 'twist':
        return {
          rotate: [-14, 0, 14, 0, -14],
          transition: { repeat: Infinity, duration: 5, ease: 'easeInOut' }
        };
      case 'chest':
        return {
          scale: [1, 1.05, 1],
          y: [0, -3, 0],
          transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
        };
      default:
        return {
          y: [0, -2, 0],
          transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
        };
    }
  }, [isPlaying, exType]);

  const leftArmMotion = useMemo(() => {
    if (!isPlaying) return { rotate: 0 };
    switch (exType) {
      case 'wrist':
        return {
          rotate: [-20, 25, -20],
          transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
        };
      case 'shoulder':
        return {
          rotate: [-30, 10, -30],
          y: [-6, 2, -6],
          transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
        };
      case 'chest':
        return {
          rotate: [-35, -5, -35],
          transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
        };
      case 'twist':
        return {
          rotate: [15, -20, 15],
          transition: { repeat: Infinity, duration: 5, ease: 'easeInOut' }
        };
      default:
        return {
          rotate: [-12, 8, -12],
          transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
        };
    }
  }, [isPlaying, exType]);

  const rightArmMotion = useMemo(() => {
    if (!isPlaying) return { rotate: 0 };
    switch (exType) {
      case 'wrist':
        return {
          rotate: [20, -25, 20],
          transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
        };
      case 'shoulder':
        return {
          rotate: [30, -10, 30],
          y: [-6, 2, -6],
          transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
        };
      case 'chest':
        return {
          rotate: [35, 5, 35],
          transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
        };
      case 'twist':
        return {
          rotate: [-15, 20, -15],
          transition: { repeat: Infinity, duration: 5, ease: 'easeInOut' }
        };
      default:
        return {
          rotate: [12, -8, 12],
          transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
        };
    }
  }, [isPlaying, exType]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950">
      
      {/* Background Lottie Kinetic Aura Layer */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <Lottie
          src={lottieData}
          loop={isPlaying}
          autoplay={isPlaying}
          style={{ width: isMini ? 180 : 320, height: isMini ? 180 : 320 }}
        />
      </div>

      {/* Cosmic Halo Flair (if unlocked & equipped) */}
      {hasCosmicHalo && (
        <motion.div
          animate={{ rotate: 360, scale: [0.95, 1.05, 0.95] }}
          transition={{ rotate: { repeat: Infinity, duration: 16, ease: 'linear' }, scale: { repeat: Infinity, duration: 4, ease: 'easeInOut' } }}
          className="absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full border border-purple-400/50 pointer-events-none"
          style={{
            boxShadow: '0 0 30px rgba(192, 132, 252, 0.3), inset 0 0 20px rgba(192, 132, 252, 0.2)'
          }}
        />
      )}

      {/* Flame Aura Flair */}
      {hasFlameAura && (
        <motion.div
          animate={{ opacity: [0.3, 0.65, 0.3], scale: [0.9, 1.02, 0.9] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="absolute w-44 h-56 rounded-full bg-gradient-to-t from-orange-500/20 via-amber-500/10 to-transparent blur-xl pointer-events-none"
        />
      )}

      {/* Main Vector Skeletal Rig (Framer Motion) */}
      <svg
        viewBox="0 0 240 320"
        className={`relative z-10 drop-shadow-2xl overflow-visible ${
          isMini ? 'w-44 h-44' : isPlayer ? 'w-64 h-64 sm:w-80 sm:h-80' : 'w-56 h-56 sm:w-64 sm:h-64'
        }`}
      >
        <defs>
          <radialGradient id="headGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor={coachPalette.primary} />
            <stop offset="100%" stopColor={coachPalette.body} />
          </radialGradient>
          <linearGradient id="torsoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hasHoodie ? '#a855f7' : hasSinglet ? '#f59e0b' : coachPalette.primary} />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Biomechanical Spine Kinetic Alignment Arc */}
        <motion.path
          d="M 120 75 Q 122 130 120 180"
          stroke={coachPalette.spineGlow}
          strokeWidth="3.5"
          strokeDasharray="4 3"
          fill="none"
          filter="url(#glowEffect)"
          animate={{ opacity: isPlaying ? [0.6, 1, 0.6] : 0.7 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />

        {/* Dynamic Biomechanical Angle Arc (shows joint range of motion) */}
        {showBiomechanicsHUD && !isMini && (
          <g opacity={isPlaying ? 0.85 : 0.4}>
            <circle cx="120" cy="85" r="28" fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <text x="155" y="85" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {exType === 'neck' ? '45° Glide' : exType === 'twist' ? '30° Twist' : 'Neutral'}
            </text>
          </g>
        )}

        {/* Lower Body & Seated Platform Base (Driver Ergonomics) */}
        <g id="pelvis-legs">
          {/* Seated Platform Line */}
          <rect x="70" y="225" width="100" height="8" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          {/* Thighs */}
          <path d="M 105 180 L 85 225" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <path d="M 135 180 L 155 225" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          {/* Calves */}
          <path d="M 85 225 L 85 270" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <path d="M 155 225 L 155 270" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* Torso & Core */}
        <motion.g
          id="torso-group"
          animate={torsoMotion as any}
          style={{ originX: '120px', originY: '180px' }}
        >
          {/* Chest & Ribcage Core */}
          <path
            d="M 95 85 Q 120 78 145 85 L 138 180 Q 120 185 102 180 Z"
            fill="url(#torsoGrad)"
            stroke={coachPalette.accent}
            strokeWidth="1.5"
          />

          {/* Exosuit Titanium Lumbar Brace Flair (if equipped) */}
          {hasExosuit && (
            <g id="exosuit-brace">
              <path d="M 98 140 L 142 140" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" />
              <path d="M 104 158 L 136 158" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              <circle cx="120" cy="140" r="4" fill="#f8fafc" stroke="#0891b2" strokeWidth="1.5" />
            </g>
          )}

          {/* Coach Emblem / Badge on Chest */}
          <circle cx="120" cy="115" r="9" fill="#0f172a" stroke={coachPalette.primary} strokeWidth="1.5" />
          <text x="120" y="118.5" textAnchor="middle" fontSize="9" fill={coachPalette.primary} fontWeight="bold">
            {coach.avatarEmoji}
          </text>
        </motion.g>

        {/* Left Arm Rig */}
        <motion.g
          id="left-arm"
          animate={leftArmMotion as any}
          style={{ originX: '95px', originY: '85px' }}
        >
          {/* Upper Arm */}
          <path d="M 95 85 L 75 130" stroke={hasSleeves ? '#38bdf8' : coachPalette.body} strokeWidth="9" strokeLinecap="round" />
          {/* Forearm */}
          <path d="M 75 130 L 60 170" stroke={hasSleeves ? '#0284c7' : coachPalette.accent} strokeWidth="7" strokeLinecap="round" />
          {/* Hand & Wrist Wrap */}
          <circle cx="60" cy="172" r="5" fill={hasWraps ? '#06b6d4' : coachPalette.primary} />
          {hasWraps && (
            <circle cx="60" cy="172" r="7" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="2 2" />
          )}
        </motion.g>

        {/* Right Arm Rig */}
        <motion.g
          id="right-arm"
          animate={rightArmMotion as any}
          style={{ originX: '145px', originY: '85px' }}
        >
          {/* Upper Arm */}
          <path d="M 145 85 L 165 130" stroke={hasSleeves ? '#38bdf8' : coachPalette.body} strokeWidth="9" strokeLinecap="round" />
          {/* Forearm */}
          <path d="M 165 130 L 180 170" stroke={hasSleeves ? '#0284c7' : coachPalette.accent} strokeWidth="7" strokeLinecap="round" />
          {/* Hand & Wrist Wrap */}
          <circle cx="180" cy="172" r="5" fill={hasWraps ? '#06b6d4' : coachPalette.primary} />
          {hasWraps && (
            <circle cx="180" cy="172" r="7" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="2 2" />
          )}
        </motion.g>

        {/* Head & Neck Rig */}
        <motion.g
          id="head-neck"
          animate={headMotion as any}
          style={{ originX: '120px', originY: '75px' }}
        >
          {/* Cervical Neck */}
          <path d="M 120 75 L 120 58" stroke={coachPalette.body} strokeWidth="8" strokeLinecap="round" />
          
          {/* Head Sphere */}
          <circle
            cx="120"
            cy="40"
            r="19"
            fill="url(#headGrad)"
            stroke={coachPalette.primary}
            strokeWidth="2"
          />

          {/* Visor Flair (if equipped) */}
          {hasVisor && (
            <path
              d="M 103 36 Q 120 30 137 36 L 140 40 Q 120 35 100 40 Z"
              fill="#eab308"
              stroke="#ca8a04"
              strokeWidth="1"
            />
          )}

          {/* Zen Headband Flair (if equipped) */}
          {hasHeadband && (
            <path
              d="M 102 32 Q 120 28 138 32"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}

          {/* Face Visor / Coach Eyes Guide */}
          <ellipse cx="120" cy="40" rx="9" ry="3" fill="#0f172a" />
          <line x1="114" y1="40" x2="126" y2="40" stroke="#38bdf8" strokeWidth="1.5" />
        </motion.g>

      </svg>

      {/* Floating Biomechanical Status Overlay */}
      {showBiomechanicsHUD && !isMini && (
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
          <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono font-bold text-slate-300">
              Rig: <strong className="text-cyan-400">{coach.title.split(' ')[0]}</strong>
            </span>
          </div>

          <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5 shadow-md">
            <span className="text-[10px] font-mono text-slate-400">Status:</span>
            <span className="text-[10px] font-bold text-emerald-400">
              {isPlaying ? 'Kinetic Active' : 'Paused'}
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
