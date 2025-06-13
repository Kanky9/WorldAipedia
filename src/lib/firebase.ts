
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseAuthProfile,
  getRedirectResult,
  signInWithRedirect, // Added import here
  type User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

import type { Post as PostType } from './types';
import type { LanguageCode } from './translations';


const firebaseConfig = {
  apiKey: "AIzaSyDpPy6-b9DhCjZizVDZXP4vE3EfG4AcNPk",
  authDomain: "worldaipedia.firebaseapp.com",
  projectId: "worldaipedia",
  storageBucket: "worldaipedia.appspot.com", // Corrected format
  messagingSenderId: "124464012147",
  appId: "1:124464012147:web:9380bde3f055bd4d784306"
};

// Initialize Firebase
let app: FirebaseApp;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
// const storage = getStorage(app);

// Helper to prepare Post data for Firestore
const preparePostForFirestore = (postData: Partial<Omit<PostType, 'id' | 'publishedDate'> & { publishedDate?: Date | Timestamp }>): any => {
  const dataToSave = { ...postData } as any; // Clone to avoid mutating the original object

  const localizedFields: (keyof Pick<PostType, 'title' | 'shortDescription' | 'longDescription'>)[] = ['title', 'shortDescription', 'longDescription'];
  localizedFields.forEach(field => {
    if (dataToSave[field] && typeof dataToSave[field] === 'string') {
      console.warn(`Warning: Localized field '${field}' was a string. Converting to { en: "value" }. Ensure form submits structured localized data.`);
      dataToSave[field] = { en: dataToSave[field] as string };
    }
  });

  if (dataToSave.publishedDate) {
    if (dataToSave.publishedDate instanceof Date) {
      dataToSave.publishedDate = Timestamp.fromDate(dataToSave.publishedDate);
    }
    // If it's already a Timestamp, it's fine.
  } else if (!postData.id) { // Only set serverTimestamp for brand new posts if date isn't provided
    // This check '(!postData.id)' is a bit indirect for "is new post".
    // It's better if the calling function decides if serverTimestamp is needed.
    // For now, assuming if id is not part of initial data, it could be new.
    // This specific part will be handled more explicitly in addPostToFirestore.
  }
  
  return dataToSave;
};


export const addPostToFirestore = async (postData: Omit<PostType, 'id' | 'publishedDate'> & { id?: string, publishedDate: Date }): Promise<string> => {
  const postId = postData.id || doc(collection(db, 'posts')).id;
  const postRef = doc(db, 'posts', postId);
  
  // Explicitly prepare the data, ensuring publishedDate is a Timestamp for new posts or converted if Date
  const dataToSave = { ...postData };
  if (dataToSave.publishedDate instanceof Date) {
    dataToSave.publishedDate = Timestamp.fromDate(dataToSave.publishedDate);
  } else if (!dataToSave.publishedDate) { // Should not happen if type is `publishedDate: Date`
     (dataToSave as any).publishedDate = serverTimestamp(); // Fallback, though type implies Date
  }

  const { id, ...firestoreData } = dataToSave; // Remove client-side ID before saving
  await setDoc(postRef, firestoreData);
  return postId;
};

export const updatePostInFirestore = async (postId: string, postData: Partial<Omit<PostType, 'id' | 'publishedDate'> & { publishedDate?: Date | Timestamp }>): Promise<void> => {
  const postRef = doc(db, 'posts', postId);
  const firestoreReadyData = preparePostForFirestore(postData);
  await updateDoc(postRef, firestoreReadyData);
};

export const getPostFromFirestore = async (postId: string): Promise<PostType | null> => {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  if (postSnap.exists()) {
    const data = postSnap.data();
    if (data.publishedDate && data.publishedDate instanceof Timestamp) {
      data.publishedDate = data.publishedDate.toDate();
    }
    return { id: postSnap.id, ...data } as PostType;
  }
  return null;
};

export const getAllPostsFromFirestore = async (): Promise<PostType[]> => {
  const postsCol = collection(db, 'posts');
  const q = query(postsCol, orderBy('publishedDate', 'desc'));
  const postsSnapshot = await getDocs(q);
  const postsList = postsSnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    if (data.publishedDate && data.publishedDate instanceof Timestamp) {
      data.publishedDate = data.publishedDate.toDate();
    }
    return { id: docSnap.id, ...data } as PostType;
  });
  return postsList;
};

export const getPostsByCategorySlugFromFirestore = async (categorySlug: string): Promise<PostType[]> => {
  const postsCol = collection(db, 'posts');
  const q = query(postsCol, where('categorySlug', '==', categorySlug), orderBy('publishedDate', 'desc'));
  const postsSnapshot = await getDocs(q);
  const postsList = postsSnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    if (data.publishedDate && data.publishedDate instanceof Timestamp) {
      data.publishedDate = data.publishedDate.toDate();
    }
    return { id: docSnap.id, ...data } as PostType;
  });
  return postsList;
};

export const deletePostFromFirestore = async (postId: string): Promise<void> => {
  // Note: This doesn't delete subcollections like comments. For a full delete,
  // you'd need a Firebase Function or more complex client-side logic.
  const postRef = doc(db, 'posts', postId);
  await deleteDoc(postRef);
};


export {
  app,
  auth,
  db,
  // storage,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateFirebaseAuthProfile,
  getRedirectResult,
  signInWithRedirect, // Added export here
  doc, // Re-exporting for use elsewhere if needed
  setDoc, // Re-exporting
  getDoc, // Re-exporting
  collection, // Re-exporting
  addDoc, // Re-exporting
  query, // Re-exporting
  where, // Re-exporting
  getDocs, // Re-exporting
  updateDoc, // Re-exporting
  deleteDoc, // Re-exporting
  Timestamp, // Re-exporting
  orderBy, // Re-exporting
  serverTimestamp, // Re-exporting
  type FirebaseUser
};
