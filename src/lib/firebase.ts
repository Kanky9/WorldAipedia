

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
  limit,
  writeBatch,
  arrayUnion,
  arrayRemove,
  getCountFromServer
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject as deleteFirebaseStorageObject,
  type StorageReference
} from 'firebase/storage';

import type { Post as PostType, GameHighScore, Product as ProductType, ProPost, User, Notification } from './types';
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

export const getPostsByAuthorId = async (authorId: string): Promise<ProPost[]> => {
    const postsCol = collection(db, 'pro-posts');
    const q = query(postsCol, where('authorId', '==', authorId), limit(20));
    const querySnapshot = await getDocs(q);
    const postsList = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        if (data.createdAt && data.createdAt instanceof Timestamp) {
            data.createdAt = data.createdAt.toDate();
        }
        return { id: docSnap.id, ...data } as ProPost;
    });
    return postsList;
};

// Product Firestore Functions
export const addProductToFirestore = async (productData: Omit<ProductType, 'id' | 'createdAt'> & { id?: string }): Promise<string> => {
  const productId = productData.id || doc(collection(db, 'products')).id;
  const productRef = doc(db, 'products', productId);
  
  const dataToSave = { 
    ...productData,
    createdAt: serverTimestamp()
  };

  const { id, ...firestoreData } = dataToSave;
  await setDoc(productRef, firestoreData);
  return productId;
};

export const updateProductInFirestore = async (productId: string, productData: Partial<Omit<ProductType, 'id'>>): Promise<void> => {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, productData);
};

export const getAllProductsFromFirestore = async (): Promise<ProductType[]> => {
  const productsCol = collection(db, 'products');
  const q = query(productsCol, orderBy('createdAt', 'desc'));
  const productsSnapshot = await getDocs(q);
  const productsList = productsSnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    if (data.createdAt && data.createdAt instanceof Timestamp) {
      data.createdAt = data.createdAt.toDate();
    }
    return { id: docSnap.id, ...data } as ProductType;
  });
  return productsList;
};

export const getProductFromFirestore = async (productId: string): Promise<ProductType | null> => {
  const productRef = doc(db, 'products', productId);
  const productSnap = await getDoc(productRef);
  if (productSnap.exists()) {
    const data = productSnap.data();
    if (data.createdAt && data.createdAt instanceof Timestamp) {
      data.createdAt = data.createdAt.toDate();
    }
    return { id: productSnap.id, ...data } as ProductType;
  }
  return null;
}

export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
  const productRef = doc(db, 'products', productId);
  await deleteDoc(productRef);
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

// Follow System, User Search, and Username Propagation
export const isUsernameTaken = async (username: string): Promise<boolean> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username), limit(1));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const updateUsernameAcrossPublications = async (userId: string, newUsername: string) => {
    const postsRef = collection(db, 'pro-posts');
    const q = query(postsRef, where('authorId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    querySnapshot.forEach(docSnap => {
        const postRef = doc(db, 'pro-posts', docSnap.id);
        batch.update(postRef, { authorName: newUsername });
    });
    
    await batch.commit();
};


export const followUser = async (currentUserId: string, targetUserId: string) => {
    const batch = writeBatch(db);
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);

    batch.update(currentUserRef, { following: arrayUnion(targetUserId) });
    batch.update(targetUserRef, { followers: arrayUnion(currentUserId) });
    
    await batch.commit();

    // Create notification after successfully following
    const currentUserSnap = await getDoc(currentUserRef);
    if(currentUserSnap.exists()) {
        const currentUserData = currentUserSnap.data() as User;
        createNotification({
            recipientId: targetUserId,
            actorId: currentUserId,
            actorName: currentUserData.username || currentUserData.displayName || 'A user',
            actorAvatarUrl: currentUserData.photoURL || undefined,
            type: 'follow'
        });
    }
};

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    const batch = writeBatch(db);
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);
    
    batch.update(currentUserRef, { following: arrayRemove(targetUserId) });
    batch.update(targetUserRef, { followers: arrayRemove(currentUserId) });

    await batch.commit();
};

