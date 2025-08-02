
import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryIcon from '../ai/CategoryIcon';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { getCategoryByName } from '@/data/posts';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale'; // Direct import of locales
import { CalendarDays, Tag } from 'lucide-react';
import type { CoreTranslationKey } from '@/lib/translations';

interface PostCardProps {
  post: Post;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const { t, language } = useLanguage();
  const category = getCategoryByName(post.category);
  const localizedCategoryName = category ? t(category.name) : post.category;

  const getPostDateLocale = () => {
    switch (language) {
      case 'es':
        return es;
      case 'en':
      default:
        return enUS;
    }
  };
  const postDateLocale = getPostDateLocale();

  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 rounded-xl group bg-card">
      <Link href={`/posts/${post.id}`} className="block">
        <div className="relative w-full h-28 sm:h-32">
          <Image
            src={post.imageUrl}
            alt={t(post.title, post.id)}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-xl group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={post.imageHint || "technology concept"}
            sizes="(max-width: 768px) 50vw, 33vw"
            unoptimized={post.imageUrl.startsWith('data:')}
          />
        </div>
      </Link>
      <CardHeader className="p-3">
        <Link href={`/posts/${post.id}`} className="block">
          <CardTitle className="font-headline text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">{t(post.title)}</CardTitle>
        </Link>
        <div className="flex items-center text-xs text-muted-foreground pt-1 gap-2">
           {category && (
              <Badge variant="secondary" className="w-fit text-xs hover:bg-primary/20 transition-colors bg-primary/10">
                  <CategoryIcon categoryName={post.category} className="h-3 w-3 mr-1 text-primary" />
                  {localizedCategoryName}
              </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-3 pt-0">
        <CardDescription className="text-xs line-clamp-3">{t(post.shortDescription)}</CardDescription>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md text-xs px-3 py-1.5 rounded-md">
          <Link href={`/posts/${post.id}`}>{t('readMoreButton', 'Read More')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
