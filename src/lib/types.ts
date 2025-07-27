
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

export interface ProPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  text: string;
  imageUrl?: string;
  imageHint?: string;
  likes: string[]; // Array of user UIDs who liked the post
  likeCount: number;
  saves: string[]; // Array of user UIDs who saved the post
  saveCount: number;
  commentCount: number;
  createdAt: Timestamp | Date;
}

export interface ProComment {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl?: string;
    text: string;
    createdAt: Timestamp | Date;
    replyCount: number;
}

export interface ProReply {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl?: string;
    text: string;
    createdAt: Timestamp | Date;
}


export interface Product {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  imageUrl: string;
  imageHint?: string;
  link: string;
  category: string;
  categorySlug: string;
  source: 'amazon';
  createdAt: Timestamp | Date;
}

export interface Category {
  name: LocalizedString;
  slug: string;
  iconName: keyof typeof import('lucide-react');
  description: LocalizedString;
}

export interface Subscription {
    status: 'active' | 'cancelled' | 'incomplete';
    method: 'paypal' | 'stripe';
    renewedAt: Timestamp | Date;
    subscriptionId?: string; // from PayPal or Stripe
}


// User type representing data from Firebase Auth and Firestore
export interface User {
  uid: string; // Firebase Auth UID
  email: string | null;
  username?: string; // Custom username from Firestore
  displayName?: string | null; // From Firebase Auth Profile (e.g., Google name)
  photoURL?: string | null; // From Firebase Auth Profile (e.g., Google avatar)
  description?: string; // User's bio/description
  isSubscribed?: boolean; // From Firestore
  memberSince?: Timestamp | Date; // From Firestore
  subscriptionPlan?: string; // For display
  paypalSubscriptionID?: string; // For PayPal integration
  isAdmin?: boolean; // Added for admin role
  followers?: string[]; // Array of UIDs of users following this user
  following?: string[]; // Array of UIDs of users this user is following
  savedPosts?: string[]; // Array of ProPost IDs
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

export type NotificationType = 'like' | 'comment' | 'reply' | 'new_post' | 'follow' | 'save';

export interface Notification {
  id: string;
  recipientId: string; // UID of the user receiving the notification
  actorId: string; // UID of the user who performed the action
  actorName: string; // Denormalized for display
  actorAvatarUrl?: string;
  type: NotificationType;
  postId?: string; // ID of the relevant post
  postTextSnippet?: string; // A short snippet of the post/comment text
  read: boolean;
  createdAt: Timestamp | Date;
}

export interface DonationSettings {
    paypalInfo?: string;
    mercadoPagoLink?: string;
}
