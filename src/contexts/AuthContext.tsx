
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
  }, []);

  useEffect(() => {
    setLoading(true); // Explicitly set loading to true at the start of the effect
    
    // First, try to get the result of a redirect operation.
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          // User signed in or linked via redirect.
          await handleUser(result.user);
          setLoading(false);
        } else {
          // No redirect result, now set up the onAuthStateChanged listener.
          // This handles cases where user is already signed in (session persisted)
          // or signs in/out through other means after initial load.
          const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
              await handleUser(firebaseUser);
            } else {
              setCurrentUser(null);
            }
            setLoading(false);
          });
          // Return the unsubscribe function for cleanup if getRedirectResult was null.
          return unsubscribe;
        }
      })
      .catch((error) => {
        // Handle errors from getRedirectResult.
        // 'auth/no-auth-event' is normal if no redirect operation was in progress.
        if ((error as any).code !== 'auth/no-auth-event') {
          console.error("Error getting redirect result:", error);
        }
        // Even if getRedirectResult fails or has no result,
        // still set up onAuthStateChanged for persistent sessions or other auth changes.
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            await handleUser(firebaseUser);
          } else {
            setCurrentUser(null);
          }
          setLoading(false);
        });
        return unsubscribe; // Return the unsubscribe function for cleanup
      });

    // The structure above should handle returning the unsubscribe function.
    // However, to be absolutely sure, if we need a general cleanup,
    // we might need to assign the result of onAuthStateChanged to a variable
    // and return it, but the promise chain complicates that.
    // The typical pattern is `const unsubscribe = onAuthStateChanged(...); return () => unsubscribe();`
    // For now, the above should be okay as onAuthStateChanged will be set up
    // if getRedirectResult doesn't immediately resolve a user.

    // A more straightforward way to structure the cleanup:
    let unsubscribe = () => {};
    const checkAuth = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                await handleUser(result.user);
                setLoading(false);
                // If user is found via redirect, onAuthStateChanged will also fire,
                // so we don't strictly need to set it up again here,
                // but setting it up won't harm.
            }
        } catch (error) {
            if ((error as any).code !== 'auth/no-auth-event') {
                console.error("Error processing redirect result:", error);
            }
        } finally {
            // Always set up onAuthStateChanged to catch subsequent auth state changes
            // or existing persisted sessions if no redirect occurred.
            unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser && !currentUser) { // Avoid re-processing if redirect already handled it
                    await handleUser(firebaseUser);
                } else if (!firebaseUser && !(result && result.user) ) { // Only set to null if redirect didn't find user
                    setCurrentUser(null);
                }
                setLoading(false);
            });
        }
    };
    checkAuth();
    return () => unsubscribe();

  }, [handleUser, currentUser]); // Added currentUser to dep array for the check within onAuthStateChanged


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
      setCurrentUser(newUser); // This will be the final source of truth for currentUser
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
      const user = await handleUser(userCredential.user); // handleUser calls setCurrentUser
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
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
      // Result handled by getRedirectResult in useEffect
    } catch (error) {
      console.error("Error initiating Google sign-in with redirect:", error);
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

  // Only render children when loading is false
  if (loading) {
    // You can return a global loader here if you want
    // e.g., <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
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
