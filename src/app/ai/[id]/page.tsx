
"use client"; 

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation'; 
import { getAiToolById, getCategoryByName } from '@/data/ai-tools';
import AILink from '@/components/ai/AILink';
import CategoryIcon from '@/components/ai/CategoryIcon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';
import type { AITool, UserComment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import StarRatingInput from '@/components/ai/StarRatingInput';
import CommentCard from '@/components/ai/CommentCard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useChat } from '@/contexts/ChatContext'; // For opening chat with context
import ScrollDownIndicator from '@/components/ui/ScrollDownIndicator'; // For scroll arrow

interface MockUser {
  username: string;
  isSubscribed: boolean;
  profileImageUrl?: string;
}

export default function AIPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { t, language } = useLanguage(); // Get language for resolving localized strings
  const { openChat } = useChat(); // Hook to open global chat

  const [aiTool, setAiTool] = useState<AITool | null | undefined>(undefined); 
  const [pageAnimationClass, setPageAnimationClass] = useState('');
  const [mockUser, setMockUser] = useState<MockUser | null>({ username: "DemoUserBasic", isSubscribed: false }); 
  const [comments, setComments] = useState<UserComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState(false);

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0); // Scroll to top when AI tool data/ID changes
      const tool = getAiToolById(id);
      setAiTool(tool);
      if (tool) {
        setPageAnimationClass('animate-scale-up-fade-in');
        setComments([
          { id: '1', aiToolId: id, username: 'AliceWonder', rating: 5, text: t('noCommentsYet', 'Great tool, very intuitive!'), timestamp: new Date(Date.now() - 86400000), isAnonymous: false, profileImageUrl: "https://placehold.co/40x40.png?text=AW"},
          { id: '2', aiToolId: id, username: 'BobTheBuilder', rating: 4, text: t('noCommentsYet','Good, but could use more features.'), timestamp: new Date(Date.now() - 172800000), isAnonymous: false, profileImageUrl: "https://placehold.co/40x40.png?text=BB"},
          { id: '3', aiToolId: id, username: 'AnonymousUser', rating: 3, text: t('noCommentsYet','It is okay.'), timestamp: new Date(Date.now() - 259200000), isAnonymous: true},
        ]);
      } else {
        setPageAnimationClass(''); 
      }
    }
  }, [id, t]); // t is included if it's used in comment loading logic

  const handleCommentSubmit = () => {
    if (!mockUser) { 
        alert(t('loginToCommentPrompt', "Please log in to comment."));
        return;
    }
    if (!mockUser.isSubscribed) {
      setShowSubscriptionAlert(true);
      return;
    }
    if (!newCommentText.trim() || newCommentRating === 0) {
      return;
    }

    const newComment: UserComment = {
      id: crypto.randomUUID(),
      aiToolId: id,
      username: mockUser.username,
      isAnonymous,
      rating: newCommentRating,
      text: newCommentText,
      timestamp: new Date(),
      profileImageUrl: mockUser.profileImageUrl,
    };
    setComments(prevComments => [newComment, ...prevComments]);
    setNewCommentText('');
    setNewCommentRating(0);
    setIsAnonymous(false);
  };

  if (aiTool === undefined) { 
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-28 sm:h-10 sm:w-32 mb-6" />
        <Card className="overflow-hidden shadow-lg rounded-xl">
          <CardHeader className="p-0">
            <Skeleton className="relative w-full h-60 sm:h-72 md:h-96" />
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 sm:h-10 mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-8 w-20 sm:h-10 sm:w-24" /> 
              <Skeleton className="h-8 w-28 sm:h-10 sm:w-32" />
            </div>
            <Skeleton className="h-7 w-1/3 sm:h-8 sm:w-1/4 mt-8 mb-3" />
            <Skeleton className="h-5 w-full sm:h-6 mb-2" />
            <Skeleton className="h-5 w-full sm:h-6 mb-2" />
            <Skeleton className="h-5 w-5/6 sm:h-6" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!aiTool) {
    notFound();
  }
  
  const category = getCategoryByName(aiTool.category);
  const localizedCategoryName = category ? t(category.name) : aiTool.category;
  const localizedToolTitle = t(aiTool.title);
  const localizedShortDescription = t(aiTool.shortDescription);


  return (
    <div className={`relative space-y-10 ${pageAnimationClass}`}> {/* Added relative for ScrollDownIndicator positioning */}
      <ScrollDownIndicator />
      <Button variant="outline" asChild className="mb-6 text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 rounded-md">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          {t('backToHomeButton', 'Back to Home')}
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-xl rounded-xl">
        <CardHeader className="p-0">
          <div className="relative w-full h-60 sm:h-72 md:h-96">
            <Image
              src={aiTool.imageUrl}
              alt={localizedToolTitle}
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-ai-hint={aiTool.imageHint || "technology banner"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="rounded-t-xl"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 text-primary">{localizedToolTitle}</h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6"> {/* Adjusted gap */}
            {category && (
              <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                <CategoryIcon categoryName={typeof category.name === 'string' ? category.name : category.name.en!} className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-primary" />
                <span>{localizedCategoryName}</span>
              </div>
            )}
            <AILink 
              href={aiTool.link} 
              logoUrl={aiTool.logoUrl} 
              logoHint={aiTool.logoHint}
              text={t('visitWebsiteButton', 'Visit Website')}
            />
             <Button
              variant="outline"
              onClick={() => {
                openChat({
                  title: localizedToolTitle,
                  shortDescription: localizedShortDescription,
                  link: aiTool.link,
                });
              }}
              className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground shadow-sm transform hover:scale-105 transition-all duration-300 ease-out text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 rounded-md group"
            >
              <MessageSquare className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:rotate-[10deg]" />
              {t('chatAboutAiButton', 'Chat about {toolName}', { toolName: localizedToolTitle })}
            </Button>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-headline font-semibold mt-8 mb-3">{t('aboutSectionTitle', 'About {toolTitle}', {toolTitle: localizedToolTitle})}</h2>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {t(aiTool.longDescription)}
          </p>

          {(aiTool.detailImageUrl1 || aiTool.detailImageUrl2) && (
            <div className="mt-10">
              <h3 className="text-lg sm:text-xl font-headline font-semibold mb-4 text-primary/90">{t('additionalVisualsTitle', 'Visual Insights')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {aiTool.detailImageUrl1 && (
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <Image
                      src={aiTool.detailImageUrl1}
                      alt={localizedToolTitle + " - " + t('visualDetailAlt', 'Visual Detail 1')}
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint={aiTool.detailImageHint1 || "AI concept"}
                      className="transform transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                )}
                {aiTool.detailImageUrl2 && (
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <Image
                      src={aiTool.detailImageUrl2}
                      alt={localizedToolTitle + " - " + t('visualDetailAlt', 'Visual Detail 2')}
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint={aiTool.detailImageHint2 || "AI technology"}
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

      <section className="space-y-6 py-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-headline font-semibold text-primary flex items-center gap-2">
          <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7" />
          {t('userReviewsTitle')}
        </h2>

        {mockUser && (
            <Card className="shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{t('addYourCommentTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <Label htmlFor="rating" className="text-sm font-medium">{t('ratingLabel')}</Label>
                <StarRatingInput value={newCommentRating} onChange={setNewCommentRating} />
                </div>
                <div>
                <Label htmlFor="comment" className="text-sm font-medium">{t('commentLabel')}</Label>
                <Textarea
                    id="comment"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={t('laceChatPlaceholder', 'Share your thoughts...')}
                    rows={3}
                    className="mt-1"
                />
                </div>
                <div className="flex items-center space-x-2">
                <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous(checked as boolean)} />
                <Label htmlFor="anonymous" className="text-sm font-medium text-muted-foreground">
                    {t('anonymousCommentLabel')}
                </Label>
                </div>
                <Button onClick={handleCommentSubmit} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 rounded-md">
                    {t('submitCommentButton')}
                </Button>
            </CardContent>
            </Card>
        )}
         {!mockUser && (
            <Card className="shadow-lg rounded-xl p-6 text-center">
                <p className="text-muted-foreground">{t('loginToCommentPrompt', 'Please log in to leave a comment and rate this AI.')}</p>
                 <Button onClick={() => { alert(t('loginButton', "Login")); }} className="mt-4">
                    {t('loginButton')}
                </Button>
            </Card>
        )}

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map(comment => <CommentCard key={comment.id} comment={comment} />)
          ) : (
            <p className="text-muted-foreground text-center py-4">{t('noCommentsYet')}</p>
          )}
        </div>
      </section>

      <AlertDialog open={showSubscriptionAlert} onOpenChange={setShowSubscriptionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('subscribeToCommentTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('subscribeToCommentDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSubscriptionAlert(false)}>{t('cancelButton')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              alert("Redirecting to subscription page (simulation)...");
              setShowSubscriptionAlert(false);
            }}>{t('subscribeButton')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
