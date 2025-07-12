
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  writeBatch,
  deleteDoc,
  where,
  getDocs,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import {
  ref as storageRef,
  deleteObject as deleteFirebaseStorageObject,
} from 'firebase/storage';
import { db, storage, deletePublicationFromFirestore } from '@/lib/firebase';
import type { ProPost, ProComment, ProReply } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ShieldAlert, Trash2, Heart, MessageCircle, Send, PlusCircle, User, List } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS, it, ja, pt, zhCN } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CreatePublicationDialog from '@/components/publications/CreatePublicationDialog';
import CommentSection from '@/components/publications/CommentSection';
import { cn } from '@/lib/utils';

const localeMap: { [key: string]: Locale } = {
  es, en: enUS, it, ja, pt, zhCN
};

function PostCard({ post, onDelete }: { post: ProPost; onDelete: (postId: string) => void; }) {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (!currentUser) return;
    const postRef = doc(db, 'pro-posts', post.id);
    const batch = writeBatch(db);

    const isLiked = post.likes.includes(currentUser.uid);
    const newLikes = isLiked
      ? post.likes.filter(uid => uid !== currentUser.uid)
      : [...post.likes, currentUser.uid];
    
    batch.update(postRef, { likes: newLikes, likeCount: newLikes.length });
    
    await batch.commit();
  };
  
  const hasLiked = currentUser ? post.likes.includes(currentUser.uid) : false;
  const canDelete = currentUser && (currentUser.isAdmin || currentUser.uid === post.authorId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar>
          <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} data-ai-hint="user avatar" />
          <AvatarFallback>{post.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col">
          <span className="font-semibold">{post.authorName}</span>
          <span className="text-xs text-muted-foreground">
            {post.createdAt && formatDistanceToNow( (post.createdAt as any).toDate(), { addSuffix: true, locale: localeMap[language] || enUS })}
          </span>
        </div>
        {canDelete && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(post.id)}>
            <Trash2 className="h-4 w-4"/>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="whitespace-pre-wrap mb-4">{post.text}</p>
        {post.imageUrl && (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden">
            <Image src={post.imageUrl} alt="Post image" layout="fill" objectFit="cover" data-ai-hint={post.imageHint || "publication image"} />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-start gap-4">
        <Button variant={hasLiked ? "default" : "ghost"} size="sm" onClick={handleLike} disabled={!currentUser}>
          <Heart className={`mr-2 h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
          {post.likeCount}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
          <MessageCircle className="mr-2 h-4 w-4" />
          {post.commentCount || 0} {t('commentButton')}
        </Button>
      </CardFooter>
      {showComments && <CommentSection postId={post.id} postAuthorId={post.authorId} />}
    </Card>
  );
}


export default function PublicationsPage() {
  const { currentUser, loading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  
  const [allPosts, setAllPosts] = useState<ProPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ProPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postToDelete, setPostToDelete] = useState<ProPost | null>(null);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'mine' | 'liked'>('all');

  useEffect(() => {
    setIsLoadingPosts(true);
    const q = query(collection(db, 'pro-posts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProPost));
      setAllPosts(fetchedPosts);
      setIsLoadingPosts(false);
    }, (error) => {
        console.error("Error fetching publications:", error);
        toast({ 
          variant: 'destructive', 
          title: t('errorText'), 
          description: "Could not load publications. A Firestore index is likely missing. Check the browser console for a link to create it.",
        });
        setIsLoadingPosts(false);
    });

    return () => unsubscribe();
  }, [toast, t]);

  useEffect(() => {
    if (!currentUser) {
      setFilteredPosts(allPosts);
      return;
    }
    if (filter === 'mine') {
        setFilteredPosts(allPosts.filter(p => p.authorId === currentUser.uid));
    } else if (filter === 'liked') {
        setFilteredPosts(allPosts.filter(p => p.likes.includes(currentUser.uid)));
    } else {
        setFilteredPosts(allPosts);
    }
  }, [allPosts, filter, currentUser]);

  
  const handleDeleteClick = (postId: string) => {
    const post = allPosts.find(p => p.id === postId);
    if (post) {
      setPostToDelete(post);
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await deletePublicationFromFirestore(postToDelete.id);
      toast({ title: "Publication Deleted", description: "The publication has been successfully removed." });
    } catch (error) {
      console.error("Error deleting publication:", error);
      toast({ variant: "destructive", title: "Deletion Failed", description: "Could not delete the publication." });
    } finally {
      setPostToDelete(null);
    }
  };

  const isUserPro = currentUser?.isSubscribed === true;

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }
  
  return (
    <>
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-headline font-bold text-primary">{t('publicationsTitle')}</h1>
          <p className="text-muted-foreground">{t('publicationsSubtitle')}</p>
        </div>

        <div className="relative">
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex gap-2">
                    <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} disabled={!isUserPro}>
                        <List className="mr-2 h-4 w-4"/> All
                    </Button>
                    <Button variant={filter === 'mine' ? 'default' : 'outline'} onClick={() => setFilter('mine')} disabled={!isUserPro}>
                        <User className="mr-2 h-4 w-4"/> My Publications
                    </Button>
                     <Button variant={filter === 'liked' ? 'default' : 'outline'} onClick={() => setFilter('liked')} disabled={!isUserPro}>
                        <Heart className="mr-2 h-4 w-4"/> My Likes
                    </Button>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} disabled={!isUserPro}>
                    <PlusCircle className="mr-2 h-4 w-4"/> New Publication
                </Button>
            </div>

            <div className={cn("space-y-6", !isUserPro && "blur-sm pointer-events-none")}>
              {isLoadingPosts ? (
                <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map(post => <PostCard key={post.id} post={post} onDelete={handleDeleteClick} />)
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <p>{filter === 'all' ? t('noPublicationsYet') : filter === 'mine' ? 'You have not created any publications yet.' : 'You have not liked any publications yet.'}</p>
                </div>
              )}
            </div>

            {!isUserPro && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center text-center z-10 rounded-lg backdrop-blur-sm">
                   <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                   <h2 className="text-2xl font-bold mb-2">{t('publicationsAccessDenied')}</h2>
                   {currentUser ? (
                     <>
                        <p className="text-muted-foreground mb-4">{t('publicationsUpgradePrompt')}</p>
                        <Button asChild><Link href="/account">{t('upgradeToProButton')}</Link></Button>
                     </>
                   ) : (
                     <>
                        <p className="text-muted-foreground mb-4">{t('publicationsLoginPrompt')}</p>
                        <Button asChild><Link href="/login">{t('loginButton')}</Link></Button>
                     </>
                   )}
                </div>
            )}
        </div>
      </div>
      
      <CreatePublicationDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      <AlertDialog open={!!postToDelete} onOpenChange={(isOpen) => !isOpen && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this publication? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
