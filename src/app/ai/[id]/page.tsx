import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAiToolById, aiTools } from '@/data/ai-tools';
import AILink from '@/components/ai/AILink';
import CategoryIcon from '@/components/ai/CategoryIcon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return aiTools.map((tool) => ({
    id: tool.id,
  }));
}

export default function AIbitatPage({ params }: AIPageProps) {
  const aiTool = getAiToolById(params.id);

  if (!aiTool) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="p-0">
          <div className="relative w-full h-72 md:h-96">
            <Image
              src={aiTool.imageUrl}
              alt={aiTool.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
              data-ai-hint={aiTool.imageHint || "technology banner"}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h1 className="text-4xl font-headline font-bold mb-4 text-primary">{aiTool.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <Badge variant="default" className="text-lg px-4 py-2">
              <CategoryIcon categoryName={aiTool.category} className="h-5 w-5 mr-2" />
              {aiTool.category}
            </Badge>
            <AILink href={aiTool.link} logoUrl={aiTool.logoUrl} logoHint={aiTool.logoHint} />
          </div>
          
          <h2 className="text-2xl font-headline font-semibold mt-8 mb-3">About {aiTool.title}</h2>
          <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {aiTool.longDescription}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
