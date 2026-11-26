import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wind,
  Compass,
  Navigation,
  Activity,
  Search,
  Play,
  Flame,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Clock,
  BookOpen,
  Trash2,
  Copy,
  ShoppingBag,
  StickyNote,
  Printer,
  Gauge
} from 'lucide-react';
import {
  VehicleType,
  MuscleGroup,
  Exercise,
  Routine,
  UserProgress,
  AccentColorTheme,
  UserAssessmentProfile,
  CoachId,
  GearProduct,
  RecoveryOrder,
  CartItem
} from './types';
import { ALL_EXERCISES, CURATED_ROUTINES } from './data/exercises';
import { INITIAL_GEAR_PRODUCTS, buildInitialOrders } from './data/gearProducts';
import { SupportedLang } from './data/translations';
import { THEME_CONFIGS } from './data/themes';
import { Navbar } from './components/Navbar';
import { HeroWall } from './components/HeroWall';
import { OnboardingModal } from './components/OnboardingModal';
import { BottomNav, AppTabType } from './components/BottomNav';
import { ExerciseCard } from './components/ExerciseCard';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { SmartRoutineCreator, computeRecoveryImpact } from './components/SmartRoutineCreator';
import { DailyGoalModal } from './components/DailyGoalModal';
import { UserSettingsModal } from './components/UserSettingsModal';
import { SundaySummaryModal } from './components/SundaySummaryModal';
import { VoiceCommandAssistant } from './components/VoiceCommandAssistant';
import { StretchNotificationSystem } from './components/StretchNotificationSystem';
import { PrintableRoutineSheet } from './components/PrintableRoutineSheet';
import { triggerHaptic } from './utils/haptics';
import { decodeSharedRoutineFromUrl } from './utils/sharePdf';
import {
  ensureAuthenticatedUser,
  syncUserProgressToFirestore,
  fetchUserProgressFromFirestore,
  syncAssessmentProfileToFirestore,
  fetchAssessmentProfileFromFirestore,
  syncCustomRoutinesToFirestore,
  fetchCustomRoutinesFromFirestore,
  recordCompletedSessionToFirestore,
  syncOrderToFirestore,
  fetchOrdersFromFirestore,
  syncGearStockToFirestore,
  signInWithGoogle,
  signOutUser,
  subscribeToAuthChanges,
  testConnection
} from './services/firebase';

// Code splitting for secondary tabs and heavy overlays
const InteractivePlayer = lazy(() =>
  import('./components/InteractivePlayer').then((m) => ({ default: m.InteractivePlayer }))
);
const BodyMap = lazy(() => import('./components/BodyMap').then((m) => ({ default: m.BodyMap })));
const BreathEngine = lazy(() =>
  import('./components/BreathEngine').then((m) => ({ default: m.BreathEngine }))
);
const ErgonomicCockpitGuide = lazy(() =>
  import('./components/ErgonomicCockpitGuide').then((m) => ({ default: m.ErgonomicCockpitGuide }))
);
const TripPlanner = lazy(() =>
  import('./components/TripPlanner').then((m) => ({ default: m.TripPlanner }))
);
const RoadLog = lazy(() => import('./components/RoadLog').then((m) => ({ default: m.RoadLog })));
const RecoveryStore = lazy(() =>
  import('./components/RecoveryStore').then((m) => ({ default: m.RecoveryStore }))
);
const AICoachModal = lazy(() =>
  import('./components/AICoachModal').then((m) => ({ default: m.AICoachModal }))
);
const RedLightQuickMode = lazy(() =>
  import('./components/RedLightQuickMode').then((m) => ({ default: m.RedLightQuickMode }))
);

const LazyFallback: React.FC = () => (
  <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-3 text-xs font-mono text-cyan-400">
    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
    <span>Loading Bio-Mobility Module...</span>
  </div>
);

