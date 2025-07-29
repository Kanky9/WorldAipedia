
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { getDonationSettings, updateDonationSettings } from '@/lib/firebase';
import type { DonationSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldAlert, Settings, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminSettingsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const [settings, setSettings] = useState<DonationSettings>({ paypalInfo: '', mercadoPagoLink: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!currentUser || !currentUser.isAdmin)) {
      router.replace('/');
      return;
    }
    if (currentUser?.isAdmin) {
      getDonationSettings().then(data => {
        if (data) {
          setSettings(data);
        }
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [currentUser, authLoading, router]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateDonationSettings(settings);
      toast({ title: t('adminSettingsSaveSuccess', 'Settings saved successfully!') });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: t('adminSettingsSaveError', 'Error saving settings.') });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || (!currentUser && !authLoading) || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!currentUser?.isAdmin) {
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
    <div className="container mx-auto pt-8 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/admin">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('adminPostButtonBack', 'Back to Admin')}
        </Link>
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-headline text-primary">
            <Settings />
            {t('adminSettingsTitle', 'Site Settings')}
          </CardTitle>
          <CardDescription>
            {t('adminSettingsDescription', 'Manage global settings for your site.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('adminDonationSettingsTitle', 'Donation Settings')}</CardTitle>
              <CardDescription>{t('adminDonationSettingsDescription', 'Set your PayPal and MercadoPago details for donations.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="paypalInfo">{t('adminPaypalInfoLabel', 'PayPal Donation Info')}</Label>
                <Input
                  id="paypalInfo"
                  value={settings.paypalInfo || ''}
                  onChange={(e) => setSettings(s => ({ ...s, paypalInfo: e.target.value }))}
                  placeholder={t('adminPaypalInfoPlaceholder', 'e.g., your paypal.me link or email')}
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label htmlFor="mercadoPagoLink">{t('adminMercadoPagoLinkLabel', 'MercadoPago Link')}</Label>
                <Input
                  id="mercadoPagoLink"
                  value={settings.mercadoPagoLink || ''}
                  onChange={(e) => setSettings(s => ({ ...s, mercadoPagoLink: e.target.value }))}
                  placeholder={t('adminMercadoPagoLinkPlaceholder', 'e.g., your mercado pago link')}
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {t('adminSettingsSaveButton', 'Save Settings')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
