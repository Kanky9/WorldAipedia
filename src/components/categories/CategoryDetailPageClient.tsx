
"use client";

import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/data/posts'; 
import { getPostsByCategorySlugFromFirestore } from '@/lib/firebase'; 
import PostCard from '@/components/blog/PostCard';
import CategoryIcon from '@/components/ai/CategoryIcon';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState, useCallback } from 'react';
import type { Category as CategoryType, Post as PostType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryDetailPageClientProps {
  categorySlug: string;
}

export default function CategoryDetailPageClient({ categorySlug }: CategoryDetailPageClientProps) {
  const { t } = useLanguage();

  const [category, setCategory] = useState<CategoryType | null | undefined>(undefined);
  const [postsInCategory, setPostsInCategory] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationClass, setAnimationClass] = useState('');


  const fetchCategoryData = useCallback(async () => {
    if (categorySlug) {
      setIsLoading(true);
      setError(null);
      const currentCategory = getCategoryBySlug(categorySlug);
      setCategory(currentCategory);

      if (currentCategory) {
        try {
          const posts = await getPostsByCategorySlugFromFirestore(currentCategory.slug);
          // Sort posts by date on the client-side
          const sortedPosts = posts.sort((a, b) => {
            const dateA = a.publishedDate instanceof Date ? a.publishedDate.getTime() : 0;
            const dateB = b.publishedDate instanceof Date ? b.publishedDate.getTime() : 0;
            return dateB - dateA;
          });
          setPostsInCategory(sortedPosts);
          setAnimationClass('animate-fade-in');
        } catch (err) {
          console.error("Error fetching posts for category:", err);
          setError("Failed to load posts for this category.");
          setPostsInCategory([]);
          setAnimationClass('');
        }
      } else {
        setAnimationClass(''); 
      }
      setIsLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  if (isLoading || category === undefined) {
     return (
      <div className="space-y-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
              <Skeleton className="h-8 w-36 sm:h-10 sm:w-48" />
            </div>
            <Skeleton className="h-5 w-60 sm:h-6 sm:w-72" />
          </div>
          <Skeleton className="h-9 w-32 sm:h-10 sm:w-40" />
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
  
  if (error && !isLoading) { 
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Posts</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchCategoryData}>Try Again</Button>
      </div>
    );
  }


  const localizedCategoryName = t(category.name);
  const localizedCategoryDescription = t(category.description);

  return (
    <div className={`space-y-8 ${animationClass} pt-8`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CategoryIcon categoryName={typeof category.name === 'string' ? category.name : category.name.en!} className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-primary">{localizedCategoryName}</h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground">{localizedCategoryDescription}</p>
        </div>
        <Button variant="outline" asChild className="text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 rounded-md">
          <Link href="/categories" className="flex items-center gap-2">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            {t('allCategoriesButton', 'All Categories')}
          </Link>
        </Button>
      </div>

      {postsInCategory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsInCategory.map((post, index) => (
            <div key={post.id} className="animate-fadeInUp" style={{animationDelay: `${index * 0.07}s`}}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg sm:text-xl text-muted-foreground mb-4">
            {t('noPostsInCategory', 'No posts found in the "{categoryName}" category yet.', {categoryName: localizedCategoryName})}
          </p>
          <p className="text-muted-foreground">
            {t('noPostsInCategorySuggestion', 'Check back soon, or explore other categories!')}
          </p>
        </div>
      )}
    </div>
  );
}
