
"use client";

import { useEffect, useState } from 'react';
import { ShoppingCart, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getAllProductsFromFirestore } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/store/ProductCard';

export default function StorePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProducts = await getAllProductsFromFirestore();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const amazonProducts = products.filter(product => product.source === 'amazon');
  const mercadoLibreProducts = products.filter(product => product.source === 'mercadolibre');

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="text-center py-8">
        <div className="flex justify-center items-center mb-4">
          <ShoppingCart className="h-10 w-10 md:h-12 md:w-12 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold mb-3 text-primary">
          {t('storePageTitle', 'Official Store')}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          {t('storePageSubtitle', 'A curated collection of recommended products.')}
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
          {amazonProducts.length > 0 && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-headline font-semibold mb-6 text-primary/90">{t('amazonProductsTitle', 'From Amazon')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {amazonProducts.map((product, index) => (
                  <div key={product.id} className="animate-fadeInUp" style={{animationDelay: `${index * 0.05}s`}}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {mercadoLibreProducts.length > 0 && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-headline font-semibold mb-6 text-primary/90">{t('mercadolibreProductsTitle', 'From MercadoLibre')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {mercadoLibreProducts.map((product, index) => (
                   <div key={product.id} className="animate-fadeInUp" style={{animationDelay: `${index * 0.05}s`}}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {products.length === 0 && (
             <p className="text-center text-muted-foreground py-10">{t('adminNoProducts', 'No products found.')}</p>
          )}
        </>
      )}
    </div>
  );
}
