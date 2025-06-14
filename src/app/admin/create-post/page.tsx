
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

const DEFAULT_MAIN_PLACEHOLDER = 'https://placehold.co/600x400.png';
const DEFAULT_LOGO_PLACEHOLDER = 'https://placehold.co/50x50.png';
const DEFAULT_DETAIL_PLACEHOLDER = 'https://placehold.co/400x300.png';
const MAX_DATA_URI_LENGTH = 1024 * 1024; // Approx 1MB

export default function CreatePostPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();

  const [postIdFromQuery, setPostIdFromQuery] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingPostDataForForm, setExistingPostDataForForm] = useState<PostType | null>(null);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split('T')[0]);
  const [linkTool, setLinkTool] = useState('');

  // State for Data URIs and Preview URLs
  const [mainImageDataUri, setMainImageDataUri] = useState<string>('');
  const [mainImageUrlForPreview, setMainImageUrlForPreview] = useState<string>(DEFAULT_MAIN_PLACEHOLDER);
  const [mainImageHint, setMainImageHint] = useState('');
  const mainImageFileRef = useRef<HTMLInputElement>(null);

  const [logoDataUri, setLogoDataUri] = useState<string>('');
  const [logoUrlForPreview, setLogoUrlForPreview] = useState<string>(DEFAULT_LOGO_PLACEHOLDER);
  const [logoHint, setLogoHint] = useState('');
  const logoFileRef = useRef<HTMLInputElement>(null);

  const [detailImage1DataUri, setDetailImage1DataUri] = useState<string>('');
  const [detailImage1UrlForPreview, setDetailImage1UrlForPreview] = useState<string>(DEFAULT_DETAIL_PLACEHOLDER);
  const [detailImageHint1, setDetailImageHint1] = useState('');
  const detailImage1FileRef = useRef<HTMLInputElement>(null);

  const [detailImage2DataUri, setDetailImage2DataUri] = useState<string>('');
  const [detailImage2UrlForPreview, setDetailImage2UrlForPreview] = useState<string>(DEFAULT_DETAIL_PLACEHOLDER);
  const [detailImageHint2, setDetailImageHint2] = useState('');
  const detailImage2FileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser || !currentUser.isAdmin) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have permission to view this page.",
        });
        router.replace('/');
      }
    }
  }, [currentUser, authLoading, router, toast]);

  const getLocalizedStringDefault = (value: LocalizedString | undefined, lang: string = 'en'): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang as keyof LocalizedString] || value.en || '';
  };

  useEffect(() => {
    if (authLoading || !currentUser?.isAdmin) return;

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

          setMainImageUrlForPreview(existingPost.imageUrl || DEFAULT_MAIN_PLACEHOLDER);
          setMainImageDataUri(existingPost.imageUrl || '');
          setMainImageHint(existingPost.imageHint || '');

          setLogoUrlForPreview(existingPost.logoUrl || DEFAULT_LOGO_PLACEHOLDER);
          setLogoDataUri(existingPost.logoUrl || '');
          setLogoHint(existingPost.logoHint || '');
          
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
          toast({ variant: "destructive", title: t('adminPostError', "Error loading post"), description: `Post with ID ${id} not found.` });
          router.push('/admin');
        }
        setIsLoadingData(false);
      }).catch(error => {
        console.error("Error fetching post for edit:", error);
        toast({ variant: "destructive", title: t('adminPostError', "Error loading post"), description: "Failed to load post data." });
        setIsLoadingData(false);
        router.push('/admin');
      });
    } else {
      setIsEditMode(false);
      setExistingPostDataForForm(null);
      setTitle(''); setShortDescription(''); setLongDescription('');
      clearImageHelper(setMainImageDataUri, setMainImageUrlForPreview, mainImageFileRef, DEFAULT_MAIN_PLACEHOLDER); setMainImageHint('');
      clearImageHelper(setLogoDataUri, setLogoUrlForPreview, logoFileRef, DEFAULT_LOGO_PLACEHOLDER); setLogoHint('');
      clearImageHelper(setDetailImage1DataUri, setDetailImage1UrlForPreview, detailImage1FileRef, DEFAULT_DETAIL_PLACEHOLDER); setDetailImageHint1('');
      clearImageHelper(setDetailImage2DataUri, setDetailImage2UrlForPreview, detailImage2FileRef, DEFAULT_DETAIL_PLACEHOLDER); setDetailImageHint2('');
      setCategory(''); setTags(''); setPublishedDate(new Date().toISOString().split('T')[0]); setLinkTool('');
    }
  }, [postIdFromQuery, language, router, t, toast, authLoading, currentUser]);

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setDataUriState: React.Dispatch<React.SetStateAction<string>>,
    setPreviewUrlState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Basic 5MB check for UX
        toast({
            variant: "destructive",
            title: "Image File Too Large",
            description: `Please select an image file smaller than 5MB. Larger images may not save correctly.`,
            duration: 7000,
        });
        if (event.target) event.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setDataUriState(result);
        setPreviewUrlState(result); // For preview, use the data URI itself
      };
      reader.readAsDataURL(file);
    }
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
      toast({ variant: "destructive", title: "Access Denied", description: "You do not have permission to perform this action." });
      return;
    }

    if (!title || !shortDescription || !longDescription || (!mainImageDataUri && mainImageUrlForPreview === DEFAULT_MAIN_PLACEHOLDER) || !category || !publishedDate) {
      toast({
        variant: "destructive",
        title: t('adminPostError', "Error submitting post"),
        description: "Please fill in all required fields (Title, Descriptions, Main Image, Category, Published Date). Ensure main image is uploaded or set.",
      });
      return;
    }
    setIsSubmitting(true);

    const currentEditingLanguage = language as LanguageCode;
    type UpdatedLocalizedFieldReturnType = { [key in LanguageCode]?: string; } & { en: string; };
    const getUpdatedLocalizedField = (
      existingFieldData: LocalizedString | undefined,
      newValue: string
    ): UpdatedLocalizedFieldReturnType => {
      const base = typeof existingFieldData === 'object' && existingFieldData !== null
        ? { ...existingFieldData }
        : { en: '' };
      const typedBase = base as UpdatedLocalizedFieldReturnType;
      typedBase[currentEditingLanguage] = newValue;
      if (!typedBase.en && newValue) typedBase.en = newValue; // Ensure 'en' has a value if possible
      return typedBase;
    };
    
    let finalMainImageUrl = mainImageDataUri || mainImageUrlForPreview;
    if (finalMainImageUrl && finalMainImageUrl.startsWith('data:image') && finalMainImageUrl.length > MAX_DATA_URI_LENGTH) {
        toast({ variant: "destructive", title: "Main Image Too Large", description: `Main image is too large (${(finalMainImageUrl.length / (1024*1024)).toFixed(1)}MB). Using placeholder. Max ~1MB for direct save.` });
        finalMainImageUrl = DEFAULT_MAIN_PLACEHOLDER;
    } else if (finalMainImageUrl === DEFAULT_MAIN_PLACEHOLDER && !mainImageDataUri) {
        finalMainImageUrl = ''; // If it's still the default placeholder and no new data URI was set.
    }

    let finalLogoUrl = logoDataUri || logoUrlForPreview;
    if (finalLogoUrl && finalLogoUrl.startsWith('data:image') && finalLogoUrl.length > MAX_DATA_URI_LENGTH) {
        toast({ variant: "destructive", title: "Logo Image Too Large", description: `Logo image is too large. Using placeholder. Max ~1MB.` });
        finalLogoUrl = DEFAULT_LOGO_PLACEHOLDER;
    } else if (finalLogoUrl === DEFAULT_LOGO_PLACEHOLDER && !logoDataUri) {
        finalLogoUrl = '';
    }

    let finalDetailImageUrl1 = detailImage1DataUri || detailImage1UrlForPreview;
    if (finalDetailImageUrl1 && finalDetailImageUrl1.startsWith('data:image') && finalDetailImageUrl1.length > MAX_DATA_URI_LENGTH) {
        toast({ variant: "destructive", title: "Detail Image 1 Too Large", description: `Detail Image 1 is too large. Using placeholder. Max ~1MB.` });
        finalDetailImageUrl1 = DEFAULT_DETAIL_PLACEHOLDER;
    } else if (finalDetailImageUrl1 === DEFAULT_DETAIL_PLACEHOLDER && !detailImage1DataUri) {
        finalDetailImageUrl1 = '';
    }

    let finalDetailImageUrl2 = detailImage2DataUri || detailImage2UrlForPreview;
    if (finalDetailImageUrl2 && finalDetailImageUrl2.startsWith('data:image') && finalDetailImageUrl2.length > MAX_DATA_URI_LENGTH) {
        toast({ variant: "destructive", title: "Detail Image 2 Too Large", description: `Detail Image 2 is too large. Using placeholder. Max ~1MB.` });
        finalDetailImageUrl2 = DEFAULT_DETAIL_PLACEHOLDER;
    } else if (finalDetailImageUrl2 === DEFAULT_DETAIL_PLACEHOLDER && !detailImage2DataUri) {
        finalDetailImageUrl2 = '';
    }

    const postDetailsToSave = {
      title: getUpdatedLocalizedField(existingPostDataForForm?.title, title),
      shortDescription: getUpdatedLocalizedField(existingPostDataForForm?.shortDescription, shortDescription),
      longDescription: getUpdatedLocalizedField(existingPostDataForForm?.longDescription, longDescription),
      imageUrl: finalMainImageUrl,
      imageHint: mainImageHint,
      logoUrl: finalLogoUrl || undefined,
      logoHint: logoHint,
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
      if (isEditMode && postIdFromQuery) {
        await updatePostInFirestore(postIdFromQuery, postDetailsToSave);
        toast({
          title: t('adminPostUpdatedSuccess', "Post Updated"),
          description: `${getLocalizedStringDefault(postDetailsToSave.title, language)} ${t('updatedInSession', "has been updated.")}`,
          action: <CheckCircle className="text-green-500" />,
        });
      } else {
        const newPostData = { ...postDetailsToSave, publishedDate: postDetailsToSave.publishedDate || new Date() };
        const newPostId = doc(firestoreCollection(db, 'posts')).id; 
        await addPostToFirestore({ ...newPostData, id: newPostId });
        toast({
          title: t('adminPostCreatedSuccess', "Post Created"),
          description: `${getLocalizedStringDefault(newPostData.title, language)} ${t('createdInSession', "has been saved.")}`,
          action: <CheckCircle className="text-green-500" />,
        });
        setTitle(''); setShortDescription(''); setLongDescription('');
        clearImageHelper(setMainImageDataUri, setMainImageUrlForPreview, mainImageFileRef, DEFAULT_MAIN_PLACEHOLDER); setMainImageHint('');
        clearImageHelper(setLogoDataUri, setLogoUrlForPreview, logoFileRef, DEFAULT_LOGO_PLACEHOLDER); setLogoHint('');
        clearImageHelper(setDetailImage1DataUri, setDetailImage1UrlForPreview, detailImage1FileRef, DEFAULT_DETAIL_PLACEHOLDER); setDetailImageHint1('');
        clearImageHelper(setDetailImage2DataUri, setDetailImage2UrlForPreview, detailImage2FileRef, DEFAULT_DETAIL_PLACEHOLDER); setDetailImageHint2('');
        setCategory(''); setTags(''); setPublishedDate(new Date().toISOString().split('T')[0]); setLinkTool('');
        setExistingPostDataForForm(null);
      }
      router.push('/admin');
    } catch (error) {
      console.error("Error saving post to Firestore:", error);
      toast({
        variant: "destructive",
        title: t('adminPostError', "Error saving post"),
        description: `Failed to save post: ${error instanceof Error ? error.message : "Unknown error"}`,
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
        {(imageUrlForPreview && imageUrlForPreview !== DEFAULT_MAIN_PLACEHOLDER && imageUrlForPreview !== DEFAULT_LOGO_PLACEHOLDER && imageUrlForPreview !== DEFAULT_DETAIL_PLACEHOLDER) && (
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
        <h2 className="text-2xl font-semibold text-destructive mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
        <Button onClick={() => router.push('/')} className="mt-4">Go to Homepage</Button>
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
            {isEditMode && existingPostDataForForm ? `${t('adminEditTitle', 'Edit Post')}: ${getLocalizedStringDefault(existingPostDataForForm.title, language)}` : t('adminPostLongDescPlaceholder', 'Fill in the details to create a new blog post.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">{t('adminPostTitleLabel', 'Post Title')}</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('adminPostTitlePlaceholder', 'Enter post title')} required disabled={isSubmitting || isLoadingData} />
            </div>

            <div>
              <Label htmlFor="shortDescription">{t('adminPostShortDescLabel', 'Short Description')}</Label>
              <Textarea id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder={t('adminPostShortDescPlaceholder', 'Enter a brief summary')} required disabled={isSubmitting || isLoadingData} />
            </div>

            <div>
              <Label htmlFor="longDescription">{t('adminPostLongDescLabel', 'Long Description (Content)')}</Label>
              <Textarea id="longDescription" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} placeholder={t('adminPostLongDescPlaceholder', 'Write the full content of the post here...')} rows={8} required disabled={isSubmitting || isLoadingData} />
            </div>

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
              <ImageUploadSection
                labelKey="adminPostLogoLabel" defaultLabel="Tool Logo (Optional)"
                imageUrlForPreview={logoUrlForPreview}
                onFileChange={(e) => handleImageFileChange(e, setLogoDataUri, setLogoUrlForPreview)}
                onClearImage={() => clearImageHelper(setLogoDataUri, setLogoUrlForPreview, logoFileRef, DEFAULT_LOGO_PLACEHOLDER)}
                fileRef={logoFileRef}
                hintValue={logoHint} onHintChange={setLogoHint}
                hintLabelKey="adminPostLogoHintLabel" hintDefaultLabel="Logo AI Hint"
                hintPlaceholderKey="adminPostLogoHintPlaceholder" hintDefaultPlaceholder="e.g., brand logo"
                aspectRatio="aspect-square"
                previewSize={{width:100, height:100}}
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
                <Select value={category} onValueChange={setCategory} required disabled={isSubmitting || isLoadingData}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t('adminPostSelectCategoryPlaceholder', 'Select a category')} />
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
                <Label htmlFor="tags">{t('adminPostTagsLabel', 'Tags (comma-separated)')}</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t('adminPostTagsPlaceholder', 'e.g., AI, Machine Learning, NLP')} disabled={isSubmitting || isLoadingData} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="publishedDate">{t('adminPostPublishedDateLabel', 'Published Date')}</Label>
                <Input id="publishedDate" type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} required disabled={isSubmitting || isLoadingData} />
              </div>
              <div>
                <Label htmlFor="linkTool">{t('adminPostLinkToolLabel', 'Link to Tool (Optional)')}</Label>
                <Input id="linkTool" value={linkTool} onChange={(e) => setLinkTool(e.target.value)} placeholder={t('adminPostLinkToolPlaceholder', 'https://example.com/tool')} disabled={isSubmitting || isLoadingData} />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting || isLoadingData}>
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
