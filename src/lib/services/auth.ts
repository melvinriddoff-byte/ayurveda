import { supabase, SUPABASE_CONFIGURED } from '../supabase';

// Send OTP to phone (+91XXXXXXXXXX format)
export async function sendOtp(phone: string) {
  if (!SUPABASE_CONFIGURED) return; // demo mode — skip network call
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { channel: 'sms' },
  });
  if (error) throw error;
}

// Verify OTP — returns session on success
export async function verifyOtp(phone: string, token: string) {
  if (!SUPABASE_CONFIGURED) return null; // demo mode — accept any OTP
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
