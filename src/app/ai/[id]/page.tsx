
"use client"; // Needs to be client for useLanguage hook

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation'; // useParams for client component
import { getAiToolById, aiTools, getCategoryByName } from '@/data/ai-tools';
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


// Remove generateStaticParams if page is client rendered based on dynamic param
// export async function generateStaticParams() {
//   return aiTools.map((tool) => ({
//     id: tool.id,
//   }));
// }

export default function AIPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { t } = useLanguage();
  const [aiTool, setAiTool] = useState<AITool | null | undefined>(undefined); // undefined for loading state

  useEffect(() => {
    if (id) {
      const tool = getAiToolById(id);
      setAiTool(tool);
    }
  }, [id]);

  if (aiTool === undefined) { // Loading state
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="p-0">
            <Skeleton className="relative w-full h-72 md:h-96" />
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-8 w-1/4 mt-8 mb-3" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-5/6" />
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
    <div className="space-y-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('backToHomeButton', 'Back to Home')}
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-lg rounded-xl">
        <CardHeader className="p-0">
          <div className="relative w-full h-72 md:h-96">
            <Image
              src={aiTool.imageUrl}
              alt={localizedToolTitle}
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-ai-hint={aiTool.imageHint || "technology banner"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h1 className="text-4xl font-headline font-bold mb-4 text-primary">{localizedToolTitle}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {category && (
              <Badge variant="default" className="text-lg px-4 py-2 rounded-lg">
                <CategoryIcon categoryName={aiTool.category} className="h-5 w-5 mr-2" />
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
          
          <h2 className="text-2xl font-headline font-semibold mt-8 mb-3">{t('aboutSectionTitle', 'About {toolTitle}', {toolTitle: localizedToolTitle})}</h2>
          <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {t(aiTool.longDescription)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
