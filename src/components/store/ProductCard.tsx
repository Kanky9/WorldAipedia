import type { FC } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { t } = useLanguage();

  const buttonTextKey = product.source === 'amazon' ? 'buyOnAmazonButton' : 'buyOnMercadoLibreButton';
  const buttonDefaultText = product.source === 'amazon' ? 'Buy on Amazon' : 'Buy on MercadoLibre';

  return (
    <div className="flex flex-col h-full group">
      <a href={product.link} target="_blank" rel="noopener noreferrer" className="block bg-background rounded-lg">
        <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden p-2">
          <Image
            src={product.imageUrl}
            alt={t(product.title)}
            fill
            style={{ objectFit: 'contain' }}
            className="transition-transform duration-300"
            data-ai-hint={product.imageHint || "product image"}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            unoptimized={product.imageUrl.startsWith('data:')}
          />
        </div>
      </a>
      <div className="p-2 flex flex-col flex-grow">
        <h3 className="font-semibold text-sm sm:text-base leading-tight text-foreground group-hover:text-primary transition-colors flex-grow">{t(product.title)}</h3>
        <Button asChild size="sm" className="w-full mt-2 bg-primary/90 text-primary-foreground hover:bg-primary shadow-md">
          <a href={product.link} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-4 w-4" /> {t(buttonTextKey, buttonDefaultText)}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
