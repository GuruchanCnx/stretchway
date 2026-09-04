import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Bike, 
  Layers, 
  Sparkles, 
  Wind, 
  Compass, 
  Navigation, 
  Activity, 
  Search, 
  Play, 
  Flame, 
  Download, 
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart,
  Droplets,
  BookOpen,
  Trash2,
  Wand2,
  Calendar,
  Target,
  Settings
} from 'lucide-react';
import { 
  VehicleType, 
  ExerciseCategory, 
  MuscleGroup, 
  Exercise, 
  Routine, 
  UserProgress,
  AccentColorTheme,
  UserAssessmentProfile
} from './types';
import { ALL_EXERCISES, CURATED_ROUTINES } from './data/exercises';
import { SupportedLang, TRANSLATIONS } from './data/translations';
import { THEME_CONFIGS } from './data/themes';
import { Navbar } from './components/Navbar';
import { HeroWall } from './components/HeroWall';
import { OnboardingModal } from './components/OnboardingModal';
import { BottomNav, AppTabType } from './components/BottomNav';
import { InteractivePlayer } from './components/InteractivePlayer';
import { BodyMap } from './components/BodyMap';
import { BreathEngine } from './components/BreathEngine';
import { AICoachModal } from './components/AICoachModal';
import { ErgonomicCockpitGuide } from './components/ErgonomicCockpitGuide';
import { TripPlanner } from './components/TripPlanner';
import { RoadLog } from './components/RoadLog';
import { ExerciseCard } from './components/ExerciseCard';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { SmartRoutineCreator } from './components/SmartRoutineCreator';
import { DailyGoalModal } from './components/DailyGoalModal';
import { UserSettingsModal } from './components/UserSettingsModal';
import { SundaySummaryModal } from './components/SundaySummaryModal';
import { 
  ensureAuthenticatedUser, 
  syncUserProgressToFirestore, 
  fetchUserProgressFromFirestore,
  syncAssessmentProfileToFirestore,
  fetchAssessmentProfileFromFirestore,
  syncCustomRoutinesToFirestore,
  fetchCustomRoutinesFromFirestore
} from './services/firebase';

