import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Profile, DoshaType } from '../database.types';

export async function getProfile(userId: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db, 'profiles', userId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Profile;
}

export async function upsertProfile(
  userId: string,
  updates: { name?: string; phone?: string; dosha?: DoshaType | null; role?: 'patient' | 'hospital' | 'doctor' }
): Promise<Profile | null> {
  const ref = doc(db, 'profiles', userId);
  const snap = await getDoc(ref);
  const now = new Date().toISOString();
  if (snap.exists()) {
    await updateDoc(ref, { ...updates, updated_at: now });
  } else {
    await setDoc(ref, {
      name: null, phone: null, dosha: null, role: 'patient', avatar_url: null,
      created_at: now, updated_at: now,
      ...updates,
    });
  }
  const updated = await getDoc(ref);
  return { id: updated.id, ...updated.data() } as Profile;
}

export async function updateProfileName(userId: string, name: string) {
  await updateDoc(doc(db, 'profiles', userId), { name, updated_at: new Date().toISOString() });
}

export async function updateProfileDosha(userId: string, dosha: DoshaType) {
  await updateDoc(doc(db, 'profiles', userId), { dosha, updated_at: new Date().toISOString() });
}
