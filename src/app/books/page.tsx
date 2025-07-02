
"use client";

import { useEffect, useState } from 'react';
import { BookOpen, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getAllBooksFromFirestore } from '@/lib/firebase';
import type { Book } from '@/lib/types';
import BookCard from '@/components/books/BookCard';

export default function BooksPage() {
  const { t } = useLanguage();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedBooks = await getAllBooksFromFirestore();
        setBooks(fetchedBooks);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const amazonBooks = books.filter(book => book.source === 'amazon');
  const mercadoLibreBooks = books.filter(book => book.source === 'mercadolibre');

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="text-center py-8">
        <div className="flex justify-center items-center mb-4">
          <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold mb-3 text-primary">
          {t('booksPageTitle', 'Recommended Books')}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          {t('booksPageSubtitle', 'A curated collection of books on AI, technology, and more.')}
        </p>
      </section>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive text-lg">{error}</p>
        </div>
      ) : (
        <>
          {amazonBooks.length > 0 && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-headline font-semibold mb-6 text-primary/90">{t('amazonProductsTitle', 'From Amazon')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {amazonBooks.map((book, index) => (
                  <div key={book.id} className="animate-fadeInUp" style={{animationDelay: `${index * 0.05}s`}}>
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {mercadoLibreBooks.length > 0 && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-headline font-semibold mb-6 text-primary/90">{t('mercadolibreProductsTitle', 'From MercadoLibre')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {mercadoLibreBooks.map((book, index) => (
                   <div key={book.id} className="animate-fadeInUp" style={{animationDelay: `${index * 0.05}s`}}>
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {books.length === 0 && (
             <p className="text-center text-muted-foreground py-10">{t('adminNoBooks', 'No books found.')}</p>
          )}
        </>
      )}
    </div>
  );
}
