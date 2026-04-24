import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import type { Speciality } from '../database.types';

export async function getSpecialities(): Promise<Speciality[]> {
  const snap = await getDocs(query(collection(db, 'specialities'), orderBy('sort_order', 'asc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Speciality);
}

export async function getSpecialityById(id: string): Promise<Speciality | null> {
  const snap = await getDoc(doc(db, 'specialities', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Speciality;
}
