import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bell, 
  BellRing, 
  BellOff, 
  Clock, 
  Car, 
  Activity, 
  Play, 
  X, 
  Settings, 
  Volume2, 
  VolumeX, 
  Check, 
  Sparkles,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Pause,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface StretchNotificationConfig {
  enabled: boolean;
  inactivityThresholdMinutes: number; // e.g., 30, 45, 60 (or 0.25 for 15s demo)
  roadDurationMinutes: number; // e.g., 60, 90, 120 (or 0.33 for 20s demo)
  soundEnabled: boolean;
  browserNotificationsAllowed: boolean;
  driveModeActive: boolean;
}

interface StretchNotificationSystemProps {
  onStartQuickStretch: () => void;
  onOpenTripPlanner?: () => void;
}

const DEFAULT_CONFIG: StretchNotificationConfig = {
  enabled: true,
  inactivityThresholdMinutes: 30,
  roadDurationMinutes: 60,
  soundEnabled: true,
  browserNotificationsAllowed: false,
  driveModeActive: false
};

const POLITE_SUGGESTIONS = [
  {
    title: "Spinal Health Check",
    message: "You've been still for a while. A quick 3-minute stretch will decompress your lumbar discs and re-oxygenate stiff posture muscles.",
    action: "Quick 3-Min Reset"
  },
  {
    title: "Highway Circulation Reminder",
    message: "Your body has been absorbing continuous road vibration. Unclench your shoulders and take a brief pitstop stretch to restore circulation.",
    action: "Start Pitstop Stretch"
  },
  {
    title: "Gentle Decompression Alert",
    message: "Prolonged sitting shortens hip flexors and puts pressure on your sciatic nerve. Time for a polite spinal elongation break.",
    action: "Decompress Spine"
  },
  {
    title: "Driver Focus & Reflex Reset",
    message: "Stale driving posture causes mental fatigue. A 5-minute mobility pitstop refreshes neural focus and keeps highway reflexes sharp.",
    action: "5-Min Pitstop Stretch"
  }
];

