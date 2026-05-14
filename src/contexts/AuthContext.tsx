import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (fUser) => {
      setFirebaseUser(fUser);
      setIsAuthReady(true);
      
      if (!fUser) {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;

    setIsLoading(true);
    const unsubscribeUser = onSnapshot(
      doc(db, 'users', firebaseUser.uid),
      (doc) => {
        if (doc.exists()) {
          setUser(doc.data() as User);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribeUser();
  }, [firebaseUser]);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, isLoading, isAuthReady }}>
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
