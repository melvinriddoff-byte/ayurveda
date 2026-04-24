import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { DoshaType } from '../types';
import { supabase } from '../lib/supabase';
import { getProfile, upsertProfile } from '../lib/services/profiles';
import { signOut as authSignOut } from '../lib/services/auth';

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  dosha: DoshaType;
  avatar?: string;
}

interface AppContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: AppUser) => void;
  logout: () => void;
  updateDosha: (dosha: DoshaType) => void;
  updateName: (name: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name ?? '',
            phone: profile.phone ?? '',
            dosha: profile.dosha ?? 'vata',
            avatar: profile.avatar_url ?? undefined,
          });
        }
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        return;
      }
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name ?? '',
            phone: profile.phone ?? '',
            dosha: profile.dosha ?? 'vata',
            avatar: profile.avatar_url ?? undefined,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (u: AppUser) => setUser(u);

  const logout = async () => {
    await authSignOut();
    setUser(null);
  };

  const updateDosha = async (dosha: DoshaType) => {
    setUser(prev => prev ? { ...prev, dosha } : null);
    if (user) {
      await upsertProfile(user.id, { dosha });
    }
  };

  const updateName = async (name: string) => {
    setUser(prev => prev ? { ...prev, name } : null);
    if (user) {
      await upsertProfile(user.id, { name });
    }
  };

  return (
    <AppContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, updateDosha, updateName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
