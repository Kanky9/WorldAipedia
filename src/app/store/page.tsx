
"use client";

import { useEffect, useState, useRef } from 'react';
import { ShoppingCart, Loader2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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
  
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      
      // Check on resize
      const resizeObserver = new ResizeObserver(handleScroll);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, [products]); // Re-check when products load/change
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="relative flex items-center md:justify-center pb-2">
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-4 z-10 h-8 w-8 rounded-full bg-background/80 hover:bg-background/90 backdrop-blur-sm md:hidden"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide md:justify-center"
        >
          <Button
             variant={selectedCategory === 'all' ? 'default' : 'outline'}
             className={cn(
               "rounded-full shrink-0", 
               selectedCategory === 'all' 
                 ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                 : "bg-primary/10 text-primary-foreground border-primary/30 hover:bg-primary/20"
             )}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {productCategories.map(category => (
            <Button
              key={category.slug}
              variant={selectedCategory === category.slug ? 'default' : 'outline'}
              className={cn(
                "rounded-full shrink-0",
                selectedCategory === category.slug
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-primary/10 text-primary-foreground border-primary/30 hover:bg-primary/20"
              )}
              onClick={() => setSelectedCategory(category.slug)}
            >
              {t(category.name)}
            </Button>
          ))}
        </div>
         {showRightArrow && (
           <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 z-10 h-8 w-8 rounded-full bg-background/80 hover:bg-background/90 backdrop-blur-sm md:hidden"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="mt-8">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
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
    </div>
  );
}
