
"use client"; 

import Image from 'next/image';
import { notFound, useParams, useRouter } from 'next/navigation'; // Added useRouter
import { getPostById, getCategoryByName } from '@/data/posts'; 
import AILink from '@/components/ai/AILink'; 
import CategoryIcon from '@/components/ai/CategoryIcon';
import { Card, CardContent, CardHeader } from '@/components/ui/card'; 
import Link from 'next/link';
import { ArrowLeft, CalendarDays, MessageSquare, Star, Tag, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';
import type { Post, UserComment, User } from '@/lib/types'; 
import { Skeleton } from '@/components/ui/skeleton';
import ScrollDownIndicator from '@/components/ui/ScrollDownIndicator'; 
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale'; 
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import StarRatingInput from '@/components/ai/StarRatingInput';
import CommentCard from '@/components/ai/CommentCard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock user for simulating login state - in a real app, this would come from auth context
const mockUser: User = { 
  id: "simulated-user-basic", 
  username: "DemoUser", 
  email: "demo@example.com", 
  isSubscribed: false, // Set to true to simulate PRO user
  profileImageUrl: "https://placehold.co/40x40.png?text=DU"
};

// const mockUserPro: User = { 
//   id: "simulated-user-pro", 
//   username: "ProUser", 
//   email: "pro@example.com", 
//   isSubscribed: true,
//   profileImageUrl: "https://placehold.co/40x40.png?text=PU"
// };


export default function PostPage() { 
  const params = useParams();
  const router = useRouter(); // Added for programmatic navigation if needed
  const id = typeof params.id === 'string' ? params.id : '';
  const { t, language } = useLanguage(); 

  const [post, setPost] = useState<Post | null | undefined>(undefined); 
  const [pageAnimationClass, setPageAnimationClass] = useState('');

  // Comment State
  const [comments, setComments] = useState<UserComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(0);
  const [isAnonymousComment, setIsAnonymousComment] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showSubscribeAlert, setShowSubscribeAlert] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(mockUser); // Use mockUser, can be toggled

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0); 
      const currentPost = getPostById(id);
      setPost(currentPost);
      if (currentPost) {
        setComments(currentPost.comments || []);
        setPageAnimationClass('animate-scale-up-fade-in');
      } else {
        setPageAnimationClass(''); 
      }
    }
  }, [id]); 

  const getPostDateLocale = () => {
    switch (language) {
      case 'es':
        return es;
      case 'en':
      default:
        return enUS;
    }
  };
  const postDateLocale = getPostDateLocale();

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setShowLoginAlert(true);
      return;
    }
    if (!currentUser.isSubscribed) {
      setShowSubscribeAlert(true);
      return;
    }
    if (newCommentText.trim() === '' || newCommentRating === 0) {
      // Basic validation, can be improved
      alert('Please provide a rating and a comment.');
      return;
    }

    const newComment: UserComment = {
      id: crypto.randomUUID(),
      postId: post!.id,
      username: currentUser.username,
      profileImageUrl: currentUser.profileImageUrl,
      isAnonymous: isAnonymousComment,
      rating: newCommentRating,
      text: newCommentText,
      timestamp: new Date(),
    };
    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
    setNewCommentRating(0);
    setIsAnonymousComment(false);
  };


  if (post === undefined) { 
    return (
      <div className="space-y-6"> 
        <Skeleton className="h-8 w-28 sm:h-10 sm:w-32 mb-4" /> 
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
            <Skeleton className="h-5 w-1/4 mb-2" /> 
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


  return (
    <div className={`relative space-y-8 ${pageAnimationClass}`}> 
      <ScrollDownIndicator />
      <Button variant="outline" asChild className="mb-4 text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 rounded-md"> 
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
              <span>{post.publishedDate && postDateLocale ? format(post.publishedDate, 'PPP', { locale: postDateLocale }) : new Date(post.publishedDate).toLocaleDateString()}</span>
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
              text={t('visitAiToolWebsiteButton', 'Visit Tool Website')} 
            />
          )}
          
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

      {/* Comments Section */}
      <section className="space-y-6 py-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-headline font-semibold text-primary flex items-center gap-2">
          <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7" />
          {t('userReviewsTitle', "User Reviews & Comments")}
        </h2>

        {/* Add Comment Form */}
        <Card className="shadow-lg bg-card/80 border border-border/50">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">{t('addYourCommentTitle', "Add Your Comment")}</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <Label htmlFor="rating" className="mb-1 block">{t('ratingLabel', "Your Rating")}</Label>
                <StarRatingInput 
                  value={newCommentRating} 
                  onChange={setNewCommentRating}
                  disabled={!currentUser || !currentUser.isSubscribed}
                />
              </div>
              <div>
                <Label htmlFor="comment" className="mb-1 block">{t('commentLabel', "Your Comment")}</Label>
                <Textarea
                  id="comment"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={!currentUser ? t('loginToCommentPrompt') : (!currentUser.isSubscribed ? t('subscribeToCommentDescription') : "Share your thoughts...")}
                  rows={4}
                  disabled={!currentUser || !currentUser.isSubscribed}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="anonymous" 
                  checked={isAnonymousComment}
                  onCheckedChange={(checked) => setIsAnonymousComment(Boolean(checked))}
                  disabled={!currentUser || !currentUser.isSubscribed}
                />
                <Label htmlFor="anonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {t('anonymousCommentLabel', "Comment Anonymously")}
                </Label>
              </div>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={!currentUser || (!currentUser.isSubscribed && newCommentText !== '')} // Enable if not PRO but only to trigger alert
              >
                {t('submitCommentButton', "Submit Comment")}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Display Comments */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">{t('noCommentsYet', "No comments yet. Be the first to share your thoughts!")}</p>
          )}
        </div>
      </section>

      {/* Login Alert Dialog */}
      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('loginToCommentTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('loginToCommentDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLoginAlert(false)}>{t('cancelButton')}</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/login" legacyBehavior passHref>
                <a>{t('loginButton')}</a>
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Subscribe Alert Dialog */}
      <AlertDialog open={showSubscribeAlert} onOpenChange={setShowSubscribeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('subscribeToCommentTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('subscribeToCommentDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSubscribeAlert(false)}>{t('cancelButton')}</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/account" legacyBehavior passHref>
                <a>{t('subscribeButton')}</a>
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    