
import type { LucideIcon } from 'lucide-react';
import type { LanguageCode } from '@/lib/translations';
import type { Timestamp } from 'firebase/firestore';

export type LocalizedString = string | { [key in LanguageCode]?: string; en: string; }; // Ensure 'en' is always present as a fallback

export interface Post {
  id: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  longDescription: LocalizedString;
  imageUrl: string;
  imageHint?: string;
  logoUrl?: string; 
  logoHint?: string; 
  category: string; 
  categorySlug: string; 
  tags: string[]; 
  publishedDate: Date; // For mock data, Firestore would use Timestamp
  link: string; 
  detailImageUrl1?: string; 
  detailImageHint1?: string; 
  detailImageUrl2?: string; 
  detailImageHint2?: string; 
  comments?: UserComment[]; // Initially from mock, then Firestore
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
