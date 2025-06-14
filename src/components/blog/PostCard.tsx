
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
        <div className="relative w-full h-48">
          <Image
            src={post.imageUrl}
            alt={t(post.title, post.id)}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-xl group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={post.imageHint || "technology concept"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={post.imageUrl.startsWith('data:')}
          />
        </div>
      </Link>
      <CardHeader className="pt-4">
        <Link href={`/posts/${post.id}`} className="block">
          <CardTitle className="font-headline text-lg sm:text-xl group-hover:text-primary transition-colors">{t(post.title)}</CardTitle>
        </Link>
        <div className="flex items-center text-xs text-muted-foreground mt-1 gap-2">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{postDateLocale ? format(new Date(post.publishedDate), 'MMM d, yyyy', { locale: postDateLocale }) : new Date(post.publishedDate).toLocaleDateString()}</span>
        </div>
        {category && (
          <Link href={`/categories/${category.slug}`} className="w-fit">
            <Badge variant="secondary" className="w-fit mt-2 text-xs sm:text-sm hover:bg-primary/20 transition-colors">
                <CategoryIcon categoryName={post.category} className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-primary" />
                {localizedCategoryName}
            </Badge>
          </Link>
        )}
      </CardHeader>
      <CardContent className="flex-grow pt-2">
        <CardDescription className="text-sm sm:text-base">{t(post.shortDescription)}</CardDescription>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs"><Tag className="h-3 w-3 mr-1"/>{tag}</Badge>
          ))}
        </div>
        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2 rounded-md">
          <Link href={`/posts/${post.id}`}>{t('readMoreButton', 'Read More')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
