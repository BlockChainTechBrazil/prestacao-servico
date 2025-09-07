// src/context/AppContext.tsx
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AppContext, type User } from './AppContextBase';
import { auth } from '../firebaseConfig';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  signOut as fbSignOut,
} from 'firebase/auth';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Garante persistência local (importante em produção e para fluxos de redirect)
    setPersistence(auth, browserLocalPersistence).catch(() => { /* noop */ });

    // Tenta resolver resultado de redirect (caso popup seja bloqueado)
    getRedirectResult(auth).catch(() => { /* noop */ });

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
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      const popupIssues = [
        'auth/popup-blocked',
        'auth/operation-not-supported-in-this-environment',
        'auth/cors-unsupported',
        'auth/internal-error',
      ];
      if (popupIssues.includes(code)) {
        await signInWithRedirect(auth, provider);
        return; // Após redirect, onAuthStateChanged tratará o usuário
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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
  <AppContext.Provider value={{ user, loading, setUser, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, authReady }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook movido para arquivo separado para evitar conflitos com Fast Refresh
