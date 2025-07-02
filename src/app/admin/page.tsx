
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { PlusCircle, Edit, Trash2, ListChecks, Loader2, AlertTriangle, ShieldAlert, BookOpenCheck } from 'lucide-react';
import Link from "next/link";
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useEffect, useState, useCallback } from "react";
import type { Post as PostType } from "@/lib/types";
import { getAllPostsFromFirestore, deletePostFromFirestore } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
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
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostType | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser || !currentUser.isAdmin) {
        toast({
          variant: "destructive",
          title: t('adminPostAccessDeniedTitle', "Access Denied"),
          description: t('adminPostAccessDeniedDesc', "You do not have permission to view this page."),
        });
        router.replace('/');
      }
    }
  }, [currentUser, authLoading, router, toast, t]);

  const fetchPosts = useCallback(async () => {
    if (!currentUser?.isAdmin) {
      setIsLoadingPosts(false);
      return;
    }
    setIsLoadingPosts(true);
    setError(null);
    try {
      const fetchedPosts = await getAllPostsFromFirestore();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      const errorMessage = err instanceof Error ? err.message : t('adminErrorLoadingPostsDesc', "Failed to load posts.");
      setError(errorMessage);
      toast({ variant: "destructive", title: t('adminErrorLoadingPostsTitle', "Error Loading Posts"), description: errorMessage });
    } finally {
      setIsLoadingPosts(false);
    }
  }, [toast, currentUser?.isAdmin, t]);

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [fetchPosts, currentUser?.isAdmin]);

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
      toast({ title: t('adminDeletePostSuccessTitle', "Post Deleted"), description: t('adminDeletePostSuccessDesc', 'Post "{title}" has been deleted.', { title: t(postToDelete.title) })});
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postToDelete.id)); 
    } catch (deleteError) {
      console.error("Error deleting post:", deleteError);
      toast({ variant: "destructive", title: t('adminDeletePostErrorTitle', "Delete Failed"), description: t('adminPostErrorDesc', "Could not delete the post.") });
    } finally {
      setShowDeleteConfirm(false);
      setPostToDelete(null);
    }
  };

  if (authLoading || (!currentUser && !authLoading) ) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!currentUser?.isAdmin && !authLoading) {
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">{t('adminPostAccessDeniedTitle', "Access Denied")}</h2>
        <p className="text-muted-foreground">{t('adminPostAccessDeniedDesc', "You do not have permission to view this page.")}</p>
        <Button onClick={() => router.push('/')} className="mt-4">{t('goToHomepageButton', "Go to Homepage")}</Button>
      </div>
    );
  }


  if (isLoadingPosts && currentUser?.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error && currentUser?.isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">{t('adminErrorLoadingPostsTitle', "Error Loading Posts")}</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchPosts}>{t('tryAgainButton', "Try Again")}</Button>
      </div>
    );
  }
  

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary">{t('adminPanelTitle', 'Admin Panel')}</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
            <Link href="/admin/manage-books">
              <BookOpenCheck className="mr-2 h-5 w-5" />
              {t('adminManageBooksTitle', 'Manage Books')}
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Link href="/admin/create-post">
              <PlusCircle className="mr-2 h-5 w-5" />
              {t('adminCreatePostButton', 'Create New Post')}
            </Link>
          </Button>
        </div>
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
            <div>
              {/* Mobile View: List of Cards */}
              <div className="md:hidden space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="p-4 border">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-foreground break-words">{t(post.title)}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {post.publishedDate instanceof Date ? format(post.publishedDate, 'PP', { locale: getLocale() }) : 'N/A'}
                            </p>
                        </div>
                        <span className='ml-2 mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 whitespace-nowrap'>
                          {t('adminPostPublishedStatus', 'Published')}
                        </span>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/create-post?id=${post.id}`}>
                          <Edit className="mr-1 h-4 w-4" /> {t('editButton', 'Edit')}
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(post)}>
                         <Trash2 className="mr-1 h-4 w-4" /> {t('deleteButton', 'Delete')}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('adminTableTitle', 'Title')}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('adminTableDate', 'Date')}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('adminTableStatus', 'Status')}</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('adminTableActions', 'Actions')}</th>
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
                            {t('adminPostPublishedStatus', 'Published')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/create-post?id=${post.id}`}>
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
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">{t('adminNoPosts', 'No posts found.')}</p>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deletePostConfirm', "Confirm Deletion")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deletePostConfirm', `Are you sure you want to delete the post "{postId}"? This action cannot be undone.` , {postId: postToDelete ? t(postToDelete.title) : ''})}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>{t('cancelButton', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              {t('deleteButton', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
