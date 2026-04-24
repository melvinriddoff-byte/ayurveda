import { supabase } from '../supabase';
import type { Profile, DoshaType } from '../database.types';

// Fetch a single profile by user ID
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

// Upsert profile after signup (name + optional dosha)
export async function upsertProfile(
  userId: string,
  updates: { name?: string; phone?: string; dosha?: DoshaType | null; role?: 'patient' | 'hospital' | 'doctor' }
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update name
export async function updateProfileName(userId: string, name: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ name })
    .eq('id', userId);
  if (error) throw error;
}

// Update dosha
export async function updateProfileDosha(userId: string, dosha: DoshaType) {
  const { error } = await supabase
    .from('profiles')
    .update({ dosha })
    .eq('id', userId);
  if (error) throw error;
}
