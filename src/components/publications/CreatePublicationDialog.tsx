
"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { ProPost } from '@/lib/types';
import { Loader2, Send, ImageIcon, X } from 'lucide-react';

interface CreatePublicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePublicationDialog({ open, onOpenChange }: CreatePublicationDialogProps) {
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
  
  const resetForm = () => {
    setText('');
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

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

      let imageUrl;
      if (image) {
        const imageRef = storageRef(storage, `pro-posts/${currentUser.uid}/${Date.now()}`);
        await uploadString(imageRef, image, 'data_url');
        imageUrl = await getDownloadURL(imageRef);
      }
      
      const finalPostData = {
        ...postData,
        ...(imageUrl && { imageUrl: imageUrl }), // Conditionally add imageUrl
        likes: [],
        likeCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, 'pro-posts'), finalPostData);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          {image && (
            <div className="relative w-32 h-32">
              <Image src={image} alt="Preview" layout="fill" objectFit="cover" className="rounded-md" />
              <Button
                type="button"
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
             <div className="flex items-center gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={!text.trim() || isSubmitting}>
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
