
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
  uploadImageAndGetURL, // Import the new upload function
  storageRef, // Import storageRef
  deleteFirebaseStorageObject // Optional: for deleting old images
} from '@/lib/firebase';
import { doc, collection as firestoreCollection, Timestamp } from 'firebase/firestore'; // aliased to avoid conflict with local collection
import type { LanguageCode } from '@/lib/translations';
import { useAuth } from '@/contexts/AuthContext';

type UpdatedLocalizedFieldReturnType = {
  [key in LanguageCode]?: string;
} & {
  en: string;
};

const DEFAULT_MAIN_PLACEHOLDER = 'https://placehold.co/600x400.png';
const DEFAULT_LOGO_PLACEHOLDER = 'https://placehold.co/50x50.png';
const DEFAULT_DETAIL_PLACEHOLDER = 'https://placehold.co/400x300.png';

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

  // Form state for text fields
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split('T')[0]);
  const [linkTool, setLinkTool] = useState('');

  // Image states: file object, preview URL, hint, and original storage path (for edit mode deletion)
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImageUrlForPreview, setMainImageUrlForPreview] = useState<string>(DEFAULT_MAIN_PLACEHOLDER);
  const [mainImageHint, setMainImageHint] = useState('');
  const [originalMainImageStoragePath, setOriginalMainImageStoragePath] = useState<string | null>(null);
  const mainImageFileRef = useRef<HTMLInputElement>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrlForPreview, setLogoUrlForPreview] = useState<string>(DEFAULT_LOGO_PLACEHOLDER);
  const [logoHint, setLogoHint] = useState('');
  const [originalLogoStoragePath, setOriginalLogoStoragePath] = useState<string | null>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);

  const [detailImage1File, setDetailImage1File] = useState<File | null>(null);
  const [detailImage1UrlForPreview, setDetailImage1UrlForPreview] = useState<string>(DEFAULT_DETAIL_PLACEHOLDER);
  const [detailImageHint1, setDetailImageHint1] = useState('');
  const [originalDetailImage1StoragePath, setOriginalDetailImage1StoragePath] = useState<string | null>(null);
  const detailImage1FileRef = useRef<HTMLInputElement>(null);

  const [detailImage2File, setDetailImage2File] = useState<File | null>(null);
  const [detailImage2UrlForPreview, setDetailImage2UrlForPreview] = useState<string>(DEFAULT_DETAIL_PLACEHOLDER);
  const [detailImageHint2, setDetailImageHint2] = useState('');
  const [originalDetailImage2StoragePath, setOriginalDetailImage2StoragePath] = useState<string | null>(null);
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

  const getStoragePathFromUrl = (url: string): string | null => {
    try {
      if (!url || !url.startsWith('https://firebasestorage.googleapis.com')) return null;
      const parsedUrl = new URL(url);
      // Path is like /v0/b/worldaipedia.appspot.com/o/posts%2F...
      // We need to decode and extract from "posts%2F..."
      const pathName = parsedUrl.pathname;
      const parts = pathName.split('/o/');
      if (parts.length > 1) {
        return decodeURIComponent(parts[1].split('?')[0]); // Remove query params like alt=media&token=...
      }
    } catch (e) {
      console.warn("Could not parse storage path from URL:", url, e);
    }
    return null;
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
          setMainImageHint(existingPost.imageHint || '');
          setOriginalMainImageStoragePath(getStoragePathFromUrl(existingPost.imageUrl));

          setLogoUrlForPreview(existingPost.logoUrl || DEFAULT_LOGO_PLACEHOLDER);
          setLogoHint(existingPost.logoHint || '');
          setOriginalLogoStoragePath(getStoragePathFromUrl(existingPost.logoUrl || ''));
          
          setDetailImage1UrlForPreview(existingPost.detailImageUrl1 || DEFAULT_DETAIL_PLACEHOLDER);
          setDetailImageHint1(existingPost.detailImageHint1 || '');
          setOriginalDetailImage1StoragePath(getStoragePathFromUrl(existingPost.detailImageUrl1 || ''));

          setDetailImage2UrlForPreview(existingPost.detailImageUrl2 || DEFAULT_DETAIL_PLACEHOLDER);
          setDetailImageHint2(existingPost.detailImageHint2 || '');
          setOriginalDetailImage2StoragePath(getStoragePathFromUrl(existingPost.detailImageUrl2 || ''));

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
      // Reset form for new post
      setIsEditMode(false);
      setExistingPostDataForForm(null);
      setTitle(''); setShortDescription(''); setLongDescription('');
      clearImageHelper(setMainImageFile, setMainImageUrlForPreview, mainImageFileRef, DEFAULT_MAIN_PLACEHOLDER, setOriginalMainImageStoragePath); setMainImageHint('');
      clearImageHelper(setLogoFile, setLogoUrlForPreview, logoFileRef, DEFAULT_LOGO_PLACEHOLDER, setOriginalLogoStoragePath); setLogoHint('');
      clearImageHelper(setDetailImage1File, setDetailImage1UrlForPreview, detailImage1FileRef, DEFAULT_DETAIL_PLACEHOLDER, setOriginalDetailImage1StoragePath); setDetailImageHint1('');
      clearImageHelper(setDetailImage2File, setDetailImage2UrlForPreview, detailImage2FileRef, DEFAULT_DETAIL_PLACEHOLDER, setOriginalDetailImage2StoragePath); setDetailImageHint2('');
      setCategory(''); setTags(''); setPublishedDate(new Date().toISOString().split('T')[0]); setLinkTool('');
    }
  }, [postIdFromQuery, language, router, t, toast, authLoading, currentUser]);

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFileState: React.Dispatch<React.SetStateAction<File | null>>,
    setPreviewUrlState: React.Dispatch<React.SetStateAction<string>>,
    setOriginalStoragePath: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic file size check (e.g., 5MB) - adjust as needed for Storage
      if (file.size > 5 * 1024 * 1024) {
        toast({
            variant: "destructive",
            title: "Image File Too Large",
            description: `Please select an image file smaller than 5MB.`,
            duration: 7000,
        });
        if (event.target) event.target.value = ""; // Clear the input
        return;
      }
      setFileState(file);
      setPreviewUrlState(URL.createObjectURL(file));
      setOriginalStoragePath(null); // New file selected, so old path is irrelevant for this slot
    }
  };
  
  const clearImageHelper = (
    setFileState: React.Dispatch<React.SetStateAction<File | null>>,
    setPreviewUrlState: React.Dispatch<React.SetStateAction<string>>,
    fileRef: React.RefObject<HTMLInputElement>,
    defaultPlaceholderUrl: string,
    setOriginalStoragePath: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setFileState(null);
    setPreviewUrlState(defaultPlaceholderUrl);
    if (fileRef.current) fileRef.current.value = "";
    setOriginalStoragePath(null); // Clearing image means no original path to worry about for this slot
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.isAdmin) {
      toast({ variant: "destructive", title: "Access Denied", description: "You do not have permission to perform this action." });
      return;
    }

    if (!title || !shortDescription || !longDescription || (!mainImageFile && mainImageUrlForPreview === DEFAULT_MAIN_PLACEHOLDER) || !category || !publishedDate) {
      toast({
        variant: "destructive",
        title: t('adminPostError', "Error submitting post"),
        description: "Please fill in all required fields (Title, Descriptions, Main Image, Category, Published Date). Ensure main image is uploaded.",
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
      if (!typedBase.en && newValue) typedBase.en = newValue;
      return typedBase;
    };
    
    const tempPostId = postIdFromQuery || doc(firestoreCollection(db, 'temp')).id; // Temporary ID for storage path if new post

    let finalMainImageUrl = mainImageUrlForPreview;
    if (mainImageFile) {
      try {
        const path = `posts/${tempPostId}/main_${Date.now()}_${mainImageFile.name}`;
        finalMainImageUrl = await uploadImageAndGetURL(mainImageFile, path);
        // Optional: Delete old image if originalMainImageStoragePath exists and is different
      } catch (error) {
        toast({ variant: "destructive", title: "Main Image Upload Failed", description: (error as Error).message });
        setIsSubmitting(false); return;
      }
    } else if (finalMainImageUrl === DEFAULT_MAIN_PLACEHOLDER) { // If placeholder is still there and no new file
        finalMainImageUrl = ''; // Or handle as error if main image is mandatory without placeholder
    }


    let finalLogoUrl = logoUrlForPreview;
    if (logoFile) {
      try {
        const path = `posts/${tempPostId}/logo_${Date.now()}_${logoFile.name}`;
        finalLogoUrl = await uploadImageAndGetURL(logoFile, path);
      } catch (error) {
        toast({ variant: "destructive", title: "Logo Upload Failed", description: (error as Error).message });
        setIsSubmitting(false); return;
      }
    } else if (finalLogoUrl === DEFAULT_LOGO_PLACEHOLDER) {
        finalLogoUrl = '';
    }

    let finalDetailImageUrl1 = detailImage1UrlForPreview;
    if (detailImage1File) {
      try {
        const path = `posts/${tempPostId}/detail1_${Date.now()}_${detailImage1File.name}`;
        finalDetailImageUrl1 = await uploadImageAndGetURL(detailImage1File, path);
      } catch (error) {
        toast({ variant: "destructive", title: "Detail Image 1 Upload Failed", description: (error as Error).message });
        setIsSubmitting(false); return;
      }
    } else if (finalDetailImageUrl1 === DEFAULT_DETAIL_PLACEHOLDER) {
        finalDetailImageUrl1 = '';
    }

    let finalDetailImageUrl2 = detailImage2UrlForPreview;
    if (detailImage2File) {
      try {
        const path = `posts/${tempPostId}/detail2_${Date.now()}_${detailImage2File.name}`;
        finalDetailImageUrl2 = await uploadImageAndGetURL(detailImage2File, path);
      } catch (error) {
        toast({ variant: "destructive", title: "Detail Image 2 Upload Failed", description: (error as Error).message });
        setIsSubmitting(false); return;
      }
    } else if (finalDetailImageUrl2 === DEFAULT_DETAIL_PLACEHOLDER) {
        finalDetailImageUrl2 = '';
    }


    const postDetailsToSave = {
      title: getUpdatedLocalizedField(existingPostDataForForm?.title, title),
      shortDescription: getUpdatedLocalizedField(existingPostDataForForm?.shortDescription, shortDescription),
      longDescription: getUpdatedLocalizedField(existingPostDataForForm?.longDescription, longDescription),
      imageUrl: finalMainImageUrl,
      imageHint: mainImageHint,
      logoUrl: finalLogoUrl || undefined, // Ensure undefined if empty string
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
        const newPostId = doc(firestoreCollection(db, 'posts')).id; // Generate ID client-side for Storage path consistency if needed
        await addPostToFirestore({ ...newPostData, id: newPostId });
        toast({
          title: t('adminPostCreatedSuccess', "Post Created"),
          description: `${getLocalizedStringDefault(newPostData.title, language)} ${t('createdInSession', "has been saved.")}`,
          action: <CheckCircle className="text-green-500" />,
        });
        // Reset form after successful creation
        setTitle(''); setShortDescription(''); setLongDescription('');
        clearImageHelper(setMainImageFile, setMainImageUrlForPreview, mainImageFileRef, DEFAULT_MAIN_PLACEHOLDER, setOriginalMainImageStoragePath); setMainImageHint('');
        clearImageHelper(setLogoFile, setLogoUrlForPreview, logoFileRef, DEFAULT_LOGO_PLACEHOLDER, setOriginalLogoStoragePath); setLogoHint('');
        clearImageHelper(setDetailImage1File, setDetailImage1UrlForPreview, detailImage1FileRef, DEFAULT_DETAIL_PLACEHOLDER, setOriginalDetailImage1StoragePath); setDetailImageHint1('');
        clearImageHelper(setDetailImage2File, setDetailImage2UrlForPreview, detailImage2FileRef, DEFAULT_DETAIL_PLACEHOLDER, setOriginalDetailImage2StoragePath); setDetailImageHint2('');
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
    isUploading?: boolean; // Add this prop if you implement individual progress
    uploadProgress?: number; // Add this prop
  }
  
  const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
    labelKey, defaultLabel, imageUrlForPreview, onFileChange, onClearImage, fileRef,
    hintValue, onHintChange, hintLabelKey, hintDefaultLabel, hintPlaceholderKey, hintDefaultPlaceholder,
    aspectRatio = "aspect-video", previewSize = {width:200, height:112}, 
    isUploading, uploadProgress
  }) => (
    <div className="space-y-2">
      <Label>{t(labelKey, defaultLabel)}</Label>
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={isSubmitting || isLoadingData || isUploading}>
          <UploadCloud className="mr-2 h-4 w-4" /> {t('uploadImageButton', 'Upload Image')}
        </Button>
        <Input type="file" accept="image/*" ref={fileRef} onChange={onFileChange} className="hidden" disabled={isSubmitting || isLoadingData || isUploading} />
        {(imageUrlForPreview && imageUrlForPreview !== DEFAULT_MAIN_PLACEHOLDER && imageUrlForPreview !== DEFAULT_LOGO_PLACEHOLDER && imageUrlForPreview !== DEFAULT_DETAIL_PLACEHOLDER) && (
          <Button type="button" variant="ghost" size="sm" onClick={onClearImage} disabled={isSubmitting || isLoadingData || isUploading}>
            <Trash2 className="mr-1 h-4 w-4" /> {t('clearImageButton', 'Clear')}
          </Button>
        )}
      </div>
      {imageUrlForPreview && (
        <div className={`mt-2 rounded border overflow-hidden ${aspectRatio}`} style={{maxWidth: `${previewSize.width}px`}}>
          <Image
            src={imageUrlForPreview} // Use the preview URL (blob or existing Storage URL)
            alt={t(labelKey, defaultLabel) + " preview"}
            width={previewSize.width}
            height={previewSize.height}
            className="object-cover w-full h-full"
            data-ai-hint={hintValue || (imageUrlForPreview.startsWith('blob:') ? "uploaded image" : "image")}
            unoptimized={imageUrlForPreview.startsWith('blob:')} // Unoptimize for local blob URLs
          />
        </div>
      )}
       {isUploading && (
        <div className="mt-2">
          <progress value={uploadProgress || 0} max="100" className="w-full h-2 rounded [&::-webkit-progress-bar]:rounded [&::-webkit-progress-value]:rounded [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"></progress>
          <p className="text-xs text-muted-foreground text-center">{uploadProgress?.toFixed(0)}%</p>
        </div>
      )}
      <div className="mt-2">
        <Label htmlFor={`${labelKey}-hint`}>{t(hintLabelKey, hintDefaultLabel)}</Label>
        <Input id={`${labelKey}-hint`} value={hintValue} onChange={(e) => onHintChange(e.target.value)} placeholder={t(hintPlaceholderKey, hintDefaultPlaceholder)} disabled={isSubmitting || isLoadingData || isUploading} />
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
                onFileChange={(e) => handleImageFileChange(e, setMainImageFile, setMainImageUrlForPreview, setOriginalMainImageStoragePath)}
                onClearImage={() => clearImageHelper(setMainImageFile, setMainImageUrlForPreview, mainImageFileRef, DEFAULT_MAIN_PLACEHOLDER, setOriginalMainImageStoragePath)}
                fileRef={mainImageFileRef}
                hintValue={mainImageHint} onHintChange={setMainImageHint}
                hintLabelKey="adminPostMainImageHintLabel" hintDefaultLabel="Main Image AI Hint"
                hintPlaceholderKey="adminPostMainImageHintPlaceholder" hintDefaultPlaceholder="e.g., abstract technology"
                previewSize={{width: 300, height: 200}}
              />
              <ImageUploadSection
                labelKey="adminPostLogoLabel" defaultLabel="Tool Logo (Optional)"
                imageUrlForPreview={logoUrlForPreview}
                onFileChange={(e) => handleImageFileChange(e, setLogoFile, setLogoUrlForPreview, setOriginalLogoStoragePath)}
                onClearImage={() => clearImageHelper(setLogoFile, setLogoUrlForPreview, logoFileRef, DEFAULT_LOGO_PLACEHOLDER, setOriginalLogoStoragePath)}
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
                onFileChange={(e) => handleImageFileChange(e, setDetailImage1File, setDetailImage1UrlForPreview, setOriginalDetailImage1StoragePath)}
                onClearImage={() => clearImageHelper(setDetailImage1File, setDetailImage1UrlForPreview, detailImage1FileRef, DEFAULT_DETAIL_PLACEHOLDER, setOriginalDetailImage1StoragePath)}
                fileRef={detailImage1FileRef}
                hintValue={detailImageHint1} onHintChange={setDetailImageHint1}
                hintLabelKey="adminPostDetailImageHint1Label" hintDefaultLabel="Visual Insight 1 AI Hint"
                hintPlaceholderKey="adminPostDetailImageHint1Placeholder" hintDefaultPlaceholder="e.g., interface screenshot"
                previewSize={{width:250, height:187}}
              />
              <ImageUploadSection
                labelKey="adminPostDetailImage2Label" defaultLabel="Visual Insight Image 2"
                imageUrlForPreview={detailImage2UrlForPreview}
                onFileChange={(e) => handleImageFileChange(e, setDetailImage2File, setDetailImage2UrlForPreview, setOriginalDetailImage2StoragePath)}
                onClearImage={() => clearImageHelper(setDetailImage2File, setDetailImage2UrlForPreview, detailImage2FileRef, DEFAULT_DETAIL_PLACEHOLDER, setOriginalDetailImage2StoragePath)}
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
