import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  getDocs,
  updateDoc,
  addDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProgress, UserAssessmentProfile, Routine, RecoveryOrder, GearProduct } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Initialize Firebase App instance safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Startup connectivity test per Firebase SDK guidance
export async function testConnection(): Promise<void> {
  if (!auth.currentUser) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration (client is offline).');
    }
  }
}

// Sign in using Google popup
export async function signInWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Return active verified user if signed in (no silent anonymous failures)
export const ensureAuthenticatedUser = async (): Promise<User | null> => {
  return auth.currentUser && auth.currentUser.emailVerified ? auth.currentUser : null;
};

// Sync user progress to Firestore safely (respects rules allowlist and timestamps)
export const syncUserProgressToFirestore = async (userId: string, progress: UserProgress) => {
  if (!auth.currentUser || auth.currentUser.uid !== userId || !auth.currentUser.emailVerified) return;
  const userPath = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      await setDoc(userDocRef, {
        userId,
        displayName: auth.currentUser.displayName || 'Driver',
        email: auth.currentUser.email || '',
        currentStreakDays: progress.currentStreakDays || 0,
        totalMinutesStretched: progress.totalMinutesStretched || 0,
        totalSessionsCompleted: progress.completedHistory.length,
        lastSessionDate: progress.lastSessionDate || progress.lastActiveDate || '',
        favoriteExerciseIds: (progress.favoriteExerciseIds || []).slice(0, 100),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(userDocRef, {
        currentStreakDays: progress.currentStreakDays || 0,
        totalMinutesStretched: progress.totalMinutesStretched || 0,
        totalSessionsCompleted: progress.completedHistory.length,
        lastSessionDate: progress.lastSessionDate || progress.lastActiveDate || '',
        favoriteExerciseIds: (progress.favoriteExerciseIds || []).slice(0, 100),
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, userPath);
  }
};

export const recordCompletedSessionToFirestore = async (
  userId: string,
  session: { routineId?: string; title: string; durationMinutes: number; vehicle?: string; feelingBefore?: number; feelingAfter?: number }
): Promise<void> => {
  if (!auth.currentUser || auth.currentUser.uid !== userId || !auth.currentUser.emailVerified) return;
  const sessionsPath = 'sessions';
  try {
    await addDoc(collection(db, sessionsPath), {
      userId,
      routineId: session.routineId || 'session',
      title: session.title.slice(0, 160),
      durationMinutes: Number(session.durationMinutes) || 1,
      vehicle: session.vehicle || 'all',
      completedAt: new Date().toISOString(),
      preComfortScore: session.feelingBefore ?? 3,
      postComfortScore: session.feelingAfter ?? 5,
      createdAt: serverTimestamp()
    });
  } catch (sessionErr) {
    handleFirestoreError(sessionErr, OperationType.CREATE, sessionsPath);
  }
};

export const syncAssessmentProfileToFirestore = async (userId: string, profile: UserAssessmentProfile) => {
  if (!auth.currentUser || auth.currentUser.uid !== userId || !auth.currentUser.emailVerified) return;
  const userPath = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      await setDoc(userDocRef, {
        userId,
        totalMinutesStretched: 0,
        assessmentProfile: profile,
        tailoredAt: new Date().toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(userDocRef, {
        assessmentProfile: profile,
        tailoredAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, userPath);
  }
};

export const fetchAssessmentProfileFromFirestore = async (userId: string): Promise<UserAssessmentProfile | null> => {
  if (!auth.currentUser || auth.currentUser.uid !== userId || !auth.currentUser.emailVerified) return null;
  const userPath = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      const data = snap.data();
      return data.assessmentProfile || null;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, userPath);
  }
  return null;
};

export const fetchUserProgressFromFirestore = async (userId: string): Promise<Partial<UserProgress> | null> => {
  if (!auth.currentUser || auth.currentUser.uid !== userId || !auth.currentUser.emailVerified) return null;
  const userPath = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      const data = snap.data();
      return {
        currentStreakDays: data.currentStreakDays || 0,
        totalMinutesStretched: data.totalMinutesStretched || 0,
        lastSessionDate: data.lastSessionDate || data.lastActiveDate || '',
        favoriteExerciseIds: data.favoriteExerciseIds || []
      };
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, userPath);
  }
  return null;
};

export const syncCustomRoutinesToFirestore = async (userId: string, routines: Routine[]) => {
  if (!auth.currentUser || auth.currentUser.uid !== userId || !auth.currentUser.emailVerified) return;
  const userPath = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    const serialized = routines.slice(0, 50).map((r) => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle || '',
      notes: r.notes || '',
      vehicle: r.vehicle,
      intensity: r.intensity,
      durationMinutes: r.durationMinutes,
      exerciseIds: (r.exercises || []).map((e) => e.id)
    }));
    if (!snap.exists()) {
      await setDoc(userDocRef, {
        userId,
        totalMinutesStretched: 0,
        customRoutines: serialized,
        lastCustomRoutineGeneratedAt: new Date().toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(userDocRef, {
        customRoutines: serialized,
        lastCustomRoutineGeneratedAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, userPath);
  }
};

export const fetchCustomRoutinesFromFirestore = async (userId: string): Promise<any[]> => {
  if (!auth.currentUser || auth.currentUser.uid !== userId || !auth.currentUser.emailVerified) return [];
  const userPath = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      const data = snap.data();
      return data.customRoutines || [];
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, userPath);
  }
  return [];
};

// Sync a Recovery Store Order to Firestore
export const syncOrderToFirestore = async (userId: string, order: RecoveryOrder): Promise<void> => {
  if (!auth.currentUser || auth.currentUser.uid !== userId || !auth.currentUser.emailVerified) return;
  const safeId = order.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const orderPath = `orders/${safeId}`;
  try {
    await setDoc(doc(db, 'orders', safeId), {
      orderId: safeId,
      userId,
      orderDate: order.orderDate,
      monthKey: order.monthKey,
      items: order.items,
      total: Number(order.total) || 0,
      status: order.status,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, orderPath);
  }
};

export const fetchOrdersFromFirestore = async (userId: string): Promise<RecoveryOrder[]> => {
  if (!auth.currentUser || auth.currentUser.uid !== userId || !auth.currentUser.emailVerified) return [];
  const path = 'orders';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as RecoveryOrder);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
};

// Sync ergonomic gear stock level to Firestore (user-scoped)
export const syncGearStockToFirestore = async (product: GearProduct): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;
  const safeId = product.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const stockId = `${user.uid}_${safeId}`.slice(0, 128);
  const stockPath = `gearInventory/${stockId}`;
  try {
    const ref = doc(db, 'gearInventory', stockId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        userId: user.uid,
        productId: safeId,
        sku: product.sku,
        name: product.name,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(ref, {
        stock: product.stock,
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, stockPath);
  }
};
