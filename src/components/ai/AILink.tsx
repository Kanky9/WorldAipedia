
import type { FC } from 'react';
import Image from 'next/image';
import { Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AILinkProps {
  href: string;
  logoUrl?: string;
  logoHint?: string;
  text?: string; // Already supports text override
}

const AILink: FC<AILinkProps> = ({ href, logoUrl, logoHint, text = "Visit Website" }) => {
  // Text prop is already used, no change needed to support t('visitWebsiteButton')
  return (
    <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-transform hover:scale-105 text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2">
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
        {logoUrl ? (
          <Image 
            src={logoUrl} 
            alt="AI Tool Logo" 
            width={16} // smaller logo
            height={16} // smaller logo
            className="rounded" 
            data-ai-hint={logoHint || "brand logo"}
          />
        ) : (
          <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        )}
        {text}
      </a>
    </Button>
  );
};

export default AILink;
