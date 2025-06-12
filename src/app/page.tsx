
"use client";

import { useState, useEffect } from 'react';
import type React from 'react';
import AICard from '@/components/ai/AICard';
import AIChatAssistant from '@/components/ai/AIChatAssistant';
import { aiTools } from '@/data/ai-tools';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);

    // Generate particle data on the client after mount
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
    <div className="space-y-8"> {/* Reduced overall page spacing */}
      {/* Hero Section */}
      <section className="relative py-6 md:py-10 text-center rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-background via-background to-primary/5"> {/* Further reduced padding */}
        {/* Animated Particle Background */}
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
          <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-primary mx-auto mb-2 md:mb-3 animate-pulse drop-shadow-lg" /> {/* Reduced icon size and margin */}
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-3 md:mb-4 leading-tight 
                         bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
                         bg-clip-text text-transparent animate-gradient-flow-fast"> {/* Reduced font size and margin */}
            {t('homeTitle', 'Unlock the Power of AI')}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-5 md:mb-6 max-w-md md:max-w-xl mx-auto leading-relaxed"> {/* Reduced font size and margin */}
            {t('homeSubtitle', 'Welcome to World AI – your ultimate launchpad for discovering groundbreaking AI tools. Dive in, explore, and revolutionize your world.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 md:gap-3"> {/* Reduced gap */}
            <Button 
              size="default" 
              asChild 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transform hover:scale-105 transition-all duration-300 ease-out px-5 py-2 md:px-6 md:py-2.5 text-sm md:text-base rounded-lg group animate-pulse-glow" /* Reduced padding, size and font size */
            >
              <Link href="/categories">
                {t('homeExploreButton', 'Explore AI Categories')}
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" /> {/* Reduced icon size */}
              </Link>
            </Button>
            <Button 
              size="default" 
              variant="outline" 
              onClick={() => setIsChatOpen(true)} 
              className="border-accent text-accent hover:bg-accent/10 hover:text-primary-foreground shadow-lg transform hover:scale-105 transition-all duration-300 ease-out px-5 py-2 md:px-6 md:py-2.5 text-sm md:text-base rounded-lg group" /* Reduced padding, size and font size */
            >
              <MessageCircle className="mr-1.5 h-4 w-4 transition-transform group-hover:rotate-[15deg]" /> {/* Reduced icon size */}
              {t('homeChatButton', 'Chat with AI Guide')}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured AI Tools Section */}
      <section className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-8 md:mb-10 text-center text-primary/90">{t('featuredAITools', 'Featured AI Innovations')}</h2>
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

      {/* View All Button Section */}
       <section className="text-center py-8 md:py-10">
         <Button size="lg" asChild variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary/80 text-base md:text-lg px-6 md:px-8 py-3 group">
           <Link href="/categories">
            {t('viewAllButton', 'View All AI Tools & Categories')}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
         </Button>
       </section>

       <AIChatAssistant open={isChatOpen} onOpenChange={setIsChatOpen} />

    </div>
  );
}

