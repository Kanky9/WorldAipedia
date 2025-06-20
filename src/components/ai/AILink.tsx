
import type { FC } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AILinkProps {
  href: string;
  text?: string;
}

const AILink: FC<AILinkProps> = ({ href, text = "Visit Website" }) => {
  return (
    <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-transform hover:scale-105 text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2">
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
        <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        {text}
      </a>
    </Button>
  );
};

export default AILink;
