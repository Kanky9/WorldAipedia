import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-muted/50 border-t border-border py-6 text-sm text-muted-foreground">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
        <div>
          <p>&copy; {new Date().getFullYear()} WorldAIPedia. All rights reserved.</p>
          <p className="mt-1">Exploring the frontiers of Artificial Intelligence.</p>
        </div>

        <div className="mt-2">
            <h4 className="font-semibold text-foreground mb-2">{t('footerFounders', 'Founders')}</h4>
            <div className="flex items-center justify-center gap-4">
                <a 
                    href="https://www.linkedin.com/in/joaquin-bello-b681842b0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2 bg-slate-700 rounded-lg shadow-md border-b-4 border-slate-800 text-white transform transition-all duration-150 ease-in-out hover:bg-slate-600 hover:border-b-2 active:translate-y-1 active:border-b-0"
                    aria-label="Joaquín Bello's LinkedIn Profile"
                >
                    <Linkedin className="h-5 w-5" />
                </a>
                <a 
                    href="https://www.linkedin.com/in/santino-bournot" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2 bg-slate-700 rounded-lg shadow-md border-b-4 border-slate-800 text-white transform transition-all duration-150 ease-in-out hover:bg-slate-600 hover:border-b-2 active:translate-y-1 active:border-b-0"
                    aria-label="Santino Bournot's LinkedIn Profile"
                >
                    <Linkedin className="h-5 w-5" />
                </a>
                <a 
                    href="https://www.instagram.com/lacelabs01?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg shadow-md border-b-4 border-purple-700 text-white transform transition-all duration-150 ease-in-out hover:from-purple-600 hover:to-orange-600 hover:border-b-2 active:translate-y-1 active:border-b-0"
                    aria-label="Lace Labs Instagram Profile"
                >
                    <Instagram className="h-5 w-5" />
                </a>
            </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
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
  );
};

export default Footer;
