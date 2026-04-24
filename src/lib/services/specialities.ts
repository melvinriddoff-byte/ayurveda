import { supabase } from '../supabase';
import type { Speciality } from '../database.types';

export async function getSpecialities(): Promise<Speciality[]> {
  const { data, error } = await supabase
    .from('specialities')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getSpecialityById(id: string): Promise<Speciality | null> {
  const { data, error } = await supabase
    .from('specialities')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}
