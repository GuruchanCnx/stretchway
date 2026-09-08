import { AchievementBadge, UserProgress } from '../types';

export const BADGE_DEFINITIONS: Omit<AchievementBadge, 'currentValue' | 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-spark',
    title: 'First Ignition',
    description: 'Complete your first road mobility or breathwork session.',
    category: 'pitstop',
    tier: 'bronze',
    icon: 'Sparkles',
    metricType: 'routines',
    targetValue: 1,
    cosmeticFlair: {
      avatarRing: 'ring-2 ring-emerald-400/80 shadow-emerald-400/30',
      profileTitle: 'Highway Pioneer',
      tagClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
    }
  },
  {
    id: 'streak-3',
    title: 'Spine Sentinel',
    description: 'Maintain a 3-day consecutive road mobility streak.',
    category: 'streak',
    tier: 'bronze',
    icon: 'Flame',
    metricType: 'streak',
    targetValue: 3,
    cosmeticFlair: {
      avatarRing: 'ring-2 ring-amber-500/80 shadow-amber-500/30',
      profileTitle: 'Spine Sentinel',
      tagClass: 'bg-amber-950/80 text-amber-300 border-amber-500/40'
    }
  },
  {
    id: 'streak-7',
    title: 'Road Warrior',
    description: 'Maintain a 7-day consecutive streak across all driving legs.',
    category: 'streak',
    tier: 'silver',
    icon: 'Shield',
    metricType: 'streak',
    targetValue: 7,
    cosmeticFlair: {
      avatarRing: 'ring-2 ring-cyan-400 shadow-cyan-400/40 shadow-md',
      profileTitle: 'Road Warrior',
      tagClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-400/50'
    }
  },
  {
    id: 'streak-10',
    title: '10-Day Streak',
    description: 'Maintain an unbroken 10-day consecutive road mobility streak across highway travels.',
    category: 'streak',
    tier: 'gold',
    icon: 'Flame',
    metricType: 'streak',
    targetValue: 10,
    cosmeticFlair: {
      avatarRing: 'ring-3 ring-amber-400 shadow-amber-500/50 shadow-lg',
      profileTitle: 'Decade Cruiser',
      tagClass: 'bg-amber-950/90 text-amber-300 border-amber-400/60'
    }
  },
  {
    id: 'streak-14',
    title: 'Century Helmsman',
    description: 'Maintain a 14-day consecutive streak of spinal decompression.',
    category: 'streak',
    tier: 'gold',
    icon: 'Trophy',
    metricType: 'streak',
    targetValue: 14,
    cosmeticFlair: {
      avatarRing: 'ring-2 ring-amber-300 shadow-amber-400/50 shadow-lg',
      profileTitle: 'Century Helmsman',
      tagClass: 'bg-amber-900/90 text-amber-200 border-amber-300/60'
    }
  },
  {
    id: 'streak-30',
    title: 'Apex Posture Helmsman',
    description: 'Reach a 30-day streak of unbreakable road posture discipline.',
    category: 'streak',
    tier: 'diamond',
    icon: 'Zap',
    metricType: 'streak',
    targetValue: 30,
    cosmeticFlair: {
      avatarRing: 'ring-4 ring-purple-400 shadow-purple-500/60 shadow-xl animate-pulse',
      profileTitle: 'Apex Helmsman',
      tagClass: 'bg-purple-950 text-purple-200 border-purple-400/70'
    }
  },
  {
    id: 'time-25',
    title: 'Quarter-Century Mover',
    description: 'Clock 25 cumulative minutes of active road mobility.',
    category: 'time',
    tier: 'bronze',
    icon: 'Clock',
    metricType: 'totalMinutes',
    targetValue: 25,
    cosmeticFlair: {
      avatarRing: 'ring-2 ring-teal-400/80 shadow-teal-400/30',
      profileTitle: 'Fluid Commuter',
      tagClass: 'bg-teal-950/80 text-teal-300 border-teal-500/40'
    }
  },
  {
    id: 'time-100',
    title: 'Centurion Stretcher',
    description: 'Hit 100 cumulative minutes decompressing discs & piriformis.',
    category: 'time',
    tier: 'silver',
    icon: 'Activity',
    metricType: 'totalMinutes',
    targetValue: 100,
    cosmeticFlair: {
      avatarRing: 'ring-2 ring-blue-400 shadow-blue-400/40',
      profileTitle: 'Centurion Stretcher',
      tagClass: 'bg-blue-950/80 text-blue-300 border-blue-400/50'
    }
  },
  {
    id: 'time-300',
    title: 'Asphalt Zen Master',
    description: 'Achieve 300 cumulative minutes of road longevity mastery.',
    category: 'time',
    tier: 'gold',
    icon: 'Sparkles',
    metricType: 'totalMinutes',
    targetValue: 300,
    cosmeticFlair: {
      avatarRing: 'ring-3 ring-amber-400 shadow-amber-400/50 shadow-md',
      profileTitle: 'Zen Master of Asphalt',
      tagClass: 'bg-amber-950 text-amber-300 border-amber-400/60'
    }
  },
  {
    id: 'time-600',
    title: 'Ironclad Spine',
    description: 'Surpass 600 cumulative minutes — total immunity to road slouch.',
    category: 'time',
    tier: 'diamond',
    icon: 'Shield',
    metricType: 'totalMinutes',
    targetValue: 600,
    cosmeticFlair: {
      avatarRing: 'ring-4 ring-cyan-300 shadow-cyan-400/60 shadow-xl',
      profileTitle: 'Ironclad Spine',
      tagClass: 'bg-cyan-950 text-cyan-200 border-cyan-300/70'
    }
  },
  {
    id: 'pitstop-10',
    title: 'Pitstop Specialist',
    description: 'Execute 10 tailored pitstop routines during travel stops.',
    category: 'pitstop',
    tier: 'silver',
    icon: 'Zap',
    metricType: 'routines',
    targetValue: 10,
    cosmeticFlair: {
      avatarRing: 'ring-2 ring-indigo-400 shadow-indigo-400/40',
      profileTitle: 'Pitstop Specialist',
      tagClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-400/50'
    }
  },
  {
    id: 'prana-10',
    title: 'Prana Navigator',
    description: 'Perform 10 diaphragmatic breath pacing resets to clear highway brain fog.',
    category: 'zen',
    tier: 'bronze',
    icon: 'Wind',
    metricType: 'breath',
    targetValue: 10,
    cosmeticFlair: {
      avatarRing: 'ring-2 ring-sky-400/80 shadow-sky-400/30',
      profileTitle: 'Prana Navigator',
      tagClass: 'bg-sky-950/80 text-sky-300 border-sky-400/40'
    }
  }
];

export function computeUserAchievements(userProgress: UserProgress): AchievementBadge[] {
  const totalRoutinesAndBreath = userProgress.routinesCompleted + userProgress.breathSessionsCompleted;

  return BADGE_DEFINITIONS.map(def => {
    let currentValue = 0;
    if (def.metricType === 'streak') {
      currentValue = userProgress.currentStreakDays || 0;
    } else if (def.metricType === 'totalMinutes') {
      currentValue = userProgress.totalMinutesStretched || 0;
    } else if (def.metricType === 'routines') {
      currentValue = def.id === 'first-spark' 
        ? totalRoutinesAndBreath 
        : (userProgress.routinesCompleted || 0);
    } else if (def.metricType === 'breath') {
      currentValue = userProgress.breathSessionsCompleted || 0;
    }

    const unlocked = currentValue >= def.targetValue;

    return {
      ...def,
      currentValue,
      unlocked,
      unlockedAt: unlocked ? 'Active' : undefined
    };
  });
}
