
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, UploadCloud, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { categories as allCategories } from '@/data/posts';
import type { Post as PostType, LocalizedString } from '@/lib/types';
import {
  addPostToFirestore,
  getPostFromFirestore,
  updatePostInFirestore,
  db,
} from '@/lib/firebase';
import { doc, collection as firestoreCollection, Timestamp } from 'firebase/firestore';
import type { LanguageCode } from '@/lib/translations';
import { useAuth } from '@/contexts/AuthContext';
import { languages as appLanguagesObject } from '@/lib/translations';

const DEFAULT_MAIN_PLACEHOLDER = 'https://placehold.co/600x400.png';
const DEFAULT_DETAIL_PLACEHOLDER = 'https://placehold.co/400x300.png';
const MAX_DATA_URI_LENGTH = 1024 * 1024; // Approx 1MB

const allAppLanguageCodes = Object.keys(appLanguagesObject) as LanguageCode[];

type LocalizedContent = {
  [key in LanguageCode]?: {
    title: string;
    shortDescription: string;
    longDescription: string;
  };
};

const initialLocalizedContent: LocalizedContent = allAppLanguageCodes.reduce((acc, langCode) => {
  acc[langCode] = { title: '', shortDescription: '', longDescription: '' };
  return acc;
}, {} as LocalizedContent);