export const App: React.FC = () => {
  // Navigation & filtering state
  const [activeTab, setActiveTab] = useState<'routines' | 'bodymap' | 'breath' | 'cockpit' | 'trip' | 'log' | 'library'>('routines');
  const [currentVehicle, setCurrentVehicle] = useState<VehicleType>('all');
  const [currentLang, setCurrentLang] = useState<SupportedLang>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accentTheme, setAccentTheme] = useState<AccentColorTheme>(() => {
    const savedAccent = localStorage.getItem('stretchway_accent_theme');
    if (savedAccent && (savedAccent in THEME_CONFIGS)) {
      return savedAccent as AccentColorTheme;
    }
    return 'ocean';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<MuscleGroup | 'all'>('all');

  // AI-Generated Custom Routines State
  const [customRoutines, setCustomRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem('stretchway_custom_routines');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved custom routines:', e);
      }
    }
    return [];
  });

  // Active workout player state
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [aiCoachInitialPrompt, setAiCoachInitialPrompt] = useState<string>('');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Daily target minutes & modals state
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('stretchway_daily_goal_minutes');
    return saved ? parseInt(saved, 10) : 15;
  });
  const [isDailyGoalModalOpen, setIsDailyGoalModalOpen] = useState(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
  const [isSundaySummaryOpen, setIsSundaySummaryOpen] = useState(false);

  // Settings for haptics & pulse countdown
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('stretchway_haptics_enabled') !== 'false';
  });
  const [pulseCountdownEnabled, setPulseCountdownEnabled] = useState<boolean>(() => {
    return localStorage.getItem('stretchway_pulse_countdown') !== 'false';
  });

  const handleToggleHaptics = (val: boolean) => {
    setHapticsEnabled(val);
    localStorage.setItem('stretchway_haptics_enabled', String(val));
  };

  const handleTogglePulseCountdown = (val: boolean) => {
    setPulseCountdownEnabled(val);
    localStorage.setItem('stretchway_pulse_countdown', String(val));
  };

  const handleSaveDailyGoal = (mins: number) => {
    setDailyGoalMinutes(mins);
    localStorage.setItem('stretchway_daily_goal_minutes', String(mins));
  };

  // Sunday summary check
  useEffect(() => {
    const isSunday = new Date().getDay() === 0;
    const lastPromptDate = localStorage.getItem('stretchway_last_sunday_summary_prompt');
    const todayStr = new Date().toISOString().split('T')[0];
    if (isSunday && lastPromptDate !== todayStr) {
      setIsSundaySummaryOpen(true);
      localStorage.setItem('stretchway_last_sunday_summary_prompt', todayStr);
    }
  }, []);

  // Personalized Driver Assessment Profile
  const [assessmentProfile, setAssessmentProfile] = useState<UserAssessmentProfile | null>(() => {
    const saved = localStorage.getItem('stretchway_assessment_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // User persistence progress
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('stretchway_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      totalMinutesStretched: 22,
      routinesCompleted: 3,
      breathSessionsCompleted: 2,
      currentStreakDays: 3,
      lastSessionDate: new Date().toISOString().split('T')[0],
      completedHistory: [
        {
          id: 'hist-1',
          title: '10-Min In-Seat Commuter Reset',
          date: 'Yesterday',
          durationMinutes: 10,
          feelingBefore: 2,
          feelingAfter: 5
        },
        {
          id: 'hist-2',
          title: '5-Min Fast Highway Pitstop',
          date: '2 days ago',
          durationMinutes: 5,
          feelingBefore: 3,
          feelingAfter: 5
        }
      ],
      favoriteExerciseIds: ['car-neck-rolls', 'car-pelvic-clock']
    };
  });

  // Save and sync assessment profile
  const handleSaveAssessment = (profile: UserAssessmentProfile) => {
    setAssessmentProfile(profile);
    localStorage.setItem('stretchway_assessment_profile', JSON.stringify(profile));
    
    // Update active vehicle if user specified in assessment
    if (profile.vehicle) {
      setCurrentVehicle(profile.vehicle);
    }

    // Sync to Cloud Firestore
    ensureAuthenticatedUser().then(user => {
      if (user) {
        syncAssessmentProfileToFirestore(user.uid, profile);
      }
    });
  };

  // Sync progress changes to localStorage and Firestore
  useEffect(() => {
    localStorage.setItem('stretchway_progress', JSON.stringify(userProgress));
    
    // Asynchronously synchronize with Cloud Firestore
    ensureAuthenticatedUser().then(user => {
      if (user) {
        syncUserProgressToFirestore(user.uid, userProgress);
      }
    });
  }, [userProgress]);

  // Initial cloud restore on mount
  useEffect(() => {
    ensureAuthenticatedUser().then(async (user) => {
      if (user) {
        // Restore user progress
        const cloudData = await fetchUserProgressFromFirestore(user.uid);
        if (cloudData && cloudData.totalMinutesStretched !== undefined) {
          setUserProgress(prev => ({
            ...prev,
            currentStreakDays: cloudData.currentStreakDays ?? prev.currentStreakDays,
            totalMinutesStretched: Math.max(cloudData.totalMinutesStretched ?? 0, prev.totalMinutesStretched),
            favoriteExerciseIds: cloudData.favoriteExerciseIds ?? prev.favoriteExerciseIds
          }));
        }

        // Restore user assessment profile
        const cloudProfile = await fetchAssessmentProfileFromFirestore(user.uid);
        if (cloudProfile && cloudProfile.primaryIssue) {
          setAssessmentProfile(cloudProfile);
          localStorage.setItem('stretchway_assessment_profile', JSON.stringify(cloudProfile));
        }

        // Restore custom AI routines
        const cloudCustomRoutines = await fetchCustomRoutinesFromFirestore(user.uid);
        if (cloudCustomRoutines && Array.isArray(cloudCustomRoutines) && cloudCustomRoutines.length > 0) {
          setCustomRoutines(prev => {
            const existingIds = new Set(prev.map(r => r.id));
            const newItems = cloudCustomRoutines.filter(r => !existingIds.has(r.id));
            const merged = [...newItems, ...prev];
            localStorage.setItem('stretchway_custom_routines', JSON.stringify(merged));
            return merged;
          });
        }
      }
    });
  }, []);

  // Handle new custom routine creation from SmartRoutineCreator or Coach
  const handleRoutineCreated = (newRoutine: Routine, autoStart: boolean = false) => {
    setCustomRoutines(prev => {
      const updated = [newRoutine, ...prev.filter(r => r.id !== newRoutine.id)];
      localStorage.setItem('stretchway_custom_routines', JSON.stringify(updated));
      ensureAuthenticatedUser().then(user => {
        if (user) {
          syncCustomRoutinesToFirestore(user.uid, updated);
        }
      });
      return updated;
    });

    if (autoStart) {
      setActiveRoutine(newRoutine);
    }
  };

  // Handle custom routine removal
  const handleDeleteCustomRoutine = (routineId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomRoutines(prev => {
      const updated = prev.filter(r => r.id !== routineId);
      localStorage.setItem('stretchway_custom_routines', JSON.stringify(updated));
      ensureAuthenticatedUser().then(user => {
        if (user) {
          syncCustomRoutinesToFirestore(user.uid, updated);
        }
      });
      return updated;
    });
  };

  // Handle theme & accent color scheme
  useEffect(() => {
    localStorage.setItem('stretchway_accent_theme', accentTheme);
    const cfg = THEME_CONFIGS[accentTheme] || THEME_CONFIGS.ocean;
    document.documentElement.setAttribute('data-accent-theme', accentTheme);
    document.documentElement.style.setProperty('--color-primary', cfg.primaryColor);
    document.documentElement.style.setProperty('--color-primary-glow', cfg.palette.glow);
  }, [accentTheme]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [theme]);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleRoutineCompleted = (data: {
    routineId: string;
    routineTitle: string;
    durationMinutes: number;
    feelingBefore: number;
    feelingAfter: number;
  }) => {
    setUserProgress(prev => {
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = prev.lastSessionDate !== today;
      return {
        ...prev,
        totalMinutesStretched: prev.totalMinutesStretched + data.durationMinutes,
        routinesCompleted: prev.routinesCompleted + 1,
        currentStreakDays: isNewDay ? prev.currentStreakDays + 1 : prev.currentStreakDays,
        lastSessionDate: today,
        completedHistory: [
          ...prev.completedHistory,
          {
            id: `hist-${Date.now()}`,
            title: data.routineTitle,
            date: 'Today',
            durationMinutes: data.durationMinutes,
            feelingBefore: data.feelingBefore,
            feelingAfter: data.feelingAfter
          }
        ]
      };
    });
    setActiveRoutine(null);
  };

  const handleBreathCompleted = (name: string, cycles: number) => {
    setUserProgress(prev => ({
      ...prev,
      breathSessionsCompleted: prev.breathSessionsCompleted + 1,
      totalMinutesStretched: prev.totalMinutesStretched + 2
    }));
  };

  const handleExportSummary = () => {
    const reportText = `===========================================
STRETCHWAY ROAD RECOVERY REPORT
Olympic Coach & Yoga Biomechanics on the Road
===========================================
Date: ${new Date().toLocaleDateString()}
Total Road Mobility Time: ${userProgress.totalMinutesStretched} Minutes
Routines Completed: ${userProgress.routinesCompleted}
Breath Sessions: ${userProgress.breathSessionsCompleted}
Current Daily Streak: ${userProgress.currentStreakDays} Days

Recent Sessions:
${userProgress.completedHistory.map(h => `- ${h.title} (${h.durationMinutes} min) | Relief: ${h.feelingBefore}/5 -> ${h.feelingAfter}/5`).join('\n')}

Biomechanical Takeaway:
Consistent spinal decompression reduces lumbar shear, relieves forward-head suboccipital strain, and ensures alert, safe commuting.
===========================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stretchway-recovery-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  // Filter exercises
  const filteredExercises = ALL_EXERCISES.filter(ex => {
    if (currentVehicle !== 'all' && !ex.vehicle.includes(currentVehicle as any)) return false;
    if (selectedCategoryFilter !== 'all' && ex.category !== selectedCategoryFilter) return false;
    if (selectedMuscleFilter !== 'all' && !ex.muscleGroup.includes(selectedMuscleFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ex.name.toLowerCase().includes(q) ||
        ex.formCues.toLowerCase().includes(q) ||
        ex.targetMuscles.some(m => m.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Combine curated and user-generated custom AI routines
  const allRoutines = [...customRoutines, ...CURATED_ROUTINES];

  // Filter routines by vehicle
  const filteredRoutines = allRoutines.filter(r => {
    if (currentVehicle === 'all') return true;
    return r.vehicle === 'all' || r.vehicle === currentVehicle;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        currentVehicle={currentVehicle}
        onSelectVehicle={setCurrentVehicle}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        accentTheme={accentTheme}
        onSelectAccentTheme={setAccentTheme}
        userProgress={userProgress}
        onOpenAICoach={() => setIsAICoachOpen(true)}
        onOpenQuickBreath={() => setActiveTab('breath')}
        activeTab={activeTab}
        onSelectTab={(tab: any) => setActiveTab(tab)}
        dailyGoalMinutes={dailyGoalMinutes}
        todayMinutes={todayMinutes}
        onOpenDailyGoalModal={() => setIsDailyGoalModalOpen(true)}
        onOpenUserSettings={() => setIsUserSettingsOpen(true)}
      />

      {/* Hero Category Navigation Bar */}
      <nav className="sticky top-16 sm:top-20 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-2.5 overflow-x-auto no-scrollbar">
            
            <button
              onClick={() => setActiveTab('routines')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'routines'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Curated Protocols</span>
            </button>

            <button
              onClick={() => setActiveTab('bodymap')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'bodymap'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Anatomy Body Map</span>
            </button>

            <button
              onClick={() => setActiveTab('breath')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'breath'
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>Breath Mastery</span>
            </button>

            <button
              onClick={() => setActiveTab('cockpit')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'cockpit'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Cockpit Ergonomics</span>
            </button>

            <button
              onClick={() => setActiveTab('trip')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'trip'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Trip Pitstops</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'library'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Drill Library ({filteredExercises.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('log')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'log'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Recovery Log</span>
            </button>

          </div>
        </div>
      </nav>

      {/* Main Container with bottom padding for BottomNav */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 space-y-8">
        
        {/* Back to Protocols Navigation Bar for Sub-Views */}
        {activeTab !== 'routines' && (
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg animate-fade-in">
            <button
              onClick={() => setActiveTab('routines')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 transition-all text-xs font-bold shadow-sm group active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Protocols</span>
            </button>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Current Section</span>
              <span className="text-xs font-extrabold text-slate-200 capitalize">
                {activeTab === 'bodymap' && '🎯 Interactive Anatomy Map'}
                {activeTab === 'breath' && '🌬️ Breath Mastery Engine'}
                {activeTab === 'cockpit' && '💺 Cockpit Ergonomics Guide'}
                {activeTab === 'trip' && '🗺️ Road Trip Interval Planner'}
                {activeTab === 'library' && '📚 Mobility Drill Library'}
                {activeTab === 'log' && '🔥 Recovery Dashboard & Log'}
              </span>
            </div>
          </div>
        )}

        {/* Tab Views with Fluid Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full"
          >
            {/* TAB 1: CURATED ROUTINES & PROTOCOLS */}
            {activeTab === 'routines' && (
              <div className="space-y-8">
            
            {/* Rich Hero Wall with CTAs, Quick Pitstop launcher & Personalized Profile */}
            <HeroWall
              currentVehicle={currentVehicle}
              onSelectVehicle={setCurrentVehicle}
              userProgress={userProgress}
              assessmentProfile={assessmentProfile}
              onStartRoutine={(r) => setActiveRoutine(r)}
              onOpenQuickDecompress={() => {
                const q = CURATED_ROUTINES.find(r => r.id === 'car-quick-pitstop') || CURATED_ROUTINES[0];
                setActiveRoutine(q);
              }}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
              onOpenAICoach={(prompt) => {
                if (prompt) setAiCoachInitialPrompt(prompt);
                setIsAICoachOpen(true);
              }}
              onOpenBreath={() => setActiveTab('breath')}
              onSelectTab={(tab) => setActiveTab(tab)}
              curatedRoutines={CURATED_ROUTINES}
            />

            {/* Curated Routines Grid Header & Smart Creator */}
            <div className="space-y-6">
              
              {/* Smart Routine Creator Dashboard */}
              <div id="smart-routine-creator-section">
                <SmartRoutineCreator
                  onRoutineCreated={handleRoutineCreated}
                  currentVehicle={currentVehicle}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Curated & AI Synthesized Protocols
                    </h2>
                    {customRoutines.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold">
                        {customRoutines.length} Custom AI
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Step-by-step guided audio & visual stretch sequences with Veo-3 4K anatomical clips
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                  {filteredRoutines.length} Active Protocols
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoutines.map((routine, idx) => {
                  const isCustom = customRoutines.some(cr => cr.id === routine.id);
                  return (
                    <motion.div
                      key={routine.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -6, scale: 1.018 }}
                      transition={{ 
                        duration: 0.35, 
                        delay: Math.min(idx * 0.04, 0.3),
                        ease: [0.25, 0.8, 0.25, 1] 
                      }}
                      className={`p-6 rounded-3xl bg-slate-900/80 border transition-all flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-500/10 group relative overflow-hidden ${
                        isCustom 
                          ? 'border-cyan-500/60 shadow-lg shadow-cyan-500/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950' 
                          : 'border-slate-800 hover:border-cyan-500/50'
                      }`}
                    >
                      {/* Ambient highlight for AI Generated routines */}
                      {isCustom && (
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400" />
                      )}

                      <div>
                        {/* Top Badges & Actions */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                              {routine.vehicle.toUpperCase()}
                            </span>
                            {isCustom && (
                              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/50 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                <span>AI Custom Rx</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{routine.durationMinutes} Min</span>
                            </span>
                            {isCustom && (
                              <button
                                onClick={(e) => handleDeleteCustomRoutine(routine.id, e)}
                                title="Remove Custom Routine"
                                className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-950/80 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-500/50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                          {routine.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                          {routine.subtitle}
                        </p>

                        {/* Coach Rationale */}
                        <div className="my-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                          <strong className="text-cyan-400 block mb-0.5 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>Olympic Coach Rationale:</span>
                          </strong>
                          {routine.coachRationale}
                        </div>

                        {/* Target Areas */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {routine.targetAreas.map((area, i) => (
                            <span key={i} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-950 border border-slate-800 text-slate-400">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => setActiveRoutine(routine)}
                        className={`w-full py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                          isCustom
                            ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 shadow-cyan-500/25'
                            : 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-cyan-500/20'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>Start Guided Session</span>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Body Map Teaser Banner */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white">
                    Need instant relief for a specific muscle knot?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Use our interactive anatomical body map to target neck, piriformis/sciatica, lumbar spine, or wrists.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('bodymap')}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap"
              >
                <span>Open Anatomy Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: INTERACTIVE ANATOMY BODY MAP */}
        {activeTab === 'bodymap' && (
          <BodyMap
            onStartTargetedRoutine={(r) => setActiveRoutine(r)}
            onFilterMuscle={(m) => {
              setSelectedMuscleFilter(m);
              setActiveTab('library');
            }}
          />
        )}

        {/* TAB 3: BREATH MASTERY ENGINE */}
        {activeTab === 'breath' && (
          <BreathEngine
            onCompleteSession={handleBreathCompleted}
          />
        )}

        {/* TAB 4: COCKPIT ERGONOMICS */}
        {activeTab === 'cockpit' && (
          <ErgonomicCockpitGuide />
        )}

        {/* TAB 5: TRIP PLANNER */}
        {activeTab === 'trip' && (
          <TripPlanner
            onStartRoutine={(r) => setActiveRoutine(r)}
            currentVehicle={currentVehicle}
          />
        )}

        {/* TAB 6: DRILL LIBRARY */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white">
                  Olympic & Yogic Mobility Drill Library
                </h2>
                <p className="text-xs text-slate-400">
                  Explore individual biomechanically proven exercises for drivers and riders
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by muscle, name..."
                  className="w-full py-2.5 pl-10 pr-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* Muscle Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setSelectedMuscleFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedMuscleFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                All Muscles ({ALL_EXERCISES.length})
              </button>
              {(['neck', 'shoulders', 'upper-back', 'lower-back', 'hips', 'wrists', 'hamstrings', 'calves'] as MuscleGroup[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMuscleFilter(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                    selectedMuscleFilter === m ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {m.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Exercise Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onOpenDetail={(ex) => setSelectedExerciseForModal(ex)}
                  onStartSingle={(r) => setActiveRoutine(r)}
                />
              ))}
            </div>

          </div>
        )}

            {/* TAB 7: ROAD LOG & RECOVERY DASHBOARD */}
            {activeTab === 'log' && (
              <RoadLog
                userProgress={userProgress}
                onExportSummary={handleExportSummary}
                onStartRoutine={(r) => setActiveRoutine(r)}
                onOpenAICoach={(prompt) => {
                  if (prompt) setAiCoachInitialPrompt(prompt);
                  setIsAICoachOpen(true);
                }}
                currentVehicle={currentVehicle}
              />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">StretchWay</span>
            <span>•</span>
            <span>Olympic Coach & Yoga Biomechanics Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={handleExportSummary} className="hover:text-cyan-400 transition-colors">
              Export Report
            </button>
            <span>•</span>
            <button onClick={() => { setAiCoachInitialPrompt(''); setIsAICoachOpen(true); }} className="hover:text-cyan-400 transition-colors">
              AI Coach Lyra
            </button>
          </div>

          <div className="text-[11px] text-slate-600">
            Always park safely before performing in-seat or off-vehicle stretches.
          </div>
        </div>
      </footer>

      {/* Interactive Fullscreen Workout Player */}
      {activeRoutine && (
        <InteractivePlayer
          routine={activeRoutine}
          onClose={() => setActiveRoutine(null)}
          onComplete={handleRoutineCompleted}
        />
      )}

      {/* Single Exercise Detail Modal */}
      {selectedExerciseForModal && (
        <ExerciseDetailModal
          exercise={selectedExerciseForModal}
          onClose={() => setSelectedExerciseForModal(null)}
          onStartSingleExercise={(r) => setActiveRoutine(r)}
        />
      )}

      {/* AI Biomechanics Coach Modal */}
      <AICoachModal
        isOpen={isAICoachOpen}
        onClose={() => {
          setIsAICoachOpen(false);
          setAiCoachInitialPrompt('');
        }}
        onLaunchGeneratedRoutine={(r) => handleRoutineCreated(r, true)}
        currentVehicle={currentVehicle}
        initialPrompt={aiCoachInitialPrompt}
      />

      {/* Personalized Onboarding / Issue Tailoring Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveAssessment={handleSaveAssessment}
        onLaunchRoutine={(r) => setActiveRoutine(r)}
        initialVehicle={currentVehicle}
      />

      {/* Daily Goal Setting Modal */}
      <DailyGoalModal
        isOpen={isDailyGoalModalOpen}
        onClose={() => setIsDailyGoalModalOpen(false)}
        currentGoalMinutes={dailyGoalMinutes}
        todayMinutes={todayMinutes}
        onSaveGoal={handleSaveDailyGoal}
      />

      {/* User Settings Modal (Haptics, Pulse Countdown, Veo-3 Autoplay) */}
      <UserSettingsModal
        isOpen={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
        hapticsEnabled={hapticsEnabled}
        onToggleHaptics={handleToggleHaptics}
        pulseCountdownEnabled={pulseCountdownEnabled}
        onTogglePulseCountdown={handleTogglePulseCountdown}
        onOpenDailyGoal={() => {
          setIsUserSettingsOpen(false);
          setIsDailyGoalModalOpen(true);
        }}
      />

      {/* Automated Sunday Weekly Recovery Summary Modal */}
      <SundaySummaryModal
        isOpen={isSundaySummaryOpen}
        onClose={() => setIsSundaySummaryOpen(false)}
        userProgress={userProgress}
        currentVehicle={currentVehicle}
        onStartRoutine={(r) => setActiveRoutine(r)}
      />

      {/* Sticky Bottom Navigation Tabs */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenAICoach={() => {
          setAiCoachInitialPrompt('');
          setIsAICoachOpen(true);
        }}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        userProgress={userProgress}
        currentVehicle={currentVehicle}
        onSelectVehicle={setCurrentVehicle}
      />

    </div>
  );
};
