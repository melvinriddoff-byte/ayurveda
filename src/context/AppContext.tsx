import { createContext, useContext, useState, type ReactNode } from 'react';
import type { DoshaType } from '../types';

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
  login: (user: AppUser) => void;
  logout: () => void;
  updateDosha: (dosha: DoshaType) => void;
  updateName: (name: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  const login = (u: AppUser) => setUser(u);
  const logout = () => setUser(null);
  const updateDosha = (dosha: DoshaType) => setUser(prev => prev ? { ...prev, dosha } : null);
  const updateName = (name: string) => setUser(prev => prev ? { ...prev, name } : null);

  return (
    <AppContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateDosha, updateName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
