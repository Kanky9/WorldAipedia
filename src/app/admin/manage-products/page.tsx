
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { PlusCircle, Edit, Trash2, BookOpenCheck, Loader2, AlertTriangle, ShieldAlert, ShoppingCart } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import type { Product as ProductType } from "@/lib/types";
import { getAllProductsFromFirestore, deleteProductFromFirestore } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ManageProductsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductType | null>(null);

  useEffect(() => {
    if (!authLoading && (!currentUser || !currentUser.isAdmin)) {
      router.replace('/');
    }
  }, [currentUser, authLoading, router]);

  const fetchProducts = useCallback(async () => {
    if (!currentUser?.isAdmin) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getAllProductsFromFirestore();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.isAdmin]);

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchProducts();
    }
  }, [fetchProducts, currentUser?.isAdmin]);

  const handleDeleteClick = (product: ProductType) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductFromFirestore(productToDelete.id);
      toast({ title: t('adminProductDeleteSuccessTitle', "Product Deleted"), description: t('adminProductDeleteSuccessDesc', 'Product "{title}" has been deleted.', { title: t(productToDelete.title) })});
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id)); 
    } catch (deleteError) {
      toast({ variant: "destructive", title: t('adminProductDeleteErrorTitle', "Delete Failed"), description: "Could not delete the product." });
    } finally {
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  if (authLoading || (!currentUser && !authLoading) ) {
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

  return (
    <div className="container mx-auto py-8 px-4">
       <Button variant="outline" asChild className="mb-6">
        <Link href="/admin">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('adminPostButtonBack', 'Back to Admin')}
        </Link>
      </Button>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary">{t('adminManageStoreTitle', 'Manage Store')}</h1>
        <Button asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
          <Link href="/admin/create-product">
            <PlusCircle className="mr-2 h-5 w-5" />
            {t('adminCreateNewProductButton', 'Add New Product')}
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart /> {t('adminManageStoreTitle', 'Manage Store Products')}
          </CardTitle>
          <CardDescription>{t('adminManageStoreDescription', 'Here you can edit, delete, and manage all products.')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">{error}</div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50 hidden md:table-header-group">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Image</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product.id} className="md:table-row flex flex-col md:flex-row p-4 md:p-0 mb-4 md:mb-0 border rounded-lg md:border-none">
                      <td className="px-6 py-4 whitespace-nowrap md:table-cell"><span className="font-bold md:hidden">Image: </span><Image src={product.imageUrl} alt={t(product.title)} width={40} height={60} className="h-16 w-auto object-contain rounded inline-block"/></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground md:table-cell"><span className="font-bold md:hidden">Title: </span>{t(product.title)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground md:table-cell"><span className="font-bold md:hidden">Category: </span><Badge variant="secondary">{product.category}</Badge></td>
                      <td className="px-6 py-4 whitespace-nowrap text-left md:text-right text-sm font-medium space-x-2 md:table-cell">
                        <span className="font-bold md:hidden">Actions: </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/create-product?id=${product.id}`}>
                            <Edit className="mr-1 h-4 w-4" /> {t('editButton', 'Edit')}
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(product)}>
                           <Trash2 className="mr-1 h-4 w-4" /> {t('deleteButton', 'Delete')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">{t('adminNoProducts', 'No products found.')}</p>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteProductConfirm', "Confirm Deletion")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteProductConfirm', 'Are you sure you want to delete the product "{title}"?', { title: productToDelete ? t(productToDelete.title) : '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>{t('cancelButton', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              {t('deleteButton', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    