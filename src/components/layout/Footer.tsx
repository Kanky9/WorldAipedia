import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-muted/50 border-t border-border py-6 text-sm text-muted-foreground">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} WorldAIPedia. All rights reserved.</p>
          <p className="mt-1">Exploring the frontiers of Artificial Intelligence.</p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-primary hover:underline">
              Terms and Conditions
            </Link>
            <Link href="/cookie-policy" className="text-primary hover:underline">
              Cookie Policy
            </Link>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <h3 className="font-semibold text-foreground">{t('footerFounders', 'Founders')}:</h3>
            <Button asChild variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <a href="https://www.linkedin.com/in/joaquin-bello-b681842b0" target="_blank" rel="noopener noreferrer" aria-label="Joaquin Bello LinkedIn">
                    <Linkedin className="h-5 w-5"/>
                </a>
            </Button>
            <Button asChild variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <a href="https://www.linkedin.com/in/santino-bournot" target="_blank" rel="noopener noreferrer" aria-label="Santino Bournot LinkedIn">
                    <Linkedin className="h-5 w-5"/>
                </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
