import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryIcon from '../ai/CategoryIcon';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { getCategoryBySlug } from '@/data/posts';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale'; // Direct import of locales
import { CalendarDays, Tag } from 'lucide-react';
import type { CoreTranslationKey } from '@/lib/translations';

interface PostCardProps {
  post: Post;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const { t, language } = useLanguage();

  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 rounded-xl group bg-card">
      <Link href={`/posts/${post.id}`} className="block">
        <div className="relative w-full h-40 sm:h-48">
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
      <CardHeader className="p-4">
        <Link href={`/posts/${post.id}`} className="block">
          <CardTitle className="font-headline text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">{t(post.title)}</CardTitle>
        </Link>
        <div className="flex items-center text-xs text-muted-foreground pt-1 gap-2 flex-wrap">
           {post.categorySlugs?.map(slug => {
                const category = getCategoryBySlug(slug);
                if (!category) return null;
                const localizedCategoryName = t(category.name);
                return (
                    <Badge key={slug} variant="secondary" className="w-fit text-xs hover:bg-primary/20 transition-colors bg-primary/10">
                        <CategoryIcon categoryName={typeof category.name === 'object' ? category.name.en : category.name} className="h-3 w-3 mr-1 text-primary" />
                        {localizedCategoryName}
                    </Badge>
                )
           })}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <CardDescription className="text-sm line-clamp-3">{t(post.shortDescription)}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Button asChild variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md text-sm px-4 py-2 rounded-lg">
          <Link href={`/posts/${post.id}`}>{t('readMoreButton', 'Read More')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
