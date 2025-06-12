
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
import { ArrowLeft, CheckCircle, XCircle, UploadCloud, Trash2 } from 'lucide-react';
import { categories as allCategories, posts as allPosts, getPostById } from '@/data/posts'; 
import type { Post, LocalizedString } from '@/lib/types';

const getLocalizedStringDefault = (value: LocalizedString | undefined, lang: string = 'en'): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang as keyof LocalizedString] || value.en || '';
};

export default function CreatePostPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  const [postId, setPostId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  
  const [mainImageDataUri, setMainImageDataUri] = useState<string | null>(null);
  const [mainImagePlaceholderUrl, setMainImagePlaceholderUrl] = useState('https://placehold.co/600x400.png');
  const [mainImageHint, setMainImageHint] = useState('');
  const mainImageFileRef = useRef<HTMLInputElement>(null);

  const [logoDataUri, setLogoDataUri] = useState<string | null>(null);
  const [logoPlaceholderUrl, setLogoPlaceholderUrl] = useState('https://placehold.co/50x50.png');
  const [logoHint, setLogoHint] = useState('');
  const logoFileRef = useRef<HTMLInputElement>(null);

  const [detailImage1DataUri, setDetailImage1DataUri] = useState<string | null>(null);
  const [detailImage1PlaceholderUrl, setDetailImage1PlaceholderUrl] = useState('https://placehold.co/400x300.png');
  const [detailImageHint1, setDetailImageHint1] = useState('');
  const detailImage1FileRef = useRef<HTMLInputElement>(null);

  const [detailImage2DataUri, setDetailImage2DataUri] = useState<string | null>(null);
  const [detailImage2PlaceholderUrl, setDetailImage2PlaceholderUrl] = useState('https://placehold.co/400x300.png');
  const [detailImageHint2, setDetailImageHint2] = useState('');
  const detailImage2FileRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split('T')[0]);
  const [linkTool, setLinkTool] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    if (id) {
      setPostId(id);
      setIsEditMode(true);
      const existingPost = getPostById(id); // This gets from the potentially modified allPosts
      if (existingPost) {
        setTitle(getLocalizedStringDefault(existingPost.title, language));
        setShortDescription(getLocalizedStringDefault(existingPost.shortDescription, language));
        setLongDescription(getLocalizedStringDefault(existingPost.longDescription, language));
        
        if (existingPost.imageUrl.startsWith('data:image')) {
            setMainImageDataUri(existingPost.imageUrl);
        } else {
            setMainImagePlaceholderUrl(existingPost.imageUrl); 
        }
        setMainImageHint(existingPost.imageHint || '');

        if (existingPost.logoUrl?.startsWith('data:image')) {
            setLogoDataUri(existingPost.logoUrl);
        } else if (existingPost.logoUrl) {
            setLogoPlaceholderUrl(existingPost.logoUrl);
        }
        setLogoHint(existingPost.logoHint || '');
        
        if (existingPost.detailImageUrl1?.startsWith('data:image')) {
            setDetailImage1DataUri(existingPost.detailImageUrl1);
        } else if (existingPost.detailImageUrl1) {
            setDetailImage1PlaceholderUrl(existingPost.detailImageUrl1);
        }
        setDetailImageHint1(existingPost.detailImageHint1 || '');

        if (existingPost.detailImageUrl2?.startsWith('data:image')) {
            setDetailImage2DataUri(existingPost.detailImageUrl2);
        } else if (existingPost.detailImageUrl2) {
            setDetailImage2PlaceholderUrl(existingPost.detailImageUrl2);
        }
        setDetailImageHint2(existingPost.detailImageHint2 || '');

        setCategory(existingPost.categorySlug);
        setTags(existingPost.tags.join(', '));
        setPublishedDate(existingPost.publishedDate instanceof Date ? existingPost.publishedDate.toISOString().split('T')[0] : new Date(existingPost.publishedDate).toISOString().split('T')[0]);
        setLinkTool(existingPost.link || '');
      } else {
        toast({
          variant: "destructive",
          title: t('adminPostError'),
          description: `Post with ID ${id} not found.`,
        });
        router.push('/admin');
      }
    }
  }, [language, router, t, toast, postId]); // Added postId to dependency array to refetch if it changes (though unlikely here)

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setDataUriState: React.Dispatch<React.SetStateAction<string | null>>,
    setPlaceholderUrlState?: React.Dispatch<React.SetStateAction<string>> 
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDataUriState(reader.result as string);
        if (setPlaceholderUrlState) setPlaceholderUrlState(''); 
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (
    setDataUriState: React.Dispatch<React.SetStateAction<string | null>>,
    fileRef: React.RefObject<HTMLInputElement>,
    defaultPlaceholderUrl: string,
    setPlaceholderUrlState?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setDataUriState(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    if (setPlaceholderUrlState) setPlaceholderUrlState(defaultPlaceholderUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredImageProvided = mainImageDataUri || (mainImagePlaceholderUrl && !mainImagePlaceholderUrl.startsWith('https://placehold.co'));
    
    if (!title || !shortDescription || !longDescription || !requiredImageProvided || !category || !publishedDate) {
      toast({
        variant: "destructive",
        title: t('adminPostError'),
        description: "Please fill in all required fields (Title, Descriptions, Main Image, Category, Published Date). Ensure main image is uploaded or a valid placeholder is used.",
      });
      return;
    }
    
    const postData: Post = {
      id: isEditMode && postId ? postId : `new-post-${Date.now()}`, // Use existing ID if editing
      title: { en: title, es: title }, // Assuming current input lang should be 'en' and 'es' for simplicity
      shortDescription: { en: shortDescription, es: shortDescription },
      longDescription: { en: longDescription, es: longDescription },
      imageUrl: mainImageDataUri || mainImagePlaceholderUrl,
      imageHint: mainImageHint,
      logoUrl: logoDataUri || (logoPlaceholderUrl.startsWith('https://placehold.co') || !logoPlaceholderUrl ? '' : logoPlaceholderUrl),
      logoHint: logoHint,
      category: allCategories.find(c => c.slug === category)?.name.en || 'Information',
      categorySlug: category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      publishedDate: new Date(publishedDate),
      link: linkTool,
      detailImageUrl1: detailImage1DataUri || (detailImage1PlaceholderUrl.startsWith('https://placehold.co') || !detailImage1PlaceholderUrl ? '' : detailImage1PlaceholderUrl),
      detailImageHint1: detailImageHint1,
      detailImageUrl2: detailImage2DataUri || (detailImage2PlaceholderUrl.startsWith('https://placehold.co') || !detailImage2PlaceholderUrl ? '' : detailImage2PlaceholderUrl),
      detailImageHint2: detailImageHint2,
      comments: (isEditMode && postId ? getPostById(postId)?.comments : []) || [],
    };

    if (isEditMode && postId) {
      const postIndex = allPosts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        allPosts[postIndex] = postData;
        toast({
          title: t('adminPostUpdatedSuccess'),
          description: `${getLocalizedStringDefault(postData.title, language)} ${t('updatedInSession')}`,
          action: <CheckCircle className="text-green-500" />,
        });
      } else {
        // Fallback: if in edit mode but post somehow not found, add as new (shouldn't happen)
        allPosts.push(postData);
        toast({
          title: t('adminPostCreatedSuccess'),
          description: `${getLocalizedStringDefault(postData.title, language)} ${t('createdInSession')} (ID not found, added as new).`,
          action: <CheckCircle className="text-green-500" />,
        });
      }
    } else {
      allPosts.push(postData);
      toast({
        title: t('adminPostCreatedSuccess'),
        description: `${getLocalizedStringDefault(postData.title, language)} ${t('createdInSession')}`,
        action: <CheckCircle className="text-green-500" />,
      });
      // Clear form only if creating a new post
      setTitle(''); setShortDescription(''); setLongDescription('');
      clearImage(setMainImageDataUri, mainImageFileRef, 'https://placehold.co/600x400.png', setMainImagePlaceholderUrl);
      setMainImageHint('');
      clearImage(setLogoDataUri, logoFileRef, 'https://placehold.co/50x50.png', setLogoPlaceholderUrl);
      setLogoHint('');
      clearImage(setDetailImage1DataUri, detailImage1FileRef, 'https://placehold.co/400x300.png', setDetailImage1PlaceholderUrl);
      setDetailImageHint1('');
      clearImage(setDetailImage2DataUri, detailImage2FileRef, 'https://placehold.co/400x300.png', setDetailImage2PlaceholderUrl);
      setDetailImageHint2('');
      setCategory(''); setTags(''); setPublishedDate(new Date().toISOString().split('T')[0]); setLinkTool('');
    }
    // Optionally, navigate away or refresh a list view.
    // For now, staying on the page will show the "saved" data in the form if editing.
    // If creating, the form clears.
  };

  const ImageUploadSection: React.FC<{
    labelKey: string; defaultLabel: string;
    imageDataUri: string | null; 
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClearImage: () => void;
    fileRef: React.RefObject<HTMLInputElement>;
    hintValue: string; onHintChange: (value: string) => void;
    hintLabelKey: string; hintDefaultLabel: string; hintPlaceholderKey: string; hintDefaultPlaceholder: string;
    aspectRatio?: string;
    previewSize?: {width: number, height: number};
    placeholderUrl: string;
  }> = ({
    labelKey, defaultLabel, imageDataUri, onFileChange, onClearImage, fileRef,
    hintValue, onHintChange, hintLabelKey, hintDefaultLabel, hintPlaceholderKey, hintDefaultPlaceholder,
    aspectRatio = "aspect-video", previewSize = {width:200, height:112}, placeholderUrl
  }) => (
    <div className="space-y-2">
      <Label>{t(labelKey, defaultLabel)}</Label>
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
          <UploadCloud className="mr-2 h-4 w-4" /> {t('uploadImageButton')}
        </Button>
        <Input type="file" accept="image/*" ref={fileRef} onChange={onFileChange} className="hidden" />
        {(imageDataUri || (placeholderUrl && !placeholderUrl.startsWith("https://placehold.co"))) && ( // Show clear if uploaded or if placeholder is not default
          <Button type="button" variant="ghost" size="sm" onClick={onClearImage}>
            <Trash2 className="mr-1 h-4 w-4" /> {t('clearImageButton')}
          </Button>
        )}
      </div>
      {(imageDataUri || placeholderUrl) && (
        <div className={`mt-2 rounded border overflow-hidden ${aspectRatio}`} style={{maxWidth: `${previewSize.width}px`}}>
          <Image
            src={imageDataUri || placeholderUrl}
            alt={t(labelKey, defaultLabel) + " preview"}
            width={previewSize.width}
            height={previewSize.height}
            className="object-cover w-full h-full"
            data-ai-hint={hintValue || (imageDataUri ? "uploaded image" : "placeholder")}
          />
        </div>
      )}
      <div className="mt-2">
        <Label htmlFor={`${labelKey}-hint`}>{t(hintLabelKey, hintDefaultLabel)}</Label>
        <Input id={`${labelKey}-hint`} value={hintValue} onChange={(e) => onHintChange(e.target.value)} placeholder={t(hintPlaceholderKey, hintDefaultPlaceholder)} />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/admin" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('adminPostButtonBack')}
        </Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">
            {isEditMode ? t('adminEditTitle') : t('adminCreateTitle')}
          </CardTitle>
          <CardDescription>
            {isEditMode && postId ? `${t('adminEditTitle')}: ${getLocalizedStringDefault(getPostById(postId)?.title, language)}` : t('adminPostLongDescPlaceholder', 'Fill in the details to create a new blog post.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('adminPostTitleLabel')}</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('adminPostTitlePlaceholder')} required />
            </div>

            <div>
              <Label htmlFor="shortDescription">{t('adminPostShortDescLabel')}</Label>
              <Textarea id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder={t('adminPostShortDescPlaceholder')} required />
            </div>

            <div>
              <Label htmlFor="longDescription">{t('adminPostLongDescLabel')}</Label>
              <Textarea id="longDescription" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} placeholder={t('adminPostLongDescPlaceholder')} rows={8} required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
              <ImageUploadSection
                labelKey="adminPostMainImageLabel" defaultLabel="Main Image"
                imageDataUri={mainImageDataUri}
                onFileChange={(e) => handleImageFileChange(e, setMainImageDataUri, setMainImagePlaceholderUrl)}
                onClearImage={() => clearImage(setMainImageDataUri, mainImageFileRef, 'https://placehold.co/600x400.png', setMainImagePlaceholderUrl)}
                fileRef={mainImageFileRef}
                hintValue={mainImageHint} onHintChange={setMainImageHint}
                hintLabelKey="adminPostMainImageHintLabel" hintDefaultLabel="Main Image AI Hint"
                hintPlaceholderKey="adminPostMainImageHintPlaceholder" hintDefaultPlaceholder="e.g., abstract technology"
                previewSize={{width: 300, height: 200}}
                placeholderUrl={mainImagePlaceholderUrl}
              />
              <ImageUploadSection
                labelKey="adminPostLogoLabel" defaultLabel="Tool Logo (Optional)"
                imageDataUri={logoDataUri}
                onFileChange={(e) => handleImageFileChange(e, setLogoDataUri, setLogoPlaceholderUrl)}
                onClearImage={() => clearImage(setLogoDataUri, logoFileRef, 'https://placehold.co/50x50.png', setLogoPlaceholderUrl)}
                fileRef={logoFileRef}
                hintValue={logoHint} onHintChange={setLogoHint}
                hintLabelKey="adminPostLogoHintLabel" hintDefaultLabel="Logo AI Hint"
                hintPlaceholderKey="adminPostLogoHintPlaceholder" hintDefaultPlaceholder="e.g., brand logo"
                aspectRatio="aspect-square"
                previewSize={{width:100, height:100}}
                placeholderUrl={logoPlaceholderUrl}
              />
            </div>

            <CardDescription>{t('additionalVisualsTitle')}</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
               <ImageUploadSection
                labelKey="adminPostDetailImage1Label" defaultLabel="Visual Insight Image 1"
                imageDataUri={detailImage1DataUri}
                onFileChange={(e) => handleImageFileChange(e, setDetailImage1DataUri, setDetailImage1PlaceholderUrl)}
                onClearImage={() => clearImage(setDetailImage1DataUri, detailImage1FileRef, 'https://placehold.co/400x300.png', setDetailImage1PlaceholderUrl)}
                fileRef={detailImage1FileRef}
                hintValue={detailImageHint1} onHintChange={setDetailImageHint1}
                hintLabelKey="adminPostDetailImageHint1Label" hintDefaultLabel="Visual Insight 1 AI Hint"
                hintPlaceholderKey="adminPostDetailImageHint1Placeholder" hintDefaultPlaceholder="e.g., interface screenshot"
                previewSize={{width:250, height:187}}
                placeholderUrl={detailImage1PlaceholderUrl}
              />
              <ImageUploadSection
                labelKey="adminPostDetailImage2Label" defaultLabel="Visual Insight Image 2"
                imageDataUri={detailImage2DataUri}
                onFileChange={(e) => handleImageFileChange(e, setDetailImage2DataUri, setDetailImage2PlaceholderUrl)}
                onClearImage={() => clearImage(setDetailImage2DataUri, detailImage2FileRef, 'https://placehold.co/400x300.png', setDetailImage2PlaceholderUrl)}
                fileRef={detailImage2FileRef}
                hintValue={detailImageHint2} onHintChange={setDetailImageHint2}
                hintLabelKey="adminPostDetailImageHint2Label" hintDefaultLabel="Visual Insight 2 AI Hint"
                hintPlaceholderKey="adminPostDetailImageHint2Placeholder" hintDefaultPlaceholder="e.g., concept art"
                previewSize={{width:250, height:187}}
                placeholderUrl={detailImage2PlaceholderUrl}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">{t('adminPostCategoryLabel')}</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t('adminPostSelectCategoryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map(cat => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {getLocalizedStringDefault(cat.name, language)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">{t('adminPostTagsLabel')}</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t('adminPostTagsPlaceholder')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="publishedDate">{t('adminPostPublishedDateLabel')}</Label>
                <Input id="publishedDate" type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="linkTool">{t('adminPostLinkToolLabel')}</Label>
                <Input id="linkTool" value={linkTool} onChange={(e) => setLinkTool(e.target.value)} placeholder={t('adminPostLinkToolPlaceholder')} />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {isEditMode ? t('adminPostButtonUpdate') : t('adminPostButtonCreate')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
    
