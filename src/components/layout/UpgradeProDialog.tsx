"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { Star } from 'lucide-react';
import PayPalButton from '@/components/payments/PayPalButton';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

interface UpgradeProDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpgradeProDialog: React.FC<UpgradeProDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleLoginRedirect = useCallback(() => {
    onOpenChange(false);
    router.push('/login');
  }, [onOpenChange, router]);

  const proBenefits = [
    t('proBenefit1'),
    t('proBenefit2'),
    t('proBenefit3'),
    t('proBenefit4'),
  ];

  if (!PAYPAL_CLIENT_ID) {
    console.error("PayPal Client ID is not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment variables.");
    // Fallback or disable payment functionality if ID is missing
    return (
       <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>{t('paymentErrorTitle', 'Payment Error')}</DialogTitle>
             <DialogDescription>
               The payment system is currently unavailable. Please contact support.
             </DialogDescription>
           </DialogHeader>
         </DialogContent>
       </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-headline text-primary">
            <Star className="mr-2 h-6 w-6 text-yellow-400 fill-yellow-400" />
            {t('upgradeToProTitleDialog', "Upgrade to World AI PRO")}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {t('upgradeToProDescriptionDialog', "Unlock exclusive features, enhanced support, and an ad-free experience.")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('upgradeToProBenefits', "PRO Benefits:")}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
              {proBenefits.map((benefit, index) => <li key={index}>{benefit}</li>)}
            </ul>
          </div>

          <div className="text-center my-4">
            <p className="text-3xl font-bold text-primary">{t('upgradeToProPrice', "Just $1.00!")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('monthlyAccessLabel', '(for one month of access)')}</p>
          </div>
          
          <div className="border-t pt-4">
             <p className="text-center text-sm text-muted-foreground mb-4">
              {t('paypalGatewayInfo', "All payments are processed securely through PayPal. You can use your PayPal balance or any major credit/debit card.")}
            </p>
            
            {currentUser && open ? (
              <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD", intent: "capture" }}>
                <PayPalButton onSuccess={() => onOpenChange(false)} />
              </PayPalScriptProvider>
            ) : (
               <Button onClick={handleLoginRedirect} className="w-full">
                  {t('loginButton', 'Login')}
              </Button>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              {t('cancelButton', "Cancel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeProDialog;
