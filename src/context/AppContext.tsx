import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { DoshaType } from '../types';
import { onAuthChange, signOut as authSignOut } from '../lib/services/auth';
import { getProfile, upsertProfile } from '../lib/services/profiles';

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  email: string;
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
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getProfile(firebaseUser.uid);
        setUser({
          id: firebaseUser.uid,
          name: profile?.name ?? firebaseUser.displayName ?? '',
          phone: profile?.phone ?? '',
          email: firebaseUser.email ?? '',
          dosha: profile?.dosha ?? 'vata',
          avatar: firebaseUser.photoURL ?? profile?.avatar_url ?? undefined,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = (u: AppUser) => setUser(u);

  const logout = async () => {
    await authSignOut();
    setUser(null);
  };

  const updateDosha = async (dosha: DoshaType) => {
    setUser(prev => prev ? { ...prev, dosha } : null);
    if (user) await upsertProfile(user.id, { dosha });
  };

  const updateName = async (name: string) => {
    setUser(prev => prev ? { ...prev, name } : null);
    if (user) await upsertProfile(user.id, { name });
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
