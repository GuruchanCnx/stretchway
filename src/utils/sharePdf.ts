import { Exercise, Routine, IntensityLevel, VehicleType } from '../types';

interface SharedRoutinePayload {
  id: string;
  t: string;
  s?: string;
  n?: string;
  v: VehicleType;
  i: IntensityLevel;
  ex: string[];
}

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64: string): string {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64.length + 3) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeRoutineShareUrl(routine: Routine): string {
  const payload: SharedRoutinePayload = {
    id: routine.id,
    t: routine.title,
    s: routine.subtitle,
    n: routine.notes,
    v: routine.vehicle,
    i: routine.intensity,
    ex: routine.exercises.map((e) => e.id)
  };
  const encoded = toBase64Url(JSON.stringify(payload));
  return `${window.location.origin}${window.location.pathname}?routine=${encodeURIComponent(routine.id)}&sharedRoutine=${encodeURIComponent(encoded)}`;
}

export function decodeSharedRoutineFromUrl(
  allExercises: Exercise[],
  knownRoutines: Routine[]
): Routine | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('sharedRoutine');
  const routineIdParam = params.get('routine');

  if (encoded) {
    try {
      const parsed: SharedRoutinePayload = JSON.parse(fromBase64Url(encoded));
      const matchedExercises = (parsed.ex || [])
        .map((id) => {
          const baseId = id.replace(/-\d{4}$/, '');
          return allExercises.find((e) => e.id === id || e.id === baseId);
        })
        .filter((e): e is Exercise => Boolean(e));

      if (matchedExercises.length > 0) {
        const totalSec = matchedExercises.reduce((acc, e) => acc + (e.durationSeconds || 45), 0);
        return {
          id: parsed.id || `shared-${Date.now()}`,
          title: parsed.t || 'Shared StretchWay Routine',
          subtitle: parsed.s || 'Shared driver mobility sequence',
          notes: parsed.n || '',
          category: parsed.v === 'two-wheeler' ? 'two-wheeler' : 'car',
          vehicle: parsed.v || 'all',
          durationMinutes: Math.max(1, Math.round(totalSec / 60)),
          intensity: parsed.i || 'Moderate',
          exercises: matchedExercises,
          coachRationale: `Shared custom sequence (${matchedExercises.length} drills, ${Math.round(totalSec / 60)} min).`,
          targetAreas: Array.from(new Set(matchedExercises.flatMap((e) => e.targetMuscles || []))).slice(0, 4),
          bannerGradient: 'from-cyan-500 to-blue-600'
        };
      }
    } catch (err) {
      console.warn('Could not decode sharedRoutine parameter:', err);
    }
  }

  if (routineIdParam) {
    return knownRoutines.find((r) => r.id === routineIdParam) || null;
  }

  return null;
}

export function buildRoutineShareSummary(routine: Routine, shareUrl: string): string {
  const totalSec = routine.exercises.reduce((acc, e) => acc + (e.durationSeconds || 45), 0);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const durStr = mins > 0 ? (secs > 0 ? `${mins}m ${secs}s` : `${mins}m`) : `${secs}s`;

  return (
    `StretchWay Custom Routine: "${routine.title}"\n` +
    `Duration: ${durStr} (${routine.exercises.length} Drills) | Intensity: ${routine.intensity} | Vehicle: ${routine.vehicle}\n` +
    (routine.notes ? `Notes: ${routine.notes}\n` : '') +
    `Exercises:\n` +
    routine.exercises
      .map((e, idx) => `  ${idx + 1}. ${e.name} (${e.durationSeconds}s) [${e.intensity}]`)
      .join('\n') +
    `\n\nOpen interactive routine: ${shareUrl}`
  );
}
