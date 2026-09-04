import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Check, X, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routine } from '../types';

export interface RoutineReminderConfig {
  routineId: string;
  routineTitle: string;
  enabled: boolean;
  time: string; // HH:MM
  repeatDaily: boolean;
}

interface RoutineReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  routine: Routine;
  onSaveReminder: (config: RoutineReminderConfig) => void;
  currentConfig?: RoutineReminderConfig;
}

export const RoutineReminderModal: React.FC<RoutineReminderModalProps> = ({
  isOpen,
  onClose,
  routine,
  onSaveReminder,
  currentConfig
}) => {
  const [enabled, setEnabled] = useState(currentConfig?.enabled ?? true);
  const [time, setTime] = useState(currentConfig?.time ?? '09:00');
  const [repeatDaily, setRepeatDaily] = useState(currentConfig?.repeatDaily ?? true);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const presets = [
    { label: 'Morning Commute', time: '08:00' },
    { label: 'Midday Pitstop', time: '12:30' },
    { label: 'Evening Return', time: '17:30' },
    { label: 'Night Decompression', time: '21:00' }
  ];

  const handleRequestPermissionAndSave = async () => {
    if (enabled && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted') {
        try {
          const res = await Notification.requestPermission();
          setPermissionStatus(res);
        } catch (e) {
          console.warn('Notification permission request error:', e);
        }
      }
    }

    onSaveReminder({
      routineId: routine.id,
      routineTitle: routine.title,
      enabled,
      time,
      repeatDaily
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-500 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Bell className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Schedule Routine Alert
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">{routine.title}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Enable Toggle */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  Enable Scheduled Reminder
                </span>
                <span className="text-[11px] text-slate-400">
                  Sends a browser notification when it's time to decompress.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 cursor-pointer ${
                  enabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-1"
              >
                {/* Time Presets */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Quick Preset Times
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset.time}
                        type="button"
                        onClick={() => setTime(preset.time)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                          time === preset.time
                            ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{preset.label}</span>
                        <span className="font-mono text-cyan-400 font-normal">{preset.time}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Time Input */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Specific Time:</span>
                  </div>

                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Permission Hint */}
                {permissionStatus !== 'granted' && (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-2.5 text-[11px] text-amber-300">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Browser will prompt for notification permission upon saving so we can alert you even when driving or taking a break.
                    </span>
                  </div>
                )}
              </motion.div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold border border-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestPermissionAndSave}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Reminder</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
