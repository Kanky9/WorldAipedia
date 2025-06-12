import Link from 'next/link';
import { BrainCircuit } from 'lucide-react'; // Or another suitable icon
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-primary">WorldAIpedia</h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/categories">Categories</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
