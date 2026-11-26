import React from 'react';
import { Routine } from '../types';

interface PrintableRoutineSheetProps {
  routine: Routine | null;
}

export const PrintableRoutineSheet: React.FC<PrintableRoutineSheetProps> = ({ routine }) => {
  if (!routine) return null;

  const totalSec = routine.exercises.reduce((acc, ex) => acc + (ex.durationSeconds || 45), 0);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const durationLabel = mins > 0 ? (secs > 0 ? `${mins}m ${secs}s` : `${mins} min`) : `${secs}s`;

  return (
    <div id="printable-routine-guide" className="print-only-sheet max-w-3xl mx-auto p-6 bg-white text-slate-900">
      <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
            StretchWay Printable Driver Mobility Guide
          </p>
          <h1 className="text-2xl font-black text-slate-950 mt-1">{routine.title}</h1>
          {routine.subtitle && (
            <p className="text-sm text-slate-700 mt-1">{routine.subtitle}</p>
          )}
        </div>
        <div className="text-right text-xs font-mono text-slate-700 space-y-0.5">
          <div>Vehicle: {String(routine.vehicle).toUpperCase()}</div>
          <div>Intensity: {routine.intensity}</div>
          <div>Duration: {durationLabel} ({routine.exercises.length} drills)</div>
        </div>
      </div>

      {routine.notes && routine.notes.trim() && (
        <div className="mb-5 p-3.5 rounded-lg border border-sky-300 bg-sky-50">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-1">
            Driver Routine Notes & Context Reminders
          </div>
          <p className="text-sm text-slate-800">{routine.notes}</p>
        </div>
      )}

      {routine.coachRationale && (
        <div className="mb-5 p-3 rounded-lg border border-slate-300 bg-slate-50 text-xs text-slate-800">
          <strong>Coach Rationale: </strong>
          {routine.coachRationale}
        </div>
      )}

      <div className="space-y-4">
        {routine.exercises.map((ex, idx) => (
          <div key={ex.id || idx} className="p-3.5 rounded-lg border border-slate-300 break-inside-avoid">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h2 className="text-sm font-extrabold text-slate-950">
                {idx + 1}. {ex.name}
              </h2>
              <span className="text-xs font-mono text-slate-700">
                {ex.durationSeconds}s • {ex.reps} • {ex.intensity} • {ex.location}
              </span>
            </div>
            <p className="text-xs text-slate-700 mb-1">
              <strong>Form Cue:</strong> {ex.formCues}
            </p>
            <p className="text-xs text-slate-600 mb-1.5">
              <strong>Targets:</strong> {(ex.targetMuscles || []).join(', ')}
            </p>
            <ol className="list-decimal list-inside text-xs text-slate-800 space-y-0.5">
              {(ex.steps || []).map((step, sIdx) => (
                <li key={sIdx}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-3 border-t border-slate-300 text-[11px] text-slate-600 flex items-center justify-between">
        <span>Safety Notice: Always park safely or engage hazard/parking brake before stretching.</span>
        <span>Generated {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};
