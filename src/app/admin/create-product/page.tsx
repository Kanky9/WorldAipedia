
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { ArrowLeft, UploadCloud, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import type { Product as ProductType } from '@/lib/types';
import {
  addProductToFirestore,
  getProductFromFirestore,
  updateProductInFirestore,
  db,
} from '@/lib/firebase';
import { doc, collection as firestoreCollection } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { categories as productCategories } from '@/data/products';

const DEFAULT_PRODUCT_PLACEHOLDER = 'https://placehold.co/400x400.png';
const MAX_DATA_URI_LENGTH = 1024 * 1024; // Approx 1MB

export default function CreateProductPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();

  const [productId, setProductId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [imageDataUri, setImageDataUri] = useState<string>('');
  const [imageUrlForPreview, setImageUrlForPreview] = useState<string>(DEFAULT_PRODUCT_PLACEHOLDER);
  const [imageHint, setImageHint] = useState('');
  const [category, setCategory] = useState('');
  const imageFileRef = useRef<HTMLInputElement>(null);
  
  const resetForm = () => {
    setTitle('');
    setLink('');
    setCategory('');
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
    setProductId(id);
    if(id) {
        setIsEditMode(true);
    } else {
        setIsEditMode(false);
        resetForm();
    }
  }, [searchParams, currentUser, authLoading, router]);

  useEffect(() => {
    if (isEditMode && productId) {
      setIsLoadingData(true);
      getProductFromFirestore(productId).then(product => {
        if (product) {
          setTitle(product.title);
          setImageUrlForPreview(product.imageUrl || DEFAULT_PRODUCT_PLACEHOLDER);
          setImageHint(product.imageHint || '');
          setLink(product.link);
          setCategory(product.categorySlug);
        } else {
            toast({ variant: 'destructive', title: 'Product not found' });
            router.push('/admin/manage-products');
        }
      }).finally(() => setIsLoadingData(false));
    }
  }, [isEditMode, productId, router, toast]);
  
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

  const clearImage = () => {
    setImageDataUri('');
    setImageUrlForPreview(DEFAULT_PRODUCT_PLACEHOLDER);
    if (imageFileRef.current) imageFileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.isAdmin || !title.trim() || !link || !category) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Title, link, and category are required." });
      return;
    }
    
    setIsSubmitting(true);
    
    const selectedCategory = productCategories.find(c => c.slug === category);
    if (!selectedCategory) {
        toast({ variant: "destructive", title: "Invalid Category", description: "Please select a valid category." });
        setIsSubmitting(false);
        return;
    }

    let finalImageUrl = imageDataUri || imageUrlForPreview;
    if (finalImageUrl.startsWith('data:image') && finalImageUrl.length > MAX_DATA_URI_LENGTH) {
      toast({ variant: "destructive", title: t('adminPostImageTooLarge', "Product Image Too Large"), description: t('adminPostImageSizeHint', `Using placeholder. Max ~1MB for direct save.`) });
      finalImageUrl = DEFAULT_PRODUCT_PLACEHOLDER;
    } else if (finalImageUrl === DEFAULT_PRODUCT_PLACEHOLDER && !imageDataUri) {
      finalImageUrl = '';
    }

    const productDetails = {
      title,
      imageUrl: finalImageUrl,
      imageHint,
      link,
      category: selectedCategory.name.en, // Storing english name for consistency
      categorySlug: selectedCategory.slug,
      source: 'amazon' as const,
    };

    try {
      if (isEditMode && productId) {
        await updateProductInFirestore(productId, productDetails as any);
        toast({ title: t('adminProductUpdatedSuccess', "Product Updated") });
      } else {
        const newProductId = doc(firestoreCollection(db, 'products')).id;
        await addProductToFirestore({ ...productDetails, id: newProductId } as any);
        toast({ title: t('adminProductCreatedSuccess', "Product Created") });
      }
      router.push('/admin/manage-products');
    } catch (error) {
      console.error("Error saving product:", error);
      toast({ variant: "destructive", title: "Save Error", description: "Could not save the product." });
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
    <div className="container mx-auto pt-8 px-4">
      <Button variant="outline" asChild className="mb-6"><Link href="/admin/manage-products"><ArrowLeft className="mr-2 h-4 w-4" />Back to Products</Link></Button>
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? t('adminEditProductTitle', 'Edit Product') : t('adminCreateProductTitle', 'Create New Product')}</CardTitle>
          <CardDescription>Fill in the product details below. All products will be listed as from Amazon.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="space-y-4">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required disabled={isSubmitting} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{t('adminPostMainImageLabel', 'Product Image')}</Label>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" onClick={() => imageFileRef.current?.click()} disabled={isSubmitting}><UploadCloud className="mr-2 h-4 w-4" /> Upload</Button>
                  <Input type="file" accept="image/*" ref={imageFileRef} onChange={handleImageFileChange} className="hidden" />
                  {imageUrlForPreview !== DEFAULT_PRODUCT_PLACEHOLDER && <Button type="button" variant="ghost" size="sm" onClick={clearImage} disabled={isSubmitting}><Trash2 className="mr-1 h-4 w-4" /> Clear</Button>}
                </div>
                {imageUrlForPreview && <Image src={imageUrlForPreview} alt="Product image preview" width={200} height={200} className="mt-2 rounded border object-cover aspect-square" data-ai-hint={imageHint || "product image"} />}
                <Label htmlFor="image-hint">{t('adminPostMainImageHintLabel', 'Image AI Hint')}</Label>
                <Input id="image-hint" value={imageHint} onChange={e => setImageHint(e.target.value)} placeholder={t('adminPostMainImageHintPlaceholder', 'e.g., modern coffee maker')} disabled={isSubmitting} />
              </div>

              <div className="space-y-6">
                 <div>
                    <Label htmlFor="category">{t('adminPostCategoryLabel', 'Category')}</Label>
                    <Select value={category} onValueChange={setCategory} required disabled={isSubmitting}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder={t('adminPostSelectCategoryPlaceholder', 'Select a category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map(cat => (
                          <SelectItem key={cat.slug} value={cat.slug}>
                            {t(cat.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                <div>
                  <Label htmlFor="link">{t('adminProductLinkLabel', 'Amazon Purchase Link')}</Label>
                  <Input id="link" value={link} onChange={e => setLink(e.target.value)} placeholder={t('adminProductLinkPlaceholder', 'https://...')} required disabled={isSubmitting} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {isEditMode ? t('adminPostButtonUpdate', 'Update Product') : t('adminPostButtonCreate', 'Create Product')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
