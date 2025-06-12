
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { PlusCircle, Edit, Trash2, ListChecks } from 'lucide-react';
import Link from "next/link";

// Mock data for posts - in a real app, this would come from a database
const mockPosts = [
  { id: "1", title: "Understanding Large Language Models", date: "2024-07-15", status: "Published" },
  { id: "2", title: "The Future of AI in Art Generation", date: "2024-07-10", status: "Draft" },
  { id: "3", title: "Getting Started with Genkit", date: "2024-07-05", status: "Published" },
];


export default function AdminPage() {
  const { t } = useLanguage();

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
          {mockPosts.length > 0 ? (
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
                  {mockPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{post.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{post.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === 'Published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/edit-post/${post.id}`}>
                            <Edit className="mr-1 h-4 w-4" /> {t('editButton', 'Edit')}
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => alert(t('deletePostConfirm', 'Delete post {postId} (simulated)?', {postId: post.id}))}>
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

      {/* Placeholder for other admin sections like user management, settings etc. */}
      {/* <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>{t('adminUserManagementTitle', 'User Management')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('adminFeatureComingSoon', 'User management features coming soon.')}</p>
        </CardContent>
      </Card> */}
    </div>
  );
}
