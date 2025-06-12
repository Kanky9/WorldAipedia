
import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { AITool } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryIcon from './CategoryIcon';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { getCategoryByName } from '@/data/ai-tools';

interface AICardProps {
  aiTool: AITool;
}

const AICard: FC<AICardProps> = ({ aiTool }) => {
  const { t } = useLanguage();
  const category = getCategoryByName(aiTool.category);
  const localizedCategoryName = category ? t(category.name) : aiTool.category;

  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 rounded-xl group">
      <div className="relative w-full h-48">
        <Image
          src={aiTool.imageUrl}
          alt={t(aiTool.title, aiTool.id)}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-t-xl group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={aiTool.imageHint || "technology concept"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader className="pt-4">
        <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{t(aiTool.title)}</CardTitle>
        {category && (
          <Badge variant="secondary" className="w-fit mt-1">
            <CategoryIcon categoryName={aiTool.category} className="h-4 w-4 mr-1.5" />
            {localizedCategoryName}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow pt-2">
        <CardDescription>{t(aiTool.shortDescription)}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground hover:shadow-md">
          <Link href={`/ai/${aiTool.id}`}>{t('learnMoreButton', 'Learn More')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AICard;
