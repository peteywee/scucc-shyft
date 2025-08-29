
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  sendSignInLinkToEmail,
  signOut,
  type User 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sendSignInLink: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const actionCodeSettings = {
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:9002',
  handleCodeInApp: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
           router.push('/onboarding');
        } else {
            setUser(user);
            if(pathname === '/onboarding' || pathname === '/') {
                router.push('/dashboard');
            }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  useEffect(() => {
    const handleSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        if (email) {
            try {
                const result = await signInWithEmailLink(auth, email, window.location.href);
                window.localStorage.removeItem('emailForSignIn');
                const user = result.user;
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    router.push('/onboarding');
                } else {
                    setUser(user);
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Error signing in with email link:', error);
                router.push('/');
            }
        }
      }
    };
    handleSignIn();
  }, [router]);

  const sendSignInLink = async (email: string) => {
    window.localStorage.setItem('emailForSignIn', email);
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const value = {
    user,
    loading,
    sendSignInLink,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
