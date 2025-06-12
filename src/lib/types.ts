
import type { LucideIcon } from 'lucide-react';
import type { LanguageCode } from '@/lib/translations';

export type LocalizedString = string | { [key in LanguageCode]?: string; en: string; }; // Ensure 'en' is always present as a fallback

export interface AITool {
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
  link: string;
  detailImageUrl1?: string;
  detailImageHint1?: string;
  detailImageUrl2?: string;
  detailImageHint2?: string;
}

export interface Category {
  name: LocalizedString;
  slug: string; 
  iconName: keyof typeof import('lucide-react');
  description: LocalizedString;
}

export interface UserComment {
  id: string;
  aiToolId: string;
  username: string;
  isAnonymous: boolean;
  rating: number; 
  text: string;
  timestamp: Date;
  profileImageUrl?: string; 
}

// Context for opening chat with specific AI tool information
export interface AiToolChatContext {
  title: string; // Resolved, localized title
  shortDescription: string; // Resolved, localized description
  link: string;
}
