import AICard from '@/components/ai/AICard';
import { aiTools } from '@/data/ai-tools';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-card rounded-lg shadow-md">
        <h1 className="text-5xl font-headline font-bold mb-4 text-primary">Welcome to WorldAIpedia</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your ultimate resource for discovering and understanding the ever-evolving world of Artificial Intelligence.
          Explore tools, news, and insights.
        </p>
        <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/categories">Explore Categories</Link>
        </Button>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-semibold mb-8 text-center">Featured AI Tools</h2>
        {aiTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.slice(0, 6).map((tool) => ( // Show a few featured tools
              <AICard key={tool.id} aiTool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No AI tools available at the moment. Please check back later.</p>
        )}
      </section>
       <section className="text-center py-8">
         <Button size="lg" asChild>
           <Link href="/categories">View All AI Tools & Categories</Link>
         </Button>
       </section>
    </div>
  );
}
