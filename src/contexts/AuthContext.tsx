
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useContext, useCallback }  from 'react';
import {
  auth,
  db,
  GoogleAuthProvider,
  signInWithPopup, // Keep for potential future use or reference, but won't be default
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithEmailAndPassword as firebaseSignInEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateFirebaseAuthProfile,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  type FirebaseUser as AuthFirebaseUser,
} from '@/lib/firebase';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUpWithEmailAndPassword: (email: string, pass: string, username: string) => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfileInFirestore: (uid: string, data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initial state is true
  const router = useRouter();

  const handleUser = useCallback(async (firebaseUser: AuthFirebaseUser | null): Promise<User | null> => {
    if (firebaseUser) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      };

      if (userSnap.exists()) {
        const firestoreData = userSnap.data() as Partial<User>;
        userData = { ...userData, ...firestoreData };
      } else {
        const newFirestoreUser: Partial<User> = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL,
          isSubscribed: false,
          memberSince: Timestamp.now(),
        };
        await setDoc(userRef, newFirestoreUser, { merge: true });
        userData = { ...userData, ...newFirestoreUser } as User;
      }
      setCurrentUser(userData);
      return userData;
    } else {
      setCurrentUser(null);
      return null;
    }
  }, []); // Empty dependency array means this is stable and won't change

  useEffect(() => {
    setLoading(true);
    let unsubscribeFromAuth = () => {};

    const checkAuthFlow = async () => {
      try {
        // Check for redirect result first. This is important for a smooth redirect sign-in flow.
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          // If a user is found via redirect, handleUser will process them.
          // onAuthStateChanged will also fire, typically confirming this user.
          // We let onAuthStateChanged be the one to set loading to false.
          await handleUser(result.user);
        }
      } catch (error) {
        // 'auth/no-auth-event' is normal if no redirect operation was in progress.
        if ((error as any).code !== 'auth/no-auth-event') {
          console.error("Error processing redirect result in AuthContext:", error);
        }
      } finally {
        // onAuthStateChanged is the definitive listener for auth state.
        // It will fire once the auth state is determined (e.g., after redirect or from session).
        unsubscribeFromAuth = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // It's possible handleUser was already called by getRedirectResult.
            // handleUser should be idempotent or check if already processed if necessary.
            // For simplicity, we call it again; setCurrentUser will handle no-op if data is same.
            await handleUser(firebaseUser);
          } else {
            setCurrentUser(null);
          }
          setLoading(false); // This is the single point where loading becomes false.
        });
      }
    };

    checkAuthFlow();

    return () => {
      if (typeof unsubscribeFromAuth === 'function') {
        unsubscribeFromAuth();
      }
    };
  }, [handleUser]); // Only `handleUser` as dependency, which is stable.

  const signUpWithEmailAndPassword = async (email: string, pass: string, username: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await firebaseCreateUser(auth, email, pass);
      const firebaseUser = userCredential.user;
      
      await updateFirebaseAuthProfile(firebaseUser, { displayName: username });

      const userRef = doc(db, 'users', firebaseUser.uid);
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        username: username,
        displayName: username,
        photoURL: firebaseUser.photoURL,
        isSubscribed: false,
        memberSince: Timestamp.now(),
      };
      await setDoc(userRef, newUser);
      setCurrentUser(newUser);
      setLoading(false);
      return newUser;
    } catch (error) {
      console.error("Error signing up:", error);
      setCurrentUser(null);
      setLoading(false);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await firebaseSignInEmail(auth, email, pass);
      const user = await handleUser(userCredential.user); 
      setLoading(false);
      return user;
    } catch (error) {
      console.error("Error signing in with email:", error);
      setCurrentUser(null);
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true); // Set loading true before redirect
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
      // Result will be handled by getRedirectResult and onAuthStateChanged in the useEffect
    } catch (error) {
      console.error("Error initiating Google sign-in with redirect:", error);
      // If redirect itself fails, ensure loading is reset
      setCurrentUser(null);
      setLoading(false); 
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      router.push('/'); 
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfileInFirestore = async (uid: string, data: Partial<User>) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
    if (currentUser && currentUser.uid === uid) {
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
    }
  };

  const value = {
    currentUser,
    loading,
    signUpWithEmailAndPassword,
    signInWithEmail,
    signInWithGoogle,
    logout,
    updateUserProfileInFirestore,
  };

  if (loading) {
    // Consider returning a full-page loader or null to prevent rendering children prematurely
    // For a less jarring experience, especially if loading is quick,
    // you might allow children to render but be aware they might see a brief "no user" state.
    // However, for robust auth state, waiting for loading to be false is safer.
    return null; 
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
