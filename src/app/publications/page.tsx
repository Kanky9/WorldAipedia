
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';
import { db, storage, deletePublicationFromFirestore } from '@/lib/firebase';
import type { ProPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Send, ImageIcon, X, Heart, MessageCircle, ShieldAlert, Trash2 } from 'lucide-react';
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

const localeMap: { [key: string]: Locale } = {
  es, en: enUS, it, ja, pt, zh: zhCN
};

function CreatePostForm() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !currentUser || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const postData: Omit<ProPost, 'id' | 'createdAt' | 'likes' | 'likeCount' | 'commentCount'> = {
        authorId: currentUser.uid,
        authorName: currentUser.username || currentUser.displayName || 'Anonymous PRO',
        authorAvatarUrl: currentUser.photoURL || undefined,
        text: text.trim(),
      };

      if (image) {
        const imageRef = storageRef(storage, `pro-posts/${currentUser.uid}/${Date.now()}`);
        await uploadString(imageRef, image, 'data_url');
        postData.imageUrl = await getDownloadURL(imageRef);
      }
      
      const finalPostData = {
        ...postData,
        likes: [],
        likeCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, 'pro-posts'), finalPostData);
      setText('');
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast({ title: t('publicationPostedSuccess') });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({ variant: 'destructive', title: t('publicationPostError') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('createPublicationPlaceholder', { username: currentUser?.username || 'member' })}
            rows={3}
            className="resize-none"
            disabled={isSubmitting}
          />
          {image && (
            <div className="relative w-32 h-32">
              <Image src={image} alt="Preview" layout="fill" objectFit="cover" className="rounded-md" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                onClick={() => setImage(null)}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <Button type="submit" disabled={!text.trim() || isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {t('createPublicationButton')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function PostCard({ post, onDelete }: { post: ProPost; onDelete: (postId: string) => void; }) {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();

  const handleLike = async () => {
    if (!currentUser) return;
    const postRef = doc(db, 'pro-posts', post.id);
    const batch = writeBatch(db);

    if (post.likes.includes(currentUser.uid)) {
      // Unlike
      const newLikes = post.likes.filter(uid => uid !== currentUser.uid);
      batch.update(postRef, { likes: newLikes, likeCount: newLikes.length });
    } else {
      // Like
      const newLikes = [...post.likes, currentUser.uid];
      batch.update(postRef, { likes: newLikes, likeCount: newLikes.length });
    }
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
        <p className="whitespace-pre-wrap">{post.text}</p>
        {post.imageUrl && (
          <div className="mt-4 relative aspect-video w-full rounded-lg overflow-hidden">
            <Image src={post.imageUrl} alt="Post image" layout="fill" objectFit="cover" data-ai-hint={post.imageHint || "publication image"} />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-start gap-4">
        <Button variant={hasLiked ? "default" : "ghost"} size="sm" onClick={handleLike} disabled={!currentUser}>
          <Heart className={`mr-2 h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
          {post.likeCount} {t('likeButton')}
        </Button>
        <Button variant="ghost" size="sm" disabled>
          <MessageCircle className="mr-2 h-4 w-4" />
          {post.commentCount} {t('commentButton')}
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function PublicationsPage() {
  const { currentUser, loading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const [posts, setPosts] = useState<ProPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postToDelete, setPostToDelete] = useState<ProPost | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!currentUser) {
        setIsLoadingPosts(false); // Not logged in, so not loading posts.
        return;
    }

    const q = query(collection(db, 'pro-posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProPost));
      setPosts(fetchedPosts);
      setIsLoadingPosts(false);
    }, (error) => {
        console.error("Error fetching publications:", error);
        setIsLoadingPosts(false);
    });

    return () => unsubscribe();
  }, [currentUser, loading]);
  
  const handleDeleteClick = (postId: string) => {
    const post = posts.find(p => p.id === postId);
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


  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('publicationsAccessDenied')}</h2>
        <p className="text-muted-foreground mb-4">{t('publicationsLoginPrompt')}</p>
        <Button asChild><Link href="/login">{t('loginButton')}</Link></Button>
      </div>
    );
  }

  if (!currentUser.isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('publicationsAccessDenied')}</h2>
        <p className="text-muted-foreground mb-4">{t('publicationsUpgradePrompt')}</p>
        <Button asChild><Link href="/account">{t('upgradeToProButton')}</Link></Button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-headline font-bold text-primary">{t('publicationsTitle')}</h1>
          <p className="text-muted-foreground">{t('publicationsSubtitle')}</p>
        </div>
        
        <CreatePostForm />

        <div className="space-y-6">
          {isLoadingPosts ? (
            <div className="text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
          ) : posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} onDelete={handleDeleteClick} />)
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <p>{t('noPublicationsYet')}</p>
            </div>
          )}
        </div>
      </div>
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
