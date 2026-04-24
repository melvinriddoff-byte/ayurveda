import {
  collection, doc, getDoc, getDocs, addDoc, query, where, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Doctor, DoctorWithRelations } from '../database.types';

async function enrichDoctor(data: any, id: string): Promise<DoctorWithRelations> {
  let hospital_name = '';
  if (data.hospital_id) {
    const hSnap = await getDoc(doc(db, 'hospitals', data.hospital_id));
    if (hSnap.exists()) hospital_name = (hSnap.data() as any).name ?? '';
  }
  const specNames: string[] = [];
  if (data.speciality_ids?.length) {
    for (const sid of data.speciality_ids) {
      const sSnap = await getDoc(doc(db, 'specialities', sid));
      if (sSnap.exists()) specNames.push((sSnap.data() as any).name ?? '');
    }
  }
  return { id, ...data, hospital_name, speciality_names: specNames } as DoctorWithRelations;
}

export async function getDoctors(): Promise<DoctorWithRelations[]> {
  const snap = await getDocs(query(collection(db, 'doctors'), orderBy('rating', 'desc')));
  return Promise.all(snap.docs.map(d => enrichDoctor(d.data(), d.id)));
}

export async function getDoctorById(id: string): Promise<DoctorWithRelations | null> {
  const snap = await getDoc(doc(db, 'doctors', id));
  if (!snap.exists()) return null;
  return enrichDoctor(snap.data(), snap.id);
}

export async function getDoctorsByHospital(hospitalId: string): Promise<DoctorWithRelations[]> {
  const snap = await getDocs(query(
    collection(db, 'doctors'),
    where('hospital_id', '==', hospitalId),
    orderBy('rating', 'desc')
  ));
  return Promise.all(snap.docs.map(d => enrichDoctor(d.data(), d.id)));
}

export async function addDoctor(doctor: Omit<Doctor, 'id' | 'created_at' | 'rating' | 'review_count'> & { speciality_ids?: string[] }) {
  const { speciality_ids, ...data } = doctor;
  const ref = await addDoc(collection(db, 'doctors'), {
    ...data,
    rating: 0,
    review_count: 0,
    speciality_ids: speciality_ids ?? [],
    created_at: new Date().toISOString(),
  });
  return { id: ref.id, ...data };
}
