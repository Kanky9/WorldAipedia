
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db, createNotification } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc, writeBatch, serverTimestamp, getDocs, deleteDoc } from 'firebase/firestore';
import type { ProComment, ProReply } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS, it, ja, pt, zhCN } from 'date-fns/locale';

const localeMap: { [key: string]: Locale } = {
  es, en: enUS, it, ja, pt, zh: zhCN
};

interface CommentProps {
    comment: ProComment;
    postId: string;
    postAuthorId: string;
}

function Comment({ comment, postId, postAuthorId }: CommentProps) {
    const { currentUser } = useAuth();
    const [replies, setReplies] = useState<ProReply[]>([]);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [visibleReplies, setVisibleReplies] = useState(2);

    const fetchReplies = useCallback(async () => {
        if (!showReplies) return;
        setIsLoadingReplies(true);
        const repliesRef = collection(db, 'pro-posts', postId, 'comments', comment.id, 'replies');
        const q = query(repliesRef, orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReplies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProReply));
            setReplies(fetchedReplies);
            setIsLoadingReplies(false);
        });
        return () => unsubscribe();
    }, [postId, comment.id, showReplies]);

    useEffect(() => {
        const unsubscribePromise = fetchReplies();
        return () => {
            unsubscribePromise?.then(unsubscribe => unsubscribe && unsubscribe());
        };
    }, [fetchReplies]);

    const handleReplySubmit = async () => {
        if (!replyText.trim() || !currentUser) return;
        setIsSubmittingReply(true);
        const repliesRef = collection(db, 'pro-posts', postId, 'comments', comment.id, 'replies');
        const commentRef = doc(db, 'pro-posts', postId, 'comments', comment.id);

        const newReply: Omit<ProReply, 'id'> = {
            authorId: currentUser.uid,
            authorName: currentUser.username || currentUser.displayName || 'Anonymous',
            authorAvatarUrl: currentUser.photoURL || undefined,
            text: replyText,
            createdAt: serverTimestamp(),
        };
        
        const batch = writeBatch(db);
        batch.set(doc(repliesRef), newReply);
        batch.update(commentRef, { replyCount: (comment.replyCount || 0) + 1 });
        
        await batch.commit();

        // Notify the original comment author
        createNotification({
            recipientId: comment.authorId,
            actorId: currentUser.uid,
            actorName: currentUser.username || currentUser.displayName || 'A user',
            actorAvatarUrl: currentUser.photoURL || undefined,
            type: 'reply',
            postId: postId,
            postTextSnippet: comment.text.substring(0, 50)
        });

        setReplyText('');
        setIsReplying(false);
        setIsSubmittingReply(false);
    };

    const canDeleteComment = currentUser && (currentUser.isAdmin || currentUser.uid === comment.authorId);
    
    const deleteComment = async () => {
        // Here you would add a confirmation dialog
        const commentRef = doc(db, 'pro-posts', postId, 'comments', comment.id);
        await deleteDoc(commentRef);
        // Note: deleting subcollection (replies) requires a cloud function for production
    };

    return (
        <div className="flex gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.authorAvatarUrl} />
                <AvatarFallback>{comment.authorName.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
                <div className="bg-muted p-2 rounded-lg">
                    <p className="text-sm font-semibold">{comment.authorName}</p>
                    <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{comment.createdAt && formatDistanceToNow((comment.createdAt as any).toDate(), { addSuffix: true, locale: enUS })}</span>
                    <button onClick={() => setIsReplying(!isReplying)} className="font-semibold hover:underline">Reply</button>
                    {canDeleteComment && <button onClick={deleteComment} className="font-semibold text-destructive hover:underline">Delete</button>}
                </div>

                {isReplying && (
                    <div className="flex gap-2 pt-2">
                        <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." rows={1} className="text-sm" />
                        <Button onClick={handleReplySubmit} size="sm" disabled={isSubmittingReply}>
                            {isSubmittingReply ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                )}
                
                {comment.replyCount > 0 && !showReplies && (
                    <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setShowReplies(true)}>
                        View {comment.replyCount} replies <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                )}

                {showReplies && (
                    <div className="pt-2 space-y-2">
                        {isLoadingReplies && <Loader2 className="h-4 w-4 animate-spin" />}
                        {replies.slice(0, visibleReplies).map(reply => (
                            <div key={reply.id} className="flex gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={reply.authorAvatarUrl} />
                                    <AvatarFallback>{reply.authorName.substring(0, 1)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-background p-2 rounded-lg border">
                                    <p className="text-xs font-semibold">{reply.authorName}</p>
                                    <p className="text-xs">{reply.text}</p>
                                </div>
                            </div>
                        ))}
                        {replies.length > visibleReplies && (
                            <Button variant="link" size="sm" onClick={() => setVisibleReplies(replies.length)}>View more replies</Button>
                        )}
                         {replies.length > 2 && visibleReplies === replies.length && (
                            <Button variant="link" size="sm" onClick={() => setVisibleReplies(2)}>View less</Button>
                        )}
                        {showReplies && comment.replyCount > 0 && (
                             <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setShowReplies(false)}>
                                Hide replies <ChevronUp className="ml-1 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CommentSection({ postId, postAuthorId }: { postId: string; postAuthorId: string }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<ProComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleComments, setVisibleComments] = useState(3);

  useEffect(() => {
    const commentsRef = collection(db, 'pro-posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProComment));
      setComments(fetchedComments);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !currentUser) return;
    setIsSubmitting(true);

    const postRef = doc(db, 'pro-posts', postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) {
        setIsSubmitting(false);
        return;
    }
    const postData = postSnap.data() as ProPost;
    const commentsRef = collection(db, 'pro-posts', postId, 'comments');

    const newCommentData: Omit<ProComment, 'id'> = {
        authorId: currentUser.uid,
        authorName: currentUser.username || currentUser.displayName || 'Anonymous',
        authorAvatarUrl: currentUser.photoURL || undefined,
        text: newComment,
        createdAt: serverTimestamp(),
        replyCount: 0,
    };
    
    const batch = writeBatch(db);
    batch.set(doc(commentsRef), newCommentData);
    batch.update(postRef, { commentCount: (postData.commentCount || 0) + 1 });
    
    await batch.commit();

    createNotification({
      recipientId: postAuthorId,
      actorId: currentUser.uid,
      actorName: currentUser.username || currentUser.displayName || 'A user',
      actorAvatarUrl: currentUser.photoURL || undefined,
      type: 'comment',
      postId: postId,
      postTextSnippet: newComment.substring(0, 50)
    });

    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <div className="p-4 border-t space-y-4">
      <div className="flex gap-2">
        <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser?.photoURL || undefined} />
            <AvatarFallback>{currentUser?.displayName?.substring(0,1) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
            <Textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..." 
                rows={1}
                className="text-sm"
            />
            <Button onClick={handleCommentSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
            </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin"/>
        ) : (
          <>
            {comments.slice(0, visibleComments).map(comment => (
                <Comment key={comment.id} comment={comment} postId={postId} postAuthorId={postAuthorId} />
            ))}
            {comments.length > visibleComments && (
                <Button variant="link" onClick={() => setVisibleComments(comments.length)}>View more comments</Button>
            )}
            {comments.length > 3 && visibleComments === comments.length && (
                <Button variant="link" onClick={() => setVisibleComments(3)}>View less</Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
