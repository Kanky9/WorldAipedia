
"use client"; 

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation'; 
import { getAiToolById, getCategoryByName } from '@/data/ai-tools';
import AILink from '@/components/ai/AILink';
import CategoryIcon from '@/components/ai/CategoryIcon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';
import type { AITool } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AIPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { t } = useLanguage();
  const [aiTool, setAiTool] = useState<AITool | null | undefined>(undefined); 
  const [pageAnimationClass, setPageAnimationClass] = useState('');

  useEffect(() => {
    if (id) {
      const tool = getAiToolById(id);
      setAiTool(tool);
      if (tool) {
        // Apply animation class once data is loaded
        setPageAnimationClass('animate-scale-up-fade-in');
      } else {
        setPageAnimationClass(''); // Reset if tool not found or during loading
      }
    }
  }, [id]);

  if (aiTool === undefined) { 
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-28 sm:h-10 sm:w-32 mb-6" />
        <Card className="overflow-hidden shadow-lg rounded-xl">
          <CardHeader className="p-0">
            <Skeleton className="relative w-full h-60 sm:h-72 md:h-96" />
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 sm:h-10 mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-8 w-20 sm:h-10 sm:w-24" />
              <Skeleton className="h-8 w-28 sm:h-10 sm:w-32" />
            </div>
            <Skeleton className="h-7 w-1/3 sm:h-8 sm:w-1/4 mt-8 mb-3" />
            <Skeleton className="h-5 w-full sm:h-6 mb-2" />
            <Skeleton className="h-5 w-full sm:h-6 mb-2" />
            <Skeleton className="h-5 w-5/6 sm:h-6" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!aiTool) {
    notFound();
  }
  
  const category = getCategoryByName(aiTool.category);
  const localizedCategoryName = category ? t(category.name) : aiTool.category;
  const localizedToolTitle = t(aiTool.title);

  return (
    <div className={`space-y-8 ${pageAnimationClass}`}>
      <Button variant="outline" asChild className="mb-6 text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 rounded-md">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          {t('backToHomeButton', 'Back to Home')}
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-lg rounded-xl">
        <CardHeader className="p-0">
          <div className="relative w-full h-60 sm:h-72 md:h-96">
            <Image
              src={aiTool.imageUrl}
              alt={localizedToolTitle}
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-ai-hint={aiTool.imageHint || "technology banner"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="rounded-t-xl"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold mb-4 text-primary">{localizedToolTitle}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {category && (
              <Badge variant="default" className="text-sm px-3 py-1 sm:text-base sm:px-4 sm:py-2 rounded-md">
                <CategoryIcon categoryName={aiTool.category} className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {localizedCategoryName}
              </Badge>
            )}
            <AILink 
              href={aiTool.link} 
              logoUrl={aiTool.logoUrl} 
              logoHint={aiTool.logoHint}
              text={t('visitWebsiteButton', 'Visit Website')}
            />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-headline font-semibold mt-8 mb-3">{t('aboutSectionTitle', 'About {toolTitle}', {toolTitle: localizedToolTitle})}</h2>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {t(aiTool.longDescription)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
