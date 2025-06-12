import type { LucideIcon } from 'lucide-react';

export interface AITool {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  imageHint?: string;
  logoUrl?: string;
  logoHint?: string;
  category: string;
  link: string;
}

export interface Category {
  name: string;
  slug: string;
  iconName: keyof typeof import('lucide-react'); // Allows type-checking for icon names
  description: string;
}
