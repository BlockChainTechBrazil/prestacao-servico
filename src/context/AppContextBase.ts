import { createContext } from 'react';

export interface User {
  id?: string;
  email?: string;
  name?: string;
  profileImage?: string;
}

export interface AppContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  authReady: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
