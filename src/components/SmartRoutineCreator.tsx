import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Clock, 
  Car, 
  Bike, 
  Truck, 
  Bus, 
  AlertTriangle, 
  Play, 
  Plus, 
  CheckCircle2, 
  RotateCcw, 
  Flame, 
  Activity, 
  ShieldCheck, 
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Zap, 
  Layers, 
  HeartPulse, 
  Info,
  Trash2,
  Copy,
  Share2,
  Star,
  GripVertical,
  X,
  Search,
  Filter,
  Check,
  Bookmark,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Routine, VehicleType, Exercise, IntensityLevel } from '../types';
import { ExerciseCharacterVisual } from './ExerciseCharacterVisual';
import { ALL_EXERCISES } from '../data/exercises';

interface SmartRoutineCreatorProps {
  onRoutineCreated: (routine: Routine, autoStart?: boolean) => void;
  currentVehicle: VehicleType;
  customRoutines?: Routine[];
  onDeleteRoutine?: (routineId: string, e: React.MouseEvent) => void;
  onDuplicateRoutine?: (routine: Routine, e?: React.MouseEvent) => void;
  onStartRoutine?: (routine: Routine) => void;
  onClose?: () => void;
  isCompact?: boolean;
}

export const SmartRoutineCreator: React.FC<SmartRoutineCreatorProps> = ({
  onRoutineCreated,
  currentVehicle,
  customRoutines = [],
  onDeleteRoutine,
  onDuplicateRoutine,
  onStartRoutine,
  onClose,
  isCompact = false
}) => {
  // Navigation tabs inside the Creator
  const [activeTab, setActiveTab] = useState<'builder' | 'ai_synthesizer' | 'saved_routines'>('builder');

  // Form State for AI Synthesis
  const [painLevel, setPainLevel] = useState<number>(6);
  const [selectedPainAreas, setSelectedPainAreas] = useState<string[]>([
    'Lower Back (L4-L5)',
    'Neck & Traps'
  ]);
  const [availableMinutes, setAvailableMinutes] = useState<number>(8);
  const [vehicle, setVehicle] = useState<'car' | 'two-wheeler' | 'truck' | 'commuter'>(
    currentVehicle === 'two-wheeler' ? 'two-wheeler' : currentVehicle === 'truck' ? 'truck' : 'car'
  );
  const [locationType, setLocationType] = useState<'In-Seat' | 'Off-Vehicle / Standing' | 'Either'>('In-Seat');
  const [goal, setGoal] = useState<'pain_relief' | 'alertness' | 'post_trip' | 'speed_reset'>('pain_relief');
  
  // Custom Routine Builder State
  const [routineTitle, setRoutineTitle] = useState<string>('My Custom Highway Recovery');
  const [routineSubtitle, setRoutineSubtitle] = useState<string>('Personalized posture decompression flow');
  const [routineExercises, setRoutineExercises] = useState<Exercise[]>(() => {
    // Initial starter exercises matching vehicle
    const vehicleKey = currentVehicle === 'two-wheeler' ? 'two-wheeler' : 'car';
    return ALL_EXERCISES.filter(ex => ex.vehicle.includes(vehicleKey as any)).slice(0, 4);
  });
  const [selectedPreviewExercise, setSelectedPreviewExercise] = useState<Exercise | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [hasAppended, setHasAppended] = useState(false);

  // Drag & drop reordering state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Exercise Library Modal State
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [librarySearch, setLibrarySearch] = useState<string>('');
  const [libraryFilterCategory, setLibraryFilterCategory] = useState<string>('all');

  // Share Dialog / Notification State
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Set default preview exercise on mount or when exercises change
  useEffect(() => {
    if (routineExercises.length > 0 && !selectedPreviewExercise) {
      setSelectedPreviewExercise(routineExercises[0]);
    } else if (routineExercises.length === 0) {
      setSelectedPreviewExercise(null);
    }
  }, [routineExercises, selectedPreviewExercise]);

  // Real-time Total Duration estimate calculation (sum of all exercise durationSeconds)
  const totalSeconds = useMemo(() => {
    return routineExercises.reduce((acc, ex) => acc + (ex.durationSeconds || 45), 0);
  }, [routineExercises]);

  const durationFormatted = useMemo(() => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  }, [totalSeconds]);

  const estimatedMinutes = useMemo(() => {
    return Math.max(1, Math.round(totalSeconds / 60));
  }, [totalSeconds]);

  // Overall intensity calculation based on exercises
  const calculatedIntensity = useMemo<IntensityLevel>(() => {
    if (routineExercises.length === 0) return 'Gentle';
    const deepCount = routineExercises.filter(e => e.intensity === 'Deep Release').length;
    const modCount = routineExercises.filter(e => e.intensity === 'Moderate').length;
    if (deepCount >= 2) return 'Deep Release';
    if (modCount >= 2 || deepCount >= 1) return 'Moderate';
    return 'Gentle';
  }, [routineExercises]);

  // Intensity Badge Helper (Low, Medium, High)
  const getIntensityBadge = (intensity?: string) => {
    const norm = (intensity || '').toLowerCase();
    if (norm.includes('gentle') || norm.includes('low') || norm.includes('light')) {
      return {
        label: 'Low',
        bgClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
        dotClass: 'bg-emerald-400'
      };
    }
    if (norm.includes('deep') || norm.includes('high') || norm.includes('intense') || norm.includes('advanced')) {
      return {
        label: 'High',
        bgClass: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
        dotClass: 'bg-rose-400'
      };
    }
    return {
      label: 'Medium',
      bgClass: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
      dotClass: 'bg-amber-400'
    };
  };

  const painAreasList = [
    { id: 'Lower Back (L4-L5)', label: 'Lower Back (L4-L5)', icon: '🦴' },
    { id: 'Neck & Traps', label: 'Cervical Neck & Traps', icon: '💆' },
    { id: 'Sciatica & Glutes', label: 'Piriformis / Sciatic Nerve', icon: '⚡' },
    { id: 'Throttle Wrists & Forearms', label: 'Steering Wrists & Forearms', icon: '🖐️' },
    { id: 'Thoracic & Mid-Back', label: 'Thoracic & Scapula', icon: '🎽' },
    { id: 'Hip Flexors & Psoas', label: 'Hip Flexors (Psoas)', icon: '🪑' },
    { id: 'Hamstrings & Calves', label: 'Legs, Hamstrings & Calves', icon: '🦵' },
    { id: 'Eye Strain & Mental Fatigue', label: 'Eye Strain & Brain Fog', icon: '👁️' },
  ];

  const durationOptions = [3, 5, 8, 12, 15];

  const togglePainArea = (areaId: string) => {
    setSelectedPainAreas(prev => 
      prev.includes(areaId)
        ? prev.filter(a => a !== areaId)
        : [...prev, areaId]
    );
  };

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    if (level <= 6) return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
    if (level <= 8) return 'text-orange-400 bg-orange-950/60 border-orange-500/40';
    return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
  };

  const getPainLevelLabel = (level: number) => {
    if (level <= 2) return 'Mild Postural Fatigue';
    if (level <= 4) return 'Noticeable Stiffness & Tightness';
    if (level <= 6) return 'Moderate Aching & Compression';
    if (level <= 8) return 'Severe Muscle Knot & Nerve Impingement';
    return 'Acute Spasm / Road Rigidity';
  };

  // AI Routine Synthesis
  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setHasAppended(false);

    setGenerationStep('Analyzing vehicle postural geometry...');
    const stepTimer1 = setTimeout(() => {
      setGenerationStep('Calculating spinal disc decompression ratios...');
    }, 600);
    const stepTimer2 = setTimeout(() => {
      setGenerationStep('Synthesizing Olympic coach biomechanical cues...');
    }, 1300);

    try {
      const response = await fetch('/api/coach/generate-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle,
          durationMinutes: availableMinutes,
          painLevel,
          painFocus: selectedPainAreas.length > 0 ? selectedPainAreas.join(', ') : 'Lower Back & Neck',
          locationType,
          environmentNotes: `Goal: ${goal}, Pain: ${painLevel}/10`,
          experienceLevel: 'All Levels'
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        throw new Error(`Generation failed with code ${response.status}`);
      }

      const data: Routine = await response.json();
      
      const enrichedRoutine: Routine = {
        ...data,
        id: data.id || `smart-routine-${Date.now()}`,
        vehicle: vehicle,
        category: vehicle === 'two-wheeler' ? 'two-wheeler' : 'car',
        durationMinutes: availableMinutes,
        bannerGradient: painLevel >= 7 
          ? 'from-rose-500 to-amber-600' 
          : painLevel >= 4 
            ? 'from-cyan-500 to-blue-600' 
            : 'from-emerald-500 to-teal-600',
        targetAreas: selectedPainAreas.length > 0 ? selectedPainAreas : data.targetAreas || ['Spine', 'Hips'],
        isFavorite: false
      };

      // Load synthesized routine into the active builder
      setRoutineTitle(enrichedRoutine.title);
      setRoutineSubtitle(enrichedRoutine.subtitle);
      setRoutineExercises(enrichedRoutine.exercises || []);
      setSelectedPreviewExercise(enrichedRoutine.exercises?.[0] || null);
      setActiveTab('builder');

      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.65 }
      });
    } catch (err: any) {
      console.error('Smart Routine Creator error:', err);
      // Fallback to local synthesis from library
      const fallbackExercises = ALL_EXERCISES.slice(0, Math.min(5, Math.max(3, Math.floor(availableMinutes * 0.7))));
      setRoutineTitle(`Synthesized ${vehicle.toUpperCase()} Relief (${availableMinutes} Min)`);
      setRoutineSubtitle(`Targeted focus on ${selectedPainAreas.slice(0, 2).join(' & ')}`);
      setRoutineExercises(fallbackExercises);
      setSelectedPreviewExercise(fallbackExercises[0]);
      setActiveTab('builder');
      setErrorMsg('Connected using local biomechanical library.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Helper: Build the complete Routine object
  const buildCurrentRoutine = (): Routine => {
    return {
      id: `custom-routine-${Date.now()}`,
      title: routineTitle || 'Custom Mobility Sequence',
      subtitle: routineSubtitle || 'Tailored stretch protocol',
      category: vehicle === 'two-wheeler' ? 'two-wheeler' : 'car',
      vehicle: vehicle,
      durationMinutes: estimatedMinutes,
      intensity: calculatedIntensity,
      exercises: routineExercises,
      coachRationale: `Custom user sequence comprising ${routineExercises.length} targeted biomechanical drills. Total cumulative stretch duration: ${durationFormatted}.`,
      targetAreas: Array.from(new Set(routineExercises.flatMap(e => e.targetMuscles || []))).slice(0, 4),
      bannerGradient: 'from-cyan-500 via-sky-500 to-blue-600',
      isFavorite: isFavorite
    };
  };

  // Save / Append to Protocols
  const handleSaveRoutine = (autoStart: boolean = false) => {
    if (routineExercises.length === 0) return;
    const routine = buildCurrentRoutine();
    setHasAppended(true);
    onRoutineCreated(routine, autoStart);
    
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // 1-Click 'Save as Quick Favorite'
  const handleToggleQuickFavorite = () => {
    if (routineExercises.length === 0) return;
    const nextFav = !isFavorite;
    setIsFavorite(nextFav);

    const routine = buildCurrentRoutine();
    routine.isFavorite = nextFav;
    onRoutineCreated(routine, false);

    // Save to quick favorites in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('stretchway_quick_favorites') || '[]');
      const updated = nextFav 
        ? [routine.id, ...existing.filter((id: string) => id !== routine.id)]
        : existing.filter((id: string) => id !== routine.id);
      localStorage.setItem('stretchway_quick_favorites', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (nextFav) {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.65 }
      });
      setShareFeedback('Saved as Quick Favorite!');
      setTimeout(() => setShareFeedback(null), 3000);
    } else {
      setShareFeedback('Removed from Quick Favorites');
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  // 'Clear All' button action
  const handleClearAll = () => {
    setRoutineExercises([]);
    setSelectedPreviewExercise(null);
    setHasAppended(false);
  };

  // Drag-and-drop reorder handlers
  const handleDragStart = (index: number) => {
    setDraggedIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    setDragOverIdx(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIdx === null || draggedIdx === dropIndex) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    setRoutineExercises(prev => {
      const next = [...prev];
      const [moved] = next.splice(draggedIdx, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });

    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleMoveExercise = (fromIdx: number, direction: 'up' | 'down') => {
    const toIdx = direction === 'up' ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= routineExercises.length) return;

    setRoutineExercises(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const handleRemoveExercise = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const removedEx = routineExercises[index];
    setRoutineExercises(prev => prev.filter((_, i) => i !== index));
    if (selectedPreviewExercise?.id === removedEx.id) {
      setSelectedPreviewExercise(routineExercises.find((_, i) => i !== index) || null);
    }
  };

  const handleAddExerciseToRoutine = (ex: Exercise) => {
    // Avoid duplicate id in same routine by appending timestamp if already exists
    const uniqueEx: Exercise = routineExercises.some(e => e.id === ex.id)
      ? { ...ex, id: `${ex.id}-${Date.now().toString().slice(-4)}` }
      : { ...ex };

    setRoutineExercises(prev => [...prev, uniqueEx]);
    setSelectedPreviewExercise(uniqueEx);
    setIsLibraryOpen(false);
  };

  // 'Share Routine' deep link & summary generation
  const handleShareRoutine = () => {
    if (routineExercises.length === 0) return;
    const routine = buildCurrentRoutine();
    const shareUrl = `${window.location.origin}${window.location.pathname}?routine=${encodeURIComponent(routine.id)}`;
    
    const summaryText = `🚗 StretchWay Custom Routine: "${routine.title}"\n` +
      `⏱️ Total Duration: ${durationFormatted} (${routine.exercises.length} Drills)\n` +
      `🎯 Difficulty: ${routine.intensity} | Vehicle: ${routine.vehicle}\n` +
      `📋 Exercises:\n` +
      routine.exercises.map((e, idx) => `  ${idx + 1}. ${e.name} (${e.durationSeconds}s) [${e.intensity}]`).join('\n') +
      `\n\nTry this routine on StretchWay: ${shareUrl}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText)
        .then(() => {
          setShareFeedback('Routine summary & link copied to clipboard!');
          setShowShareModal(true);
          setTimeout(() => setShareFeedback(null), 4000);
        })
        .catch(() => {
          setShowShareModal(true);
        });
    } else {
      setShowShareModal(true);
    }
  };

  // 'Duplicate' action handler for custom routine cards
  const handleDuplicate = (routine: Routine, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onDuplicateRoutine) {
      onDuplicateRoutine(routine, e);
    } else {
      const duplicated: Routine = {
        ...routine,
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: `${routine.title} (Copy)`,
        subtitle: routine.subtitle || 'Cloned custom routine',
        isFavorite: false,
        exercises: [...routine.exercises]
      };
      onRoutineCreated(duplicated, false);
    }

    // Also load into builder so user can instantly tweak
    setRoutineTitle(`${routine.title} (Copy)`);
    setRoutineSubtitle(routine.subtitle || 'Cloned sequence');
    setRoutineExercises([...routine.exercises]);
    setSelectedPreviewExercise(routine.exercises[0] || null);
    setActiveTab('builder');

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 }
    });

    setShareFeedback(`Duplicated "${routine.title}"! Loaded into creator.`);
    setTimeout(() => setShareFeedback(null), 3500);
  };

  // Filtered exercises for the library drawer
  const filteredLibraryExercises = useMemo(() => {
    return ALL_EXERCISES.filter(ex => {
      const matchesSearch = librarySearch.trim() === '' || 
        ex.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
        ex.targetMuscles.some(m => m.toLowerCase().includes(librarySearch.toLowerCase()));
      
      const matchesCategory = libraryFilterCategory === 'all' || ex.category === libraryFilterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [librarySearch, libraryFilterCategory]);

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all">
      
      {/* Decorative Background Glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-teal-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar & Mode Navigation */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        
        {/* Left: Branding & Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                Interactive Studio
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                ⚡ Real-Time Protocol Engineering
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
              Smart Routine Creator
            </h2>
          </div>
        </div>

        {/* Center/Right: Top Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'builder'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Routine Builder</span>
            {routineExercises.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/40 text-slate-950 font-black">
                {routineExercises.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai_synthesizer')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ai_synthesizer'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Synthesizer</span>
          </button>

          {customRoutines.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('saved_routines')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'saved_routines'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Custom Cards</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {customRoutines.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Action Feedback Toast */}
      {shareFeedback && (
        <div className="relative z-20 mt-4 p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{shareFeedback}</span>
          </div>
          <button 
            onClick={() => setShareFeedback(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: ROUTINE BUILDER & DYNAMIC PREVIEW GRID                              */}
      {/* ========================================================================= */}
      {activeTab === 'builder' && (
        <div className="relative z-10 mt-6 space-y-6">
          
          {/* Top Control Bar: Title Editing + Real-Time Total Duration Counter + Quick Actions */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Routine Title & Subtitle Input */}
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={routineTitle}
                onChange={(e) => setRoutineTitle(e.target.value)}
                placeholder="Enter Routine Title..."
                className="w-full bg-transparent text-white font-extrabold text-base sm:text-lg border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none transition-colors"
              />
              <input
                type="text"
                value={routineSubtitle}
                onChange={(e) => setRoutineSubtitle(e.target.value)}
                placeholder="Routine description or objective..."
                className="w-full bg-transparent text-xs text-slate-400 border-b border-transparent hover:border-slate-700 focus:border-cyan-500/60 focus:outline-none transition-colors"
              />
            </div>

            {/* Right Side: Real-time 'Total Duration' Estimate Counter & Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* REAL-TIME TOTAL DURATION ESTIMATE COUNTER */}
              <div 
                id="realtime-total-duration-counter"
                title="Real-time estimate updates as you add or remove exercises"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-md shadow-cyan-500/10 text-cyan-300"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <Clock className="w-4 h-4 text-cyan-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-mono font-black tracking-wider text-slate-400 leading-none">
                    Total Duration
                  </span>
                  <span className="text-sm font-black font-mono text-white leading-tight">
                    {durationFormatted}
                    <span className="text-[10px] text-cyan-400/80 font-normal ml-1">
                      ({totalSeconds}s)
                    </span>
                  </span>
                </div>
              </div>

              {/* SAVE AS QUICK FAVORITE BUTTON */}
              <button
                type="button"
                onClick={handleToggleQuickFavorite}
                disabled={routineExercises.length === 0}
                title={isFavorite ? "Favorited! Click to toggle" : "Save as Quick Favorite with a single click"}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/15 font-black'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-amber-500/40'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">
                  {isFavorite ? 'Saved Favorite' : 'Save as Quick Favorite'}
                </span>
                <span className="sm:hidden">Favorite</span>
              </button>

              {/* SHARE ROUTINE BUTTON */}
              <button
                type="button"
                onClick={handleShareRoutine}
                disabled={routineExercises.length === 0}
                title="Share routine summary or deep-link"
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Share Routine</span>
                <span className="sm:hidden">Share</span>
              </button>

              {/* CLEAR ALL BUTTON */}
              <button
                type="button"
                onClick={handleClearAll}
                disabled={routineExercises.length === 0}
                title="Remove all exercises and reset builder"
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Builder Workspace Layout: Dynamic Preview Grid & Selected 3D Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column (lg: 8 cols): Dynamic Preview Grid with Drag-and-Drop */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Selected Exercise Sequence</span>
                    <span className="text-xs font-mono font-normal text-slate-400">
                      ({routineExercises.length} Drills)
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Drag items to reorder sequence • Intensity badges indicate drill difficulty
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLibraryOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add Exercise</span>
                </button>
              </div>

              {/* DYNAMIC PREVIEW GRID OF EXERCISE THUMBNAILS */}
              {routineExercises.length === 0 ? (
                /* Empty State when 'Clear All' is clicked */
                <div className="p-8 rounded-2xl bg-slate-950/60 border-2 border-dashed border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-300">Routine is currently empty</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Add exercises from the biomechanical library or synthesize a targeted recovery flow using AI.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsLibraryOpen(true)}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 hover:bg-cyan-400 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Browse Exercise Library</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ai_synthesizer')}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-cyan-300 border border-cyan-500/40 text-xs font-extrabold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Synthesize Protocol</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {routineExercises.map((ex, index) => {
                    const isSelected = selectedPreviewExercise?.id === ex.id;
                    const isBeingDragged = draggedIdx === index;
                    const isDropTarget = dragOverIdx === index;
                    const intensityBadge = getIntensityBadge(ex.intensity);

                    return (
                      <div
                        key={ex.id || index}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        onClick={() => setSelectedPreviewExercise(ex)}
                        className={`p-3 rounded-2xl border transition-all relative group cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-900/90 border-cyan-500 shadow-lg shadow-cyan-500/10'
                            : 'bg-slate-950/70 hover:bg-slate-900/70 border-slate-800/90 hover:border-slate-700'
                        } ${isBeingDragged ? 'opacity-40 border-dashed border-cyan-400' : ''} ${
                          isDropTarget ? 'border-t-4 border-cyan-400 bg-cyan-950/30' : ''
                        }`}
                      >
                        <div>
                          {/* Top Thumbnail Header: Drag Handle, Sequence Number, Intensity Badge, Remove */}
                          <div className="flex items-center justify-between gap-1.5 mb-2">
                            
                            <div className="flex items-center gap-1.5">
                              {/* Drag-and-Drop Handle */}
                              <div 
                                title="Drag to reorder" 
                                className="p-1 rounded text-slate-500 hover:text-cyan-300 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="w-3.5 h-3.5" />
                              </div>

                              {/* Sequence Badge */}
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-black ${
                                isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                              }`}>
                                #{index + 1}
                              </span>
                            </div>

                            {/* SMALL INTENSITY BADGE (Low, Medium, High) */}
                            <div className="flex items-center gap-1.5">
                              <span 
                                title={`Exercise intensity: ${ex.intensity || intensityBadge.label}`}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${intensityBadge.bgClass}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${intensityBadge.dotClass}`} />
                                <span>{intensityBadge.label}</span>
                              </span>

                              {/* Remove Exercise Button */}
                              <button
                                type="button"
                                onClick={(e) => handleRemoveExercise(index, e)}
                                title="Remove drill from routine"
                                className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Thumbnail Visual / Icon Area */}
                          <div className="flex items-start gap-3 mt-1">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border border-slate-800 flex items-center justify-center text-xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                              {ex.category === 'car' ? '🚗' : ex.category === 'two-wheeler' ? '🏍️' : ex.category === 'spinal' ? '🦴' : ex.category === 'yoga' ? '🧘' : '⚡'}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className={`text-xs font-black leading-snug truncate ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                                {ex.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  {ex.durationSeconds}s
                                </span>
                                <span className="text-[10px] text-slate-500">•</span>
                                <span className="text-[10px] text-slate-400 truncate">
                                  {ex.location}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                {ex.targetMuscles?.slice(0, 2).join(', ') || ex.reps}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Mini Control: Accessible Up/Down Reordering Buttons */}
                        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-900 text-[10px] text-slate-500">
                          <span className="font-mono">
                            {isSelected ? '👀 Viewing 3D Preview' : 'Click to preview'}
                          </span>

                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveExercise(index, 'up')}
                              title="Move earlier in routine"
                              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={index === routineExercises.length - 1}
                              onClick={() => handleMoveExercise(index, 'down')}
                              title="Move later in routine"
                              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action Buttons: Save & Add to Protocols / Start Session */}
              {routineExercises.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleSaveRoutine(true)}
                    className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Start This Session Now ({durationFormatted})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveRoutine(false)}
                    disabled={hasAppended}
                    className={`py-3.5 px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      hasAppended
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700 hover:border-cyan-500/50'
                    }`}
                  >
                    {hasAppended ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Saved to Protocols!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-cyan-400" />
                        <span>Save to Protocols</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>

            {/* Right Column (lg: 4 cols): 3D Animation Preview Stage & Exercise Details */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>3D Motion Demonstration</span>
                  </span>
                  {selectedPreviewExercise && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                      {selectedPreviewExercise.durationSeconds}s
                    </span>
                  )}
                </div>

                {selectedPreviewExercise ? (
                  <div className="space-y-3">
                    <div className="h-56 rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-inner">
                      <ExerciseCharacterVisual
                        exercise={selectedPreviewExercise}
                        variant="card"
                        isPlaying={true}
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-white">
                        {selectedPreviewExercise.name}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900 border border-slate-800 text-cyan-300">
                          🎯 {selectedPreviewExercise.targetMuscles.slice(0, 2).join(', ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                          📍 {selectedPreviewExercise.location}
                        </span>
                      </div>
                      {selectedPreviewExercise.formCues && (
                        <p className="text-[11px] text-slate-400 mt-2 italic bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                          💡 {selectedPreviewExercise.formCues}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-56 rounded-2xl border border-slate-800/80 bg-slate-900/40 flex flex-col items-center justify-center p-4 text-center text-slate-500 text-xs">
                    <Layers className="w-8 h-8 mb-2 opacity-50" />
                    <span>Select an exercise in the preview grid to inspect its 3D biomechanical kinematics</span>
                  </div>
                )}
              </div>

              {/* Protocol Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span>Drill Count:</span>
                  <span className="font-bold text-white">{routineExercises.length} Exercises</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span>Total Duration:</span>
                  <span className="font-bold text-cyan-300">{durationFormatted}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span>Overall Intensity:</span>
                  <span className="font-bold text-amber-300">{calculatedIntensity}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span>Quick Favorite:</span>
                  <span className={`font-bold ${isFavorite ? 'text-amber-400' : 'text-slate-500'}`}>
                    {isFavorite ? '★ Yes' : '☆ No'}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AI SYNTHESIZER (Pain Inputs & Algorithmic Prescriptions)             */}
      {/* ========================================================================= */}
      {activeTab === 'ai_synthesizer' && (
        <div className="relative z-10 mt-6 space-y-5 animate-fade-in">
          
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span>1. Current Pain & Tightness Severity</span>
              </label>
              <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${getPainLevelColor(painLevel)}`}>
                Level {painLevel} / 10 • {getPainLevelLabel(painLevel)}
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
                <span>1 (Mild Fatigue)</span>
                <span>5 (Moderate Aching)</span>
                <span>8 (Severe Knot)</span>
                <span>10 (Acute Spasm)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>2. Specific Tension / Pain Areas</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedPainAreas.length} selected
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {painAreasList.map((area) => {
                const isSelected = selectedPainAreas.includes(area.id);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => togglePainArea(area.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs font-medium flex items-center gap-2 ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-200 shadow-sm'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm">{area.icon}</span>
                    <span className="line-clamp-2 leading-tight text-[11px]">{area.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>3. Target Routine Time</span>
              </label>

              <div className="flex flex-wrap gap-1.5">
                {durationOptions.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setAvailableMinutes(mins)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex-1 min-w-[50px] text-center border ${
                      availableMinutes === mins
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 font-black'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-cyan-400" />
                <span>4. Vehicle Cockpit</span>
              </label>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'car', label: 'Car / SUV', icon: Car },
                  { id: 'two-wheeler', label: 'Motorcycle', icon: Bike },
                  { id: 'truck', label: 'Semi / Truck', icon: Truck },
                  { id: 'commuter', label: 'Transit / Van', icon: Bus },
                ].map((v) => {
                  const Icon = v.icon;
                  const isSelected = vehicle === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicle(v.id as any)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{v.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-slate-950" />
                  <span>Synthesizing Personalized Routine...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
                  <span>Synthesize & Load into Routine Builder</span>
                </>
              )}
            </button>

            {isGenerating && generationStep && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-center animate-fade-in">
                <span className="text-xs font-mono text-cyan-300 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  {generationStep}
                </span>
              </div>
            )}

            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CUSTOM ROUTINE CARDS WITH 'DUPLICATE' ACTION BUTTON                 */}
      {/* ========================================================================= */}
      {activeTab === 'saved_routines' && (
        <div className="relative z-10 mt-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              <span>Your Custom Routines ({customRoutines.length})</span>
            </h3>
            <span className="text-xs text-slate-400">
              Click 'Duplicate' to clone & customize any protocol
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customRoutines.map((routine) => (
              <div
                key={routine.id}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group relative overflow-hidden shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-[10px] font-extrabold uppercase font-mono">
                      {routine.vehicle}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{routine.durationMinutes}m</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {routine.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {routine.subtitle}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {routine.exercises.slice(0, 3).map((e, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-400">
                        {e.name}
                      </span>
                    ))}
                    {routine.exercises.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-500">
                        +{routine.exercises.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Custom Routine Card Action Buttons including 'Duplicate' */}
                <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* DUPLICATE BUTTON */}
                    <button
                      type="button"
                      onClick={(e) => handleDuplicate(routine, e)}
                      title="Duplicate this routine"
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicate</span>
                    </button>

                    {/* EDIT IN BUILDER */}
                    <button
                      type="button"
                      onClick={() => {
                        setRoutineTitle(routine.title);
                        setRoutineSubtitle(routine.subtitle || '');
                        setRoutineExercises([...routine.exercises]);
                        setSelectedPreviewExercise(routine.exercises[0] || null);
                        setActiveTab('builder');
                      }}
                      title="Load into Routine Builder"
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-colors"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* START SESSION */}
                    <button
                      type="button"
                      onClick={() => onStartRoutine ? onStartRoutine(routine) : onRoutineCreated(routine, true)}
                      title="Start Session"
                      className="p-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-transform active:scale-95 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                    </button>

                    {/* DELETE */}
                    {onDeleteRoutine && (
                      <button
                        type="button"
                        onClick={(e) => onDeleteRoutine(routine.id, e)}
                        title="Delete custom routine"
                        className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/70 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXERCISE LIBRARY DRAWER / MODAL (FOR ADDING EXERCISES)                    */}
      {/* ========================================================================= */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">
                  Add Exercise to Custom Routine
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search and Category Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="Search by exercise name or muscle..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={libraryFilterCategory}
                onChange={(e) => setLibraryFilterCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Categories</option>
                <option value="car">Car In-Seat</option>
                <option value="two-wheeler">Motorcycle</option>
                <option value="spinal">Spinal Decompression</option>
                <option value="quick">Quick Pitstop</option>
                <option value="yoga">Ergonomic Yoga</option>
              </select>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredLibraryExercises.map((ex) => {
                const badge = getIntensityBadge(ex.intensity);
                return (
                  <div
                    key={ex.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white truncate">{ex.name}</h4>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${badge.bgClass}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        <span className="text-cyan-400 font-mono">⏱️ {ex.durationSeconds}s</span>
                        <span>• {ex.location}</span>
                        <span>• {ex.targetMuscles.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddExerciseToRoutine(ex)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1 shrink-0 transition-transform active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SHARE ROUTINE MODAL / SUMMARY VIEW                                        */}
      {/* ========================================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">Share Custom Routine</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5 leading-relaxed select-all">
              <div className="font-bold text-cyan-300">🚗 {routineTitle}</div>
              <div className="text-slate-400">⏱️ Duration: {durationFormatted} • {routineExercises.length} Drills</div>
              <div className="text-slate-400">⚡ Intensity: {calculatedIntensity}</div>
              <div className="text-slate-500 text-[11px] pt-1">
                Sequence: {routineExercises.map(e => e.name).join(' → ')}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const shareUrl = `${window.location.origin}${window.location.pathname}?routine=${encodeURIComponent(buildCurrentRoutine().id)}`;
                  navigator.clipboard.writeText(shareUrl);
                  setShareFeedback('Link copied to clipboard!');
                  setShowShareModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-colors text-center"
              >
                Copy Shareable Link
              </button>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
