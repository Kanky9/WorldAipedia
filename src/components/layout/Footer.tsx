import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';


const Footer = () => {
  const { t } = useLanguage();

  return (
    <>
      {/* 
      <div id="ads-footer" className="text-center my-4 container mx-auto min-h-[100px] flex items-center justify-center">
        Placeholder para el anuncio del pie de página
      </div> 
      */}
      <footer className="bg-muted/50 border-t border-border py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <div className="mb-4">
             <h3 className="font-semibold mb-2">{t('footerFounders', 'Founders')}</h3>
             <div className="flex justify-center items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <a href="https://www.linkedin.com/in/joaquin-bello-b681842b0" target="_blank" rel="noopener noreferrer" aria-label="Joaquin Bello LinkedIn">
                        <Linkedin className="h-5 w-5"/>
                    </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <a href="https://www.linkedin.com/in/santino-bournot" target="_blank" rel="noopener noreferrer" aria-label="Santino Bournot LinkedIn">
                         <Linkedin className="h-5 w-5"/>
                    </a>
                </Button>
             </div>
          </div>
          <p>&copy; {new Date().getFullYear()} WorldAIPedia. All rights reserved.</p>
          <p className="mt-1">Exploring the frontiers of Artificial Intelligence.</p>
          <p className="mt-2 text-xs">Este sitio usa cookies. Al continuar navegando, aceptás su uso.</p>
          <div className="mt-2 space-x-4">
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
        </div>
      </footer>
    </>
  );
};

export default Footer;
