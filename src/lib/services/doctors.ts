import { supabase } from '../supabase';
import type { DoctorWithRelations } from '../database.types';

// Fetch all doctors with hospital name and speciality names
export async function getDoctors(): Promise<DoctorWithRelations[]> {
  const { data, error } = await supabase
    .from('doctors')
    .select(`
      *,
      hospitals ( name ),
      doctor_specialities (
        specialities ( name )
      )
    `)
    .order('rating', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    ...row,
    hospital_name: row.hospitals?.name ?? '',
    speciality_names: (row.doctor_specialities ?? []).map((ds: any) => ds.specialities?.name).filter(Boolean),
    hospitals: undefined,
    doctor_specialities: undefined,
  }));
}

// Fetch a single doctor by ID
export async function getDoctorById(id: string): Promise<DoctorWithRelations | null> {
  const { data, error } = await supabase
    .from('doctors')
    .select(`
      *,
      hospitals ( id, name ),
      doctor_specialities (
        specialities ( name )
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;

  const row = data as any;
  return {
    ...row,
    hospital_name: row.hospitals?.name ?? '',
    speciality_names: (row.doctor_specialities ?? [])
      .map((ds: any) => ds.specialities?.name)
      .filter(Boolean),
    hospitals: undefined,
    doctor_specialities: undefined,
  } as DoctorWithRelations;
}

// Fetch doctors belonging to a hospital
export async function getDoctorsByHospital(hospitalId: string): Promise<DoctorWithRelations[]> {
  const { data, error } = await supabase
    .from('doctors')
    .select(`
      *,
      hospitals ( name ),
      doctor_specialities ( specialities ( name ) )
    `)
    .eq('hospital_id', hospitalId)
    .order('rating', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    ...row,
    hospital_name: row.hospitals?.name ?? '',
    speciality_names: (row.doctor_specialities ?? []).map((ds: any) => ds.specialities?.name).filter(Boolean),
    hospitals: undefined,
    doctor_specialities: undefined,
  }));
}

// Add a new doctor (hospital owner action)
export async function addDoctor(doctor: {
  hospital_id: string;
  name: string;
  title?: string;
  bio?: string;
  experience?: number;
  education?: string[];
  languages?: string[];
  consultation_fee?: number;
  video_fee?: number;
  available_days?: string[];
  accepts_video?: boolean;
  dosha_expertise?: string[];
  photo_url?: string;
  speciality_ids?: string[];
}) {
  const { speciality_ids, ...doctorData } = doctor;

  const { data, error } = await supabase
    .from('doctors')
    .insert(doctorData)
    .select()
    .single();
  if (error) throw error;

  // Link specialities
  if (speciality_ids?.length) {
    const links = speciality_ids.map(sid => ({ doctor_id: data.id, speciality_id: sid }));
    await supabase.from('doctor_specialities').insert(links);
  }

  return data;
}