export const getUserById = async (uid: string): Promise<User | null> => {
    if (!uid) return null;
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return { uid: userSnap.id, ...userSnap.data() } as User;
    }
    return null;
};

export const getUsersByIds = async (uids: string[]): Promise<User[]> => {
    if (uids.length === 0) return [];
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', 'in', uids));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as User));
};

export const getTopUsersByFollowers = async (count: number = 7): Promise<User[]> => {
    const usersRef = collection(db, 'users');
    // Note: Firestore requires a composite index for this query.
    // The error in the console will provide a link to create it.
    const q = query(usersRef, orderBy('followers.length', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as User));
};

export const searchUsersByUsername = async (searchText: string): Promise<User[]> => {
    if (!searchText.trim()) return [];
    const usersRef = collection(db, 'users');
    // Create a query that looks for usernames that start with the search text.
    // The '\uf8ff' character is a high-point unicode character that acts as a limit for the query.
    const q = query(
        usersRef,
        where('username', '>=', searchText),
        where('username', '<', searchText + '\uf8ff'),
        limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as User));
};

// --- Bookmarking / Saving ---
export const savePost = async (userId: string, postId: string, postAuthorId: string, postText: string) => {
    const userRef = doc(db, 'users', userId);
    const postRef = doc(db, 'pro-posts', postId);
    const batch = writeBatch(db);

    batch.update(userRef, { savedPosts: arrayUnion(postId) });
    batch.update(postRef, { saves: arrayUnion(userId) });
    batch.update(postRef, { saveCount: (await getDoc(postRef)).data()?.saveCount + 1 || 1 });
    
    await batch.commit();

    // Create notification after commit
    const currentUserDoc = await getDoc(userRef);
    const currentUser = currentUserDoc.data() as User;
    
    if (userId !== postAuthorId) {
        createNotification({
            recipientId: postAuthorId,
            actorId: userId,
            actorName: currentUser.username || currentUser.displayName || 'A user',
            actorAvatarUrl: currentUser.photoURL || undefined,
            type: 'save',
            postId: postId,
            postTextSnippet: postText.substring(0, 50)
        });
    }
};

export const unsavePost = async (userId: string, postId: string) => {
    const userRef = doc(db, 'users', userId);
    const postRef = doc(db, 'pro-posts', postId);
    const batch = writeBatch(db);
    const currentSaveCount = (await getDoc(postRef)).data()?.saveCount || 0;

    batch.update(userRef, { savedPosts: arrayRemove(postId) });
    batch.update(postRef, { saves: arrayRemove(userId) });
    batch.update(postRef, { saveCount: Math.max(0, currentSaveCount - 1) });

    await batch.commit();
};

export const getSavedPosts = async (savedPostIds: string[]): Promise<ProPost[]> => {
    if (savedPostIds.length === 0) return [];
    const postsRef = collection(db, 'pro-posts');
    // Firestore 'in' query is limited to 30 items. For more, you'd need multiple queries.
    const q = query(postsRef, where('__name__', 'in', savedPostIds.slice(0, 30)));
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProPost));
    // Since Firestore doesn't guarantee order with 'in' queries, we re-order based on the original list
    return posts.sort((a, b) => savedPostIds.indexOf(b.id) - savedPostIds.indexOf(a.id));
};


// --- Notifications ---
export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    // Avoid notifying user about their own actions
    if (notification.recipientId === notification.actorId) return;

    await addDoc(collection(db, 'notifications'), {
        ...notification,
        read: false,
        createdAt: serverTimestamp(),
    });
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    const notifsRef = collection(db, 'notifications');
    const q = query(notifsRef, where('recipientId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Notification));
    return notifications;
};

export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
    const notifsRef = collection(db, 'notifications');
    const q = query(notifsRef, where('recipientId', '==', userId), where('read', '==', false));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const markNotificationsAsRead = async (notificationIds: string[]) => {
    if (notificationIds.length === 0) return;
    const batch = writeBatch(db);
    notificationIds.forEach(id => {
        const notifRef = doc(db, 'notifications', id);
        batch.update(notifRef, { read: true });
    });
    await batch.commit();
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
