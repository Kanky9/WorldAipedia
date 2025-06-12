import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { AITool } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryIcon from './CategoryIcon';
import { Badge } from '@/components/ui/badge';

interface AICardProps {
  aiTool: AITool;
}

const AICard: FC<AICardProps> = ({ aiTool }) => {
  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="relative w-full h-48 mb-4">
          <Image
            src={aiTool.imageUrl}
            alt={aiTool.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            data-ai-hint={aiTool.imageHint || "technology concept"}
          />
        </div>
        <CardTitle className="font-headline text-xl">{aiTool.title}</CardTitle>
        <Badge variant="secondary" className="w-fit">
          <CategoryIcon categoryName={aiTool.category} className="h-4 w-4 mr-1" />
          {aiTool.category}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{aiTool.shortDescription}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
          <Link href={`/ai/${aiTool.id}`}>Learn More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AICard;
