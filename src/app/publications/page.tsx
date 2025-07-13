
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
import { db, storage, deletePublicationFromFirestore, savePost, unsavePost, getSavedPosts, createNotification } from '@/lib/firebase';
import type { ProPost, ProComment, ProReply, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ShieldAlert, Trash2, Heart, MessageCircle, Send, PlusCircle, User as UserIcon, List, UserPlus, Check, ChevronDown, ChevronUp, Bookmark, Bell } from 'lucide-react';
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
import UserSearch from '@/components/publications/UserSearch';
import NotificationsPanel from '@/components/publications/NotificationsPanel';

const localeMap: { [key: string]: Locale } = {
  es, en: enUS, it, ja, pt, zhCN
};

function PostCard({ post, onDelete }: { post: ProPost; onDelete: (postId: string) => void; }) {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasLiked = currentUser ? post.likes.includes(currentUser.uid) : false;
  const hasSaved = currentUser ? post.saves.includes(currentUser.uid) : false;

  const handleLike = async () => {
    if (!currentUser || isLiking) return;
    setIsLiking(true);
    const postRef = doc(db, 'pro-posts', post.id);
    const batch = writeBatch(db);

    const isLiked = post.likes.includes(currentUser.uid);
    const newLikes = isLiked
      ? post.likes.filter(uid => uid !== currentUser.uid)
      : [...post.likes, currentUser.uid];
    
    batch.update(postRef, { likes: newLikes, likeCount: newLikes.length });

    try {
      await batch.commit();
       if (!isLiked && post.authorId !== currentUser.uid) {
         createNotification({
          recipientId: post.authorId,
          actorId: currentUser.uid,
          actorName: currentUser.username || currentUser.displayName || 'A user',
          actorAvatarUrl: currentUser.photoURL || undefined,
          type: 'like',
          postId: post.id,
          postTextSnippet: post.text.substring(0, 50)
        });
      }
    } catch (e) {
      console.error("Error liking post", e);
    } finally {
        setIsLiking(false);
    }
  };

  const handleSave = async () => {
      if (!currentUser || isSaving) return;
      setIsSaving(true);
      try {
          if (hasSaved) {
              await unsavePost(currentUser.uid, post.id);
          } else {
              await savePost(currentUser.uid, post.id, post.authorId, post.text);
          }
      } catch (e) {
          console.error("Error saving post", e);
      } finally {
          setIsSaving(false);
      }
  };
  
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
        {post.text && <p className="whitespace-pre-wrap">{post.text}</p>}
        {post.imageUrl && (
          <div className="mt-4 relative aspect-video w-full rounded-lg overflow-hidden">
            <Image src={post.imageUrl} alt="Post image" layout="fill" objectFit="cover" data-ai-hint={post.imageHint || "publication image"} />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center">
         <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleLike} disabled={!currentUser || isLiking} className={cn("text-muted-foreground", hasLiked && "text-primary")}>
              <Heart className={`mr-2 h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
              {post.likeCount}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="text-muted-foreground">
              <MessageCircle className="mr-2 h-4 w-4" />
              {post.commentCount || 0}
            </Button>
         </div>
         <Button variant="ghost" size="sm" onClick={handleSave} disabled={!currentUser || isSaving} className={cn("text-muted-foreground", hasSaved && "text-yellow-500")}>
            <Bookmark className={`mr-2 h-4 w-4 ${hasSaved ? 'fill-current' : ''}`} />
            {post.saveCount || 0}
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
  const [filter, setFilter] = useState<'all' | 'mine' | 'liked' | 'saved'>('all');
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  
  const fetchAllPosts = useCallback(() => {
    setIsLoadingPosts(true);
    const q = query(collection(db, 'pro-posts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), saves: doc.data().saves || [], saveCount: doc.data().saveCount || 0 } as ProPost));
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

    return unsubscribe;
  }, [toast, t]);

  useEffect(() => {
    if(!loading && currentUser?.isSubscribed) {
        const unsubscribe = fetchAllPosts();
        return () => unsubscribe();
    } else if (!loading && !currentUser?.isSubscribed) {
        setIsLoadingPosts(false);
    }
  }, [fetchAllPosts, loading, currentUser]);


  const fetchAndSetSavedPosts = useCallback(async () => {
      if (!currentUser || !currentUser.savedPosts || currentUser.savedPosts.length === 0) {
          setFilteredPosts([]);
          setIsLoadingPosts(false);
          return;
      }
      setIsLoadingPosts(true);
      try {
          const saved = await getSavedPosts(currentUser.savedPosts);
          setFilteredPosts(saved);
      } catch (e) {
          console.error("Error fetching saved posts", e);
          toast({ variant: 'destructive', title: "Error", description: "Could not fetch saved posts." });
      } finally {
          setIsLoadingPosts(false);
      }
  }, [currentUser, toast]);

  useEffect(() => {
    setIsLoadingPosts(true);
    if (filter === 'all') {
      setFilteredPosts(allPosts);
      setIsLoadingPosts(false);
    } else {
        if (!currentUser) {
          setFilteredPosts([]);
          setIsLoadingPosts(false);
          return;
        }
        if (filter === 'mine') {
            setFilteredPosts(allPosts.filter(p => p.authorId === currentUser.uid));
            setIsLoadingPosts(false);
        } else if (filter === 'liked') {
            setFilteredPosts(allPosts.filter(p => p.likes.includes(currentUser.uid)));
            setIsLoadingPosts(false);
        } else if (filter === 'saved') {
            fetchAndSetSavedPosts();
        }
    }
  }, [allPosts, filter, currentUser, fetchAndSetSavedPosts]);

  
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
      <div className="py-8 relative">
        <NotificationsPanel isOpen={isNotificationsPanelOpen} onClose={() => setIsNotificationsPanelOpen(false)} />
        <div className="text-center mb-6">
          <h1 className="text-3xl font-headline font-bold text-primary">{t('publicationsTitle')}</h1>
          <p className="text-muted-foreground">{t('publicationsSubtitle')}</p>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-8">
            <aside className="hidden lg:block sticky top-24 self-start">
                <div className="flex flex-col gap-2 w-full">
                    <Button 
                        variant={filter === 'all' ? 'ghost' : 'ghost'} 
                        onClick={() => setFilter('all')} 
                        disabled={!isUserPro} 
                        className={cn(
                            "w-full justify-start hover:bg-primary/20 hover:text-primary", 
                            filter === 'all' ? 'bg-primary/20 text-primary' : ''
                        )}
                    >
                        <List className="mr-2 h-4 w-4"/> All
                    </Button>
                    <Button 
                        variant={filter === 'mine' ? 'ghost' : 'ghost'} 
                        onClick={() => setFilter('mine')} 
                        disabled={!isUserPro} 
                        className={cn(
                            "w-full justify-start hover:bg-primary/20 hover:text-primary", 
                            filter === 'mine' ? 'bg-primary/20 text-primary' : ''
                        )}
                    >
                        <UserIcon className="mr-2 h-4 w-4"/> My Publications
                    </Button>
                     <Button 
                        variant={filter === 'liked' ? 'ghost' : 'ghost'} 
                        onClick={() => setFilter('liked')} 
                        disabled={!isUserPro} 
                        className={cn(
                            "w-full justify-start hover:bg-primary/20 hover:text-primary", 
                            filter === 'liked' ? 'bg-primary/20 text-primary' : ''
                        )}
                     >
                        <Heart className="mr-2 h-4 w-4"/> My Likes
                    </Button>
                    <Button 
                        variant={filter === 'saved' ? 'ghost' : 'ghost'} 
                        onClick={() => setFilter('saved')} 
                        disabled={!isUserPro} 
                        className={cn(
                            "w-full justify-start hover:bg-primary/20 hover:text-primary", 
                            filter === 'saved' ? 'bg-primary/20 text-primary' : ''
                        )}
                     >
                        <Bookmark className="mr-2 h-4 w-4"/> My Saves
                    </Button>
                     <Button 
                        onClick={() => setIsNotificationsPanelOpen(true)}
                        disabled={!isUserPro} 
                        className="w-full justify-start hover:bg-primary/20 hover:text-primary mt-4"
                     >
                        <Bell className="mr-2 h-4 w-4"/> Notifications
                    </Button>
                    <Button 
                        onClick={() => setIsCreateDialogOpen(true)} 
                        disabled={!isUserPro} 
                        className="w-full justify-start mt-4 bg-primary/20 text-primary hover:bg-primary/30"
                    >
                        <PlusCircle className="mr-2 h-4 w-4"/> New Publication
                    </Button>
                </div>
            </aside>

            <main className={cn("flex-1 space-y-6", !isUserPro && "blur-sm pointer-events-none")}>
              {isLoadingPosts ? (
                <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map(post => <PostCard key={post.id} post={post} onDelete={handleDeleteClick} />)
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <p>{filter === 'all' ? t('noPublicationsYet') : filter === 'mine' ? 'You have not created any publications yet.' : filter === 'liked' ? 'You have not liked any publications yet.' : 'You have not saved any publications yet.'}</p>
                </div>
              )}
            </main>
            
            {isUserPro && <aside className="hidden lg:block sticky top-24 self-start"><UserSearch /></aside>}
            
            {!isUserPro && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center text-center z-10 rounded-lg backdrop-blur-sm col-span-full">
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
