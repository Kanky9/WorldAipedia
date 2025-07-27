
"use client";

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { getDonationSettings } from '@/lib/firebase';
import type { DonationSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, HandHeart, Copy } from 'lucide-react';
import { SiPaypal, SiMercadopago } from "@icons-pack/react-simple-icons";

export default function DonationsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [settings, setSettings] = useState<DonationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDonationSettings()
      .then(setSettings)
      .finally(() => setIsLoading(false));
  }, []);
  
  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: title,
        description: (
            <div className="flex flex-col">
                <span className="font-mono bg-muted p-2 rounded-md my-2">{text}</span>
                <span>{t('donationsInfoCopied')}</span>
            </div>
        )
    });
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="text-center mb-10">
        <HandHeart className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary">
          {t('donationsPageTitle')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('donationsPageDescription')}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <CardHeader>
              <div className="mx-auto bg-blue-100 p-3 rounded-full">
                <SiPaypal className="h-8 w-8 text-[#00457C]" />
              </div>
              <CardTitle className="mt-4">{t('donationsPayPalButton')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild disabled={!settings?.paypalInfo} className="w-full">
                <a href={settings?.paypalInfo || '#'} target="_blank" rel="noopener noreferrer">
                    <SiPaypal className="mr-2 h-4 w-4" />
                    {t('donationsPayPalButton')}
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            <CardHeader>
              <div className="mx-auto bg-sky-100 p-3 rounded-full">
                <SiMercadopago className="h-8 w-8 text-[#00A650]" />
              </div>
              <CardTitle className="mt-4">{t('donationsMercadoPagoButton')}</CardTitle>
            </CardHeader>
            <CardContent>
               <Button 
                asChild
                disabled={!settings?.mercadoPagoLink}
                className="w-full"
              >
                <a href={settings?.mercadoPagoLink || '#'} target="_blank" rel="noopener noreferrer">
                    <SiMercadopago className="mr-2 h-4 w-4" />
                    {t('donationsMercadoPagoButton')}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
