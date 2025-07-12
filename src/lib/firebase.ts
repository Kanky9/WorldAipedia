
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

import type { Post as PostType, GameHighScore, Book as BookType, ProPost } from './types';
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

// PRO Publications
export const deletePublicationFromFirestore = async (postId: string): Promise<void> => {
  const postRef = doc(db, 'pro-posts', postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const postData = postSnap.data() as ProPost;
    // If there's an image, delete it from Storage first
    if (postData.imageUrl) {
      try {
        const imageRef = ref(storage, postData.imageUrl);
        await deleteFirebaseStorageObject(imageRef);
      } catch (error: any) {
        // Log error but don't block Firestore deletion if image deletion fails
        if (error.code !== 'storage/object-not-found') {
          console.error("Error deleting publication image from Storage:", error);
        }
      }
    }
  }

  // Delete the Firestore document
  await deleteDoc(postRef);
};

// Book Firestore Functions
export const addBookToFirestore = async (bookData: Omit<BookType, 'id' | 'createdAt'> & { id?: string }): Promise<string> => {
  const bookId = bookData.id || doc(collection(db, 'books')).id;
  const bookRef = doc(db, 'books', bookId);
  
  const dataToSave = { 
    ...bookData,
    createdAt: serverTimestamp()
  };

  const { id, ...firestoreData } = dataToSave;
  await setDoc(bookRef, firestoreData);
  return bookId;
};

export const updateBookInFirestore = async (bookId: string, bookData: Partial<Omit<BookType, 'id'>>): Promise<void> => {
  const bookRef = doc(db, 'books', bookId);
  await updateDoc(bookRef, bookData);
};

export const getAllBooksFromFirestore = async (): Promise<BookType[]> => {
  const booksCol = collection(db, 'books');
  const q = query(booksCol, orderBy('createdAt', 'desc'));
  const booksSnapshot = await getDocs(q);
  const booksList = booksSnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    if (data.createdAt && data.createdAt instanceof Timestamp) {
      data.createdAt = data.createdAt.toDate();
    }
    return { id: docSnap.id, ...data } as BookType;
  });
  return booksList;
};

export const getBookFromFirestore = async (bookId: string): Promise<BookType | null> => {
  const bookRef = doc(db, 'books', bookId);
  const bookSnap = await getDoc(bookRef);
  if (bookSnap.exists()) {
    const data = bookSnap.data();
    if (data.createdAt && data.createdAt instanceof Timestamp) {
      data.createdAt = data.createdAt.toDate();
    }
    return { id: bookSnap.id, ...data } as BookType;
  }
  return null;
}

export const deleteBookFromFirestore = async (bookId: string): Promise<void> => {
  const bookRef = doc(db, 'books', bookId);
  await deleteDoc(bookRef);
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

// PRO Subscription
export const updateUserToPro = async (uid: string, method: 'paypal', subscriptionId?: string) => {
  const userRef = doc(db, 'users', uid);
  const subRef = doc(db, 'users', uid, 'subscription', 'current');
  
  const subscriptionData = {
    status: 'active',
    method,
    renewedAt: serverTimestamp(),
    subscriptionId: subscriptionId || null,
  };
  
  // Update the subcollection
  await setDoc(subRef, subscriptionData, { merge: true });
  
  // Also update the main user document for easy access in the app
  await updateDoc(userRef, {
    isSubscribed: true,
    subscriptionPlan: `PRO Monthly (${method})`,
  });
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
