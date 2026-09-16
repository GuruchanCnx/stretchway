import { AvatarFlairItem, UserProgress } from '../types';

export const AVATAR_FLAIR_ITEMS: AvatarFlairItem[] = [
  {
    id: 'flair-wraps',
    name: 'Steering Grip Wrist Wraps',
    slot: 'wrist',
    description: 'Protective neoprene wrist stabilizers to counter carpal tension from prolonged steering wheel vibration.',
    icon: 'Shield',
    milestoneDescription: 'Welcome Gift: Unlocked for all road drivers',
    unlockedByDefault: true,
    requiredMetric: 'routines',
    requiredValue: 0,
    visualPreview: {
      color: '#06b6d4',
      glow: 'shadow-cyan-500/50',
      badgeLabel: 'Wrist Gear'
    }
  },
  {
    id: 'flair-singlet',
    name: 'Olympic Mobility Singlet',
    slot: 'apparel',
    description: 'High-breathability athletic competition jersey featuring dynamic kinetic alignment seams.',
    icon: 'Sparkles',
    milestoneDescription: 'Complete your first road mobility routine',
    requiredMetric: 'routines',
    requiredValue: 1,
    visualPreview: {
      color: '#f59e0b',
      glow: 'shadow-amber-500/50',
      badgeLabel: 'Athletic Apparel'
    }
  },
  {
    id: 'flair-visor',
    name: 'Olympic Aero Visor',
    slot: 'headwear',
    description: 'Aerodynamic sun visor that reduces windshield glare and promotes upright cervical line.',
    icon: 'Zap',
    milestoneDescription: 'Maintain a 3-day consecutive road mobility streak',
    requiredMetric: 'streak',
    requiredValue: 3,
    visualPreview: {
      color: '#eab308',
      glow: 'shadow-yellow-500/50',
      badgeLabel: 'Headwear'
    }
  },
  {
    id: 'flair-headband',
    name: 'Zen Prana Headband',
    slot: 'headwear',
    description: 'Mindfulness fabric infused with cooling comfort to soothe highway mental fatigue.',
    icon: 'HeartPulse',
    milestoneDescription: 'Complete 3 breathing or meditation pitstops',
    requiredMetric: 'breath',
    requiredValue: 3,
    visualPreview: {
      color: '#10b981',
      glow: 'shadow-emerald-500/50',
      badgeLabel: 'Zen Headband'
    }
  },
  {
    id: 'flair-sleeves',
    name: 'Kinetic Compression Sleeves',
    slot: 'wrist',
    description: 'Graduated arm sleeves promoting venous blood return after long highway hours.',
    icon: 'Activity',
    milestoneDescription: 'Maintain a 7-day Road Warrior streak',
    requiredMetric: 'streak',
    requiredValue: 7,
    visualPreview: {
      color: '#38bdf8',
      glow: 'shadow-sky-500/50',
      badgeLabel: 'Compression Gear'
    }
  },
  {
    id: 'flair-hoodie',
    name: 'Asphalt Tech Hoodie',
    slot: 'apparel',
    description: 'Weather-resistant ergonomic hoodie tailored for active truck stops and roadside stretches.',
    icon: 'Wind',
    milestoneDescription: 'Accumulate 30 cumulative minutes of mobility sessions',
    requiredMetric: 'totalMinutes',
    requiredValue: 30,
    visualPreview: {
      color: '#a855f7',
      glow: 'shadow-purple-500/50',
      badgeLabel: 'Technical Apparel'
    }
  },
  {
    id: 'flair-exosuit',
    name: 'Titanium Lumbar Exosuit',
    slot: 'gear',
    description: 'Bionic lumbar support harness designed to neutralize lower disc compression.',
    icon: 'Trophy',
    milestoneDescription: 'Accumulate 100 cumulative minutes decompressing on the road',
    requiredMetric: 'totalMinutes',
    requiredValue: 100,
    visualPreview: {
      color: '#06b6d4',
      glow: 'shadow-cyan-400/60',
      badgeLabel: 'Bionic Gear'
    }
  },
  {
    id: 'flair-aura-amber',
    name: 'Olympic Kinetic Aura',
    slot: 'aura',
    description: 'A radiant golden field of athletic energy surrounding your character.',
    icon: 'Flame',
    milestoneDescription: 'Complete 5 mobility or pitstop routines',
    requiredMetric: 'routines',
    requiredValue: 5,
    visualPreview: {
      color: '#f97316',
      glow: 'shadow-orange-500/70',
      badgeLabel: 'Flame Aura'
    }
  },
  {
    id: 'flair-aura-cosmic',
    name: 'Highway Grandmaster Halo',
    slot: 'aura',
    description: 'Cosmic celestial rings rotating around your coach avatar, honoring mastery over road slouch.',
    icon: 'Crown',
    milestoneDescription: 'Maintain an unbroken 14-day streak or reach 200 minutes',
    requiredMetric: 'streak',
    requiredValue: 14,
    visualPreview: {
      color: '#c084fc',
      glow: 'shadow-purple-400/80',
      badgeLabel: 'Cosmic Halo'
    }
  }
];

export function isFlairUnlocked(item: AvatarFlairItem, userProgress: UserProgress): boolean {
  if (item.unlockedByDefault) return true;
  if (userProgress.unlockedBadgeIds?.includes(item.id)) return true;

  switch (item.requiredMetric) {
    case 'routines':
      return (userProgress.routinesCompleted || userProgress.completedHistory.length) >= item.requiredValue;
    case 'streak':
      return (userProgress.currentStreakDays || 0) >= item.requiredValue;
    case 'totalMinutes':
      return (userProgress.totalMinutesStretched || 0) >= item.requiredValue;
    case 'breath':
      return (userProgress.breathSessionsCompleted || 0) >= item.requiredValue;
    default:
      return false;
  }
}

export function getFlairProgress(item: AvatarFlairItem, userProgress: UserProgress): { current: number; target: number; percent: number } {
  let current = 0;
  switch (item.requiredMetric) {
    case 'routines':
      current = userProgress.routinesCompleted || userProgress.completedHistory.length || 0;
      break;
    case 'streak':
      current = userProgress.currentStreakDays || 0;
      break;
    case 'totalMinutes':
      current = userProgress.totalMinutesStretched || 0;
      break;
    case 'breath':
      current = userProgress.breathSessionsCompleted || 0;
      break;
  }
  const target = item.requiredValue;
  const percent = target === 0 ? 100 : Math.min(100, Math.round((current / target) * 100));
  return { current, target, percent };
}
