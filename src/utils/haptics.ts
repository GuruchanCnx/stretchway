export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 16,
  medium: 32,
  heavy: 60,
  success: [28, 45, 55],
  warning: [75, 40, 75]
};

export function isHapticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('stretchway_haptics_enabled') !== 'false';
}

export function triggerHaptic(pattern: HapticPattern = 'light', force: boolean = false): boolean {
  if (!force && !isHapticsEnabled()) return false;
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return false;
  }
  try {
    return navigator.vibrate(PATTERNS[pattern]);
  } catch {
    return false;
  }
}
