import { supabase } from '../supabase';
import type { AppointmentWithRelations, AppointmentStatus, AppointmentType, Appointment } from '../database.types';

export async function getMyAppointments(patientId: string): Promise<AppointmentWithRelations[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select(`*, doctors ( name, photo_url ), hospitals ( name )`)
    .eq('patient_id', patientId)
    .order('date', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    ...row,
    doctor_name: row.doctors?.name ?? '',
    doctor_photo: row.doctors?.photo_url ?? '',
    hospital_name: row.hospitals?.name ?? '',
    doctors: undefined,
    hospitals: undefined,
  }));
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
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
  const { data, error } = await supabase
    .from('appointments')
    .insert({ status: 'pending', ...appointment })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  extras?: { notes?: string; follow_up_date?: string; prescription?: string; meeting_link?: string }
) {
  const { error } = await supabase
    .from('appointments')
    .update({ status, ...extras })
    .eq('id', id);
  if (error) throw error;
}

export async function cancelAppointment(id: string) {
  return updateAppointmentStatus(id, 'cancelled');
}