export default function CreatePostPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();

  const [postIdFromQuery, setPostIdFromQuery] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for language-specific content
  const [localizedContent, setLocalizedContent] = useState<LocalizedContent>(initialLocalizedContent);

  // State for common fields
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split('T')[0]);
  const [linkTool, setLinkTool] = useState('');
  const [mainImageDataUri, setMainImageDataUri] = useState<string>('');
  const [mainImageUrlForPreview, setMainImageUrlForPreview] = useState<string>(DEFAULT_MAIN_PLACEHOLDER);
  const [mainImageHint, setMainImageHint] = useState('');
  const mainImageFileRef = useRef<HTMLInputElement>(null);
  const [detailImage1DataUri, setDetailImage1DataUri] = useState<string>('');
  const [detailImage1UrlForPreview, setDetailImage1UrlForPreview] = useState<string>(DEFAULT_DETAIL_PLACEHOLDER);
  const [detailImageHint1, setDetailImageHint1] = useState('');
  const detailImage1FileRef = useRef<HTMLInputElement>(null);
  const [detailImage2DataUri, setDetailImage2DataUri] = useState<string>('');
  const [detailImage2UrlForPreview, setDetailImage2UrlForPreview] = useState<string>(DEFAULT_DETAIL_PLACEHOLDER);
  const [detailImageHint2, setDetailImageHint2] = useState('');
  const detailImage2FileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setLocalizedContent(initialLocalizedContent);
    setCategory('');
    setTags('');
    setPublishedDate(new Date().toISOString().split('T')[0]);
    setLinkTool('');
    clearImageHelper(setMainImageDataUri, setMainImageUrlForPreview, mainImageFileRef, DEFAULT_MAIN_PLACEHOLDER); setMainImageHint('');
    clearImageHelper(setDetailImage1DataUri, setDetailImage1UrlForPreview, detailImage1FileRef, DEFAULT_DETAIL_PLACEHOLDER); setDetailImageHint1('');
    clearImageHelper(setDetailImage2DataUri, setDetailImage2UrlForPreview, detailImage2FileRef, DEFAULT_DETAIL_PLACEHOLDER); setDetailImageHint2('');
  };
  
  useEffect(() => {
    if (authLoading || (currentUser && !currentUser.isAdmin)) return;

    const id = searchParams.get('id');

    if (id) {
      if (postIdFromQuery !== id) {
        setPostIdFromQuery(id);
        setIsEditMode(true);
      }
    } else {
      if (isEditMode || postIdFromQuery !== null) {
        setIsEditMode(false);
        setPostIdFromQuery(null);
        resetForm();
      }
      setIsLoadingData(false);
    }
  }, [searchParams, authLoading, currentUser, isEditMode, postIdFromQuery]);

  useEffect(() => {
    if (!isEditMode || !postIdFromQuery || authLoading || (currentUser && !currentUser.isAdmin)) {
      if (!isEditMode) setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    getPostFromFirestore(postIdFromQuery)
      .then(existingPost => {
        if (existingPost) {
            const contentToLoad: LocalizedContent = {};
            allAppLanguageCodes.forEach(langCode => {
                contentToLoad[langCode] = {
                    title: existingPost.title?.[langCode] || '',
                    shortDescription: existingPost.shortDescription?.[langCode] || '',
                    longDescription: existingPost.longDescription?.[langCode] || '',
                };
            });
            setLocalizedContent(contentToLoad);

          setMainImageUrlForPreview(existingPost.imageUrl || DEFAULT_MAIN_PLACEHOLDER);
          setMainImageDataUri(existingPost.imageUrl || '');
          setMainImageHint(existingPost.imageHint || '');
          setDetailImage1UrlForPreview(existingPost.detailImageUrl1 || DEFAULT_DETAIL_PLACEHOLDER);
          setDetailImage1DataUri(existingPost.detailImageUrl1 || '');
          setDetailImageHint1(existingPost.detailImageHint1 || '');
          setDetailImage2UrlForPreview(existingPost.detailImageUrl2 || DEFAULT_DETAIL_PLACEHOLDER);
          setDetailImage2DataUri(existingPost.detailImageUrl2 || '');
          setDetailImageHint2(existingPost.detailImageHint2 || '');
          setCategory(existingPost.categorySlug);
          setTags(existingPost.tags.join(', '));
          let pDate = existingPost.publishedDate;
          if (pDate instanceof Timestamp) pDate = pDate.toDate();
          setPublishedDate(pDate instanceof Date ? pDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
          setLinkTool(existingPost.link || '');
        } else {
          toast({ variant: "destructive", title: t('adminPostErrorTitle', "Error loading post"), description: t('adminPostNotFound', "Post with ID {id} not found.", { id: postIdFromQuery }) });
          router.push('/admin');
        }
      })
      .catch(error => {
        console.error("Error fetching post for edit:", error);
        toast({ variant: "destructive", title: t('adminPostErrorTitle', "Error loading post"), description: t('adminPostErrorDesc', "Failed to load post data.") });
        router.push('/admin');
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  }, [postIdFromQuery, isEditMode, router, t, toast, authLoading, currentUser]);


  useEffect(() => {
    if (!authLoading && (!currentUser || !currentUser.isAdmin)) {
      toast({
        variant: "destructive",
        title: t('adminPostAccessDeniedTitle', "Access Denied"),
        description: t('adminPostAccessDeniedDesc', "You do not have permission to view this page."),
      });
      router.replace('/');
    }
  }, [currentUser, authLoading, router, toast, t]);


  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setDataUriState: React.Dispatch<React.SetStateAction<string>>,
    setPreviewUrlState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
            variant: "destructive",
            title: t('imageFileTooLargeTitle', "Image File Too Large"),
            description: t('imageFileTooLargeDesc', "Please select an image file smaller than 5MB. Larger images may not save correctly."),
            duration: 7000,
        });
        if (event.target) event.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setDataUriState(result);
        setPreviewUrlState(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocalizedContentChange = (langCode: LanguageCode, field: 'title' | 'shortDescription' | 'longDescription', value: string) => {
    setLocalizedContent(prev => ({
      ...prev,
      [langCode]: {
        ...prev[langCode],
        [field]: value,
      },
    }));
  };

  const clearImageHelper = (
    setDataUriState: React.Dispatch<React.SetStateAction<string>>,
    setPreviewUrlState: React.Dispatch<React.SetStateAction<string>>,
    fileRef: React.RefObject<HTMLInputElement>,
    defaultPlaceholderUrl: string
  ) => {
    setDataUriState('');
    setPreviewUrlState(defaultPlaceholderUrl);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.isAdmin) {
      toast({ variant: "destructive", title: t('adminPostAccessDeniedTitle', "Access Denied"), description: t('adminPostAccessDeniedDesc', "You do not have permission to perform this action.") });
      return;
    }

    if (!localizedContent.en?.title?.trim()) {
      toast({
        variant: "destructive",
        title: t('adminPostRequiredFields', "Missing Required Field"),
        description: t('adminPostTitlePlaceholder', "The English title is required to save the post."),
      });
      return;
    }

    if (!category || !publishedDate) {
         toast({
            variant: "destructive",
            title: t('adminPostRequiredFields', "Missing Required Field"),
            description: "Please select a category and a published date.",
         });
         return;
    }
    
    setIsSubmitting(true);

    const finalTranslations: {
      title: Partial<Record<LanguageCode, string>>;
      shortDescription: Partial<Record<LanguageCode, string>>;
      longDescription: Partial<Record<LanguageCode, string>>;
    } = {
      title: {},
      shortDescription: {},
      longDescription: {},
    };

    for (const langCode in localizedContent) {
        const content = localizedContent[langCode as LanguageCode];
        if (content?.title?.trim()) finalTranslations.title[langCode as LanguageCode] = content.title;
        if (content?.shortDescription?.trim()) finalTranslations.shortDescription[langCode as LanguageCode] = content.shortDescription;
        if (content?.longDescription?.trim()) finalTranslations.longDescription[langCode as LanguageCode] = content.longDescription;
    }

    let finalMainImageUrl = mainImageDataUri || mainImageUrlForPreview;
    if (finalMainImageUrl && finalMainImageUrl.startsWith('data:image') && finalMainImageUrl.length > MAX_DATA_URI_LENGTH) {
        toast({ variant: "destructive", title: t('adminPostImageTooLarge', "Main Image Too Large"), description: t('adminPostImageSizeHint', `Using placeholder. Max ~1MB for direct save.`) });
        finalMainImageUrl = DEFAULT_MAIN_PLACEHOLDER;
    } else if (finalMainImageUrl === DEFAULT_MAIN_PLACEHOLDER && !mainImageDataUri) {
        finalMainImageUrl = '';
    }

    let finalDetailImageUrl1 = detailImage1DataUri || detailImage1UrlForPreview;
    if (finalDetailImageUrl1 && finalDetailImageUrl1.startsWith('data:image') && finalDetailImageUrl1.length > MAX_DATA_URI_LENGTH) {
        toast({ variant: "destructive", title: t('adminPostImageTooLarge', "Detail Image 1 Too Large"), description: t('adminPostImageSizeHint', `Using placeholder. Max ~1MB.`) });
        finalDetailImageUrl1 = DEFAULT_DETAIL_PLACEHOLDER;
    } else if (finalDetailImageUrl1 === DEFAULT_DETAIL_PLACEHOLDER && !detailImage1DataUri) {
        finalDetailImageUrl1 = '';
    }

    let finalDetailImageUrl2 = detailImage2DataUri || detailImage2UrlForPreview;
    if (finalDetailImageUrl2 && finalDetailImageUrl2.startsWith('data:image') && finalDetailImageUrl2.length > MAX_DATA_URI_LENGTH) {
        toast({ variant: "destructive", title: t('adminPostImageTooLarge', "Detail Image 2 Too Large"), description: t('adminPostImageSizeHint', `Using placeholder. Max ~1MB.`) });
        finalDetailImageUrl2 = DEFAULT_DETAIL_PLACEHOLDER;
    } else if (finalDetailImageUrl2 === DEFAULT_DETAIL_PLACEHOLDER && !detailImage2DataUri) {
        finalDetailImageUrl2 = '';
    }

    const postDetailsToSave = {
      title: finalTranslations.title as Record<LanguageCode, string> & { en: string },
      shortDescription: finalTranslations.shortDescription as Record<LanguageCode, string> & { en: string },
      longDescription: finalTranslations.longDescription as Record<LanguageCode, string> & { en: string },
      imageUrl: finalMainImageUrl,
      imageHint: mainImageHint,
      category: allCategories.find(c => c.slug === category)?.name.en || 'Information',
      categorySlug: category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      publishedDate: new Date(publishedDate),
      link: linkTool,
      detailImageUrl1: finalDetailImageUrl1 || undefined,
      detailImageHint1: detailImageHint1,
      detailImageUrl2: finalDetailImageUrl2 || undefined,
      detailImageHint2: detailImageHint2,
    };

    try {
      const postTitleForToast = postDetailsToSave.title.en;
      if (isEditMode && postIdFromQuery) {
        await updatePostInFirestore(postIdFromQuery, postDetailsToSave);
        toast({
          title: t('adminPostUpdatedSuccess', "Post Updated"),
          description: t('updatedInSession', 'Post "{title}" has been updated.', { title: postTitleForToast }),
          action: <CheckCircle className="text-green-500" />,
        });
      } else {
        const newPostData = { ...postDetailsToSave, publishedDate: postDetailsToSave.publishedDate || new Date() };
        const newPostId = doc(firestoreCollection(db, 'posts')).id;
        await addPostToFirestore({ ...newPostData, id: newPostId });
        toast({
          title: t('adminPostCreatedSuccess', "Post Created"),
          description: t('createdInSession', 'Post "{title}" has been saved.', { title: postTitleForToast }),
          action: <CheckCircle className="text-green-500" />,
        });
        resetForm();
      }
      router.push('/admin');
    } catch (error) {
      console.error("Error saving post to Firestore:", error);
      toast({
        variant: "destructive",
        title: t('adminPostError', "Error saving post"),
        description: `${t('adminPostErrorDesc', 'Failed to save post')}: ${error instanceof Error ? error.message : "Unknown error"}`,
        action: <XCircle className="text-red-500" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  interface ImageUploadSectionProps {
    labelKey: string; defaultLabel: string;
    imageUrlForPreview: string;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClearImage: () => void;
    fileRef: React.RefObject<HTMLInputElement>;
    hintValue: string; onHintChange: (value: string) => void;
    hintLabelKey: string; hintDefaultLabel: string; hintPlaceholderKey: string; hintDefaultPlaceholder: string;
    aspectRatio?: string;
    previewSize?: {width: number, height: number};
  }

  const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
    labelKey, defaultLabel, imageUrlForPreview, onFileChange, onClearImage, fileRef,
    hintValue, onHintChange, hintLabelKey, hintDefaultLabel, hintPlaceholderKey, hintDefaultPlaceholder,
    aspectRatio = "aspect-video", previewSize = {width:200, height:112}
  }) => (
    <div className="space-y-2">
      <Label>{t(labelKey, defaultLabel)}</Label>
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={isSubmitting || isLoadingData}>
          <UploadCloud className="mr-2 h-4 w-4" /> {t('uploadImageButton', 'Upload Image')}
        </Button>
        <Input type="file" accept="image/*" ref={fileRef} onChange={onFileChange} className="hidden" disabled={isSubmitting || isLoadingData} />
        {(imageUrlForPreview && imageUrlForPreview !== DEFAULT_MAIN_PLACEHOLDER && imageUrlForPreview !== DEFAULT_DETAIL_PLACEHOLDER) && (
          <Button type="button" variant="ghost" size="sm" onClick={onClearImage} disabled={isSubmitting || isLoadingData}>
            <Trash2 className="mr-1 h-4 w-4" /> {t('clearImageButton', 'Clear')}
          </Button>
        )}
      </div>
      {imageUrlForPreview && (
        <div className={`mt-2 rounded border overflow-hidden ${aspectRatio}`} style={{maxWidth: `${previewSize.width}px`}}>
          <Image
            src={imageUrlForPreview}
            alt={t(labelKey, defaultLabel) + " preview"}
            width={previewSize.width}
            height={previewSize.height}
            className="object-cover w-full h-full"
            data-ai-hint={hintValue || (imageUrlForPreview.startsWith('blob:') || imageUrlForPreview.startsWith('data:') ? "uploaded image" : "image")}
            unoptimized={imageUrlForPreview.startsWith('blob:') || imageUrlForPreview.startsWith('data:')}
          />
        </div>
      )}
      <div className="mt-2">
        <Label htmlFor={`${labelKey}-hint`}>{t(hintLabelKey, hintDefaultLabel)}</Label>
        <Input id={`${labelKey}-hint`} value={hintValue} onChange={(e) => onHintChange(e.target.value)} placeholder={t(hintPlaceholderKey, hintDefaultPlaceholder)} disabled={isSubmitting || isLoadingData} />
      </div>
    </div>
  );

  if (authLoading || (!currentUser && !authLoading)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser?.isAdmin && !authLoading) {
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">{t('adminPostAccessDeniedTitle', "Access Denied")}</h2>
        <p className="text-muted-foreground">{t('adminPostAccessDeniedDesc', "You do not have permission to view this page.")}</p>
        <Button onClick={() => router.push('/')} className="mt-4">{t('goToHomepageButton', "Go to Homepage")}</Button>
      </div>
    );
  }

  if (isLoadingData && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const isProcessRunning = isSubmitting || (isLoadingData && isEditMode);

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
          <CardTitle className="text-xl sm:text-2xl font-headline text-primary">
            {isEditMode ? t('adminEditTitle', 'Edit Post') : t('adminCreateTitle', 'Create New Post')}
          </CardTitle>
          <CardDescription>
            {isEditMode ? `${t('adminEditTitle', 'Edit Post')}: ${localizedContent.en?.title || '...'}` : t('adminPostLongDescPlaceholder', 'Fill in the details to create a new blog post.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <Tabs defaultValue="en" className="w-full">
                <TabsList className="h-auto flex-wrap justify-start">
                    {allAppLanguageCodes.map((code) => (
                        <TabsTrigger key={code} value={code}>
                           {appLanguagesObject[code].flag} {appLanguagesObject[code].name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {allAppLanguageCodes.map((code) => (
                    <TabsContent key={code} value={code}>
                        <div className="space-y-4 mt-4">
                            <div>
                                <Label htmlFor={`title-${code}`}>{t('adminPostTitleLabel', 'Post Title')} ({appLanguagesObject[code].name})</Label>
                                <Input 
                                    id={`title-${code}`} 
                                    value={localizedContent[code]?.title || ''} 
                                    onChange={(e) => handleLocalizedContentChange(code as LanguageCode, 'title', e.target.value)} 
                                    placeholder={`${t('adminPostTitlePlaceholder', 'Enter post title')} (${code})`}
                                    required={code === 'en'}
                                    disabled={isProcessRunning} 
                                />
                            </div>
                            <div>
                                <Label htmlFor={`shortDescription-${code}`}>{t('adminPostShortDescLabel', 'Short Description')} ({appLanguagesObject[code].name})</Label>
                                <Textarea 
                                    id={`shortDescription-${code}`} 
                                    value={localizedContent[code]?.shortDescription || ''} 
                                    onChange={(e) => handleLocalizedContentChange(code as LanguageCode, 'shortDescription', e.target.value)} 
                                    placeholder={`${t('adminPostShortDescPlaceholder', 'Enter a brief summary')} (${code})`}
                                    disabled={isProcessRunning} 
                                />
                            </div>
                            <div>
                                <Label htmlFor={`longDescription-${code}`}>{t('adminPostLongDescLabel', 'Long Description (Content)')} ({appLanguagesObject[code].name})</Label>
                                <Textarea 
                                    id={`longDescription-${code}`} 
                                    value={localizedContent[code]?.longDescription || ''} 
                                    onChange={(e) => handleLocalizedContentChange(code as LanguageCode, 'longDescription', e.target.value)} 
                                    placeholder={`${t('adminPostLongDescPlaceholder', 'Write the full content of the post here...')} (${code})`}
                                    rows={8}
                                    disabled={isProcessRunning} 
                                />
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
              <ImageUploadSection
                labelKey="adminPostMainImageLabel" defaultLabel="Main Image"
                imageUrlForPreview={mainImageUrlForPreview}
                onFileChange={(e) => handleImageFileChange(e, setMainImageDataUri, setMainImageUrlForPreview)}
                onClearImage={() => clearImageHelper(setMainImageDataUri, setMainImageUrlForPreview, mainImageFileRef, DEFAULT_MAIN_PLACEHOLDER)}
                fileRef={mainImageFileRef}
                hintValue={mainImageHint} onHintChange={setMainImageHint}
                hintLabelKey="adminPostMainImageHintLabel" hintDefaultLabel="Main Image AI Hint"
                hintPlaceholderKey="adminPostMainImageHintPlaceholder" hintDefaultPlaceholder="e.g., abstract technology"
                previewSize={{width: 300, height: 200}}
              />
            </div>

            <CardDescription>{t('additionalVisualsTitle', 'Visual Insights')}</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
               <ImageUploadSection
                labelKey="adminPostDetailImage1Label" defaultLabel="Visual Insight Image 1"
                imageUrlForPreview={detailImage1UrlForPreview}
                onFileChange={(e) => handleImageFileChange(e, setDetailImage1DataUri, setDetailImage1UrlForPreview)}
                onClearImage={() => clearImageHelper(setDetailImage1DataUri, setDetailImage1UrlForPreview, detailImage1FileRef, DEFAULT_DETAIL_PLACEHOLDER)}
                fileRef={detailImage1FileRef}
                hintValue={detailImageHint1} onHintChange={setDetailImageHint1}
                hintLabelKey="adminPostDetailImageHint1Label" hintDefaultLabel="Visual Insight 1 AI Hint"
                hintPlaceholderKey="adminPostDetailImageHint1Placeholder" hintDefaultPlaceholder="e.g., interface screenshot"
                previewSize={{width:250, height:187}}
              />
              <ImageUploadSection
                labelKey="adminPostDetailImage2Label" defaultLabel="Visual Insight Image 2"
                imageUrlForPreview={detailImage2UrlForPreview}
                onFileChange={(e) => handleImageFileChange(e, setDetailImage2DataUri, setDetailImage2UrlForPreview)}
                onClearImage={() => clearImageHelper(setDetailImage2DataUri, setDetailImage2UrlForPreview, detailImage2FileRef, DEFAULT_DETAIL_PLACEHOLDER)}
                fileRef={detailImage2FileRef}
                hintValue={detailImageHint2} onHintChange={setDetailImageHint2}
                hintLabelKey="adminPostDetailImageHint2Label" hintDefaultLabel="Visual Insight 2 AI Hint"
                hintPlaceholderKey="adminPostDetailImageHint2Placeholder" hintDefaultPlaceholder="e.g., concept art"
                previewSize={{width:250, height:187}}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">{t('adminPostCategoryLabel', 'Category')}</Label>
                <Select value={category} onValueChange={setCategory} required disabled={isProcessRunning}>
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

              <div>
                <Label htmlFor="tags">{t('adminPostTagsLabel', 'Tags (comma-separated)')}</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t('adminPostTagsPlaceholder', 'e.g., AI, Machine Learning, NLP')} disabled={isProcessRunning} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="publishedDate">{t('adminPostPublishedDateLabel', 'Published Date')}</Label>
                <Input id="publishedDate" type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} required disabled={isProcessRunning} />
              </div>
              <div>
                <Label htmlFor="linkTool">{t('adminPostLinkToolLabel', 'Link to Tool (Optional)')}</Label>
                <Input id="linkTool" value={linkTool} onChange={(e) => setLinkTool(e.target.value)} placeholder={t('adminPostLinkToolPlaceholder', 'https://example.com/tool')} disabled={isProcessRunning} />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90 w-full sm:w-auto" disabled={isProcessRunning}>
                {(isSubmitting || (isLoadingData && isEditMode)) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {isEditMode ? t('adminPostButtonUpdate', 'Update Post') : t('adminPostButtonCreate', 'Create Post')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
