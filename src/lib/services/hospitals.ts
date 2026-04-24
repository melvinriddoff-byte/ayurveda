import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, query, orderBy, where,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Hospital } from '../database.types';

export async function getHospitals(): Promise<Hospital[]> {
  const snap = await getDocs(query(collection(db, 'hospitals'), orderBy('rating', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Hospital);
}

export async function getHospitalById(id: string): Promise<Hospital | null> {
  const snap = await getDoc(doc(db, 'hospitals', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Hospital;
}

export async function getMyHospital(ownerId: string): Promise<Hospital | null> {
  const snap = await getDocs(query(collection(db, 'hospitals'), where('owner_id', '==', ownerId)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Hospital;
}

export async function registerHospital(hospital: Omit<Hospital, 'id' | 'created_at' | 'rating' | 'review_count' | 'verified'>): Promise<Hospital> {
  const ref = await addDoc(collection(db, 'hospitals'), {
    ...hospital,
    rating: 0,
    review_count: 0,
    verified: false,
    created_at: new Date().toISOString(),
  });
  return { id: ref.id, ...hospital, rating: 0, review_count: 0, verified: false, created_at: new Date().toISOString() };
}

export async function updateHospital(id: string, updates: Partial<Omit<Hospital, 'id' | 'created_at'>>) {
  await updateDoc(doc(db, 'hospitals', id), updates as any);
}
