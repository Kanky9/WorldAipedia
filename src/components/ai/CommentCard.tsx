
"use client";

import type { FC } from 'react';
import type { UserComment } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/hooks/useLanguage';
import type { Timestamp } from 'firebase/firestore';

interface CommentCardProps {
  comment: UserComment;
  isAdmin?: boolean;
  onDelete?: (commentId: string) => void;
}

const CommentCard: FC<CommentCardProps> = ({ comment, isAdmin, onDelete }) => {
  const { language, t } = useLanguage();
  const displayName = comment.isAnonymous ? t('anonymousCommentLabel', "Anonymous") : comment.username;
  const displayInitials = comment.isAnonymous ? t('anonymousCommentLabel', "Anonymous").substring(0,2).toUpperCase() : comment.username.substring(0, 2).toUpperCase();
  
  const profileImage = comment.isAnonymous ? undefined : comment.profileImageUrl;

  const getLocale = () => {
    switch (language) {
      case 'es':
        return es;
      default:
        return enUS;
    }
  };

  let commentDate: Date | null = null;
  if (comment.timestamp) {
    if (comment.timestamp instanceof Date) {
      commentDate = comment.timestamp;
    } else if (typeof (comment.timestamp as Timestamp).toDate === 'function') {
      commentDate = (comment.timestamp as Timestamp).toDate();
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment.id);
    }
  };

  return (
    <div className="flex space-x-3 p-4 border-b border-border/50">
      <Avatar className="h-10 w-10">
        {profileImage ? (
            <AvatarImage src={profileImage} alt={displayName} data-ai-hint="user avatar"/>
        ) : null }
        <AvatarFallback className="bg-muted text-muted-foreground">{displayInitials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">
            {displayName}
          </h4>
          <div className="flex items-center gap-2">
            {commentDate && (
              <time dateTime={commentDate.toISOString()} className="text-xs text-muted-foreground">
                {format(commentDate, 'PPp', { locale: getLocale() })}
              </time>
            )}
            {isAdmin && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={handleDelete}
                aria-label={t('deleteCommentButton', "Delete Comment")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={16}
              className={i < comment.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}
            />
          ))}
        </div>
        <p className="text-sm text-foreground/90 whitespace-pre-wrap">
          {comment.text}
        </p>
      </div>
    </div>
  );
};

export default CommentCard;
