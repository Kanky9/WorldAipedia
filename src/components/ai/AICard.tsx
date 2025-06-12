
import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { AITool } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryIcon from './CategoryIcon';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { getCategoryByName } from '@/data/ai-tools'; // To get localized category name

interface AICardProps {
  aiTool: AITool;
}

const AICard: FC<AICardProps> = ({ aiTool }) => {
  const { t, language } = useLanguage();

  // Get the category object to display its localized name
  // aiTool.category stores the English name of the category as a key
  const category = getCategoryByName(aiTool.category);
  const localizedCategoryName = category ? t(category.name) : aiTool.category;

  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="relative w-full h-48 mb-4">
          <Image
            src={aiTool.imageUrl}
            alt={t(aiTool.title, aiTool.id)}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            data-ai-hint={aiTool.imageHint || "technology concept"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardTitle className="font-headline text-xl">{t(aiTool.title)}</CardTitle>
        <Badge variant="secondary" className="w-fit">
          {category && <CategoryIcon categoryName={aiTool.category} className="h-4 w-4 mr-1" />}
          {localizedCategoryName}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{t(aiTool.shortDescription)}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
          <Link href={`/ai/${aiTool.id}`}>{t('learnMoreButton', 'Learn More')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AICard;
