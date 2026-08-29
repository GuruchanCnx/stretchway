import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, addDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProgress, UserAssessmentProfile } from '../types';

// Initialize Firebase App instance safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

// Authenticate anonymously or return active user
export const ensureAuthenticatedUser = async (): Promise<User | null> => {
  try {
    if (auth.currentUser) return auth.currentUser;
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (error) {
    console.warn('Anonymous Firebase auth skipped or running offline:', error);
    return null;
  }
};

// Sync user progress to Firestore
export const syncUserProgressToFirestore = async (userId: string, progress: UserProgress) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      userId,
      currentStreakDays: progress.currentStreakDays,
      totalMinutesStretched: progress.totalMinutesStretched,
      totalSessionsCompleted: progress.completedHistory.length,
      lastActiveDate: progress.lastActiveDate,
      favoriteExerciseIds: progress.favoriteExerciseIds || [],
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Also persist latest completed sessions
    const sessionsCol = collection(db, 'sessions');
    if (progress.completedHistory.length > 0) {
      const latest = progress.completedHistory[progress.completedHistory.length - 1];
      await addDoc(sessionsCol, {
        userId,
        routineId: (latest as any).routineId || (latest as any).id,
        title: latest.title,
        durationMinutes: latest.durationMinutes,
        vehicle: (latest as any).vehicle || 'all',
        completedAt: (latest as any).completedAt || (latest as any).date || new Date().toISOString(),
        preComfortScore: (latest as any).preComfortScore ?? (latest as any).feelingBefore ?? 5,
        postComfortScore: (latest as any).postComfortScore ?? (latest as any).feelingAfter ?? 8,
        createdAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Could not sync progress to Firestore (offline fallback active):', err);
  }
};

// Sync User Tailored Assessment Profile to Firestore
export const syncAssessmentProfileToFirestore = async (userId: string, profile: UserAssessmentProfile) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      assessmentProfile: profile,
      tailoredAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Could not sync assessment profile to Firestore:', err);
  }
};

// Fetch User Tailored Assessment Profile from Firestore
export const fetchAssessmentProfileFromFirestore = async (userId: string): Promise<UserAssessmentProfile | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return data.assessmentProfile || null;
    }
  } catch (err) {
    console.warn('Could not fetch assessment profile from Firestore:', err);
  }
  return null;
};

// Fetch user progress from Firestore
export const fetchUserProgressFromFirestore = async (userId: string): Promise<Partial<UserProgress> | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        currentStreakDays: data.currentStreakDays || 0,
        totalMinutesStretched: data.totalMinutesStretched || 0,
        lastActiveDate: data.lastActiveDate || '',
        favoriteExerciseIds: data.favoriteExerciseIds || []
      };
    }
  } catch (err) {
    console.warn('Could not fetch user progress from Firestore:', err);
  }
  return null;
};

// Sync AI-Generated Custom Routines to Firestore
export const syncCustomRoutinesToFirestore = async (userId: string, routines: any[]) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      customRoutines: routines,
      lastCustomRoutineGeneratedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Could not sync custom routines to Firestore:', err);
  }
};

// Fetch AI-Generated Custom Routines from Firestore
export const fetchCustomRoutinesFromFirestore = async (userId: string): Promise<any[]> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return data.customRoutines || [];
    }
  } catch (err) {
    console.warn('Could not fetch custom routines from Firestore:', err);
  }
  return [];
};
