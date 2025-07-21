
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
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:shadow-lg group bg-card border-none shadow-none hover:shadow-xl rounded-lg">
      <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden p-4">
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
      <CardHeader className="p-3">
        <CardTitle className="font-semibold text-sm sm:text-base leading-tight truncate group-hover:text-primary transition-colors">{t(product.title)}</CardTitle>
        <CardDescription className="text-xs line-clamp-2">{t(product.description)}</CardDescription>
      </CardHeader>
      <CardFooter className="p-3 pt-0 mt-auto">
        <Button asChild size="sm" className="w-full bg-primary/90 text-primary-foreground hover:bg-primary shadow-md">
          <a href={product.link} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-4 w-4" /> {t(buttonTextKey, buttonDefaultText)}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
