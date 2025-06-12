
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { categories as allCategories, posts as allPosts, getPostById } from '@/data/posts'; // Import posts and categories
import type { Post, LocalizedString } from '@/lib/types';

// Helper to handle LocalizedString for defaultValues
const getLocalizedStringDefault = (value: LocalizedString | undefined, lang: string = 'en'): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang as keyof LocalizedString] || value.en || '';
};


export default function CreatePostPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  // Check for edit mode (e.g., /admin/create-post?id=some-id)
  // This is a client-side way to get query params.
  // For a more robust solution with SSR, you'd use `useSearchParams` from `next/navigation`
  const [postId, setPostId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    if (id) {
      setPostId(id);
      setIsEditMode(true);
      const existingPost = getPostById(id);
      if (existingPost) {
        // Pre-fill form for edit mode
        setTitle(getLocalizedStringDefault(existingPost.title, language));
        setShortDescription(getLocalizedStringDefault(existingPost.shortDescription, language));
        setLongDescription(getLocalizedStringDefault(existingPost.longDescription, language));
        setMainImageUrl(existingPost.imageUrl);
        setMainImageHint(existingPost.imageHint || '');
        setLogoUrl(existingPost.logoUrl || '');
        setLogoHint(existingPost.logoHint || '');
        setDetailImageUrl1(existingPost.detailImageUrl1 || '');
        setDetailImageHint1(existingPost.detailImageHint1 || '');
        setDetailImageUrl2(existingPost.detailImageUrl2 || '');
        setDetailImageHint2(existingPost.detailImageHint2 || '');
        setCategory(existingPost.categorySlug); // Use categorySlug for Select value
        setTags(existingPost.tags.join(', '));
        setPublishedDate(existingPost.publishedDate.toISOString().split('T')[0]); // Format for date input
        setLinkTool(existingPost.link || '');
      } else {
        toast({
          variant: "destructive",
          title: t('adminPostError', "Error"),
          description: `Post with ID ${id} not found.`,
        });
        router.push('/admin');
      }
    }
  }, [language, router, t, toast]);


  // Form state
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [mainImageHint, setMainImageHint] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoHint, setLogoHint] = useState('');
  const [detailImageUrl1, setDetailImageUrl1] = useState('');
  const [detailImageHint1, setDetailImageHint1] = useState('');
  const [detailImageUrl2, setDetailImageUrl2] = useState('');
  const [detailImageHint2, setDetailImageHint2] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split('T')[0]);
  const [linkTool, setLinkTool] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend (e.g., Firebase Firestore)
    // For this prototype, we'll just show a toast message.

    // Basic validation
    if (!title || !shortDescription || !longDescription || !mainImageUrl || !category || !publishedDate) {
      toast({
        variant: "destructive",
        title: t('adminPostError', "Error"),
        description: "Please fill in all required fields (Title, Descriptions, Main Image, Category, Published Date).",
      });
      return;
    }
    
    const postData = {
      id: isEditMode && postId ? postId : `new-post-${Date.now()}`, // Generate new ID or use existing
      title: { en: title, es: title }, // Simplification: using same for both langs
      shortDescription: { en: shortDescription, es: shortDescription },
      longDescription: { en: longDescription, es: longDescription },
      imageUrl: mainImageUrl,
      imageHint: mainImageHint,
      logoUrl: logoUrl,
      logoHint: logoHint,
      category: allCategories.find(c => c.slug === category)?.name.en || 'Information', // Get category name from slug
      categorySlug: category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      publishedDate: new Date(publishedDate),
      link: linkTool,
      detailImageUrl1: detailImageUrl1,
      detailImageHint1: detailImageHint1,
      detailImageUrl2: detailImageUrl2,
      detailImageHint2: detailImageHint2,
      comments: isEditMode && postId ? getPostById(postId)?.comments || [] : [],
    };

    console.log("Simulating post submission:", postData);

    toast({
      title: isEditMode ? t('adminPostUpdatedSuccess') : t('adminPostCreatedSuccess'),
      description: `${t(postData.title)} ${isEditMode ? 'updated' : 'created'}.`,
      action: <CheckCircle className="text-green-500" />,
    });
    
    // Potentially clear form or redirect
    if (!isEditMode) {
        // Clear form for new post
        setTitle('');
        setShortDescription('');
        setLongDescription('');
        setMainImageUrl('');
        setMainImageHint('');
        setLogoUrl('');
        setLogoHint('');
        setDetailImageUrl1('');
        setDetailImageHint1('');
        setDetailImageUrl2('');
        setDetailImageHint2('');
        setCategory('');
        setTags('');
        setPublishedDate(new Date().toISOString().split('T')[0]);
        setLinkTool('');
    }
    // router.push('/admin'); // Optionally redirect after submit
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/admin" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('adminPostButtonBack', 'Back to Admin')}
        </Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">
            {isEditMode ? t('adminEditTitle', 'Edit Post') : t('adminCreateTitle', 'Create New Post')}
          </CardTitle>
          <CardDescription>
            {isEditMode ? `Editing post: ${getLocalizedStringDefault(getPostById(postId!)?.title, language)}` : 'Fill in the details to create a new blog post.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">{t('adminPostTitleLabel', 'Post Title')}</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('adminPostTitlePlaceholder', 'Enter post title')} required />
            </div>

            {/* Short Description */}
            <div>
              <Label htmlFor="shortDescription">{t('adminPostShortDescLabel', 'Short Description')}</Label>
              <Textarea id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder={t('adminPostShortDescPlaceholder', 'Enter a brief summary')} required />
            </div>

            {/* Long Description */}
            <div>
              <Label htmlFor="longDescription">{t('adminPostLongDescLabel', 'Long Description (Content)')}</Label>
              <Textarea id="longDescription" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} placeholder={t('adminPostLongDescPlaceholder', 'Write the full content of the post here...')} rows={8} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Image URL */}
              <div>
                <Label htmlFor="mainImageUrl">{t('adminPostMainImageUrlLabel', 'Main Image URL')}</Label>
                <Input id="mainImageUrl" value={mainImageUrl} onChange={(e) => setMainImageUrl(e.target.value)} placeholder={t('adminPostMainImageUrlPlaceholder', 'https://placehold.co/600x400.png')} required />
              </div>
              {/* Main Image Hint */}
              <div>
                <Label htmlFor="mainImageHint">{t('adminPostMainImageHintLabel', 'Main Image AI Hint')}</Label>
                <Input id="mainImageHint" value={mainImageHint} onChange={(e) => setMainImageHint(e.target.value)} placeholder={t('adminPostMainImageHintPlaceholder', 'e.g., abstract technology')} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo URL */}
              <div>
                <Label htmlFor="logoUrl">{t('adminPostLogoUrlLabel', 'Tool Logo URL (Optional)')}</Label>
                <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder={t('adminPostLogoUrlPlaceholder', 'https://placehold.co/50x50.png')} />
              </div>
              {/* Logo Hint */}
              <div>
                <Label htmlFor="logoHint">{t('adminPostLogoHintLabel', 'Logo AI Hint')}</Label>
                <Input id="logoHint" value={logoHint} onChange={(e) => setLogoHint(e.target.value)} placeholder={t('adminPostLogoHintPlaceholder', 'e.g., brand logo')} />
              </div>
            </div>

            <CardDescription>{t('additionalVisualsTitle')}</CardDescription>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Detail Image 1 URL */}
                <div>
                    <Label htmlFor="detailImageUrl1">{t('adminPostDetailImageUrl1Label', 'Visual Insight Image 1 URL')}</Label>
                    <Input id="detailImageUrl1" value={detailImageUrl1} onChange={(e) => setDetailImageUrl1(e.target.value)} placeholder={t('adminPostDetailImageUrl1Placeholder', 'https://placehold.co/400x300.png')} />
                </div>
                {/* Detail Image 1 Hint */}
                <div>
                    <Label htmlFor="detailImageHint1">{t('adminPostDetailImageHint1Label', 'Visual Insight 1 AI Hint')}</Label>
                    <Input id="detailImageHint1" value={detailImageHint1} onChange={(e) => setDetailImageHint1(e.target.value)} placeholder={t('adminPostDetailImageHint1Placeholder', 'e.g., interface screenshot')} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Detail Image 2 URL */}
                <div>
                    <Label htmlFor="detailImageUrl2">{t('adminPostDetailImageUrl2Label', 'Visual Insight Image 2 URL')}</Label>
                    <Input id="detailImageUrl2" value={detailImageUrl2} onChange={(e) => setDetailImageUrl2(e.target.value)} placeholder={t('adminPostDetailImageUrl2Placeholder', 'https://placehold.co/400x300.png')} />
                </div>
                {/* Detail Image 2 Hint */}
                <div>
                    <Label htmlFor="detailImageHint2">{t('adminPostDetailImageHint2Label', 'Visual Insight 2 AI Hint')}</Label>
                    <Input id="detailImageHint2" value={detailImageHint2} onChange={(e) => setDetailImageHint2(e.target.value)} placeholder={t('adminPostDetailImageHint2Placeholder', 'e.g., concept art')} />
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <Label htmlFor="category">{t('adminPostCategoryLabel', 'Category')}</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t('adminPostSelectCategoryPlaceholder', 'Select a category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map(cat => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {t(cat.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">{t('adminPostTagsLabel', 'Tags (comma-separated)')}</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t('adminPostTagsPlaceholder', 'e.g., AI, Machine Learning, NLP')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Published Date */}
              <div>
                <Label htmlFor="publishedDate">{t('adminPostPublishedDateLabel', 'Published Date')}</Label>
                <Input id="publishedDate" type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} required />
              </div>
              {/* Link to Tool */}
              <div>
                <Label htmlFor="linkTool">{t('adminPostLinkToolLabel', 'Link to Tool (Optional)')}</Label>
                <Input id="linkTool" value={linkTool} onChange={(e) => setLinkTool(e.target.value)} placeholder={t('adminPostLinkToolPlaceholder', 'https://example.com/tool')} />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {isEditMode ? t('adminPostButtonUpdate', 'Update Post') : t('adminPostButtonCreate', 'Create Post')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
