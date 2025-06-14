
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
  serverTimestamp
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject as deleteFirebaseStorageObject, // Renamed to avoid conflict
  type StorageReference
} from 'firebase/storage';

import type { Post as PostType } from './types';
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
const storage = getStorage(app); // Initialize Firebase Storage

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
  // Note: This does not delete associated images from Firebase Storage.
  // That would require additional logic here or a Firebase Function.
};

// Firebase Storage helper function
export const uploadImageAndGetURL = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        // Optional: Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed:", error);
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        }).catch(reject);
      }
    );
  });
};


export {
  app,
  auth,
  db,
  storage, // Export storage
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
  // Storage specific exports
  ref as storageRef, // alias to avoid conflict with React.ref
  uploadBytesResumable,
  getDownloadURL as getStorageDownloadURL, // alias
  deleteFirebaseStorageObject
};
