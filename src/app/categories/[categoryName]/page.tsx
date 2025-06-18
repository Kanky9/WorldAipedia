// This file is now primarily for server-side concerns like generateStaticParams
// and then delegates rendering to a Client Component.

import { categories } from '@/data/posts';
import type { Category as CategoryType } from '@/lib/types';
import CategoryDetailPageClient from '@/components/categories/CategoryDetailPageClient';

// This function runs at build time (server-side)
export async function generateStaticParams() {
  try {
    return categories.map((category: CategoryType) => ({
      categoryName: category.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for /categories/[categoryName]:", error);
    return [];
  }
}

interface CategoryDynamicPageProps {
  params: { categoryName: string };
}

export default async function CategoryDynamicPage({ params }: CategoryDynamicPageProps) {
  // This is a Server Component.
  // It receives params from the dynamic route.
  // It then renders the Client Component, passing the categoryName.
  return <CategoryDetailPageClient categorySlug={params.categoryName} />;
}
