
"use client";

import { useState } from 'react';
import AICard from '@/components/ai/AICard';
import AIChatAssistant from '@/components/ai/AIChatAssistant';
import { aiTools } from '@/data/ai-tools';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="space-y-12">
      <section className="text-center py-16 bg-card rounded-lg shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-50"></div>
        <div className="relative z-10 p-6">
          <Sparkles className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-headline font-bold mb-6 text-primary">
            {t('homeTitle', 'Unlock the Power of AI')}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            {t('homeSubtitle', 'Welcome to World AI – your ultimate launchpad for discovering groundbreaking AI tools. Dive in, explore, and revolutionize your world.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/80 shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Link href="/categories">{t('homeExploreButton', 'Explore AI Categories')}</Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setIsChatOpen(true)} className="border-accent text-accent-foreground hover:bg-accent/20 shadow-lg transform hover:scale-105 transition-transform duration-200">
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('homeChatButton', 'Chat with AI Guide')}
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-semibold mb-8 text-center text-primary/90">{t('featuredAITools', 'Featured AI Innovations')}</h2>
        {aiTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {aiTools.slice(0, 8).map((tool) => ( 
              <AICard key={tool.id} aiTool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No AI tools available at the moment. Please check back later.</p>
        )}
      </section>
       <section className="text-center py-8">
         <Button size="lg" asChild variant="ghost" className="text-primary hover:bg-primary/10">
           <Link href="/categories">{t('viewAllButton', 'View All AI Tools & Categories')}</Link>
         </Button>
       </section>
       <AIChatAssistant open={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
}
