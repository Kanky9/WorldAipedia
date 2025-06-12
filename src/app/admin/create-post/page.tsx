
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
import { ArrowLeft, CheckCircle, XCircle, UploadCloud, Trash2, Loader2 } from 'lucide-react';
import { categories as allCategories } from '@/data/posts';
import type { Post as PostType, LocalizedString } from '@/lib/types';
import { addPostToFirestore, getPostFromFirestore, updatePostInFirestore, db } from '@/lib/firebase';
import { doc, collection, Timestamp } from 'firebase/firestore';
import type { LanguageCode } from '@/lib/translations';

const getLocalizedStringDefault = (value: LocalizedString | undefined, lang: string = 'en'): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang as keyof LocalizedString] || value.en || '';
};

// Define the return type for getUpdatedLocalizedField at the top level using an intersection
type UpdatedLocalizedFieldReturnType = 
  { [key in LanguageCode]?: string } & 
  { en: string }; // Ensures 'en' is always present

export default function CreatePostPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();

  const [postIdFromQuery, setPostIdFromQuery] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingPostDataForForm, setExistingPostDataForForm] = useState<PostType | null>(null);


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
      setPostIdFromQuery(id);
      setIsEditMode(true);
      setIsLoadingData(true);
      getPostFromFirestore(id).then(existingPost => {
        if (existingPost) {
          setExistingPostDataForForm(existingPost);
          setTitle(getLocalizedStringDefault(existingPost.title, language));
          setShortDescription(getLocalizedStringDefault(existingPost.shortDescription, language));
          setLongDescription(getLocalizedStringDefault(existingPost.longDescription, language));

          if (existingPost.imageUrl.startsWith('data:image')) {
            setMainImageDataUri(existingPost.imageUrl);
            setMainImagePlaceholderUrl('');
          } else {
            setMainImagePlaceholderUrl(existingPost.imageUrl || 'https://placehold.co/600x400.png');
            setMainImageDataUri(null);
          }
          setMainImageHint(existingPost.imageHint || '');

          if (existingPost.logoUrl?.startsWith('data:image')) {
            setLogoDataUri(existingPost.logoUrl);
            setLogoPlaceholderUrl('');
          } else if (existingPost.logoUrl) {
            setLogoPlaceholderUrl(existingPost.logoUrl);
            setLogoDataUri(null);
          } else {
            setLogoPlaceholderUrl('https://placehold.co/50x50.png');
            setLogoDataUri(null);
          }
          setLogoHint(existingPost.logoHint || '');

          if (existingPost.detailImageUrl1?.startsWith('data:image')) {
            setDetailImage1DataUri(existingPost.detailImageUrl1);
            setDetailImage1PlaceholderUrl('');
          } else if (existingPost.detailImageUrl1) {
            setDetailImage1PlaceholderUrl(existingPost.detailImageUrl1);
            setDetailImage1DataUri(null);
          } else {
            setDetailImage1PlaceholderUrl('https://placehold.co/400x300.png');
            setDetailImage1DataUri(null);
          }
          setDetailImageHint1(existingPost.detailImageHint1 || '');

           if (existingPost.detailImageUrl2?.startsWith('data:image')) {
            setDetailImage2DataUri(existingPost.detailImageUrl2);
            setDetailImage2PlaceholderUrl('');
          } else if (existingPost.detailImageUrl2) {
            setDetailImage2PlaceholderUrl(existingPost.detailImageUrl2);
            setDetailImage2DataUri(null);
          } else {
            setDetailImage2PlaceholderUrl('https://placehold.co/400x300.png');
            setDetailImage2DataUri(null);
          }
          setDetailImageHint2(existingPost.detailImageHint2 || '');


          setCategory(existingPost.categorySlug);
          setTags(existingPost.tags.join(', '));
          
          let pDate = existingPost.publishedDate;
          if (pDate instanceof Timestamp) {
            pDate = pDate.toDate();
          }
          setPublishedDate(pDate instanceof Date ? pDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
          
          setLinkTool(existingPost.link || '');
        } else {
          toast({
            variant: "destructive",
            title: t('adminPostError'),
            description: `Post with ID ${id} not found in database.`,
          });
          router.push('/admin');
        }
        setIsLoadingData(false);
      }).catch(error => {
        console.error("Error fetching post for edit:", error);
        toast({ variant: "destructive", title: t('adminPostError'), description: "Failed to load post data."});
        setIsLoadingData(false);
        router.push('/admin');
      });
    } else {
      // Reset form for new post
      setIsEditMode(false);
      setExistingPostDataForForm(null);
      setTitle(''); setShortDescription(''); setLongDescription('');
      clearImage(setMainImageDataUri, mainImageFileRef, 'https://placehold.co/600x400.png', setMainImagePlaceholderUrl); setMainImageHint('');
      clearImage(setLogoDataUri, logoFileRef, 'https://placehold.co/50x50.png', setLogoPlaceholderUrl); setLogoHint('');
      clearImage(setDetailImage1DataUri, detailImage1FileRef, 'https://placehold.co/400x300.png', setDetailImage1PlaceholderUrl); setDetailImageHint1('');
      clearImage(setDetailImage2DataUri, detailImage2FileRef, 'https://placehold.co/400x300.png', setDetailImage2PlaceholderUrl); setDetailImageHint2('');
      setCategory(''); setTags(''); setPublishedDate(new Date().toISOString().split('T')[0]); setLinkTool('');
    }
  }, [postIdFromQuery, language, router, t, toast]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredImageProvided = mainImageDataUri || (mainImagePlaceholderUrl && !mainImagePlaceholderUrl.startsWith('https://placehold.co'));

    if (!title || !shortDescription || !longDescription || !requiredImageProvided || !category || !publishedDate) {
      toast({
        variant: "destructive",
        title: t('adminPostError'),
        description: "Please fill in all required fields (Title, Descriptions, Main Image, Category, Published Date). Ensure main image is uploaded or a valid non-default placeholder is used.",
      });
      return;
    }

    setIsSubmitting(true);

    const currentEditingLanguage = language as LanguageCode;
    
    const getUpdatedLocalizedField = (
      existingFieldData: LocalizedString | undefined,
      newValue: string
    ): UpdatedLocalizedFieldReturnType => {
      const base = typeof existingFieldData === 'object' && existingFieldData !== null
        ? { ...existingFieldData }
        : { en: '' }; 
      
      const typedBase = base as UpdatedLocalizedFieldReturnType;

      typedBase[currentEditingLanguage] = newValue;
      if (!typedBase.en) { 
           typedBase.en = newValue;
      }
      return typedBase;
    };
    
    const postDetailsToSave = {
      title: getUpdatedLocalizedField(existingPostDataForForm?.title, title),
      shortDescription: getUpdatedLocalizedField(existingPostDataForForm?.shortDescription, shortDescription),
      longDescription: getUpdatedLocalizedField(existingPostDataForForm?.longDescription, longDescription),
      imageUrl: mainImageDataUri || mainImagePlaceholderUrl,
      imageHint: mainImageHint,
      logoUrl: logoDataUri || (logoPlaceholderUrl.startsWith('https://placehold.co') || !logoPlaceholderUrl ? undefined : logoPlaceholderUrl),
      logoHint: logoHint,
      category: allCategories.find(c => c.slug === category)?.name.en || 'Information',
      categorySlug: category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      publishedDate: new Date(publishedDate), 
      link: linkTool,
      detailImageUrl1: detailImage1DataUri || (detailImage1PlaceholderUrl.startsWith('https://placehold.co') || !detailImage1PlaceholderUrl ? undefined : detailImage1PlaceholderUrl),
      detailImageHint1: detailImageHint1,
      detailImageUrl2: detailImage2DataUri || (detailImage2PlaceholderUrl.startsWith('https://placehold.co') || !detailImage2PlaceholderUrl ? undefined : detailImage2PlaceholderUrl),
      detailImageHint2: detailImageHint2,
    };

    try {
      if (isEditMode && postIdFromQuery) {
        await updatePostInFirestore(postIdFromQuery, postDetailsToSave);
        toast({
          title: t('adminPostUpdatedSuccess', "Post Updated"),
          description: `${getLocalizedStringDefault(postDetailsToSave.title, language)} ${t('updatedInSession', "has been updated in the database.")}`,
          action: <CheckCircle className="text-green-500" />,
        });
      } else {
        
        const newPostData = { 
            ...postDetailsToSave, 
            publishedDate: postDetailsToSave.publishedDate || new Date() 
        };
        const newPostId = doc(collection(db, 'posts')).id; 
        await addPostToFirestore({ ...newPostData, id: newPostId });
        toast({
          title: t('adminPostCreatedSuccess', "Post Created"),
          description: `${getLocalizedStringDefault(newPostData.title, language)} ${t('createdInSession', "has been saved to the database.")}`,
          action: <CheckCircle className="text-green-500" />,
        });
        
        setTitle(''); setShortDescription(''); setLongDescription('');
        clearImage(setMainImageDataUri, mainImageFileRef, 'https://placehold.co/600x400.png', setMainImagePlaceholderUrl); setMainImageHint('');
        clearImage(setLogoDataUri, logoFileRef, 'https://placehold.co/50x50.png', setLogoPlaceholderUrl); setLogoHint('');
        clearImage(setDetailImage1DataUri, detailImage1FileRef, 'https://placehold.co/400x300.png', setDetailImage1PlaceholderUrl); setDetailImageHint1('');
        clearImage(setDetailImage2DataUri, detailImage2FileRef, 'https://placehold.co/400x300.png', setDetailImage2PlaceholderUrl); setDetailImageHint2('');
        setCategory(''); setTags(''); setPublishedDate(new Date().toISOString().split('T')[0]); setLinkTool('');
        setExistingPostDataForForm(null); 
      }
      router.push('/admin'); 
    } catch (error) {
      console.error("Error saving post to Firestore:", error);
      toast({
        variant: "destructive",
        title: t('adminPostError'),
        description: `Failed to save post: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: <XCircle className="text-red-500" />,
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={isSubmitting || isLoadingData}>
          <UploadCloud className="mr-2 h-4 w-4" /> {t('uploadImageButton')}
        </Button>
        <Input type="file" accept="image/*" ref={fileRef} onChange={onFileChange} className="hidden" disabled={isSubmitting || isLoadingData} />
        {(imageDataUri || (placeholderUrl && !placeholderUrl.startsWith("https://placehold.co"))) && (
          <Button type="button" variant="ghost" size="sm" onClick={onClearImage} disabled={isSubmitting || isLoadingData}>
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
            unoptimized={!!imageDataUri} 
          />
        </div>
      )}
      <div className="mt-2">
        <Label htmlFor={`${labelKey}-hint`}>{t(hintLabelKey, hintDefaultLabel)}</Label>
        <Input id={`${labelKey}-hint`} value={hintValue} onChange={(e) => onHintChange(e.target.value)} placeholder={t(hintPlaceholderKey, hintDefaultPlaceholder)} disabled={isSubmitting || isLoadingData} />
      </div>
    </div>
  );

  if (isLoadingData && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
            {isEditMode && existingPostDataForForm ? `${t('adminEditTitle')}: ${getLocalizedStringDefault(existingPostDataForForm.title, language)}` : t('adminPostLongDescPlaceholder', 'Fill in the details to create a new blog post.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('adminPostTitleLabel')}</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('adminPostTitlePlaceholder')} required disabled={isSubmitting || isLoadingData} />
            </div>

            <div>
              <Label htmlFor="shortDescription">{t('adminPostShortDescLabel')}</Label>
              <Textarea id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder={t('adminPostShortDescPlaceholder')} required disabled={isSubmitting || isLoadingData} />
            </div>

            <div>
              <Label htmlFor="longDescription">{t('adminPostLongDescLabel')}</Label>
              <Textarea id="longDescription" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} placeholder={t('adminPostLongDescPlaceholder')} rows={8} required disabled={isSubmitting || isLoadingData} />
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
                <Select value={category} onValueChange={setCategory} required disabled={isSubmitting || isLoadingData}>
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
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t('adminPostTagsPlaceholder')} disabled={isSubmitting || isLoadingData} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="publishedDate">{t('adminPostPublishedDateLabel')}</Label>
                <Input id="publishedDate" type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} required disabled={isSubmitting || isLoadingData} />
              </div>
              <div>
                <Label htmlFor="linkTool">{t('adminPostLinkToolLabel')}</Label>
                <Input id="linkTool" value={linkTool} onChange={(e) => setLinkTool(e.target.value)} placeholder={t('adminPostLinkToolPlaceholder')} disabled={isSubmitting || isLoadingData} />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting || isLoadingData}>
                {(isSubmitting || (isLoadingData && isEditMode)) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {isEditMode ? t('adminPostButtonUpdate') : t('adminPostButtonCreate')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    