
import type { LucideIcon } from 'lucide-react';
import type { LanguageCode } from '@/lib/translations';

export type LocalizedString = string | { [key in LanguageCode]?: string };

export interface AITool {
  id: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  longDescription: LocalizedString;
  imageUrl: string;
  imageHint?: string;
  logoUrl?: string;
  logoHint?: string;
  category: string; // This refers to the category *name* (which itself can be localized in Category type)
  categorySlug: string; // Keep slug non-localized for routing
  link: string;
  detailImageUrl1?: string;
  detailImageHint1?: string;
  detailImageUrl2?: string;
  detailImageHint2?: string;
}

export interface Category {
  name: LocalizedString;
  slug: string; // Slugs should remain consistent and typically non-localized
  iconName: keyof typeof import('lucide-react');
  description: LocalizedString;
}
