import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Appointment, AppointmentStatus, AppointmentType, AppointmentWithRelations } from '../database.types';

async function enrichAppointment(data: any, id: string): Promise<AppointmentWithRelations> {
  let doctor_name = '', doctor_photo = '', hospital_name = '';
  if (data.doctor_id) {
    const snap = await getDoc(doc(db, 'doctors', data.doctor_id));
    if (snap.exists()) { doctor_name = (snap.data() as any).name ?? ''; doctor_photo = (snap.data() as any).photo_url ?? ''; }
  }
  if (data.hospital_id) {
    const snap = await getDoc(doc(db, 'hospitals', data.hospital_id));
    if (snap.exists()) hospital_name = (snap.data() as any).name ?? '';
  }
  return { id, ...data, doctor_name, doctor_photo, hospital_name } as AppointmentWithRelations;
}

export async function getMyAppointments(patientId: string): Promise<AppointmentWithRelations[]> {
  const snap = await getDocs(query(
    collection(db, 'appointments'),
    where('patient_id', '==', patientId),
    orderBy('date', 'desc')
  ));
  return Promise.all(snap.docs.map(d => enrichAppointment(d.data(), d.id)));
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const snap = await getDoc(doc(db, 'appointments', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Appointment;
}

export async function createAppointment(appointment: {
  patient_id: string;
  doctor_id?: string | null;
  hospital_id?: string | null;
  date: string;
  time: string;
  type: AppointmentType;
  notes?: string | null;
  fee?: number;
  meeting_link?: string | null;
}): Promise<Appointment> {
  const now = new Date().toISOString();
  const ref = await addDoc(collection(db, 'appointments'), {
    ...appointment,
    status: 'pending',
    follow_up_date: null,
    prescription: null,
    created_at: now,
    updated_at: now,
  });
  return { id: ref.id, ...appointment, status: 'pending', follow_up_date: null, prescription: null, created_at: now, updated_at: now } as Appointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  extras?: { notes?: string; follow_up_date?: string; prescription?: string; meeting_link?: string }
) {
  await updateDoc(doc(db, 'appointments', id), { status, ...extras, updated_at: new Date().toISOString() });
}

export async function cancelAppointment(id: string) {
  return updateAppointmentStatus(id, 'cancelled');
}
