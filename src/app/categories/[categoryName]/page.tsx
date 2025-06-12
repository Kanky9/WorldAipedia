import { notFound } from 'next/navigation';
import { getAiToolsByCategory, getCategoryBySlug, categories as allCategories } from '@/data/ai-tools';
import AICard from '@/components/ai/AICard';
import CategoryIcon from '@/components/ai/CategoryIcon';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CategoryDetailPageProps {
  params: {
    categoryName: string; // This will be the slug
  };
}

export async function generateStaticParams() {
  return allCategories.map((category) => ({
    categoryName: category.slug,
  }));
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const category = getCategoryBySlug(params.categoryName);
  
  if (!category) {
    notFound();
  }

  const toolsInCategory = getAiToolsByCategory(params.categoryName);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CategoryIcon categoryName={category.name} className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-headline font-bold text-primary">{category.name}</h1>
          </div>
          <p className="text-lg text-muted-foreground">{category.description}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/categories" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            All Categories
          </Link>
        </Button>
      </div>

      {toolsInCategory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsInCategory.map((tool) => (
            <AICard key={tool.id} aiTool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-4">No AI tools found in the "{category.name}" category yet.</p>
          <p className="text-muted-foreground">Check back soon, or explore other categories!</p>
        </div>
      )}
    </div>
  );
}
