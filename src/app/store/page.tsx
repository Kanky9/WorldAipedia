
"use client";

import { useEffect, useState } from 'react';
import { ShoppingCart, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getAllProductsFromFirestore } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/store/ProductCard';
import { categories as productCategories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function StorePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProducts = await getAllProductsFromFirestore();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.categorySlug === selectedCategory));
    }
  }, [selectedCategory, products]);

  return (
    <div className="space-y-8 animate-fade-in py-8">
      {/* Category Filter Buttons */}
      <div className="flex justify-center flex-wrap gap-2 pb-6">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className={cn("rounded-full", selectedCategory === 'all' && "bg-primary hover:bg-primary/90")}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </Button>
        {productCategories.map(category => (
          <Button
            key={category.slug}
            variant={selectedCategory === category.slug ? 'default' : 'outline'}
            className={cn("rounded-full", selectedCategory === category.slug && "bg-primary hover:bg-primary/90")}
            onClick={() => setSelectedCategory(category.slug)}
          >
            {t(category.name)}
          </Button>
        ))}
      </div>

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div key={product.id} className="animate-fadeInUp" style={{animationDelay: `${index * 0.05}s`}}>
                <ProductCard product={product} />
              </div>
            ))
          ) : (
             <p className="col-span-full text-center text-muted-foreground py-10">{t('adminNoProducts', 'No products found.')}</p>
          )}
        </div>
      )}
    </div>
  );
}
