
"use client";

import PostCard from '@/components/blog/PostCard';
import { posts as allPosts } from '@/data/posts';
import { useLanguage } from '@/hooks/useLanguage';
import { BookCopy } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AllPostsPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  const sortedPosts = allPosts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  if (!mounted) {
    return null; // Or a loading skeleton
  }

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
        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedPosts.map((post, index) => (
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
