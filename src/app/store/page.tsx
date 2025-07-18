
"use client";

import { useEffect, useState } from 'react';
import { ShoppingCart, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getAllProductsFromFirestore } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/store/ProductCard';
import { categories as productCategories } from '@/data/products';
import CategoryIcon from '@/components/ai/CategoryIcon';

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

  const productsByCategory = products.reduce((acc, product) => {
    const categorySlug = product.categorySlug || 'uncategorized';
    if (!acc[categorySlug]) {
      acc[categorySlug] = [];
    }
    acc[categorySlug].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const orderedCategories = productCategories.filter(cat => productsByCategory[cat.slug]);

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
          {t('storePageSubtitle', 'A curated collection of recommended products from Amazon.')}
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
        <div className="space-y-12">
          {orderedCategories.length > 0 ? (
            orderedCategories.map(category => (
              <section key={category.slug}>
                <div className="flex items-center gap-3 mb-6">
                    <CategoryIcon categoryName={category.name.en} className="h-8 w-8 text-primary" />
                    <h2 className="text-2xl sm:text-3xl font-headline font-bold text-primary/90">{t(category.name)}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {productsByCategory[category.slug].map((product, index) => (
                    <div key={product.id} className="animate-fadeInUp" style={{animationDelay: `${index * 0.05}s`}}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
             <p className="text-center text-muted-foreground py-10">{t('adminNoProducts', 'No products found.')}</p>
          )}
        </div>
      )}
    </div>
  );
}

    