
"use client";

import PostCard from '@/components/blog/PostCard';
import { useLanguage } from '@/hooks/useLanguage';
import { BookCopy, Loader2, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Post } from '@/lib/types';
import { getAllPostsFromFirestore } from '@/lib/firebase';

export default function AllPostsPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPosts = await getAllPostsFromFirestore();
        // Sorting should ideally be by Firestore query, but client-side is fallback
         const sorted = fetchedPosts.sort((a, b) =>
          (b.publishedDate instanceof Date ? b.publishedDate.getTime() : 0) -
          (a.publishedDate instanceof Date ? a.publishedDate.getTime() : 0)
        );
        setPosts(sorted);
      } catch (err) {
        console.error("Error fetching all posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center py-8">
        <div className="flex justify-center items-center mb-4">
          <BookCopy className="h-10 w-10 md:h-12 md:w-12 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold mb-3 text-primary">
          {t('allPostsTitle', 'All Blog Posts')}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          {t('allPostsSubtitle', 'Browse through our complete collection of articles and insights on AI.')}
        </p>
      </section>

      <section className="container mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive text-lg">{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post, index) => (
              <div key={post.id} className="animate-fadeInUp" style={{animationDelay: `${index * 0.05}s`}}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">{t('adminNoPosts', 'No posts found.')}</p>
        )}
      </section>
    </div>
  );
}
