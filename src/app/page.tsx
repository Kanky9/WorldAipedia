
"use client";

import { useEffect, useState } from 'react';
import type React from 'react';
import PostCard from '@/components/blog/PostCard'; // Changed from AICard
import { posts as allPosts } from '@/data/posts'; // Changed from aiTools
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ParticleStyle {
  width: string;
  height: string;
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

interface Particle {
  key: number;
  style: ParticleStyle;
}

export default function HomePage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const displayedPosts = allPosts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());


  useEffect(() => {
    setMounted(true);
    const generatedParticles = Array.from({ length: 15 }).map((_, i) => ({
      key: i,
      style: {
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${Math.random() * 15 + 10}s`,
      },
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="space-y-8">
      <section className="relative py-8 md:py-12 text-center rounded-xl overflow-hidden shadow-lg bg-card animate-hero-background-gradient">
        {mounted && particles.length > 0 && (
          <div className="hero-particles">
            {particles.map((particle) => (
              <div
                key={particle.key}
                className="particle"
                style={particle.style}
              />
            ))}
          </div>
        )}
        
        <div className="relative z-10 p-4 container mx-auto">
          <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-2 md:mb-3 animate-pulse drop-shadow-lg" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold mb-3 md:mb-4 leading-tight 
                         bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-flow-fast">
            {t('blogTitle', 'The World AI Blog')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 md:mb-6 max-w-lg md:max-w-2xl mx-auto leading-relaxed">
            {t('blogSubtitle', 'Stay updated with the latest news, insights, and tools in the world of Artificial Intelligence.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4">
            <Button 
              asChild 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transform hover:scale-105 transition-all duration-300 ease-out text-sm px-5 py-2.5 sm:text-base sm:px-6 sm:py-3 rounded-lg group animate-pulse-glow"
            >
              <Link href="/categories">
                {t('exploreCategoriesButton', 'Explore Categories')}
                <ArrowRight className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto animate-fadeInUp">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-semibold mb-6 md:mb-8 text-center text-primary/90">{t('latestPosts', 'Latest Posts')}</h2>
        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
            {displayedPosts.slice(0, 6).map((post) => ( // Display up to 6 posts
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">{t('loadingText', 'Loading posts...')}</p>
        )}
      </section>

       <section className="text-center py-6 md:py-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
         <Button asChild variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary/80 text-sm px-4 py-2 sm:text-base sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg group">
           <Link href="/categories">
            {t('viewAllPostsButton', 'View All Posts & Categories')}
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </Link>
         </Button>
       </section>
    </div>
  );
}
