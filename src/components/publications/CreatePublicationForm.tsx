
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, createNotification } from '@/lib/firebase';
import type { ProPost } from '@/lib/types';
import { Loader2, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function CreatePublicationForm() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !currentUser || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const finalPostData: Omit<ProPost, 'id'> = {
        authorId: currentUser.uid,
        authorName: currentUser.username || currentUser.displayName || 'Anonymous PRO',
        text: text.trim(),
        likes: [],
        likeCount: 0,
        saves: [],
        saveCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
      };
      
      if (currentUser.photoURL) {
        finalPostData.authorAvatarUrl = currentUser.photoURL;
      }
      
      const newPostRef = await addDoc(collection(db, 'pro-posts'), finalPostData);
      
      if (currentUser.followers && currentUser.followers.length > 0) {
        currentUser.followers.forEach(followerId => {
          createNotification({
            recipientId: followerId,
            actorId: currentUser.uid,
            actorName: currentUser.username || currentUser.displayName || 'A User',
            actorAvatarUrl: currentUser.photoURL || undefined,
            type: 'new_post',
            postId: newPostRef.id,
            postTextSnippet: text.substring(0, 50)
          });
        });
      }
      
      setText('');
      toast({ title: t('publicationPostedSuccess') });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({ variant: 'destructive', title: t('publicationPostError') });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const canSubmit = text.trim() && !isSubmitting;

  if (!currentUser) {
    return null; // Don't render the form if not logged in
  }

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.username || 'user'} data-ai-hint="user avatar" />
            <AvatarFallback>{(currentUser.username || currentUser.displayName || 'U').substring(0, 1)}</AvatarFallback>
          </Avatar>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={2}
            className="flex-1 resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-lg"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end items-center mt-2 pt-2 border-t border-border">
          <Button type="submit" disabled={!canSubmit} size="sm" className="rounded-full font-bold">
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              t('createPublicationButton')
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
