import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, FIREBASE_CONFIGURED } from '../firebase';

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  if (!FIREBASE_CONFIGURED) throw new Error('Firebase not configured');
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  if (!FIREBASE_CONFIGURED) throw new Error('Firebase not configured');
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string) {
  if (!FIREBASE_CONFIGURED) throw new Error('Firebase not configured');
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signOut() {
  if (!FIREBASE_CONFIGURED) return;
  await firebaseSignOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
