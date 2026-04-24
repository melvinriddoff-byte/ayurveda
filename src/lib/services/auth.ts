import { supabase } from '../supabase';

// Send OTP to phone (+91XXXXXXXXXX format)
export async function sendOtp(phone: string) {
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { channel: 'sms' },
  });
  if (error) throw error;
}

// Verify OTP — returns session on success
export async function verifyOtp(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  if (error) throw error;
  return data;
}

// Get current session
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
