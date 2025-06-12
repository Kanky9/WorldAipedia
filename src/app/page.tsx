
"use client";

import { useState, useEffect } from 'react';
import AICard from '@/components/ai/AICard';
import AIChatAssistant from '@/components/ai/AIChatAssistant';
import { aiTools } from '@/data/ai-tools';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-12"> {/* Slightly reduced spacing */}
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 text-center rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-primary/10 via-background to-accent/10">
        {/* Animated Particle Background */}
        {mounted && (
          <div className="hero-particles">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${Math.random() * 15 + 10}s`,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="relative z-10 p-4 md:p-6 container mx-auto"> {/* Reduced padding */}
          <Sparkles className="h-16 w-16 md:h-20 md:w-20 text-primary mx-auto mb-4 md:mb-6 animate-pulse drop-shadow-lg" /> {/* Slightly smaller sparkles */}
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 md:mb-8 text-primary leading-tight"> {/* Slightly smaller heading */}
            {t('homeTitle', 'Unlock the Power of AI')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl md:max-w-3xl mx-auto leading-relaxed"> {/* Slightly smaller paragraph */}
            {t('homeSubtitle', 'Welcome to World AI – your ultimate launchpad for discovering groundbreaking AI tools. Dive in, explore, and revolutionize your world.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
            <Button 
              size="lg" 
              asChild 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transform hover:scale-105 transition-all duration-300 ease-out px-8 py-6 md:px-10 md:py-7 text-base md:text-lg rounded-lg group animate-pulse-glow" // Added pulse-glow
            >
              <Link href="/categories">
                {t('homeExploreButton', 'Explore AI Categories')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setIsChatOpen(true)} 
              className="border-accent text-accent-foreground hover:bg-accent/10 shadow-lg transform hover:scale-105 transition-all duration-300 ease-out px-8 py-6 md:px-10 md:py-7 text-base md:text-lg rounded-lg group"
              style={{ animation: 'pulse-chat-button 2s infinite ease-in-out' }} // Applied pulse animation
            >
              <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-[15deg]" />
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

       <style jsx global>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          background-size: 400% 400%;
          animation: gradient-flow 15s ease infinite;
        }
       `}</style>
    </div>
  );
}
