import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart,
  Droplets,
  BookOpen
} from 'lucide-react';
import { 
  VehicleType, 
  ExerciseCategory, 
  MuscleGroup, 
  Exercise, 
  Routine, 
  UserProgress 
} from './types';
import { ALL_EXERCISES, CURATED_ROUTINES } from './data/exercises';
import { SupportedLang, TRANSLATIONS } from './data/translations';
import { Navbar } from './components/Navbar';
import { InteractivePlayer } from './components/InteractivePlayer';
import { BodyMap } from './components/BodyMap';
import { BreathEngine } from './components/BreathEngine';
import { AICoachModal } from './components/AICoachModal';
import { ErgonomicCockpitGuide } from './components/ErgonomicCockpitGuide';
import { TripPlanner } from './components/TripPlanner';
import { RoadLog } from './components/RoadLog';
import { ExerciseCard } from './components/ExerciseCard';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';

export const App: React.FC = () => {
  // Navigation & filtering state
  const [activeTab, setActiveTab] = useState<'routines' | 'bodymap' | 'breath' | 'cockpit' | 'trip' | 'log' | 'library'>('routines');
  const [currentVehicle, setCurrentVehicle] = useState<VehicleType>('all');
  const [currentLang, setCurrentLang] = useState<SupportedLang>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<MuscleGroup | 'all'>('all');

  // Active workout player state
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

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

  // Save progress changes
  useEffect(() => {
    localStorage.setItem('stretchway_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Handle theme
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

  // Filter routines by vehicle
  const filteredRoutines = CURATED_ROUTINES.filter(r => {
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
        userProgress={userProgress}
        onOpenAICoach={() => setIsAICoachOpen(true)}
        onOpenQuickBreath={() => setActiveTab('breath')}
        activeTab={activeTab}
        onSelectTab={(tab: any) => setActiveTab(tab)}
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* TAB 1: CURATED ROUTINES & PROTOCOLS */}
        {activeTab === 'routines' && (
          <div className="space-y-8">
            
            {/* Hero Banner with Quick AI Action */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-950 border border-cyan-800/50 shadow-2xl overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Olympic Coach & Yoga Biomechanics
                  </span>
                  <span className="text-xs text-slate-400">Zero-Equipment Road Health</span>
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Eradicate Driver Stiffness & Spinal Compression.
                </h1>
                
                <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                  Precision in-seat micro-drills, rest-stop traction, and diaphragmatic vagal pacing engineered to keep drivers, commuters, and motorcyclists pain-free.
                </p>

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => setActiveRoutine(CURATED_ROUTINES[0])}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Start 10-Min In-Seat Reset</span>
                  </button>

                  <button
                    onClick={() => setIsAICoachOpen(true)}
                    className="py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Generate AI Custom Protocol</span>
                  </button>
                </div>
              </div>

              {/* Decorative background visual icon */}
              <Activity className="absolute -right-8 -bottom-8 w-64 h-64 text-cyan-500/5 pointer-events-none" />
            </div>

            {/* Curated Routines Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Targeted Road Recovery Protocols
                  </h2>
                  <p className="text-xs text-slate-400">
                    Step-by-step guided audio & visual stretch sequences
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  {filteredRoutines.length} Programs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoutines.map((routine) => (
                  <div
                    key={routine.id}
                    className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between hover:shadow-2xl hover:shadow-cyan-500/10 group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                          {routine.vehicle.toUpperCase()}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{routine.durationMinutes} Min</span>
                        </span>
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
                        <strong className="text-cyan-400 block mb-0.5">Olympic Coach Rationale:</strong>
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
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Start Guided Session</span>
                    </button>
                  </div>
                ))}
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
          />
        )}

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
            <button onClick={() => setIsAICoachOpen(true)} className="hover:text-cyan-400 transition-colors">
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
        onClose={() => setIsAICoachOpen(false)}
        onLaunchGeneratedRoutine={(r) => setActiveRoutine(r)}
        currentVehicle={currentVehicle}
      />

    </div>
  );
};