export const App: React.FC = () => {
  // Navigation & filtering state
  const [activeTab, setActiveTab] = useState<AppTabType>('routines');
  const [roadLogSubTab, setRoadLogSubTab] = useState<
    'analytics' | 'achievements' | 'flair' | 'efficiency' | 'orders' | undefined
  >(undefined);
  const [currentVehicle, setCurrentVehicle] = useState<VehicleType>('all');
  const [currentLang, setCurrentLang] = useState<SupportedLang>('en');

  // Firebase authenticated user
  const [authUser, setAuthUser] = useState<{
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null>(null);

  // Theme state with OS System Preference & manual override support
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const manualOverride = localStorage.getItem('stretchway_theme_override');
    if (manualOverride === 'light' || manualOverride === 'dark') {
      return manualOverride;
    }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  const [accentTheme, setAccentTheme] = useState<AccentColorTheme>(() => {
    const savedAccent = localStorage.getItem('stretchway_accent_theme');
    if (savedAccent && savedAccent in THEME_CONFIGS) {
      return savedAccent as AccentColorTheme;
    }
    return 'ocean';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<MuscleGroup | 'all'>('all');

  // Custom AI & User Routines State
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

  // Ergonomic Store Inventory & Order History State
  const [products, setProducts] = useState<GearProduct[]>(() => {
    const saved = localStorage.getItem('stretchway_gear_stock');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved stock:', e);
      }
    }
    return INITIAL_GEAR_PRODUCTS;
  });

  const [orders, setOrders] = useState<RecoveryOrder[]>(() => {
    const saved = localStorage.getItem('stretchway_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved orders:', e);
      }
    }
    return buildInitialOrders();
  });

  // Active workout player, red-light mode & modals
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [isRedLightOpen, setIsRedLightOpen] = useState(false);
  const [printableRoutine, setPrintableRoutine] = useState<Routine | null>(null);
  const [sharedBannerMessage, setSharedBannerMessage] = useState<string | null>(null);
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

  // User Settings: Haptics, Pulse Countdown, Selected Animated Coach
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('stretchway_haptics_enabled') !== 'false';
  });
  const [pulseCountdownEnabled, setPulseCountdownEnabled] = useState<boolean>(() => {
    return localStorage.getItem('stretchway_pulse_countdown') !== 'false';
  });
  const [selectedCoachId, setSelectedCoachId] = useState<CoachId>(() => {
    return (localStorage.getItem('stretchway_selected_coach') as CoachId) || 'olympic';
  });

  const handleToggleHaptics = (val: boolean) => {
    setHapticsEnabled(val);
    localStorage.setItem('stretchway_haptics_enabled', String(val));
    if (val) triggerHaptic('light');
  };

  const handleTogglePulseCountdown = (val: boolean) => {
    setPulseCountdownEnabled(val);
    localStorage.setItem('stretchway_pulse_countdown', String(val));
  };

  const handleSelectCoach = (id: CoachId) => {
    setSelectedCoachId(id);
    localStorage.setItem('stretchway_selected_coach', id);
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

  // Persist stock & orders locally
  useEffect(() => {
    localStorage.setItem('stretchway_gear_stock', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('stretchway_orders', JSON.stringify(orders));
  }, [orders]);

  // Hydrate Shared Routine Deep Link (?sharedRoutine=... or ?routine=...) on first load
  useEffect(() => {
    const combinedPool = [...customRoutines, ...CURATED_ROUTINES];
    const shared = decodeSharedRoutineFromUrl(ALL_EXERCISES, combinedPool);
    if (shared) {
      const exists = combinedPool.some((r) => r.id === shared.id);
      if (!exists) {
        setCustomRoutines((prev) => {
          const updated = [shared, ...prev.filter((r) => r.id !== shared.id)];
          localStorage.setItem('stretchway_custom_routines', JSON.stringify(updated));
          return updated;
        });
      }
      setSharedBannerMessage(`Loaded shared routine "${shared.title}" (${shared.exercises.length} drills)`);
      setActiveRoutine(shared);
    }
  }, []);

  // Auth subscription & Firestore startup sync
  useEffect(() => {
    const unsub = subscribeToAuthChanges(async (user) => {
      if (user) {
        setAuthUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });
        await testConnection();

        const cloudData = await fetchUserProgressFromFirestore(user.uid);
        if (cloudData && cloudData.totalMinutesStretched !== undefined) {
          setUserProgress((prev) => ({
            ...prev,
            currentStreakDays: cloudData.currentStreakDays ?? prev.currentStreakDays,
            totalMinutesStretched: Math.max(cloudData.totalMinutesStretched ?? 0, prev.totalMinutesStretched),
            favoriteExerciseIds: cloudData.favoriteExerciseIds ?? prev.favoriteExerciseIds
          }));
        }

        const cloudProfile = await fetchAssessmentProfileFromFirestore(user.uid);
        if (cloudProfile && cloudProfile.primaryIssue) {
          setAssessmentProfile(cloudProfile);
          localStorage.setItem('stretchway_assessment_profile', JSON.stringify(cloudProfile));
        }

        const cloudCustomRoutines = await fetchCustomRoutinesFromFirestore(user.uid);
        if (cloudCustomRoutines && Array.isArray(cloudCustomRoutines) && cloudCustomRoutines.length > 0) {
          const hydrated: Routine[] = cloudCustomRoutines.map((raw: any) => {
            const matchedExercises = (raw.exerciseIds || [])
              .map((eid: string) => ALL_EXERCISES.find((ex) => ex.id === eid))
              .filter(Boolean) as Exercise[];
            return {
              id: raw.id || `custom-${Date.now()}`,
              title: raw.title || 'Synced Routine',
              subtitle: raw.subtitle || 'Synced from cloud',
              notes: raw.notes,
              category: raw.vehicle === 'two-wheeler' ? 'two-wheeler' : 'car',
              vehicle: raw.vehicle || 'car',
              durationMinutes: raw.durationMinutes || 5,
              intensity: raw.intensity || 'Moderate',
              targetAreas: Array.from(new Set(matchedExercises.flatMap((e) => e.targetMuscles))).slice(0, 4),
              coachRationale: 'Synced custom routine from your cloud driver profile.',
              exercises: matchedExercises.length > 0 ? matchedExercises : ALL_EXERCISES.slice(0, 3)
            };
          });
          setCustomRoutines((prev) => {
            const existingIds = new Set(prev.map((r) => r.id));
            const newItems = hydrated.filter((r) => !existingIds.has(r.id));
            const merged = [...prev, ...newItems];
            localStorage.setItem('stretchway_custom_routines', JSON.stringify(merged));
            return merged;
          });
        }

        const cloudOrders = await fetchOrdersFromFirestore(user.uid);
        if (cloudOrders && cloudOrders.length > 0) {
          setOrders((prev) => {
            const existingIds = new Set(prev.map((o) => o.id));
            const merged = [...prev];
            cloudOrders.forEach((co: any) => {
              const id = co.orderId || co.id;
              if (id && !existingIds.has(id)) {
                merged.push({ ...co, id });
              }
            });
            return merged;
          });
        }
      } else {
        setAuthUser(null);
      }
    });
    return () => unsub();
  }, []);

  // Save & sync progress
  useEffect(() => {
    localStorage.setItem('stretchway_progress', JSON.stringify(userProgress));
    ensureAuthenticatedUser().then((user) => {
      if (user) {
        syncUserProgressToFirestore(user.uid, userProgress);
      }
    });
  }, [userProgress]);

  const handleSaveAssessment = (profile: UserAssessmentProfile) => {
    setAssessmentProfile(profile);
    localStorage.setItem('stretchway_assessment_profile', JSON.stringify(profile));
    if (profile.vehicle) {
      setCurrentVehicle(profile.vehicle);
    }
    ensureAuthenticatedUser().then((user) => {
      if (user) {
        syncAssessmentProfileToFirestore(user.uid, profile);
      }
    });
  };

  const handleRoutineCreated = (newRoutine: Routine, autoStart: boolean = false) => {
    setCustomRoutines((prev) => {
      const updated = [newRoutine, ...prev.filter((r) => r.id !== newRoutine.id)];
      localStorage.setItem('stretchway_custom_routines', JSON.stringify(updated));
      ensureAuthenticatedUser().then((user) => {
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

  const handleUpdateCustomRoutineNotes = (routineId: string, notes: string) => {
    setCustomRoutines((prev) => {
      const updated = prev.map((r) => (r.id === routineId ? { ...r, notes } : r));
      localStorage.setItem('stretchway_custom_routines', JSON.stringify(updated));
      ensureAuthenticatedUser().then((user) => {
        if (user) {
          syncCustomRoutinesToFirestore(user.uid, updated);
        }
      });
      return updated;
    });
  };

  const handleDeleteCustomRoutine = (routineId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('warning');
    setCustomRoutines((prev) => {
      const updated = prev.filter((r) => r.id !== routineId);
      localStorage.setItem('stretchway_custom_routines', JSON.stringify(updated));
      ensureAuthenticatedUser().then((user) => {
        if (user) {
          syncCustomRoutinesToFirestore(user.uid, updated);
        }
      });
      return updated;
    });
  };

  const handleDuplicateCustomRoutine = (routine: Routine, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('medium');
    const duplicated: Routine = {
      ...routine,
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: `${routine.title} (Copy)`,
      subtitle: routine.subtitle || 'Cloned custom sequence',
      notes: routine.notes,
      isFavorite: false,
      exercises: [...routine.exercises]
    };
    handleRoutineCreated(duplicated, false);
  };

  const handlePrintRoutinePdf = (routine: Routine) => {
    triggerHaptic('light');
    setPrintableRoutine(routine);
    setTimeout(() => {
      window.print();
    }, 120);
  };

  const handleToggleFavoriteExercise = (exerciseId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('medium');
    setUserProgress((prev) => {
      const currentFavs = prev.favoriteExerciseIds || [];
      const exists = currentFavs.includes(exerciseId);
      return {
        ...prev,
        favoriteExerciseIds: exists
          ? currentFavs.filter((id) => id !== exerciseId)
          : [...currentFavs, exerciseId]
      };
    });
  };

  // Ergonomic Store Stock & Checkout Handlers
  const handlePlaceOrder = (cartItems: CartItem[]): RecoveryOrder | null => {
    if (cartItems.length === 0) return null;

    // Validate stock levels
    for (const item of cartItems) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod || prod.stock < item.quantity) {
        return null;
      }
    }

    const now = new Date();
    const orderDate = now.toISOString().split('T')[0];
    const monthKey = orderDate.slice(0, 7);

    const orderItems = cartItems.map((item) => {
      const prod = products.find((p) => p.id === item.productId)!;
      return {
        productId: prod.id,
        name: prod.name,
        quantity: item.quantity,
        unitPrice: prod.price
      };
    });

    const total = Number(
      orderItems.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0).toFixed(2)
    );

    const newOrder: RecoveryOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      orderDate,
      monthKey,
      items: orderItems,
      total,
      status: 'Confirmed'
    };

    // Atomically decrement product stock
    setProducts((prev) => {
      const updated = prev.map((prod) => {
        const cartMatch = cartItems.find((c) => c.productId === prod.id);
        if (!cartMatch) return prod;
        const nextProd = { ...prod, stock: Math.max(0, prod.stock - cartMatch.quantity) };
        ensureAuthenticatedUser().then((user) => {
          if (user) syncGearStockToFirestore(nextProd);
        });
        return nextProd;
      });
      return updated;
    });

    setOrders((prev) => [newOrder, ...prev]);

    ensureAuthenticatedUser().then((user) => {
      if (user) {
        syncOrderToFirestore(user.uid, newOrder);
      }
    });

    return newOrder;
  };

  const handleRestockProduct = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const nextProd = { ...prod, stock: Math.max(0, prod.stock + delta) };
        ensureAuthenticatedUser().then((user) => {
          if (user) syncGearStockToFirestore(nextProd);
        });
        return nextProd;
      })
    );
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

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const manualOverride = localStorage.getItem('stretchway_theme_override');
      if (!manualOverride) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  const handleToggleTheme = () => {
    triggerHaptic('light');
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('stretchway_theme_override', next);
      return next;
    });
  };

  const handleTriggerQuickPitstop = () => {
    const quickRoutine = CURATED_ROUTINES.find((r) => r.id === 'routine-quick-5min') || CURATED_ROUTINES[0];
    setActiveRoutine(quickRoutine);
  };

  const handleEquipFlair = (title: string, badgeId: string) => {
    triggerHaptic('medium');
    setUserProgress((prev) => {
      const isAlreadyEquipped = prev.equippedTitle === title;
      return {
        ...prev,
        equippedTitle: isAlreadyEquipped ? undefined : title,
        equippedBadgeId: isAlreadyEquipped ? undefined : badgeId
      };
    });
  };

  const handleRoutineCompleted = (data: {
    routineId: string;
    routineTitle: string;
    durationMinutes: number;
    feelingBefore: number;
    feelingAfter: number;
  }) => {
    triggerHaptic('success');
    setUserProgress((prev) => {
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

    ensureAuthenticatedUser().then((user) => {
      if (user) {
        recordCompletedSessionToFirestore(user.uid, {
          routineId: data.routineId,
          title: data.routineTitle,
          durationMinutes: data.durationMinutes,
          vehicle: currentVehicle,
          feelingBefore: data.feelingBefore,
          feelingAfter: data.feelingAfter
        });
      }
    });

    setActiveRoutine(null);
  };

  const handleLogQuickDrill = (exerciseName: string, seconds: number) => {
    const mins = Math.max(1, Math.round(seconds / 60));
    setUserProgress((prev) => ({
      ...prev,
      totalMinutesStretched: prev.totalMinutesStretched + mins,
      routinesCompleted: prev.routinesCompleted + 1,
      lastSessionDate: new Date().toISOString().split('T')[0],
      completedHistory: [
        ...prev.completedHistory,
        {
          id: `hist-quick-${Date.now()}`,
          title: `Quick-Stop: ${exerciseName}`,
          date: 'Today',
          durationMinutes: mins,
          feelingBefore: 3,
          feelingAfter: 5
        }
      ]
    }));
  };

  const handleBreathCompleted = (name: string, cycles: number) => {
    triggerHaptic('success');
    setUserProgress((prev) => ({
      ...prev,
      breathSessionsCompleted: prev.breathSessionsCompleted + 1,
      totalMinutesStretched: prev.totalMinutesStretched + 2,
      lastSessionDate: new Date().toISOString().split('T')[0],
      completedHistory: [
        ...prev.completedHistory,
        {
          id: `hist-breath-${Date.now()}`,
          title: `${name} (${cycles} cycles)`,
          date: 'Today',
          durationMinutes: 2,
          feelingBefore: 3,
          feelingAfter: 5
        }
      ]
    }));
  };

  const todayMinutes = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return userProgress.completedHistory.reduce((total, item) => {
      if (item.date === 'Today' || item.date === todayStr || item.date?.startsWith(todayStr)) {
        return total + (Number(item.durationMinutes) || 0);
      }
      return total;
    }, 0);
  }, [userProgress.completedHistory]);

  const handleExportSummary = () => {
    const reportText = `===========================================
STRETCHWAY ROAD RECOVERY REPORT
===========================================
Date: ${new Date().toLocaleDateString()}
Total Road Mobility Time: ${userProgress.totalMinutesStretched} Minutes
Routines Completed: ${userProgress.routinesCompleted}
Breath Sessions: ${userProgress.breathSessionsCompleted}
Current Daily Streak: ${userProgress.currentStreakDays} Days
Total Orders Placed: ${orders.length}

Recent Sessions:
${userProgress.completedHistory
  .map((h) => `- ${h.title} (${h.durationMinutes} min) | Relief: ${h.feelingBefore}/5 -> ${h.feelingAfter}/5`)
  .join('\n')}
===========================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stretchway-recovery-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  // Filter exercises
  const filteredExercises = ALL_EXERCISES.filter((ex) => {
    if (currentVehicle !== 'all' && !ex.vehicle.includes(currentVehicle as any)) return false;
    if (selectedMuscleFilter !== 'all' && !ex.muscleGroup.includes(selectedMuscleFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ex.name.toLowerCase().includes(q) ||
        ex.formCues.toLowerCase().includes(q) ||
        ex.targetMuscles.some((m) => m.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const allRoutines = useMemo(() => [...customRoutines, ...CURATED_ROUTINES], [customRoutines]);

  const filteredRoutines = allRoutines.filter((r) => {
    if (currentVehicle === 'all') return true;
    return r.vehicle === 'all' || r.vehicle === currentVehicle;
  });

  return (
    <>
      <div
        id="stretchway-main-shell"
        className={`min-h-screen flex flex-col selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-300 ${
          theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          currentVehicle={currentVehicle}
          onSelectVehicle={setCurrentVehicle}
          currentLang={currentLang}
          onSelectLang={setCurrentLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
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
          onOpenRedLightMode={() => setIsRedLightOpen(true)}
          onOpenStore={() => setActiveTab('store')}
          cartCount={0}
        />

        {/* Hero Category Navigation Bar */}
        <nav
          className={`sticky top-16 sm:top-20 z-30 backdrop-blur-md border-b transition-colors duration-300 ${
            theme === 'light' ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800/80'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-2.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('routines');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'routines'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 shadow-md shadow-cyan-500/20'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Curated Protocols</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('bodymap');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'bodymap'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 shadow-md shadow-cyan-500/20'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Anatomy Body Map</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('breath');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'breath'
                    ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Wind className="w-4 h-4" />
                <span>Breath Mastery</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('cockpit');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'cockpit'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 shadow-md shadow-cyan-500/20'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Cockpit Ergonomics</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('trip');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'trip'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>Trip Pitstops</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('library');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'library'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 shadow-md shadow-cyan-500/20'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Drill Library ({filteredExercises.length})</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('store');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'store'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Gear Store</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setRoadLogSubTab(undefined);
                  setActiveTab('log');
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'log'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Recovery Log & Orders</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Container */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 space-y-8">
          {sharedBannerMessage && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-bold flex items-center justify-between gap-3">
              <span>{sharedBannerMessage}</span>
              <button
                onClick={() => setSharedBannerMessage(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeTab !== 'routines' && (
            <div
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md shadow-lg animate-fade-in ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('routines');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold shadow-sm group active:scale-95 transition-all ${
                  theme === 'light'
                    ? 'bg-slate-50 border-slate-200 text-cyan-700 hover:bg-slate-100'
                    : 'bg-slate-950 border-slate-700/80 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Protocols</span>
              </button>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                  Current Section
                </span>
                <span
                  className={`text-xs font-extrabold capitalize ${
                    theme === 'light' ? 'text-slate-800' : 'text-slate-200'
                  }`}
                >
                  {activeTab === 'bodymap' && 'Interactive Anatomy Map'}
                  {activeTab === 'breath' && 'Breath Mastery Engine'}
                  {activeTab === 'cockpit' && 'Cockpit Ergonomics Guide'}
                  {activeTab === 'trip' && 'Road Trip Interval Planner'}
                  {activeTab === 'library' && 'Mobility Drill Library'}
                  {activeTab === 'store' && 'Ergonomic Gear Store & Stock'}
                  {activeTab === 'log' && 'Recovery Dashboard & Order Trends'}
                </span>
              </div>
            </div>
          )}

          {/* Tab Views */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full"
            >
              {/* TAB 1: CURATED ROUTINES & HERO WALL */}
              {activeTab === 'routines' && (
                <div className="space-y-8">
                  <HeroWall
                    currentVehicle={currentVehicle}
                    onSelectVehicle={setCurrentVehicle}
                    userProgress={userProgress}
                    assessmentProfile={assessmentProfile}
                    onStartRoutine={(r) => setActiveRoutine(r)}
                    onOpenQuickDecompress={() => {
                      const q =
                        CURATED_ROUTINES.find((r) => r.id === 'routine-quick-5min') || CURATED_ROUTINES[0];
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
                    allRoutines={allRoutines}
                    onOpenRedLightMode={() => setIsRedLightOpen(true)}
                    onOpenStore={() => setActiveTab('store')}
                  />

                  <div className="space-y-6">
                    <div id="smart-routine-creator-section">
                      <SmartRoutineCreator
                        onRoutineCreated={handleRoutineCreated}
                        currentVehicle={currentVehicle}
                        customRoutines={customRoutines}
                        onDeleteRoutine={handleDeleteCustomRoutine}
                        onDuplicateRoutine={handleDuplicateCustomRoutine}
                        onStartRoutine={(routine) => setActiveRoutine(routine)}
                        onPrintRoutinePdf={handlePrintRoutinePdf}
                        onUpdateCustomRoutineNotes={handleUpdateCustomRoutineNotes}
                        dailyGoalMinutes={dailyGoalMinutes}
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
                              {customRoutines.length} Custom
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Step-by-step guided audio & 3D character stretch sequences with Veo-3 4K clips
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                        {filteredRoutines.length} Active Protocols
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRoutines.map((routine, idx) => {
                        const isCustom = customRoutines.some((cr) => cr.id === routine.id);
                        const cardImpact = computeRecoveryImpact(
                          routine.exercises || [],
                          0,
                          dailyGoalMinutes
                        );

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
                            {isCustom && (
                              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400" />
                            )}

                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                                    {routine.vehicle.toUpperCase()}
                                  </span>
                                  {isCustom && (
                                    <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/50 flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-cyan-400" />
                                      <span>Custom Rx</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>{routine.durationMinutes} Min</span>
                                  </span>
                                  {isCustom && (
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => handlePrintRoutinePdf(routine)}
                                        title="Export Printable PDF Guide"
                                        className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-emerald-950/80 text-emerald-400 border border-slate-800 hover:border-emerald-500/50 transition-colors"
                                      >
                                        <Printer className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={(e) => handleDuplicateCustomRoutine(routine, e)}
                                        title="Duplicate Custom Routine"
                                        className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-cyan-950/80 text-slate-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition-colors"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={(e) => handleDeleteCustomRoutine(routine.id, e)}
                                        title="Remove Custom Routine"
                                        className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-950/80 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-500/50 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                                {routine.title}
                              </h3>
                              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                {routine.subtitle}
                              </p>

                              {routine.notes && (
                                <div className="mt-3 p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-1.5">
                                  <StickyNote className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                  <span className="line-clamp-2">{routine.notes}</span>
                                </div>
                              )}

                              <div className="my-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                                <strong className="text-cyan-400 block mb-0.5 flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                  <span>Olympic Coach Rationale:</span>
                                </strong>
                                {routine.coachRationale}
                              </div>

                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {routine.targetAreas.map((area, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-950 border border-slate-800 text-slate-400"
                                  >
                                    {area}
                                  </span>
                                ))}
                              </div>

                              {/* Recovery Impact Progress Bar on Custom Cards */}
                              {isCustom && (
                                <div className="mb-4 pt-2 border-t border-slate-800/70 space-y-1">
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-bold uppercase text-slate-400 flex items-center gap-1">
                                      <Gauge className="w-3 h-3 text-cyan-400" />
                                      <span>Recovery Impact</span>
                                    </span>
                                    <span className="font-mono font-black text-cyan-300">
                                      {cardImpact.score}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full bg-gradient-to-r ${cardImpact.barGradient}`}
                                      style={{ width: `${cardImpact.score}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                triggerHaptic('medium');
                                setActiveRoutine(routine);
                              }}
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

              {/* TAB 2: BODY MAP */}
              {activeTab === 'bodymap' && (
                <Suspense fallback={<LazyFallback />}>
                  <BodyMap
                    onStartTargetedRoutine={(r) => setActiveRoutine(r)}
                    onFilterMuscle={(m) => {
                      setSelectedMuscleFilter(m);
                      setActiveTab('library');
                    }}
                  />
                </Suspense>
              )}

              {/* TAB 3: BREATH ENGINE */}
              {activeTab === 'breath' && (
                <Suspense fallback={<LazyFallback />}>
                  <BreathEngine onCompleteSession={handleBreathCompleted} />
                </Suspense>
              )}

              {/* TAB 4: COCKPIT ERGONOMICS */}
              {activeTab === 'cockpit' && (
                <Suspense fallback={<LazyFallback />}>
                  <ErgonomicCockpitGuide />
                </Suspense>
              )}

              {/* TAB 5: TRIP PLANNER */}
              {activeTab === 'trip' && (
                <Suspense fallback={<LazyFallback />}>
                  <TripPlanner
                    onStartRoutine={(r) => setActiveRoutine(r)}
                    currentVehicle={currentVehicle}
                  />
                </Suspense>
              )}

              {/* TAB 6: DRILL LIBRARY */}
              {activeTab === 'library' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">
                        Olympic & Yogic Mobility Drill Library
                      </h2>
                      <p className="text-xs text-slate-400">
                        Explore individual biomechanically proven exercises for drivers and riders
                      </p>
                    </div>

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

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                    <button
                      onClick={() => setSelectedMuscleFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        selectedMuscleFilter === 'all'
                          ? 'bg-cyan-500 text-slate-950 font-extrabold'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      All Muscles ({ALL_EXERCISES.length})
                    </button>
                    {(
                      ['neck', 'shoulders', 'upper-back', 'lower-back', 'hips', 'wrists', 'hamstrings', 'calves'] as MuscleGroup[]
                    ).map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMuscleFilter(m)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                          selectedMuscleFilter === m
                            ? 'bg-cyan-500 text-slate-950 font-extrabold'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {m.replace('-', ' ')}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredExercises.map((exercise) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onOpenDetail={(ex) => setSelectedExerciseForModal(ex)}
                        onStartSingle={(r) => setActiveRoutine(r)}
                        isFavorite={(userProgress.favoriteExerciseIds || []).includes(exercise.id)}
                        onToggleFavorite={handleToggleFavoriteExercise}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: ERGONOMIC RECOVERY GEAR STORE & STOCK MANAGEMENT */}
              {activeTab === 'store' && (
                <Suspense fallback={<LazyFallback />}>
                  <RecoveryStore
                    products={products}
                    orders={orders}
                    onPlaceOrder={handlePlaceOrder}
                    onRestockProduct={handleRestockProduct}
                    onViewOrderAnalytics={() => {
                      setRoadLogSubTab('orders');
                      setActiveTab('log');
                    }}
                  />
                </Suspense>
              )}

              {/* TAB 8: ROAD LOG & ORDERS TREND DASHBOARD */}
              {activeTab === 'log' && (
                <Suspense fallback={<LazyFallback />}>
                  <RoadLog
                    userProgress={userProgress}
                    onExportSummary={handleExportSummary}
                    onStartRoutine={(r) => setActiveRoutine(r)}
                    onOpenAICoach={(prompt) => {
                      if (prompt) setAiCoachInitialPrompt(prompt);
                      setIsAICoachOpen(true);
                    }}
                    currentVehicle={currentVehicle}
                    onEquipFlair={handleEquipFlair}
                    orders={orders}
                    products={products}
                    authUser={authUser}
                    onSignInGoogle={() => signInWithGoogle()}
                    onSignOut={() => signOutUser()}
                    onOpenStore={() => setActiveTab('store')}
                    initialSubTab={roadLogSubTab}
                  />
                </Suspense>
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
              <button
                onClick={() => {
                  setAiCoachInitialPrompt('');
                  setIsAICoachOpen(true);
                }}
                className="hover:text-cyan-400 transition-colors"
              >
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
          <Suspense fallback={<LazyFallback />}>
            <InteractivePlayer
              routine={activeRoutine}
              onClose={() => setActiveRoutine(null)}
              onComplete={handleRoutineCompleted}
              equippedFlairIds={userProgress.equippedBadgeId ? [userProgress.equippedBadgeId] : []}
              initialHapticsEnabled={hapticsEnabled}
              initialPulseCountdownEnabled={pulseCountdownEnabled}
              selectedCoachId={selectedCoachId}
            />
          </Suspense>
        )}

        {/* Traffic Light / Quick-Stop Fullscreen Mode */}
        {isRedLightOpen && (
          <Suspense fallback={<LazyFallback />}>
            <RedLightQuickMode
              isOpen={isRedLightOpen}
              onClose={() => setIsRedLightOpen(false)}
              onLogQuickDrill={handleLogQuickDrill}
            />
          </Suspense>
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
        {isAICoachOpen && (
          <Suspense fallback={<LazyFallback />}>
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
          </Suspense>
        )}

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

        {/* User Settings Modal */}
        <UserSettingsModal
          isOpen={isUserSettingsOpen}
          onClose={() => setIsUserSettingsOpen(false)}
          hapticsEnabled={hapticsEnabled}
          onToggleHaptics={handleToggleHaptics}
          pulseCountdownEnabled={pulseCountdownEnabled}
          onTogglePulseCountdown={handleTogglePulseCountdown}
          selectedCoachId={selectedCoachId}
          onSelectCoach={handleSelectCoach}
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

        {/* Hands-Free Voice Copilot */}
        <VoiceCommandAssistant
          onNavigate={(tab) => setActiveTab(tab)}
          onTriggerQuickPitstop={handleTriggerQuickPitstop}
          onToggleTheme={handleToggleTheme}
          currentTab={activeTab}
        />

        {/* Browser Stretch Notification & Highway Timer System */}
        <StretchNotificationSystem
          onStartQuickStretch={handleTriggerQuickPitstop}
          onOpenTripPlanner={() => setActiveTab('trip')}
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
          onOpenRedLightMode={() => setIsRedLightOpen(true)}
          userProgress={userProgress}
          currentVehicle={currentVehicle}
          onSelectVehicle={setCurrentVehicle}
          theme={theme}
        />
      </div>

      {/* Printable PDF Guide Sheet (hidden on screen, rendered cleanly for window.print) */}
      <PrintableRoutineSheet routine={printableRoutine} />
    </>
  );
};
