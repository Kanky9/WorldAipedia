import type { FC } from 'react';
import Image from 'next/image';
import type { Book } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { ShoppingCart } from 'lucide-react';
import type { CoreTranslationKey } from '@/lib/translations';

interface BookCardProps {
  book: Book;
}

const BookCard: FC<BookCardProps> = ({ book }) => {
  const { t } = useLanguage();

  const buttonTextKey = book.source === 'amazon' ? 'buyOnAmazonButton' : 'buyOnMercadoLibreButton';
  const buttonDefaultText = book.source === 'amazon' ? 'Buy on Amazon' : 'Buy on MercadoLibre';

  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 rounded-xl group bg-card">
      <div className="relative w-full h-64">
        <Image
          src={book.imageUrl}
          alt={t(book.title)}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-t-xl group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={book.imageHint || "book cover"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={book.imageUrl.startsWith('data:')}
        />
      </div>
      <CardHeader className="pt-4">
        <CardTitle className="font-headline text-lg sm:text-xl group-hover:text-primary transition-colors">{t(book.title)}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pt-2">
        <CardDescription className="text-sm sm:text-base">{t(book.description)}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">
          <a href={book.link} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-4 w-4" /> {t(buttonTextKey, buttonDefaultText)}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