export const StretchNotificationSystem: React.FC<StretchNotificationSystemProps> = ({
  onStartQuickStretch,
  onOpenTripPlanner
}) => {
  // Load configuration from localStorage
  const [config, setConfig] = useState<StretchNotificationConfig>(() => {
    try {
      const saved = localStorage.getItem('stretchway_notification_config');
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load notification config:', e);
    }
    return DEFAULT_CONFIG;
  });

  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeAlert, setActiveAlert] = useState<{
    id: string;
    type: 'inactivity' | 'road_duration' | 'test';
    title: string;
    message: string;
    actionLabel: string;
    timestamp: number;
  } | null>(null);

  // Road trip timer tracking
  const [roadDriveSeconds, setRoadDriveSeconds] = useState(0);

  // Inactivity tracking refs
  const lastInteractionRef = useRef<number>(Date.now());
  const lastAlertTimeRef = useRef<number>(0);
  const roadTimeIntervalRef = useRef<any>(null);

  // Check browser Notification support & current permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionState(Notification.permission);
      if (Notification.permission === 'granted') {
        setConfig(prev => ({ ...prev, browserNotificationsAllowed: true }));
      }
    }
  }, []);

  // Persist config changes
  useEffect(() => {
    try {
      localStorage.setItem('stretchway_notification_config', JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save notification config:', e);
    }
  }, [config]);

  // Gentle Web Audio synthesised chime (528 Hz Love Frequency + 660 Hz Harmonic)
  const playGentleChime = useCallback(() => {
    if (!config.soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const now = ctx.currentTime;
      // First tone: 528 Hz
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 1.2);

      // Second tone: 660 Hz (harmonic major third)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(660, now + 0.12);
      gain2.gain.setValueAtTime(0, now + 0.12);
      gain2.gain.linearRampToValueAtTime(0.1, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 1.4);
    } catch (err) {
      console.warn('Web Audio chime could not play:', err);
    }
  }, [config.soundEnabled]);

  // Trigger Notification through both Browser API & In-App Floating Toast
  const triggerStretchSuggestion = useCallback((
    type: 'inactivity' | 'road_duration' | 'test',
    customTitle?: string,
    customMsg?: string
  ) => {
    const suggestion = POLITE_SUGGESTIONS[Math.floor(Math.random() * POLITE_SUGGESTIONS.length)];
    const title = customTitle || (
      type === 'inactivity' 
        ? "Gentle Spine Reminder" 
        : type === 'road_duration' 
        ? "Highway Pitstop Recommended" 
        : "Stretch Suggestion Test"
    );
    const message = customMsg || suggestion.message;
    const actionLabel = suggestion.action;

    // Sound chime
    playGentleChime();

    // 1. Try Native Browser Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const n = new Notification(`StretchWay: ${title}`, {
          body: message,
          tag: 'stretchway-polite-alert',
          silent: !config.soundEnabled
        });
        n.onclick = () => {
          window.focus();
          onStartQuickStretch();
          n.close();
        };
      } catch (e) {
        console.warn('Browser Notification instance failed (iframe or sandbox):', e);
      }
    }

    // 2. In-App Polite Toast Banner
    setActiveAlert({
      id: `alert-${Date.now()}`,
      type,
      title,
      message,
      actionLabel,
      timestamp: Date.now()
    });

    lastAlertTimeRef.current = Date.now();
  }, [config.soundEnabled, playGentleChime, onStartQuickStretch]);

  // Activity listeners to detect user interaction
  useEffect(() => {
    if (!config.enabled) return;

    const handleUserInteraction = () => {
      lastInteractionRef.current = Date.now();
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, handleUserInteraction, { passive: true }));

    // Periodic check for inactivity interval
    const interval = setInterval(() => {
      if (!config.enabled) return;
      const now = Date.now();
      const inactiveDurationMs = now - lastInteractionRef.current;
      const thresholdMs = config.inactivityThresholdMinutes * 60 * 1000;
      const cooldownMs = 5 * 60 * 1000; // Minimum 5 mins between inactivity alerts

      // Check if threshold reached and not in immediate cooldown
      if (inactiveDurationMs >= thresholdMs && (now - lastAlertTimeRef.current) > cooldownMs) {
        triggerStretchSuggestion(
          'inactivity',
          'Spinal Decompression Reminder',
          `You have been stationary for over ${config.inactivityThresholdMinutes < 1 ? `${Math.round(config.inactivityThresholdMinutes * 60)} seconds` : `${config.inactivityThresholdMinutes} minutes`}. A 3-minute pitstop stretch will relieve disc compression.`
        );
        lastInteractionRef.current = now; // reset
      }
    }, 5000);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleUserInteraction));
      clearInterval(interval);
    };
  }, [config.enabled, config.inactivityThresholdMinutes, triggerStretchSuggestion]);

  // Road Trip Driving Timer
  useEffect(() => {
    if (!config.enabled || !config.driveModeActive) {
      if (roadTimeIntervalRef.current) clearInterval(roadTimeIntervalRef.current);
      return;
    }

    roadTimeIntervalRef.current = setInterval(() => {
      setRoadDriveSeconds(prev => {
        const next = prev + 1;
        const targetSeconds = config.roadDurationMinutes * 60;
        
        // Alert when target driving time reached
        if (next > 0 && next % Math.max(15, targetSeconds) === 0) {
          triggerStretchSuggestion(
            'road_duration',
            'Highway Rest Area Pitstop',
            `You have been on the road for ${config.roadDurationMinutes < 1 ? `${Math.round(config.roadDurationMinutes * 60)} seconds` : `${config.roadDurationMinutes} minutes`}. Please pull into a safe rest stop for a guided posture reset.`
          );
        }
        return next;
      });
    }, 1000);

    return () => {
      if (roadTimeIntervalRef.current) clearInterval(roadTimeIntervalRef.current);
    };
  }, [config.enabled, config.driveModeActive, config.roadDurationMinutes, triggerStretchSuggestion]);

  // Request browser notification permission
  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermissionState(result);
        if (result === 'granted') {
          setConfig(prev => ({ ...prev, browserNotificationsAllowed: true }));
          triggerStretchSuggestion('test', 'Notifications Enabled', 'You will now receive polite posture and road pitstop alerts.');
        }
      } catch (e) {
        console.warn('Error requesting notification permission:', e);
      }
    }
  };

  const handleSnooze = (minutes: number) => {
    setActiveAlert(null);
    lastInteractionRef.current = Date.now();
    lastAlertTimeRef.current = Date.now() + (minutes * 60 * 1000) - (config.inactivityThresholdMinutes * 60 * 1000);
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <>
      {/* Floating Control Chip / Status Indicator */}
      <div className="fixed bottom-20 right-4 z-40 sm:bottom-24 sm:right-6">
        <div className="flex items-center gap-2">
          {/* Active Drive Mode Pill */}
          {config.driveModeActive && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/60 rounded-2xl px-3 py-1.5 shadow-lg backdrop-blur-md"
            >
              <Car className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-black text-amber-400">On The Road</span>
                <span className="text-xs font-mono font-bold text-white">{formatTime(roadDriveSeconds)}</span>
              </div>
            </motion.div>
          )}

          {/* Quick Notification Controls Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
              config.enabled 
                ? 'bg-slate-900/90 hover:bg-slate-800/90 border-cyan-500/40 text-cyan-300' 
                : 'bg-slate-950/90 hover:bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Stretch Notification Settings"
          >
            {config.enabled ? (
              <BellRing className="w-4 h-4 text-cyan-400" />
            ) : (
              <BellOff className="w-4 h-4 text-slate-500" />
            )}
            <span className="text-xs font-bold hidden md:inline">
              {config.enabled ? 'Stretch Alerts Active' : 'Alerts Paused'}
            </span>
          </button>
        </div>
      </div>

      {/* In-App Polite Floating Suggestion Toast / Banner */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-18 sm:top-20 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg"
          >
            <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border-2 border-cyan-400/80 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-md shrink-0 mt-0.5">
                    <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                        {activeAlert.type === 'inactivity' ? 'Inactivity Suggestion' : activeAlert.type === 'road_duration' ? 'Road Pitstop Due' : 'Notification Test'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Polite Alert</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white mt-1">
                      {activeAlert.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {activeAlert.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveAlert(null)}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => handleSnooze(15)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold border border-slate-800 transition-all"
                >
                  Snooze (15m)
                </button>
                <button
                  onClick={() => {
                    setActiveAlert(null);
                    onStartQuickStretch();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-black shadow-lg shadow-cyan-400/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{activeAlert.actionLabel}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Settings & Road Trip Timer Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Stretch Suggestion Alerts</h3>
                    <p className="text-xs text-slate-400">Browser notifications & road timer</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* System Master Toggle */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">Enable Stretch Suggestions</span>
                    <span className="text-xs text-slate-400">Automatic reminders based on inactivity and driving</span>
                  </div>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      config.enabled ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                      config.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Browser Notification Permission Card */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">Browser Push Notifications</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      permissionState === 'granted' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : permissionState === 'denied'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {permissionState}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Enables OS-level browser alerts so you never miss a stretch while in another window or driving navigation app.
                  </p>
                  {permissionState !== 'granted' && (
                    <button
                      onClick={handleRequestPermission}
                      className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
                    >
                      Request Browser Permission
                    </button>
                  )}
                </div>

                {/* Inactivity Threshold Setting */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Inactivity Detection Interval</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {config.inactivityThresholdMinutes < 1 ? '15 Seconds (Demo)' : `${config.inactivityThresholdMinutes} Minutes`}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      { label: '15s Demo', val: 0.25 },
                      { label: '20 min', val: 20 },
                      { label: '30 min', val: 30 },
                      { label: '45 min', val: 45 }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setConfig(prev => ({ ...prev, inactivityThresholdMinutes: opt.val }))}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          config.inactivityThresholdMinutes === opt.val
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Road Duration Timer (Driving Mode) */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-amber-400" />
                        <span>Highway Driving Mode</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Tracks continuous road trip duration
                      </span>
                    </div>
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, driveModeActive: !prev.driveModeActive }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        config.driveModeActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {config.driveModeActive ? 'Drive Active' : 'Start Drive'}
                    </button>
                  </div>

                  {config.driveModeActive && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs">
                      <span className="text-amber-300 font-medium">Elapsed Road Time:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{formatTime(roadDriveSeconds)}</span>
                        <button
                          onClick={() => setRoadDriveSeconds(0)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Reset road timer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: '20s Demo', val: 0.33 },
                      { label: '45 min', val: 45 },
                      { label: '60 min', val: 60 },
                      { label: '90 min', val: 90 }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setConfig(prev => ({ ...prev, roadDurationMinutes: opt.val }))}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          config.roadDurationMinutes === opt.val
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sound alert chime toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-2">
                    {config.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-500" />
                    )}
                    <span className="text-xs font-bold text-white">Audible Harmonic Chime</span>
                  </div>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      config.soundEnabled ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {config.soundEnabled ? 'On' : 'Muted'}
                  </button>
                </div>

                {/* Test button */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => triggerStretchSuggestion('test', 'Sample Stretch Alert', 'You have been in driving posture for a prolonged period. Take 3 minutes to relieve lumbar tension.')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
                  >
                    Test Stretch Suggestion Now
                  </button>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-black transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
