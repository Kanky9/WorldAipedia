import type { LucideIcon } from 'lucide-react';
import type { LanguageCode } from '@/lib/translations';
import type { Timestamp } from 'firebase/firestore';

export type LocalizedString =
  | string
  | ({
      [key in Exclude<LanguageCode, "en">]?: string;
    } & {
      en: string;
    });

export interface Post {
  id: string; // Firestore document ID
  title: { [key in LanguageCode]?: string; en: string; }; // Stored as a map in Firestore
  shortDescription: { [key in LanguageCode]?: string; en: string; }; // Stored as a map
  longDescription: { [key in LanguageCode]?: string; en: string; }; // Stored as a map
  imageUrl: string; // URL or Data URI
  imageHint?: string;
  category: string; // English name of category, from categories.name.en
  categorySlug: string;
  tags: string[];
  publishedDate: Timestamp | Date; // Firestore Timestamp when read/saved, Date when manipulated in forms
  link: string;
  detailImageUrl1?: string;
  detailImageHint1?: string;
  detailImageUrl2?: string;
  detailImageHint2?: string;
  // Comments are a subcollection in Firestore, not directly part of the Post document.
}

export interface Book {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
  imageHint?: string;
  link: string;
  source: 'amazon' | 'mercadolibre';
  createdAt: Timestamp | Date;
}

export interface Category {
  name: LocalizedString;
  slug: string;
  iconName: keyof typeof import('lucide-react');
  description: LocalizedString;
}

// User type representing data from Firebase Auth and Firestore
export interface User {
  uid: string; // Firebase Auth UID
  email: string | null;
  username?: string; // Custom username from Firestore
  displayName?: string | null; // From Firebase Auth Profile (e.g., Google name)
  photoURL?: string | null; // From Firebase Auth Profile (e.g., Google avatar)
  isSubscribed?: boolean; // From Firestore
  memberSince?: Timestamp | Date; // From Firestore
  subscriptionPlan?: string; // From Firestore
  paypalSubscriptionID?: string; // For PayPal integration
  isAdmin?: boolean; // Added for admin role
}

export interface UserComment {
  id: string; // Firestore document ID
  postId: string;
  userId: string; // UID of the commenter
  username: string; // Denormalized for easy display
  profileImageUrl?: string; // Denormalized
  isAnonymous: boolean;
  rating: number;
  text: string;
  timestamp: Timestamp | Date; // Firestore Timestamp or Date object
}

export interface AiToolChatContext {
  title: string;
  shortDescription: string;
  link: string;
}

export interface GameHighScore {
  id: string; // userId
  username: string;
  score: number;
  timestamp: Timestamp | Date;
}
