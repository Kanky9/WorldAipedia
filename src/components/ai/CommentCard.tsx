
"use client";

import type { FC } from 'react';
import type { UserComment } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale'; // Import locales directly
import { useLanguage } from '@/hooks/useLanguage';

interface CommentCardProps {
  comment: UserComment;
}

const CommentCard: FC<CommentCardProps> = ({ comment }) => {
  const { language } = useLanguage();
  const displayName = comment.isAnonymous ? "Anonymous" : comment.username;
  const displayInitials = comment.isAnonymous ? "AN" : comment.username.substring(0, 2).toUpperCase();
  
  // Fallback for profile image for anonymous or if not provided
  const profileImage = comment.isAnonymous ? undefined : comment.profileImageUrl;

  const getLocale = () => {
    switch (language) {
      case 'es':
        return es;
      default:
        return enUS;
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
          <time dateTime={comment.timestamp.toISOString()} className="text-xs text-muted-foreground">
            {format(comment.timestamp, 'PPp', { locale: getLocale() })}
          </time>
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
