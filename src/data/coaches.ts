import { CoachProfile, CoachId } from '../types';

export const COACH_PROFILES: Record<CoachId, CoachProfile> = {
  olympic: {
    id: 'olympic',
    name: 'Coach Marcus Vance',
    title: 'Olympic Mobility Coach',
    tagline: 'Explosive spinal decompression, kinetic power, and unyielding road alertness.',
    avatarEmoji: '⚡',
    themeColor: '#f59e0b',
    accentGradient: 'from-amber-500 via-orange-500 to-yellow-400',
    voiceStyle: 'Dynamic, confident, and inspiring Olympic training cadence',
    specialty: 'Athletic recovery, posture stamina, and fast neuromuscular resets',
    characterStyle: 'athletic',
    introMessage: "Let's lock in! Road fatigue has zero chance against Olympic biomechanics.",
    formCueTone: 'Precision & Power',
    celebrationQuote: "Phenomenal execution! Your spine is primed for peak highway performance."
  },
  yoga: {
    id: 'yoga',
    name: 'Guru Shanti Devi',
    title: 'Yoga & Breathwork Master',
    tagline: 'Deep diaphragmatic flow, cervical unwinding, and conscious nervous system stillness.',
    avatarEmoji: '🧘',
    themeColor: '#10b981',
    accentGradient: 'from-emerald-500 via-teal-500 to-green-400',
    voiceStyle: 'Calm, grounding, rhythmic breath-guided cadence',
    specialty: 'Prana breathing, spinal cord decompression, and mental clarity',
    characterStyle: 'zen',
    introMessage: 'Breathe in deep renewal. Release the asphalt tension on every exhale.',
    formCueTone: 'Mindful Harmony',
    celebrationQuote: 'Namaste, driver. Your nervous system is centered, grounded, and restored.'
  },
  physio: {
    id: 'physio',
    name: 'Dr. Chen, DPT',
    title: 'Physio Pro & Spine Clinician',
    tagline: 'Evidence-based orthopedic angles, disc pressure mitigation, and joint longevity.',
    avatarEmoji: '🩺',
    themeColor: '#06b6d4',
    accentGradient: 'from-cyan-500 via-sky-500 to-blue-500',
    voiceStyle: 'Clinical, precise, anatomical angle analysis',
    specialty: 'Lumbar disc decompression, sciatica prevention, and carpal relief',
    characterStyle: 'clinical',
    introMessage: 'Calibrating joint angles. Minimizing lumbar disc load by up to 45%.',
    formCueTone: 'Orthopedic Accuracy',
    celebrationQuote: 'Clinical goal achieved. Vertebral disc spacing normalized.'
  },
  ergonomic: {
    id: 'ergonomic',
    name: 'Coach Lyra',
    title: 'Highway Ergonomics Specialist',
    tagline: 'Vehicle cabin biomechanics, steering grip posture, and rapid pitstop resets.',
    avatarEmoji: '🚀',
    themeColor: '#8b5cf6',
    accentGradient: 'from-purple-500 via-indigo-500 to-violet-400',
    voiceStyle: 'Modern, high-tech, and reassuring co-pilot guidance',
    specialty: 'Steering wheel ergonomics, commuter neck syndrome, and micro-pitstops',
    characterStyle: 'road-pro',
    introMessage: 'Scanning driver biomechanics. Ready to neutralize highway stiffness.',
    formCueTone: 'Cabin Ergonomics',
    celebrationQuote: 'Highway posture reset complete. Smooth, pain-free travels ahead!'
  }
};

export const DEFAULT_COACH_ID: CoachId = 'olympic';

export function getCoach(id?: string): CoachProfile {
  if (id && id in COACH_PROFILES) {
    return COACH_PROFILES[id as CoachId];
  }
  return COACH_PROFILES[DEFAULT_COACH_ID];
}
