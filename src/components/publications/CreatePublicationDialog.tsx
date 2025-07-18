
"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, createNotification } from '@/lib/firebase';
import type { ProPost } from '@/lib/types';
import { Loader2, Send } from 'lucide-react';

interface CreatePublicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePublicationDialog({ open, onOpenChange }: CreatePublicationDialogProps) {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setText('');
  }

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
      
      // Create notifications for followers
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
      
      resetForm();
      onOpenChange(false);
      toast({ title: t('publicationPostedSuccess') });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({ variant: 'destructive', title: t('publicationPostError') });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const canSubmit = text.trim() && !isSubmitting;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            resetForm();
        }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Publication</DialogTitle>
          <DialogDescription>Share your thoughts with the community.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('createPublicationPlaceholder', { username: currentUser?.username || 'member' })}
            rows={4}
            className="resize-none"
            disabled={isSubmitting}
          />
          <div className="flex justify-end items-center">
             <div className="flex items-center gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {t('createPublicationButton')}
                </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
