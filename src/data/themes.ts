import { AccentColorTheme, ThemeConfig } from '../types';

export const THEME_CONFIGS: Record<AccentColorTheme, ThemeConfig> = {
  ocean: {
    id: 'ocean',
    name: 'Ocean Cyan',
    description: 'Refreshing coastal blue & bio-cyan for sharp mental focus',
    primaryColor: '#06b6d4',
    accentGradient: 'from-cyan-500 via-sky-500 to-blue-600',
    badgeBg: 'bg-cyan-950/80 text-cyan-400 border-cyan-800/80',
    activeRing: 'ring-cyan-400 shadow-cyan-500/20',
    palette: {
      50: '#ecfeff',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      glow: 'rgba(6, 182, 212, 0.25)'
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Ember',
    description: 'Warm crimson & amber dusk tones to release fatigue',
    primaryColor: '#f97316',
    accentGradient: 'from-orange-500 via-amber-500 to-rose-600',
    badgeBg: 'bg-orange-950/80 text-orange-400 border-orange-800/80',
    activeRing: 'ring-orange-400 shadow-orange-500/20',
    palette: {
      50: '#fff7ed',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      glow: 'rgba(249, 115, 22, 0.25)'
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest Emerald',
    description: 'Tranquil alpine pine & mint green for deep parasympathetic calm',
    primaryColor: '#10b981',
    accentGradient: 'from-emerald-500 via-teal-500 to-green-600',
    badgeBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80',
    activeRing: 'ring-emerald-400 shadow-emerald-500/20',
    palette: {
      50: '#ecfdf5',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      glow: 'rgba(16, 185, 129, 0.25)'
    }
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora Purple',
    description: 'Night highway violet & indigo for restorative decompression',
    primaryColor: '#8b5cf6',
    accentGradient: 'from-violet-500 via-purple-500 to-indigo-600',
    badgeBg: 'bg-purple-950/80 text-purple-400 border-purple-800/80',
    activeRing: 'ring-purple-400 shadow-purple-500/20',
    palette: {
      50: '#f5f3ff',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      glow: 'rgba(139, 92, 246, 0.25)'
    }
  },
  amber: {
    id: 'amber',
    name: 'Golden Highway',
    description: 'High-contrast solar gold & citrus energy for alertness',
    primaryColor: '#eab308',
    accentGradient: 'from-amber-400 via-yellow-500 to-orange-500',
    badgeBg: 'bg-amber-950/80 text-amber-400 border-amber-800/80',
    activeRing: 'ring-amber-400 shadow-amber-500/20',
    palette: {
      50: '#fefce8',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      glow: 'rgba(234, 179, 8, 0.25)'
    }
  }
};
