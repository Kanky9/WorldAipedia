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
import { ArrowLeft, UploadCloud, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import type { Book as BookType } from '@/lib/types';
import {
  addBookToFirestore,
  getBookFromFirestore,
  updateBookInFirestore,
  db,
} from '@/lib/firebase';
import { doc, collection as firestoreCollection } from 'firebase/firestore';
import type { LanguageCode } from '@/lib/translations';
import { useAuth } from '@/contexts/AuthContext';
import { languages as appLanguagesObject } from '@/lib/translations';

const DEFAULT_BOOK_PLACEHOLDER = 'https://placehold.co/400x600.png';

const allAppLanguageCodes = Object.keys(appLanguagesObject) as LanguageCode[];

type LocalizedContent = {
  [key in LanguageCode]?: {
    title: string;
    description: string;
  };
};

const initialLocalizedContent: LocalizedContent = allAppLanguageCodes.reduce((acc, langCode) => {
  acc[langCode] = { title: '', description: '' };
  return acc;
}, {} as LocalizedContent);


export default function CreateBookPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();

  const [bookId, setBookId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [localizedContent, setLocalizedContent] = useState<LocalizedContent>(initialLocalizedContent);

  const [link, setLink] = useState('');
  const [source, setSource] = useState<'amazon' | 'mercadolibre' | ''>('');
  const [imageDataUri, setImageDataUri] = useState<string>('');
  const [imageUrlForPreview, setImageUrlForPreview] = useState<string>(DEFAULT_BOOK_PLACEHOLDER);
  const [imageHint, setImageHint] = useState('');
  const imageFileRef = useRef<HTMLInputElement>(null);
  
  const resetForm = () => {
    setLocalizedContent(initialLocalizedContent);
    setLink('');
    setSource('');
    clearImage();
    setImageHint('');
  };

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser || !currentUser.isAdmin) {
      router.replace('/');
      return;
    }

    const id = searchParams.get('id');
    setBookId(id);
    if(id) {
        setIsEditMode(true);
    } else {
        setIsEditMode(false);
        resetForm();
    }
  }, [searchParams, currentUser, authLoading, router]);

  useEffect(() => {
    if (isEditMode && bookId) {
      setIsLoadingData(true);
      getBookFromFirestore(bookId).then(book => {
        if (book) {
            const contentToLoad: LocalizedContent = {};
            allAppLanguageCodes.forEach(langCode => {
                contentToLoad[langCode] = {
                    title: book.title?.[langCode] || '',
                    description: book.description?.[langCode] || '',
                };
            });
            setLocalizedContent(contentToLoad);
          setImageUrlForPreview(book.imageUrl || DEFAULT_BOOK_PLACEHOLDER);
          setImageHint(book.imageHint || '');
          setLink(book.link);
          setSource(book.source);
        } else {
            toast({ variant: 'destructive', title: 'Book not found' });
            router.push('/admin/manage-books');
        }
      }).finally(() => setIsLoadingData(false));
    }
  }, [isEditMode, bookId, router, toast]);
  
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageDataUri(result);
        setImageUrlForPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocalizedContentChange = (langCode: LanguageCode, field: 'title' | 'description', value: string) => {
    setLocalizedContent(prev => ({
      ...prev,
      [langCode]: { ...prev[langCode], [field]: value },
    }));
  };

  const clearImage = () => {
    setImageDataUri('');
    setImageUrlForPreview(DEFAULT_BOOK_PLACEHOLDER);
    if (imageFileRef.current) imageFileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.isAdmin || !localizedContent.en?.title?.trim() || !source || !link) {
      toast({ variant: "destructive", title: "Missing Fields", description: "English title, source, and link are required." });
      return;
    }
    
    setIsSubmitting(true);

    const finalTranslations: { title: Partial<Record<LanguageCode, string>>; description: Partial<Record<LanguageCode, string>>; } = { title: {}, description: {} };
    for (const langCode in localizedContent) {
        const content = localizedContent[langCode as LanguageCode];
        if (content?.title?.trim()) finalTranslations.title[langCode as LanguageCode] = content.title;
        if (content?.description?.trim()) finalTranslations.description[langCode as LanguageCode] = content.description;
    }

    const bookDetails = {
      title: finalTranslations.title,
      description: finalTranslations.description,
      imageUrl: imageDataUri || imageUrlForPreview,
      imageHint,
      link,
      source,
    };

    try {
      if (isEditMode && bookId) {
        await updateBookInFirestore(bookId, bookDetails as any);
        toast({ title: t('adminBookUpdatedSuccess', "Book Updated") });
      } else {
        const newBookId = doc(firestoreCollection(db, 'books')).id;
        await addBookToFirestore({ ...bookDetails, id: newBookId } as any);
        toast({ title: t('adminBookCreatedSuccess', "Book Created") });
      }
      router.push('/admin/manage-books');
    } catch (error) {
      console.error("Error saving book:", error);
      toast({ variant: "destructive", title: "Save Error", description: "Could not save the book." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (!currentUser && !authLoading) || (isLoadingData && isEditMode)) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (!currentUser?.isAdmin) {
    return <div className="text-center p-8">Access Denied</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-6"><Link href="/admin/manage-books"><ArrowLeft className="mr-2 h-4 w-4" />Back to Books</Link></Button>
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? t('adminEditBookTitle', 'Edit Book') : t('adminCreateBookTitle', 'Create New Book')}</CardTitle>
          <CardDescription>Fill in the book details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="flex-wrap h-auto justify-start">
                {allAppLanguageCodes.map(code => <TabsTrigger key={code} value={code}>{appLanguagesObject[code].flag} {appLanguagesObject[code].name}</TabsTrigger>)}
              </TabsList>
              {allAppLanguageCodes.map(code => (
                <TabsContent key={code} value={code} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor={`title-${code}`}>Title ({code.toUpperCase()})</Label>
                    <Input id={`title-${code}`} value={localizedContent[code]?.title || ''} onChange={e => handleLocalizedContentChange(code, 'title', e.target.value)} required={code === 'en'} disabled={isSubmitting} />
                  </div>
                  <div>
                    <Label htmlFor={`description-${code}`}>Description ({code.toUpperCase()})</Label>
                    <Textarea id={`description-${code}`} value={localizedContent[code]?.description || ''} onChange={e => handleLocalizedContentChange(code, 'description', e.target.value)} disabled={isSubmitting} />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{t('adminPostMainImageLabel', 'Book Cover Image')}</Label>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" onClick={() => imageFileRef.current?.click()} disabled={isSubmitting}><UploadCloud className="mr-2 h-4 w-4" /> Upload</Button>
                  <Input type="file" accept="image/*" ref={imageFileRef} onChange={handleImageFileChange} className="hidden" />
                  {imageUrlForPreview !== DEFAULT_BOOK_PLACEHOLDER && <Button type="button" variant="ghost" size="sm" onClick={clearImage} disabled={isSubmitting}><Trash2 className="mr-1 h-4 w-4" /> Clear</Button>}
                </div>
                {imageUrlForPreview && <Image src={imageUrlForPreview} alt="Book cover preview" width={150} height={225} className="mt-2 rounded border object-cover" />}
                <Label htmlFor="image-hint">{t('adminPostMainImageHintLabel', 'Image AI Hint')}</Label>
                <Input id="image-hint" value={imageHint} onChange={e => setImageHint(e.target.value)} placeholder={t('adminPostMainImageHintPlaceholder', 'e.g., book cover science')} disabled={isSubmitting} />
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="source">{t('adminBookSourceLabel', 'Source')}</Label>
                  <Select value={source} onValueChange={(v) => setSource(v as any)} required disabled={isSubmitting}>
                    <SelectTrigger><SelectValue placeholder={t('adminBookSelectSourcePlaceholder', 'Select a source')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amazon">{t('adminBookSourceAmazon', 'Amazon')}</SelectItem>
                      <SelectItem value="mercadolibre">{t('adminBookSourceMercadoLibre', 'MercadoLibre')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="link">{t('adminBookLinkLabel', 'Purchase Link')}</Label>
                  <Input id="link" value={link} onChange={e => setLink(e.target.value)} placeholder={t('adminBookLinkPlaceholder', 'https://...')} required disabled={isSubmitting} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {isEditMode ? t('adminPostButtonUpdate', 'Update Book') : t('adminPostButtonCreate', 'Create Book')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
