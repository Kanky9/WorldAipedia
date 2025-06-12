
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { PlusCircle, Edit, Trash2, ListChecks, Loader2, AlertTriangle } from 'lucide-react';
import Link from "next/link";
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useEffect, useState, useCallback } from "react";
import type { Post as PostType } from "@/lib/types";
import { getAllPostsFromFirestore, deletePostFromFirestore } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostType | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPosts = await getAllPostsFromFirestore();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err instanceof Error ? err.message : "Failed to load posts.");
      toast({ variant: "destructive", title: "Error", description: "Could not fetch posts from database." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const getLocale = () => {
    switch (language) {
      case 'es':
        return es;
      default:
        return enUS;
    }
  };

  const handleDeleteClick = (post: PostType) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await deletePostFromFirestore(postToDelete.id);
      toast({ title: "Post Deleted", description: `"${t(postToDelete.title)}" has been deleted.` });
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postToDelete.id)); // Optimistic update
    } catch (deleteError) {
      console.error("Error deleting post:", deleteError);
      toast({ variant: "destructive", title: "Delete Failed", description: "Could not delete the post." });
    } finally {
      setShowDeleteConfirm(false);
      setPostToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Posts</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchPosts}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-bold text-primary">{t('adminPanelTitle', 'Admin Panel')}</h1>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/admin/create-post">
            <PlusCircle className="mr-2 h-5 w-5" />
            {t('adminCreatePostButton', 'Create New Post')}
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks /> {t('adminManagePostsTitle', 'Manage Posts')}
          </CardTitle>
          <CardDescription>{t('adminManagePostsDescription', 'Here you can edit, delete, and manage all blog posts.')}</CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('adminTableTitle', 'Title')}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('adminTableDate', 'Date')}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('adminTableStatus', 'Status')}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('adminTableActions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{t(post.title)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {post.publishedDate instanceof Date ? format(post.publishedDate, 'PP', { locale: getLocale() }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'>
                          Published
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/create-post?id=${post.id}`}> {/* Changed to use create-post with ID */}
                            <Edit className="mr-1 h-4 w-4" /> {t('editButton', 'Edit')}
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(post)}>
                           <Trash2 className="mr-1 h-4 w-4" /> {t('deleteButton', 'Delete')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">{t('adminNoPosts', 'No posts found.')}</p>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deletePostConfirm', `Are you sure you want to delete the post "${postToDelete ? t(postToDelete.title) : ''}"? This action cannot be undone.` , {postId: postToDelete ? t(postToDelete.title) : ''})}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
