
"use client"; // Needs to be client for useLanguage hook

import { notFound, useParams } from 'next/navigation';
import { getAiToolsByCategory, getCategoryBySlug, categories as allCategories } from '@/data/ai-tools';
import AICard from '@/components/ai/AICard';
import CategoryIcon from '@/components/ai/CategoryIcon';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';
import type { Category as CategoryType, AITool } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


// Remove generateStaticParams if page is client rendered based on dynamic param
// export async function generateStaticParams() {
//   return allCategories.map((category) => ({
//     categoryName: category.slug, // categoryName is the slug
//   }));
// }

export default function CategoryDetailPage() {
  const params = useParams();
  const categorySlug = typeof params.categoryName === 'string' ? params.categoryName : '';
  const { t } = useLanguage();
  
  const [category, setCategory] = useState<CategoryType | null | undefined>(undefined);
  const [toolsInCategory, setToolsInCategory] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (categorySlug) {
      setIsLoading(true);
      const currentCategory = getCategoryBySlug(categorySlug);
      setCategory(currentCategory);
      if (currentCategory) {
        const tools = getAiToolsByCategory(categorySlug);
        setToolsInCategory(tools);
      }
      setIsLoading(false);
    }
  }, [categorySlug]);

  if (isLoading || category === undefined) { // Loading state
     return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-48" />
            </div>
            <Skeleton className="h-6 w-72" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-96 w-full rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  const localizedCategoryName = t(category.name);
  const localizedCategoryDescription = t(category.description);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CategoryIcon categoryName={typeof category.name === 'string' ? category.name : category.name.en!} className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-headline font-bold text-primary">{localizedCategoryName}</h1>
          </div>
          <p className="text-lg text-muted-foreground">{localizedCategoryDescription}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/categories" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('allCategoriesButton', 'All Categories')}
          </Link>
        </Button>
      </div>

      {toolsInCategory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsInCategory.map((tool) => (
            <AICard key={tool.id} aiTool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-4">
            {t('noToolsInCategory', 'No AI tools found in the "{categoryName}" category yet.', {categoryName: localizedCategoryName})}
          </p>
          <p className="text-muted-foreground">
            {t('noToolsInCategorySuggestion', 'Check back soon, or explore other categories!')}
          </p>
        </div>
      )}
    </div>
  );
}
