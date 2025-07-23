
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useContext, useCallback }  from 'react';
import {
  auth,
  db,
  GoogleAuthProvider,
  signInWithPopup, // Changed from signInWithRedirect
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
  isUsernameTaken,
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
  const [loading, setLoading] = useState(true);
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
          const newFirestoreUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL,
            description: '',
            isSubscribed: false,
            isAdmin: false,
            memberSince: Timestamp.now(),
          };
          await setDoc(userRef, newFirestoreUser, { merge: true });
          userData = newFirestoreUser;
        }
        setCurrentUser(userData);
        return userData;
      } catch (error) {
        console.error("Error in handleUser (Firestore interaction):", error);
        const minimalUserData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAdmin: false,
        };
        setCurrentUser(minimalUserData);
        return minimalUserData;
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
        if ((error as any).code !== 'auth/no-auth-event') {
          console.error("Error processing redirect result in AuthContext:", error);
        }
      } finally {
        unsubscribeFromAuth = onAuthStateChanged(auth, async (firebaseUser) => {
          try {
            if (firebaseUser) {
              await handleUser(firebaseUser);
            } else {
              setCurrentUser(null);
            }
          } catch (error) {
            console.error("Error in onAuthStateChanged handler (within handleUser):", error);
            setCurrentUser(null); 
          } finally {
            setLoading(false); 
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
    
    // Check if username is already taken
    const usernameExists = await isUsernameTaken(username);
    if (usernameExists) {
        setLoading(false);
        throw new Error("This username is already taken. Please choose another one.");
    }

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
        description: '',
        isSubscribed: false,
        isAdmin: false,
        memberSince: Timestamp.now(),
      };
      await setDoc(userRef, newUser);
      setCurrentUser(newUser); // Optimistically set, but onAuthStateChanged confirms
      return newUser;
    } catch (error) {
      console.error("Error signing up:", error);
      setCurrentUser(null);
      setLoading(false); // Ensure loading is false on direct error
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await firebaseSignInEmail(auth, email, pass);
      const user = await handleUser(userCredential.user); 
      return user;
    } catch (error) {
      console.error("Error signing in with email:", error);
      setCurrentUser(null);
      setLoading(false); 
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      // This error code means the user closed the popup. It's a normal action,
      // so we can ignore it and not treat it as a failure.
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      // For all other errors, we should still log them and let the caller handle it.
      console.error("Error during Google signInWithPopup:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/'); 
    } catch (error) {
      console.error("Error signing out:", error);
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

  // Do not render children until authentication status is resolved
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
