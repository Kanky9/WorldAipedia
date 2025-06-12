
"use client"; 

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation'; 
import { getPostById, getCategoryByName } from '@/data/posts'; // Changed from ai-tools
import AILink from '@/components/ai/AILink'; // This component can be reused if a post links to a tool
import CategoryIcon from '@/components/ai/CategoryIcon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';
import type { Post } from '@/lib/types'; // Changed from AITool
import { Skeleton } from '@/components/ui/skeleton';
// Comment-related imports might be re-added later based on new requirements
// import { Textarea } from '@/components/ui/textarea';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import StarRatingInput from '@/components/ai/StarRatingInput';
// import CommentCard from '@/components/ai/CommentCard';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
// import { useChat } from '@/contexts/ChatContext'; 
import ScrollDownIndicator from '@/components/ui/ScrollDownIndicator'; 
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function PostPage() { // Renamed from AIPage
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { t, language } = useLanguage(); 

  const [post, setPost] = useState<Post | null | undefined>(undefined); 
  const [pageAnimationClass, setPageAnimationClass] = useState('');

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0); 
      const currentPost = getPostById(id);
      setPost(currentPost);
      if (currentPost) {
        setPageAnimationClass('animate-scale-up-fade-in');
      } else {
        setPageAnimationClass(''); 
      }
    }
  }, [id, t]);

  const postDateLocale = language === 'es' ? require('date-fns/locale/es') : require('date-fns/locale/en-US');


  if (post === undefined) { 
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-28 sm:h-10 sm:w-32 mb-6" />
        <Card className="overflow-hidden shadow-lg rounded-xl bg-card">
          <CardHeader className="p-0">
            <Skeleton className="relative w-full h-60 sm:h-72 md:h-96" />
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 sm:h-10 mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-8 w-20 sm:h-10 sm:w-24" /> 
              <Skeleton className="h-8 w-28 sm:h-10 sm:w-32" />
            </div>
            <Skeleton className="h-5 w-1/4 mb-2" /> {/* For date */}
            <Skeleton className="h-7 w-1/3 sm:h-8 sm:w-1/4 mt-8 mb-3" />
            <Skeleton className="h-5 w-full sm:h-6 mb-2" />
            <Skeleton className="h-5 w-full sm:h-6 mb-2" />
            <Skeleton className="h-5 w-5/6 sm:h-6" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!post) {
    notFound();
  }
  
  const category = getCategoryByName(post.category);
  const localizedCategoryName = category ? t(category.name) : post.category;
  const localizedPostTitle = t(post.title);
  // const localizedShortDescription = t(post.shortDescription); // Potentially used by chat


  return (
    <div className={`relative space-y-10 ${pageAnimationClass}`}>
      <ScrollDownIndicator />
      <Button variant="outline" asChild className="mb-6 text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 rounded-md">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          {t('backToBlogButton', 'Back to Blog')}
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-xl rounded-xl bg-card">
        <CardHeader className="p-0">
          <div className="relative w-full h-60 sm:h-72 md:h-96">
            <Image
              src={post.imageUrl}
              alt={localizedPostTitle}
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-ai-hint={post.imageHint || "technology banner"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="rounded-t-xl"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-2 text-primary">{localizedPostTitle}</h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>{format(new Date(post.publishedDate), 'PPP', { locale: postDateLocale })}</span>
            </div>
            {category && (
              <div className="flex items-center gap-1.5">
                <CategoryIcon categoryName={typeof category.name === 'string' ? category.name : category.name.en!} className="h-4 w-4 text-primary" />
                <Link href={`/categories/${category.slug}`} className="hover:underline">{localizedCategoryName}</Link>
              </div>
            )}
          </div>
           {post.tags && post.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs"><Tag className="h-3 w-3 mr-1"/>{tag}</Badge>
              ))}
            </div>
          )}
          
          {post.link && (
             <AILink 
              href={post.link} 
              logoUrl={post.logoUrl} 
              logoHint={post.logoHint}
              text={t('visitAiToolWebsiteButton', 'Visit Tool Website')} // Specific text if post is about a tool
            />
          )}
          {/* Chat about AI button removed for now, to be reconsidered with new subscription model
             <Button
              variant="outline"
              onClick={() => {
                openChat({
                  title: localizedPostTitle,
                  shortDescription: localizedShortDescription,
                  link: post.link,
                });
              }}
              className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground shadow-sm transform hover:scale-105 transition-all duration-300 ease-out text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 rounded-md group"
            >
              <MessageSquare className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:rotate-[10deg]" />
              {t('chatAboutPostButton', 'Chat about this Post')}
            </Button>
          */}
          
          <h2 className="text-xl sm:text-2xl font-headline font-semibold mt-8 mb-3">{t('postContentTitle', 'Post Content')}</h2>
          <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {t(post.longDescription)}
          </article>

          {(post.detailImageUrl1 || post.detailImageUrl2) && (
            <div className="mt-10">
              <h3 className="text-lg sm:text-xl font-headline font-semibold mb-4 text-primary/90">{t('additionalVisualsTitle', 'Visual Insights')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {post.detailImageUrl1 && (
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <Image
                      src={post.detailImageUrl1}
                      alt={localizedPostTitle + " - " + t('visualDetailAlt', 'Visual Detail 1')}
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint={post.detailImageHint1 || "AI concept"}
                      className="transform transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                )}
                {post.detailImageUrl2 && (
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <Image
                      src={post.detailImageUrl2}
                      alt={localizedPostTitle + " - " + t('visualDetailAlt', 'Visual Detail 2')}
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint={post.detailImageHint2 || "AI technology"}
                      className="transform transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing comments section is removed for now. Will be rebuilt with new auth/subscription logic. */}
      {/* 
      <section className="space-y-6 py-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-headline font-semibold text-primary flex items-center gap-2">
          <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7" />
          {t('userReviewsTitle')}
        </h2>
        ...
      </section>
      */}
    </div>
  );
}
