
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

export default function UserProfileDialog({ userId, open, onOpenChange }: UserProfileDialogProps) {
    const { currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState<User | null>(null);
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
            const user = await getUserById(userId);
            setProfileUser(user);
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
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : profileUser ? (
                    <>
                        <DialogHeader className="items-center text-center space-y-4">
                             <DialogTitle className="sr-only">Profile of {profileUser.username}</DialogTitle>
                             <DialogDescription className="sr-only">View user details and their description.</DialogDescription>
                            <Avatar className="h-24 w-24 border-2 border-primary">
                                <AvatarImage src={profileUser.photoURL || undefined} alt={profileUser.username} />
                                <AvatarFallback>{profileUser.username?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="w-full">
                                <h2 className="text-2xl font-bold">{profileUser.username}</h2>
                                <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground mt-1">
                                    <span><span className="font-bold text-foreground">{profileUser.followers?.length || 0}</span> Followers</span>
                                    <span><span className="font-bold text-foreground">{profileUser.following?.length || 0}</span> Following</span>
                                </div>
                            </div>
                        </DialogHeader>

                        {profileUser.description && (
                            <div className="text-center text-muted-foreground text-sm my-4 p-3 bg-muted/50 rounded-lg">
                                {profileUser.description}
                            </div>
                        )}

                        {currentUser && currentUser.uid !== profileUser.uid && (
                            <Button onClick={handleFollowToggle} disabled={isFollowLoading} size="sm" className="mt-2 w-full">
                                {isFollowLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isFollowing ? <UserCheck className="mr-2 h-4 w-4"/> : <UserPlus className="mr-2 h-4 w-4"/>)}
                                {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8">User not found.</div>
                )}
            </DialogContent>
        </Dialog>
    );
}
