
"use client"; 

import Link from 'next/link';
import { categories } from '@/data/posts'; 
import { posts as allPosts } from '@/data/posts';
import CategoryIcon from '@/components/ai/CategoryIcon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';
import { isPostNew } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export default function CategoriesPage() {
  const { t } = useLanguage();
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
  }, []);

  return (
    <div className={`space-y-8 pb-8 pt-8 ${animationClass}`}>
      <section className="text-center">
        <h1 className="text-xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 text-primary">{t('categoriesTitle', 'Explore Posts by Category')}</h1>
        <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto">
          {t('categoriesSubtitle', 'Find posts tailored to your interests, organized into relevant categories for easy browsing.')}
        </p>
      </section>
      
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const localizedCategoryName = t(category.name);
            const localizedCategoryDescription = t(category.description);
            const iconKeyCategoryName = typeof category.name === 'string' ? category.name : category.name.en!;

            const hasNewInThisCategory = allPosts.some(
              post => post.categorySlug === category.slug && isPostNew(post)
            );

            return (
              <Link href={`/categories/${category.slug}`} key={category.slug} className="block group">
                <Card 
                  className="h-full flex flex-col transform transition-all duration-300 hover:shadow-xl hover:border-primary rounded-xl animate-fadeInUp bg-card"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3 mb-2">
                        <CategoryIcon categoryName={iconKeyCategoryName} className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
                        <CardTitle className="font-headline text-lg sm:text-2xl group-hover:text-primary transition-colors">{localizedCategoryName}</CardTitle>
                      </div>
                      {hasNewInThisCategory && (
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="pulsating-dot-new-ai"></span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('newPostsInCategoryTooltip', 'New posts in this category!')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-4 sm:p-6">
                    <CardDescription>{localizedCategoryDescription}</CardDescription>
                  </CardContent>
                  <CardContent className="p-4 sm:p-6">
                     <p className="text-sm text-primary font-semibold flex items-center">
                       {t('viewPostsButton', 'View Posts')} <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                     </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">{t('noCategoriesAvailable', 'No categories available at the moment.')}</p>
      )}
    </div>
  );
}
