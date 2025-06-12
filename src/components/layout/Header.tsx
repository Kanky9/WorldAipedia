
"use client";

import Link from 'next/link';
import { BrainCircuit, Menu, X } from 'lucide-react'; // Added Menu, X
import { Button } from '@/components/ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';
import { useState } from 'react'; // Added useState

const Header = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <BrainCircuit className="h-10 w-10 text-primary transition-transform group-hover:rotate-[15deg] duration-300" />
          <h1 className="text-3xl font-headline font-bold text-primary transition-colors group-hover:text-primary/80">World AI</h1>
        </Link>
        
        <div className="flex items-center gap-2">
          {/* Language Switcher - always visible */}
          <LanguageSwitcher />

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" asChild className="text-base hover:bg-accent/50 rounded-md">
              <Link href="/">{t('navHome', 'Home')}</Link>
            </Button>
            <Button variant="ghost" asChild className="text-base hover:bg-accent/50 rounded-md">
              <Link href="/categories">{t('navCategories', 'Categories')}</Link>
            </Button>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="sm:hidden">
            <Button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              variant="ghost" 
              size="icon"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-20 left-0 right-0 w-full bg-card shadow-lg p-4 z-40 border-b border-t border-border">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/" 
              className="text-lg font-medium hover:text-primary py-2 text-center" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navHome', 'Home')}
            </Link>
            <Link 
              href="/categories" 
              className="text-lg font-medium hover:text-primary py-2 text-center" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navCategories', 'Categories')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
