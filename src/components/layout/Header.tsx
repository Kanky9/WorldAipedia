
"use client";

import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-primary">World AI</h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">{t('navHome', 'Home')}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/categories">{t('navCategories', 'Categories')}</Link>
          </Button>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;
