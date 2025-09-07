// src/context/AppContext.tsx
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AppContext, type User } from './AppContextBase';
import { auth } from '../firebaseConfig';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const u: User = {
          id: fbUser.uid,
          name: fbUser.displayName ?? fbUser.email ?? 'Usuário',
          email: fbUser.email ?? undefined,
          profileImage: fbUser.photoURL ?? undefined,
        };
        setUser(u);
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await fbSignOut(auth);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{ user, loading, setUser, signInWithEmail, signInWithGoogle, signOut, authReady }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook movido para arquivo separado para evitar conflitos com Fast Refresh
