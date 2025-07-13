
"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getNotifications, markNotificationsAsRead } from '@/lib/firebase';
import type { Notification } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es, it, pt, zhCN, ja } from 'date-fns/locale';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { cn } from '@/lib/utils';

const localeMap: { [key: string]: Locale } = {
  es, en: enUS, it, ja, pt, zh: zhCN
};

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationText = ({ notif }: { notif: Notification }) => {
  const textMap = {
    like: 'liked your publication:',
    comment: 'commented on your publication:',
    reply: 'replied to your comment:',
    new_post: 'published a new post:',
    follow: 'started following you.',
    save: 'saved your publication:'
  };

  return (
    <p className="text-sm">
      <span className="font-semibold">{notif.actorName}</span>{' '}
      {textMap[notif.type]}{' '}
      {notif.postTextSnippet && <span className="text-muted-foreground italic">"{notif.postTextSnippet}..."</span>}
    </p>
  );
};


export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  
  useOnClickOutside(panelRef, onClose);

  useEffect(() => {
    if (isOpen && currentUser) {
      setIsLoading(true);
      getNotifications(currentUser.uid)
        .then(data => {
          setNotifications(data);
          const unreadIds = data.filter(n => !n.read).map(n => n.id);
          if (unreadIds.length > 0) {
            markNotificationsAsRead(unreadIds);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, currentUser]);

  return (
    <div 
      ref={panelRef}
      className={cn(
        "fixed top-0 left-0 h-full w-80 bg-background border-r shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-[calc(100%-65px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map(notif => (
              <Link key={notif.id} href={notif.postId ? `/publications#${notif.postId}` : `/account`} onClick={onClose} legacyBehavior>
                <a className="block p-4 hover:bg-muted/50">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={notif.actorAvatarUrl} />
                      <AvatarFallback>{notif.actorName.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <NotificationText notif={notif} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow((notif.createdAt as any).toDate(), { addSuffix: true, locale: localeMap[language] || enUS })}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground p-8">You have no notifications yet.</p>
        )}
      </div>
    </div>
  );
}

