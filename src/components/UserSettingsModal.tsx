import React, { useState } from 'react';
import { Settings, X, Smartphone, Vibrate, Volume2, Sparkles, Video, Bell, Check, Zap, UserCheck, Play, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CoachId, CoachProfile } from '../types';
import { COACH_PROFILES, getCoach } from '../data/coaches';
import { speakCoachCue } from '../utils/audio';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: (enabled: boolean) => void;
  pulseCountdownEnabled: boolean;
  onTogglePulseCountdown: (enabled: boolean) => void;
  onOpenDailyGoal?: () => void;
  selectedCoachId?: CoachId;
  onSelectCoach?: (coachId: CoachId) => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
  hapticsEnabled,
  onToggleHaptics,
  pulseCountdownEnabled,
  onTogglePulseCountdown,
  onOpenDailyGoal,
  selectedCoachId = 'olympic',
  onSelectCoach
}) => {
  const [activeTab, setActiveTab] = useState<'coaches' | 'device'>('coaches');
  const [testSuccess, setTestSuccess] = useState(false);
  const [currentCoach, setCurrentCoach] = useState<CoachId>(() => {
    return (localStorage.getItem('stretchway_selected_coach') as CoachId) || selectedCoachId || 'olympic';
  });
  const [autoPlayVeo3, setAutoPlayVeo3] = useState<boolean>(() => {
    return localStorage.getItem('stretchway_autoplay_veo3') !== 'false';
  });

  if (!isOpen) return null;

  const handleChooseCoach = (coachId: CoachId) => {
    setCurrentCoach(coachId);
    localStorage.setItem('stretchway_selected_coach', coachId);
    if (onSelectCoach) {
      onSelectCoach(coachId);
    }
  };

  const handlePreviewVoice = (coach: CoachProfile) => {
    speakCoachCue(`${coach.introMessage} ${coach.celebrationQuote}`, true);
  };

  const handleTestHaptics = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 60, 100]);
        setTestSuccess(true);
        setTimeout(() => setTestSuccess(false), 2000);
      } catch (err) {
        console.warn('Vibration API error:', err);
      }
    } else {
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 2000);
    }
  };

  const handleToggleVeo3Auto = (val: boolean) => {
    setAutoPlayVeo3(val);
    localStorage.setItem('stretchway_autoplay_veo3', String(val));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-500 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Settings className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">App & Coach Settings</h3>
                <p className="text-xs text-slate-400">Select animated coaches, haptic pulse, and playback</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800/80 mb-5">
            <button
              onClick={() => setActiveTab('coaches')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'coaches'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Character & Coach Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('device')}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'device'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Device & Haptics</span>
            </button>
          </div>

          {/* Tab 1: Character Settings (Coach Selection) */}
          {activeTab === 'coaches' && (
            <div className="space-y-3.5">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Choose which animated biomechanics coach leads your mobility sessions:</span>
                <span className="font-mono text-cyan-400 font-bold text-[11px]">4 Coaches Available</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {Object.values(COACH_PROFILES).map((coach) => {
                  const isSelected = currentCoach === coach.id;
                  return (
                    <div
                      key={coach.id}
                      onClick={() => handleChooseCoach(coach.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                        isSelected
                          ? 'bg-slate-950/90 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {/* Coach Avatar Box */}
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 border ${
                              isSelected
                                ? 'bg-gradient-to-tr ' + coach.accentGradient + ' border-white/40'
                                : 'bg-slate-900 border-slate-700'
                            }`}
                          >
                            <span>{coach.avatarEmoji}</span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-extrabold text-white">
                                {coach.title}
                              </h4>
                              <span className="text-[11px] text-slate-400">
                                ({coach.name})
                              </span>
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                                  <Check className="w-3 h-3" /> Active Coach
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              {coach.tagline}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 flex-wrap">
                              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                                Specialty: {coach.specialty}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-amber-300 font-medium">
                                Cue Tone: {coach.formCueTone}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Audio Voice Preview Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewVoice(coach);
                          }}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-400 hover:text-white transition-all shrink-0"
                          title="Preview Coach Voice"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Device & Haptics Settings */}
          {activeTab === 'device' && (
            <div className="space-y-4">
              {/* Setting 1: Haptics Toggle */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Vibrate className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Movement Transition Haptics</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Vibrates your mobile device when transitioning between exercises or completing sets.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleHaptics(!hapticsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 cursor-pointer ${
                    hapticsEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Setting 2: Pulse Settings Toggle (3s Countdown) */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-white">Pulse Settings (3-Second Countdown)</h4>
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-950 text-amber-400 border border-amber-800/80">
                        Rhythmic
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Triggers a rhythmic haptic vibration pulse during the final 3 seconds before each exercise transition.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onTogglePulseCountdown(!pulseCountdownEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 cursor-pointer ${
                    pulseCountdownEnabled ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      pulseCountdownEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Test Haptic Button */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs">
                <span className="text-slate-400">Mobile Haptics Engine:</span>
                <button
                  type="button"
                  onClick={handleTestHaptics}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  {testSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Pulse Triggered!</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Test Device Vibration</span>
                    </>
                  )}
                </button>
              </div>

              {/* Setting 3: Veo-3 4K Auto-Play */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Veo-3 4K Motion Demos</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Automatically load hyper-realistic Veo-3 cinema video models during workout sessions.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleVeo3Auto(!autoPlayVeo3)}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 cursor-pointer ${
                    autoPlayVeo3 ? 'bg-purple-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      autoPlayVeo3 ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Daily Goal Quick Link */}
              {onOpenDailyGoal && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDailyGoal();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-between"
                  >
                    <span>Edit Daily Stretching Minutes Target</span>
                    <span className="text-cyan-400">Configure &rarr;</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20"
            >
              Save & Done
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

