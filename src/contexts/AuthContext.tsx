
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useContext, useCallback }  from 'react';
import {
  auth,
  db,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithEmailAndPassword as firebaseSignInEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateFirebaseAuthProfile,
  doc,
  setDoc,
  getDoc,
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
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  updateUserProfileInFirestore: (uid: string, data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
        // New user (e.g. first Google sign-in), create Firestore doc
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
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await handleUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [handleUser]);

  const signUpWithEmailAndPassword = async (email: string, pass: string, username: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await firebaseCreateUser(auth, email, pass);
      const firebaseUser = userCredential.user;
      
      // Update Firebase Auth profile
      await updateFirebaseAuthProfile(firebaseUser, { displayName: username });

      // Create Firestore document
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
      setCurrentUser(null); // Ensure user is null on error
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

  const signInWithGoogle = async (): Promise<User | null> => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = await handleUser(result.user); // handleUser will create Firestore doc if needed
      setLoading(false);
      return user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
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
      router.push('/'); // Redirect to home after logout
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfileInFirestore = async (uid: string, data: Partial<User>) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
    // Optimistically update local state or re-fetch
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

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
