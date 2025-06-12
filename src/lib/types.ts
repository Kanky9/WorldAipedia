
import type { LucideIcon } from 'lucide-react';
import type { LanguageCode } from '@/lib/translations';

export type LocalizedString = string | { [key in LanguageCode]?: string; en: string; }; // Ensure 'en' is always present as a fallback

// Renamed AITool to Post, added publishedDate and tags
export interface Post {
  id: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  longDescription: LocalizedString;
  imageUrl: string;
  imageHint?: string;
  logoUrl?: string; // Still relevant if post is about a specific tool
  logoHint?: string; // Still relevant
  category: string; // Main category/tag
  categorySlug: string; 
  tags: string[]; // Additional tags
  publishedDate: Date;
  link: string; // Link to the AI tool if the post is about one
  detailImageUrl1?: string; // Still relevant
  detailImageHint1?: string; // Still relevant
  detailImageUrl2?: string; // Still relevant
  detailImageHint2?: string; // Still relevant
  comments?: UserComment[]; // Added comments
}

export interface Category {
  name: LocalizedString;
  slug: string; 
  iconName: keyof typeof import('lucide-react');
  description: LocalizedString;
}

// Simplified User type for UI simulation
export interface User {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  isSubscribed: boolean; // PRO status
}

export interface UserComment {
  id: string;
  postId: string; 
  username: string;
  isAnonymous: boolean;
  rating: number; 
  text: string;
  timestamp: Date;
  profileImageUrl?: string; 
}

export interface AiToolChatContext {
  title: string; 
  shortDescription: string; 
  link: string;
}
