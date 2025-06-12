
"use client";

import { useState } from 'react';
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

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-center rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-background"></div>
          <div 
            className="absolute inset-0 animate-gradient-flow"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 70% 30%, hsl(var(--primary)/.15) 0%, transparent 40%), radial-gradient(ellipse at 30% 70%, hsl(var(--accent)/.15) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, hsl(var(--secondary)/.1) 0%, transparent 30%)',
            }}
          ></div>
        </div>
        
        <div className="relative z-10 p-6 container mx-auto">
          <Sparkles className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse drop-shadow-lg" />
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-8 text-primary leading-tight">
            {t('homeTitle', 'Unlock the Power of AI')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('homeSubtitle', 'Welcome to World AI – your ultimate launchpad for discovering groundbreaking AI tools. Dive in, explore, and revolutionize your world.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Button 
              size="lg" 
              asChild 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl transform hover:scale-105 transition-all duration-300 ease-out px-10 py-7 text-lg rounded-lg group"
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
              className="border-accent text-accent-foreground hover:bg-accent/10 shadow-xl transform hover:scale-105 transition-all duration-300 ease-out px-10 py-7 text-lg rounded-lg group"
            >
              <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-[15deg]" />
              {t('homeChatButton', 'Chat with AI Guide')}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured AI Tools Section */}
      <section className="container mx-auto">
        <h2 className="text-4xl font-headline font-semibold mb-10 text-center text-primary/90">{t('featuredAITools', 'Featured AI Innovations')}</h2>
        {aiTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {aiTools.slice(0, 8).map((tool) => ( 
              <AICard key={tool.id} aiTool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">{t('loadingText', 'Loading AI tools...')}</p> // Or a more specific "no tools" message
        )}
      </section>

      {/* View All Button Section */}
       <section className="text-center py-10">
         <Button size="lg" asChild variant="ghost" className="text-primary hover:bg-primary/10 hover:text-primary/80 text-lg px-8 py-3 group">
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
