
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search, UserPlus, Check, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { searchUsersByUsername, followUser, unfollowUser } from '@/lib/firebase';
import type { User } from '@/lib/types';
import { debounce } from 'lodash';

interface UserSearchProps {
  onProfileClick: (userId: string) => void;
}

export default function UserSearch({ onProfileClick }: UserSearchProps) {
  const { currentUser, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // A local state to manage following status for immediate UI feedback
  const [localFollowing, setLocalFollowing] = useState<string[]>(currentUser?.following || []);

  useEffect(() => {
    if (currentUser) {
      setLocalFollowing(currentUser.following || []);
    }
  }, [currentUser]);

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length < 2) {
        setResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const users = await searchUsersByUsername(term);
        setResults(users);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    // Cleanup the debounced function on unmount
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleFollowToggle = async (e: React.MouseEvent, targetUserId: string) => {
    e.stopPropagation(); // Prevent the dialog from opening when clicking the button
    if (!currentUser) return;

    const isCurrentlyFollowing = localFollowing.includes(targetUserId);
    
    // Optimistic UI update
    if (isCurrentlyFollowing) {
      setLocalFollowing(prev => prev.filter(id => id !== targetUserId));
      await unfollowUser(currentUser.uid, targetUserId);
    } else {
      setLocalFollowing(prev => [...prev, targetUserId]);
      await followUser(currentUser.uid, targetUserId);
    }
    // Note: A more robust solution might refetch the currentUser from AuthContext 
    // to ensure perfect sync, but this local state management is often sufficient and faster.
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for users..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {isSearching && <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />}
        {!isSearching && results.length > 0 && (
          results.map(user => {
            if (user.uid === currentUser?.uid) return null; // Don't show current user
            const isFollowing = localFollowing.includes(user.uid);
            return (
              <div 
                key={user.uid} 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => onProfileClick(user.uid)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback>{user.username?.substring(0, 1) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{user.username}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {user.followers?.length || 0}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleFollowToggle(e, user.uid)}
                  disabled={authLoading}
                  className={`p-2 rounded-full transition-colors z-10 relative ${
                    isFollowing 
                      ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {isFollowing ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                </button>
              </div>
            );
          })
        )}
        {!isSearching && searchTerm.length > 1 && results.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">No users found.</p>
        )}
      </div>
    </div>
  );
}
