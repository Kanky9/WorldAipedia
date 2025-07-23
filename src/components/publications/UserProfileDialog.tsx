
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserById, getPostsByAuthorId, followUser, unfollowUser } from '@/lib/firebase';
import type { User, ProPost } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Users, FileText, UserPlus, UserCheck } from 'lucide-react';
import { formatDistanceToNow, Locale } from 'date-fns';
import { es, enUS, it, ja, pt, zhCN } from 'date-fns/locale';
import type { Timestamp } from 'firebase/firestore';

interface UserProfileDialogProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const localeMap: { [key: string]: Locale } = {
  es, en: enUS, it, ja, pt, zh: zhCN
};

export default function UserProfileDialog({ userId, open, onOpenChange }: UserProfileDialogProps) {
    const { currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [userPosts, setUserPosts] = useState<ProPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    useEffect(() => {
        if (currentUser && userId) {
            setIsFollowing(currentUser.following?.includes(userId) || false);
        }
    }, [currentUser, userId]);

    const fetchProfileData = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const [user, posts] = await Promise.all([
                getUserById(userId),
                getPostsByAuthorId(userId)
            ]);
            setProfileUser(user);
            setUserPosts(posts);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (open) {
            fetchProfileData();
        } else {
            // Reset state when dialog closes to ensure fresh data on reopen
            setProfileUser(null);
            setUserPosts([]);
            setIsLoading(true);
        }
    }, [open, fetchProfileData]);

    const handleFollowToggle = async () => {
        if (!currentUser || !profileUser) return;
        setIsFollowLoading(true);
        try {
            if (isFollowing) {
                await unfollowUser(currentUser.uid, profileUser.uid);
                setIsFollowing(false);
            } else {
                await followUser(currentUser.uid, profileUser.uid);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        } finally {
            setIsFollowLoading(false);
        }
    };
    
    const formatDate = (dateValue: Date | Timestamp) => {
        if (!dateValue) return '';
        // Check if it's a Firestore Timestamp and convert, otherwise assume it's a Date
        const date = (dateValue as Timestamp)?.toDate ? (dateValue as Timestamp).toDate() : (dateValue as Date);
        return formatDistanceToNow(date, { addSuffix: true, locale: enUS });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg h-[80vh] flex flex-col">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : profileUser ? (
                    <>
                        <DialogHeader>
                            {/* The DialogTitle and DialogDescription must be direct children for accessibility */}
                            <DialogTitle className="sr-only">Profile of {profileUser.username}</DialogTitle>
                            <DialogDescription className="sr-only">View user details and their latest publications.</DialogDescription>
                            
                            {/* Visual layout container */}
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20 border-2 border-primary flex-shrink-0">
                                    <AvatarImage src={profileUser.photoURL || undefined} />
                                    <AvatarFallback>{profileUser.username?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 mt-2">
                                    <h2 className="text-2xl font-semibold leading-none tracking-tight">{profileUser.username}</h2>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground pt-1">
                                        <span><span className="font-bold text-foreground">{profileUser.followers?.length || 0}</span> Followers</span>
                                        <span><span className="font-bold text-foreground">{profileUser.following?.length || 0}</span> Following</span>
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>

                        {currentUser && currentUser.uid !== profileUser.uid && (
                            <Button onClick={handleFollowToggle} disabled={isFollowLoading} size="sm" className="mt-2 w-full">
                                {isFollowLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isFollowing ? <UserCheck className="mr-2 h-4 w-4"/> : <UserPlus className="mr-2 h-4 w-4"/>)}
                                {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                        )}
                        
                        <div className="flex-grow overflow-y-auto mt-2 pr-4 -mr-6 space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><FileText className="h-4 w-4"/> Publications</h3>
                            {userPosts.length > 0 ? (
                                userPosts.map(post => (
                                    <div key={post.id} className="p-3 border rounded-lg text-sm bg-muted/50">
                                        <p className="whitespace-pre-wrap">{post.text}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{formatDate(post.createdAt)}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-4">This user has no publications yet.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">User not found.</div>
                )}
            </DialogContent>
        </Dialog>
    );
}
