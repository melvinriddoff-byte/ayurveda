import { supabase } from '../supabase';
import type { Hospital, Database } from '../database.types';

// Fetch all hospitals
export async function getHospitals(): Promise<Hospital[]> {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .order('rating', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// Fetch a single hospital by ID
export async function getHospitalById(id: string): Promise<Hospital | null> {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

// Fetch hospital owned by current user
export async function getMyHospital(ownerId: string): Promise<Hospital | null> {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .eq('owner_id', ownerId)
    .single();
  if (error) return null;
  return data;
}

// Register a new hospital
export async function registerHospital(hospital: {
  owner_id: string;
  name: string;
  tagline?: string;
  description?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  website?: string;
  year_established?: number;
  accreditations?: string[];
  amenities?: string[];
}): Promise<Hospital> {
  const { data, error } = await supabase
    .from('hospitals')
    .insert(hospital)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update hospital details
export async function updateHospital(id: string, updates: Database['public']['Tables']['hospitals']['Update']) {
  const { error } = await supabase
    .from('hospitals')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}
