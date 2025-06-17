
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
  signInWithRedirect,
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
  serverTimestamp,
  limit
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject as deleteFirebaseStorageObject,
  type StorageReference
} from 'firebase/storage';

import type { Post as PostType, GameHighScore } from './types';
import type { LanguageCode } from './translations';


const firebaseConfig = {
  apiKey: "AIzaSyDpPy6-b9DhCjZizVDZXP4vE3EfG4AcNPk",
  authDomain: "worldaipedia.firebaseapp.com",
  projectId: "worldaipedia",
  storageBucket: "worldaipedia.appspot.com",
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
const storage = getStorage(app);

// Helper to prepare Post data for Firestore
const preparePostForFirestore = (postData: Partial<Omit<PostType, 'id' | 'publishedDate'> & { publishedDate?: Date | Timestamp }>): any => {
  const dataToSave = { ...postData } as any;

  const localizedFields: (keyof Pick<PostType, 'title' | 'shortDescription' | 'longDescription'>)[] = ['title', 'shortDescription', 'longDescription'];
  localizedFields.forEach(field => {
    if (dataToSave[field] && typeof dataToSave[field] === 'string') {
      dataToSave[field] = { en: dataToSave[field] as string };
    }
  });

  if (dataToSave.publishedDate) {
    if (dataToSave.publishedDate instanceof Date) {
      dataToSave.publishedDate = Timestamp.fromDate(dataToSave.publishedDate);
    }
  }
  
  return dataToSave;
};


export const addPostToFirestore = async (postData: Omit<PostType, 'id' | 'publishedDate'> & { id?: string, publishedDate: Date }): Promise<string> => {
  const postId = postData.id || doc(collection(db, 'posts')).id;
  const postRef = doc(db, 'posts', postId);
  
  const dataToSave = { ...postData };
  if (dataToSave.publishedDate instanceof Date) {
    dataToSave.publishedDate = Timestamp.fromDate(dataToSave.publishedDate);
  } else if (!dataToSave.publishedDate) {
     (dataToSave as any).publishedDate = serverTimestamp();
  }

  const { id, ...firestoreData } = dataToSave;
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
  const postRef = doc(db, 'posts', postId);
  await deleteDoc(postRef);
};

export const deleteCommentFromFirestore = async (postId: string, commentId: string): Promise<void> => {
  const commentRef = doc(db, 'posts', postId, 'comments', commentId);
  await deleteDoc(commentRef);
};

// Dinosaur Game Firestore Functions
const DINO_GAME_HIGH_SCORES_COLLECTION = 'dinoGameHighScores';

export const saveDinoGameHighScore = async (userId: string, username: string, score: number): Promise<void> => {
  const highScoreRef = doc(db, DINO_GAME_HIGH_SCORES_COLLECTION, userId);
  const currentHighScoreSnap = await getDoc(highScoreRef);

  if (currentHighScoreSnap.exists()) {
    const currentHighScoreData = currentHighScoreSnap.data() as GameHighScore;
    if (score > currentHighScoreData.score) {
      await updateDoc(highScoreRef, {
        score: score,
        username: username, // Update username in case it changed
        timestamp: serverTimestamp(),
      });
    }
  } else {
    await setDoc(highScoreRef, {
      userId: userId,
      username: username,
      score: score,
      timestamp: serverTimestamp(),
    });
  }
};

export const getDinoGameTopHighScores = async (count: number = 100): Promise<GameHighScore[]> => {
  const highScoresCol = collection(db, DINO_GAME_HIGH_SCORES_COLLECTION);
  const q = query(highScoresCol, orderBy('score', 'desc'), limit(count));
  const querySnapshot = await getDocs(q);
  const highScores: GameHighScore[] = [];
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.timestamp && data.timestamp instanceof Timestamp) {
        data.timestamp = data.timestamp.toDate();
    }
    highScores.push({ id: docSnap.id, ...data } as GameHighScore);
  });
  return highScores;
};


export {
  app,
  auth,
  db,
  storage, 
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateFirebaseAuthProfile,
  getRedirectResult,
  signInWithRedirect,
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
  serverTimestamp,
  type FirebaseUser,
  ref as storageRef, 
  uploadBytesResumable,
  getDownloadURL as getStorageDownloadURL, 
  deleteFirebaseStorageObject
};
