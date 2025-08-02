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
    <Card className="flex flex-col h-full group overflow-hidden transition-all duration-300 bg-card/5 border border-primary/20 backdrop-blur-sm hover:border-primary/40 hover:bg-card/10">
      <a href={product.link} target="_blank" rel="noopener noreferrer" className="block p-4">
        <div className="relative w-full aspect-square overflow-hidden rounded-md">
          <Image
            src={product.imageUrl}
            alt={t(product.title)}
            fill
            style={{ objectFit: 'contain' }}
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={product.imageHint || "product image"}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            unoptimized={product.imageUrl.startsWith('data:')}
          />
        </div>
      </a>
      <CardContent className="p-4 pt-2 text-center flex-grow">
        <h3 className="font-semibold text-base leading-snug text-foreground/90 flex-grow line-clamp-2">{t(product.title)}</h3>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild size="sm" className="w-full mt-2 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 shadow-md">
          <a href={product.link} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-4 w-4" /> {t(buttonTextKey, buttonDefaultText)}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
