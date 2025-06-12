
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
    <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-transform hover:scale-105">
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
        {logoUrl ? (
          <Image 
            src={logoUrl} 
            alt="AI Tool Logo" 
            width={20} 
            height={20} 
            className="rounded" 
            data-ai-hint={logoHint || "brand logo"}
          />
        ) : (
          <LinkIcon className="h-4 w-4" />
        )}
        {text}
      </a>
    </Button>
  );
};

export default AILink;
