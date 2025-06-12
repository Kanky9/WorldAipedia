
"use client";

import { useEffect, useState } from 'react';
import type React from 'react';
import AICard from '@/components/ai/AICard';
// AIChatAssistant is now global, remove from here
import { aiTools } from '@/data/ai-tools';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react'; // Removed MessageCircle
import { useLanguage } from '@/hooks/useLanguage';
// useChat context can be used here if needed, but openChat is now on global FAB
// import { useChat } from '@/contexts/ChatContext'; 

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
  // const { openChat } = useChat(); // Chat is opened by global FAB now
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

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
      <section className="relative py-2 md:py-4 text-center rounded-xl overflow-hidden shadow-2xl animate-hero-background-gradient">
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
          <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-primary mx-auto mb-1 md:mb-2 animate-pulse drop-shadow-lg" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-2 md:mb-3 leading-tight 
                         bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
                         bg-clip-text text-transparent animate-gradient-flow-fast">
            {t('homeTitle', 'Unlock the Power of AI')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-3 md:mb-4 max-w-md md:max-w-xl mx-auto leading-relaxed">
            {t('homeSubtitle', 'Welcome to World AI – your ultimate launchpad for discovering groundbreaking AI tools. Dive in, explore, and revolutionize your world.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 md:gap-3">
            <Button 
              asChild 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transform hover:scale-105 transition-all duration-300 ease-out text-xs px-4 py-2 sm:text-sm sm:px-5 sm:py-2.5 rounded-lg group animate-pulse-glow"
            >
              <Link href="/categories">
                {t('homeExploreButton', 'Explore AI Categories')}
                <ArrowRight className="ml-1.5 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            {/* Removed old chat button, FAB will handle this globally
            <Button 
              variant="outline" 
              onClick={() => openChat()} // Uses context to open chat
              className="border-accent text-accent hover:bg-accent/10 hover:text-primary-foreground shadow-lg transform hover:scale-105 transition-all duration-300 ease-out text-xs px-4 py-2 sm:text-sm sm:px-5 sm:py-2.5 rounded-lg group"
            >
              <MessageCircle className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:rotate-[15deg]" />
              {t('homeChatButton', 'Chat with Lace')}
            </Button>
            */}
          </div>
        </div>
      </section>

      <section className="container mx-auto animate-fadeInUp">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-semibold mb-6 md:mb-8 text-center text-primary/90">{t('featuredAITools', 'Featured AI Innovations')}</h2>
        {aiTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {aiTools.slice(0, 8).map((tool) => ( 
              <AICard key={tool.id} aiTool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">{t('loadingText', 'Loading AI tools...')}</p>
        )}
      </section>

       <section className="text-center py-6 md:py-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
         <Button asChild variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary/80 text-sm px-4 py-2 sm:text-base sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg group">
           <Link href="/categories">
            {t('viewAllButton', 'View All AI Tools & Categories')}
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </Link>
         </Button>
       </section>

       {/* AIChatAssistant is now rendered globally in RootLayout */}
    </div>
  );
}
