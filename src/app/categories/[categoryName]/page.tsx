
"use client"; 

import { notFound, useParams } from 'next/navigation';
import { getPostsByCategory, getCategoryBySlug } from '@/data/posts'; // Changed from ai-tools
import PostCard from '@/components/blog/PostCard'; // Changed from AICard
import CategoryIcon from '@/components/ai/CategoryIcon';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';
import type { Category as CategoryType, Post as PostType } from '@/lib/types'; // Changed AITool to Post
import { Skeleton } from '@/components/ui/skeleton';


export default function CategoryDetailPage() {
  const params = useParams();
  const categorySlug = typeof params.categoryName === 'string' ? params.categoryName : '';
  const { t } = useLanguage();
  
  const [category, setCategory] = useState<CategoryType | null | undefined>(undefined);
  const [postsInCategory, setPostsInCategory] = useState<PostType[]>([]); // Changed from AITool[]
  const [isLoading, setIsLoading] = useState(true);
  const [animationClass, setAnimationClass] = useState('');


  useEffect(() => {
    if (categorySlug) {
      setIsLoading(true);
      const currentCategory = getCategoryBySlug(categorySlug);
      setCategory(currentCategory);
      if (currentCategory) {
        const posts = getPostsByCategory(categorySlug); // Changed from tools
        setPostsInCategory(posts);
        setAnimationClass('animate-fade-in'); 
      } else {
        setAnimationClass('');
      }
      setIsLoading(false);
    }
  }, [categorySlug]);

  if (isLoading || category === undefined) { 
     return (
      <div className="space-y-8">
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

  const localizedCategoryName = t(category.name);
  const localizedCategoryDescription = t(category.description);

  return (
    <div className={`space-y-8 ${animationClass}`}>
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
          {postsInCategory.map((post, index) => ( // Changed from tool to post
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
