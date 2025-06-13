
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useContext, useCallback }  from 'react';
import {
  auth,
  db,
  GoogleAuthProvider,
  signInWithPopup, // Keep for potential future use or reference, but won't be default
  signInWithRedirect, // Added
  getRedirectResult,  // Added
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
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAdmin: false, 
        };

        if (userSnap.exists()) {
          const firestoreData = userSnap.data() as Partial<User>;
          userData = { ...userData, ...firestoreData, isAdmin: firestoreData.isAdmin || false };
        } else {
          // New user, create Firestore document
          const newFirestoreUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL,
            isSubscribed: false,
            isAdmin: false, // Explicitly set isAdmin to false for new users
            memberSince: Timestamp.now(),
          };
          await setDoc(userRef, newFirestoreUser, { merge: true });
          userData = newFirestoreUser;
        }
        setCurrentUser(userData);
        return userData;
      } catch (error) {
        console.error("Error in handleUser (Firestore interaction):", error);
        // Fallback to minimal user data if Firestore interaction fails
        const minimalUserData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAdmin: false, // Default to false
        };
        setCurrentUser(minimalUserData);
        return minimalUserData; // Return minimal data instead of throwing
      }
    } else {
      setCurrentUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    let unsubscribeFromAuth = () => {};

    const checkAuthFlow = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          await handleUser(result.user);
        }
      } catch (error) {
        if ((error as any).code !== 'auth/no-auth-event') { // auth/no-auth-event is expected if no redirect occurred
          console.error("Error processing redirect result in AuthContext:", error);
        }
        // Do not setLoading(false) here yet, let onAuthStateChanged handle it
      } finally {
        // This will run regardless of getRedirectResult outcome or errors (unless checkAuthFlow itself crashes before finally)
        unsubscribeFromAuth = onAuthStateChanged(auth, async (firebaseUser) => {
          try {
            if (firebaseUser) {
              await handleUser(firebaseUser);
            } else {
              setCurrentUser(null);
            }
          } catch (error) {
            console.error("Error in onAuthStateChanged handler (likely within handleUser):", error);
            setCurrentUser(null); // Fallback if handleUser fails catastrophically
          } finally {
            setLoading(false); // CRITICAL: Ensure loading is set to false here
          }
        });
      }
    };

    checkAuthFlow();

    return () => {
      if (typeof unsubscribeFromAuth === 'function') {
        unsubscribeFromAuth();
      }
    };
  }, [handleUser]);

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
        isAdmin: false, // Set isAdmin to false on new sign-up
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
      // onAuthStateChanged will handle setting user and loading state
      const user = await handleUser(userCredential.user); 
      // setLoading(false) will be handled by onAuthStateChanged
      return user;
    } catch (error) {
      console.error("Error signing in with email:", error);
      setCurrentUser(null);
      setLoading(false); // Ensure loading is false in direct error case
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true); // Set loading true before redirect
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
      // After redirect, the useEffect and onAuthStateChanged will handle the user and setLoading(false)
    } catch (error) {
      console.error("Error initiating Google sign-in with redirect:", error);
      setCurrentUser(null);
      setLoading(false); // Ensure loading is false if redirect initiation fails
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
      setLoading(false); // Ensure loading is false after logout attempt
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
