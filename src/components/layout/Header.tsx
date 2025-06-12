
"use client";

import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <BrainCircuit className="h-10 w-10 text-primary transition-transform group-hover:rotate-[15deg] duration-300" />
          <h1 className="text-3xl font-headline font-bold text-primary transition-colors group-hover:text-primary/80">World AI</h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="text-lg hover:bg-accent/50 rounded-md">
            <Link href="/">{t('navHome', 'Home')}</Link>
          </Button>
          <Button variant="ghost" asChild className="text-lg hover:bg-accent/50 rounded-md">
            <Link href="/categories">{t('navCategories', 'Categories')}</Link>
          </Button>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;
