import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';


const Footer = () => {
  const { t } = useLanguage();

  const founderButtonStyle = cn(
    'p-2 rounded-lg bg-blue-800 text-white shadow-md border-b-4 border-blue-900',
    'transition-all duration-150 ease-in-out',
    'hover:bg-blue-700 hover:border-blue-800 hover:shadow-lg hover:bg-opacity-80', // Translucido al pasar el ratón
    'active:translate-y-0.5 active:border-b-2 active:shadow-sm' // Efecto 3D al presionar
  );

  return (
    <>
      <footer className="bg-muted/50 border-t border-border py-8 text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-8">
            
            {/* Founders Section (Left) */}
            <div className="flex flex-col items-center md:items-start">
               <h3 className="font-semibold mb-2 text-foreground">{t('footerFounders', 'Founders')}</h3>
               <div className="flex justify-center items-center gap-3">
                  <a href="https://www.linkedin.com/in/joaquin-bello-b681842b0" target="_blank" rel="noopener noreferrer" aria-label="Joaquin Bello LinkedIn" className={founderButtonStyle}>
                      <Linkedin className="h-5 w-5"/>
                  </a>
                  <a href="https://www.linkedin.com/in/santino-bournot" target="_blank" rel="noopener noreferrer" aria-label="Santino Bournot LinkedIn" className={founderButtonStyle}>
                       <Linkedin className="h-5 w-5"/>
                  </a>
               </div>
            </div>

            {/* Separator Line (visible on md screens and up) */}
            <Separator orientation="vertical" className="h-16 hidden md:block bg-border/50 shadow-inner" />

            {/* Privacy Links Section (Right) */}
            <div className="flex flex-col items-center md:items-end">
                <h3 className="font-semibold mb-2 text-foreground">Legal</h3>
                <div className="flex flex-col items-center md:items-end gap-1">
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

          </div>

          {/* Centered Copyright */}
          <div className="text-center mt-8 pt-6 border-t border-border/50">
            <p>&copy; {new Date().getFullYear()} WorldAIPedia. All rights reserved.</p>
            <p className="mt-1">Exploring the frontiers of Artificial Intelligence.</p>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;
