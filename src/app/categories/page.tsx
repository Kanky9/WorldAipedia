import Link from 'next/link';
import { categories } from '@/data/ai-tools';
import CategoryIcon from '@/components/ai/CategoryIcon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-headline font-bold mb-4 text-primary">Explore AI by Category</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Find AI tools tailored to your needs, organized into relevant categories for easy browsing.
        </p>
      </section>
      
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link href={`/categories/${category.slug}`} key={category.slug} className="block group">
              <Card className="h-full flex flex-col transform transition-all duration-300 hover:shadow-xl hover:border-primary">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <CategoryIcon categoryName={category.name} className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{category.description}</CardDescription>
                </CardContent>
                <CardContent>
                   <p className="text-sm text-primary font-semibold flex items-center">
                     View Tools <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                   </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No categories available at the moment.</p>
      )}
    </div>
  );
}
