
"use client";

import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation'; // useParams is no longer needed if id is passed as prop
import { getCategoryByName } from '@/data/posts';
// getAllPostsFromFirestore is not needed here as it's for generateStaticParams
import { getPostFromFirestore, deleteCommentFromFirestore, db, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, Timestamp } from '@/lib/firebase';
import AILink from '@/components/ai/AILink';
import CategoryIcon from '@/components/ai/CategoryIcon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, MessageSquare, Star, Tag, UserCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import type { Post as PostType, UserComment } from '@/lib/types';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";
import AdSenseUnit from '@/components/ads/AdSenseUnit';

interface PostPageClientProps {
  postId: string;
}

export default function PostPageClient({ postId }: PostPageClientProps) {
  const router = useRouter();
  const id = postId; // Use the prop directly
  const { t, language } = useLanguage();
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [post, setPost] = useState<PostType | null | undefined>(undefined);
  const [pageAnimationClass, setPageAnimationClass] = useState('');

  const [comments, setComments] = useState<UserComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(0);
  const [isAnonymousComment, setIsAnonymousComment] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showSubscribeAlert, setShowSubscribeAlert] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);


  const fetchComments = useCallback(async (currentPostId: string) => {
    if (!currentPostId) {
      setCommentsLoading(false);
      return;
    }
    setCommentsLoading(true);
    try {
      const commentsRef = collection(db, 'posts', currentPostId, 'comments');
      const q = query(commentsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedComments: UserComment[] = [];
      querySnapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() } as UserComment);
      });
      setComments(fetchedComments);
    } catch (error: any) {
      console.error("Error fetching comments: ", error);
      if (error.code === 'permission-denied' || error.message?.includes('permission-denied') || error.message?.includes('Missing or insufficient permissions')) {
        toast({ variant: "destructive", title: t('errorDefaultTitle', "Error"), description: t('permissionDeniedErrorToastDesc', "You do not have permission to post comments. Please check Firestore rules.") });
      } else {
        toast({ variant: "destructive", title: t('errorDefaultTitle', "Error"), description: t('commentSubmitErrorDesc', "Could not post your comment.") });
      }
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      setPost(undefined);
      setCommentsLoading(true);

      getPostFromFirestore(id).then(currentPost => {
        if (currentPost) {
          setPost(currentPost);
          fetchComments(currentPost.id);
          setPageAnimationClass('animate-scale-up-fade-in');
        } else {
          setPost(null);
          setCommentsLoading(false);
          setPageAnimationClass('');
        }
      }).catch(err => {
        console.error("Error fetching post from Firestore:", err);
        setPost(null);
        setCommentsLoading(false);
        toast({variant: "destructive", title: t('errorDefaultTitle', "Error"), description: t('errorLoadingPost', "Failed to load post.")})
      });
    } else {
      setCommentsLoading(false);
    }
  }, [id, fetchComments, toast, t]);

  const getPostDateLocale = () => {
    switch (language) {
      case 'es': return es;
      case 'en': default: return enUS;
    }
  };
  const postDateLocale = getPostDateLocale();

  const handleCommentSubmit = async (e: React.FormEvent) => {
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
      toast({ variant: "destructive", title: t('commentMissingInfoTitle', "Missing Information"), description: t('commentMissingInfoDesc', "Please provide a rating and a comment.")});
      return;
    }
    if (!post || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const newCommentData = {
      postId: post.id,
      userId: currentUser.uid,
      username: isAnonymousComment ? t('anonymousCommentLabel', "Anonymous") : (currentUser.username || currentUser.displayName || "User"),
      profileImageUrl: isAnonymousComment ? null : (currentUser.photoURL || null),
      isAnonymous: isAnonymousComment,
      rating: newCommentRating,
      text: newCommentText,
      timestamp: serverTimestamp(),
    };

    try {
      const commentCollectionRef = collection(db, 'posts', post.id, 'comments');
      await addDoc(commentCollectionRef, newCommentData);
      fetchComments(post.id);
      setNewCommentText('');
      setNewCommentRating(0);
      setIsAnonymousComment(false);
      toast({ title: t('commentSubmittedSuccessTitle', "Comment Submitted"), description: t('commentSubmittedSuccessDesc', "Your comment has been posted.") });
    } catch (error: any) {
      console.error("Error submitting comment: ", error);
      if (error.code === 'permission-denied' || error.message?.includes('permission-denied') || error.message?.includes('Missing or insufficient permissions')) {
         toast({ variant: "destructive", title: t('commentSubmitErrorTitle', "Submission Error"), description: t('permissionDeniedErrorToastDesc', "You do not have permission to post comments. Please check Firestore rules.")});
      } else {
         toast({ variant: "destructive", title: t('commentSubmitErrorTitle', "Submission Error"), description: t('commentSubmitErrorDesc', "Could not post your comment.")});
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteCommentClicked = (commentId: string) => {
    setCommentToDeleteId(commentId);
    setShowDeleteCommentConfirm(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDeleteId || !post) return;
    try {
      await deleteCommentFromFirestore(post.id, commentToDeleteId);
      toast({ title: t('commentDeletedSuccess', "Comment deleted successfully.") });
      setComments(prevComments => prevComments.filter(c => c.id !== commentToDeleteId));
    } catch (deleteError) {
      console.error("Error deleting comment:", deleteError);
      toast({ variant: "destructive", title: t('commentDeleteError', "Failed to delete comment.") });
    } finally {
      setShowDeleteCommentConfirm(false);
      setCommentToDeleteId(null);
    }
  };


  if (post === undefined && !authLoading) { // Still loading post data
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

  if (!post && !authLoading) { // Post not found after attempting to load
    notFound();
  }

  // Covers auth loading OR post still undefined (initial state or after failed fetch) OR comments still loading
  if (authLoading || post === undefined || (post && commentsLoading && !comments.length) ) {
     return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const categoryData = getCategoryByName(post.category);
  const localizedCategoryName = categoryData ? t(categoryData.name) : post.category;
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
              unoptimized={post.imageUrl.startsWith('data:')}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-2 text-primary">{localizedPostTitle}</h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>{post.publishedDate instanceof Date && postDateLocale ? format(post.publishedDate, 'PPP', { locale: postDateLocale }) : new Date(post.publishedDate as Date).toLocaleDateString()}</span>
            </div>
            {categoryData && (
              <div className="flex items-center gap-1.5">
                <CategoryIcon categoryName={typeof categoryData.name === 'string' ? categoryData.name : categoryData.name.en!} className="h-4 w-4 text-primary" />
                <Link href={`/categories/${categoryData.slug}`} className="hover:underline">{localizedCategoryName}</Link>
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
              text={t('visitAiToolWebsiteButton', 'Visit Tool Website')}
            />
          )}

          <div className="ads-content my-6 flex justify-center">
            {/* Placeholder para anuncio dentro del contenido */}
          </div>

          <h2 className="text-xl sm:text-2xl font-headline font-semibold mt-8 mb-3">{t('postContentTitle', 'Post Content')}</h2>
          <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {t(post.longDescription)}
          </article>

          <div className="ads-content my-6 flex justify-center">
              {/* Placeholder para anuncio dentro del contenido */}
          </div>

          {(post.detailImageUrl1 || post.detailImageUrl2) && (
            <div className="mt-10">
              <h3 className="text-lg sm:text-xl font-headline font-semibold mb-4 text-primary/90">{t('additionalVisualsTitle', 'Visual Insights')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {post.detailImageUrl1 && (
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <Image
                      src={post.detailImageUrl1}
                      alt={localizedPostTitle + " - " + t('visualDetailAlt', 'Visual Detail 1', {number: '1'})}
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint={post.detailImageHint1 || "AI concept"}
                      className="transform transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      unoptimized={post.detailImageUrl1.startsWith('data:')}
                    />
                  </div>
                )}
                {post.detailImageUrl2 && (
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <Image
                      src={post.detailImageUrl2}
                      alt={localizedPostTitle + " - " + t('visualDetailAlt', 'Visual Detail 2', {number: '2'})}
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint={post.detailImageHint2 || "AI technology"}
                      className="transform transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      unoptimized={post.detailImageUrl2.startsWith('data:')}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <section className="space-y-6 py-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-headline font-semibold text-primary flex items-center gap-2">
          <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7" />
          {t('userReviewsTitle', "User Reviews & Comments")}
        </h2>

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
                  disabled={!currentUser || !currentUser.isSubscribed || isSubmittingComment || authLoading}
                />
              </div>
              <div>
                <Label htmlFor="comment" className="mb-1 block">{t('commentLabel', "Your Comment")}</Label>
                <Textarea
                  id="comment"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={!currentUser ? t('loginToCommentPrompt') : (!currentUser.isSubscribed ? t('subscribeToCommentDescription') : t('commentLabel', "Your Comment"))}
                  rows={4}
                  disabled={!currentUser || !currentUser.isSubscribed || isSubmittingComment || authLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymousComment}
                  onCheckedChange={(checked) => setIsAnonymousComment(Boolean(checked))}
                  disabled={!currentUser || !currentUser.isSubscribed || isSubmittingComment || authLoading}
                />
                <Label htmlFor="anonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {t('anonymousCommentLabel', "Comment Anonymously")}
                </Label>
              </div>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={isSubmittingComment || authLoading || (!currentUser || (!currentUser.isSubscribed && newCommentText !== ''))}
              >
                {isSubmittingComment ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                {t('submitCommentButton', "Submit Comment")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {commentsLoading && comments.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              isAdmin={currentUser?.isAdmin}
              onDelete={handleDeleteCommentClicked}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4">{t('noCommentsYet', "No comments yet. Be the first to share your thoughts!")}</p>
        )}
      </section>

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
              <Link href="/login">{t('loginButton')}</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              <Link href="/account">{t('subscribeButton')}</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteCommentConfirm} onOpenChange={setShowDeleteCommentConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteCommentConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteCommentConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteCommentConfirm(false)}>{t('cancelButton')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteComment} className="bg-destructive hover:bg-destructive/90">
              {t('deleteButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
