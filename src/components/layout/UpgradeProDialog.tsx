
"use client";

import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Star, CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Simple inline SVGs for payment provider icons
const PayPalIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3.063 3.01c.44-.63 1.011-1.12 1.646-1.51C5.469.99 6.39.65 7.374.65h8.31c3.288 0 5.208 1.71 5.208 4.73 0 2.71-1.51 4.24-3.99 4.59.27.39.409.85.409 1.42 0 .64-.138 1.19-.389 1.67.76.15 1.45.38 2.08.7.62.31 1.15.69 1.59 1.14.43.45.75.96.95 1.53.2.57.3 1.17.3 1.79 0 2.3-.94 3.98-2.812 5.05-.75.43-1.62.73-2.62.91a5.545 5.545 0 01-1.95.29H7.373c-3.67 0-5.24-2.36-5.24-5.39 0-1.39.41-2.61 1.22-3.67.82-1.06 1.96-1.78 3.43-2.17a6.954 6.954 0 00-1.23-2.03c-.5-.7-.74-1.48-.74-2.34 0-1.1.4-2.01 1.219-2.73zm4.34 1.62c-.39.62-.58 1.3-.58 2.05 0 .74.2 1.4.59 1.98.39.58.88.98 1.47 1.2.59.21 1.22.32 1.9.32h.99c1.49 0 2.52-.53 3.1-1.58.58-1.05.87-2.34.87-3.87 0-1.47-.3-2.68-.89-3.62-.59-.94-1.64-1.41-3.15-1.41h-.88c-1.12 0-2.02.3-2.7.91zm-.13 8.84c-.61.68-1.11 1.18-1.5 1.5-.39.31-.72.53-1 .65-.28.12-.52.2-.71.23a4.15 4.15 0 00-.6.05c-.98 0-1.67-.58-2.08-1.73-.4-.91-.6-1.9-.6-2.97 0-.98.23-1.9.7-2.76.47-.86 1.11-1.52 1.94-1.99.82-.47 1.72-.7 2.7-.7h.62c.46 0 .89.07 1.28.2.39.13.73.3 1.01.51.28.2.52.43.71.67.19.24.39.51.59.79.68.98 1.01 2.01 1.01 3.09 0 1.01-.27 1.93-.82 2.75z" fillRule="evenodd"></path></svg>;
const ApplePayIcon = () => <svg className="h-6 w-6" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M46.52 33.49C46.52 27.29 50.86 24.7 51 24.65C49.48 22.05 47.08 21.74 46.18 21.65C42.84 21.22 40.25 23.26 38.9 23.26C37.54 23.26 35.43 21.33 32.85 21.33C30.04 21.33 27.62 23.12 26.22 23.12C24.84 23.12 22.42 20.55 19.45 20.5C16.03 20.42 12.73 22.84 12.73 28.63C12.73 36.12 17.86 43.34 20.95 43.34C23.62 43.34 24.57 41.59 27.57 41.59C30.49 41.59 31.32 43.34 34.25 43.34C37.26 43.34 38.15 41.46 40.76 41.46C43.49 41.46 44.24 43.34 46.98 43.34C49.65 43.34 51.27 36.47 51.27 36.47C51.22 36.44 46.52 34.3 46.52 33.49ZM35.77 18.12C37.13 16.51 38.03 14.33 37.67 12.21C35.73 12.43 33.63 13.81 32.3 15.42C31.21 16.78 30.02 18.95 30.48 21.03C32.69 21.05 34.48 19.65 35.77 18.12Z" fill="currentColor"/></svg>;
const GooglePayIcon = () => <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.54 15.71c.2-.25.32-.55.32-.88V9.12c0-.33-.12-.63-.32-.87L14.77 3.1c-.25-.25-.57-.38-.92-.38H9.69c-.35 0-.67.13-.92.38L2.98 8.25c-.2.24-.32.54-.32.87v6.05c0 .33.12.63.32.88l5.79 5.15c.25.25.57.38.92.38h4.16c.35 0 .67-.13.92-.38l5.79-5.15zM9.96 10.17c0-.99.47-1.77 1.22-2.26l.25-.16v4.87l-.25-.16c-.75-.48-1.22-1.27-1.22-2.29zm2.07 2.59V7.61l2.84 2.08c.3.22.3.61 0 .83l-2.84 2.08zm2.03-5.04L11.07 6c.76.51 1.26 1.32 1.26 2.31s-.5 1.8-1.26 2.31l2.99 1.77V7.72z" fill="currentColor"/></svg>;


interface UpgradeProDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpgradeProDialog: React.FC<UpgradeProDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const { currentUser, updateUserProfileInFirestore } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    if (!currentUser) {
      toast({
        title: t('loginRequiredForProTitle', 'Login Required'),
        description: t('loginRequiredForProDescription', 'Please log in or create an account to upgrade to PRO.'),
        variant: 'destructive',
      });
      onOpenChange(false);
      router.push('/login');
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      await updateUserProfileInFirestore(currentUser.uid, {
        isSubscribed: true,
        subscriptionPlan: "PRO Monthly",
        // nextBillingDate could be set here too e.g., one month from now
      });
      toast({
        title: t('upgradeSuccessTitle', 'Upgrade Successful!'),
        description: t('upgradeSuccessDescription', 'Welcome to World AI PRO! Your new features are now active.'),
        action: <CheckCircle className="text-green-500" />
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Upgrade failed:", error);
      toast({
        title: t('upgradeFailedTitle', 'Upgrade Failed'),
        description: t('upgradeFailedDescription', 'Could not process your upgrade. Please try again or contact support.'),
        variant: 'destructive',
        action: <XCircle className="text-red-500" />
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const proBenefits = [
    t('proBenefit1', "Full access to all AI tools & posts"),
    t('proBenefit2', "Comment and rate AI tools"),
    t('proBenefit3', "Priority support"),
  ];

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
              {proBenefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="text-center my-6">
            <p className="text-3xl font-bold text-primary">{t('upgradeToProPrice', "Just $1/month!")}</p>
            <p className="text-xs text-muted-foreground">(Billed monthly, cancel anytime)</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">{t('paymentMethodsTitle', "Select Payment Method")}</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Button variant="outline" className="flex-col h-auto py-3" disabled={isProcessing}>
                <CreditCard className="mb-1.5 h-6 w-6"/>
                {t('creditCardLabel', "Credit/Debit Card")}
              </Button>
              <Button variant="outline" className="flex-col h-auto py-3" disabled={isProcessing}>
                <PayPalIcon />
                {t('paypalLabel', "PayPal")}
              </Button>
               <Button variant="outline" className="flex-col h-auto py-3" disabled={isProcessing}>
                <ApplePayIcon />
                {t('applePayLabel', "Apple Pay")}
              </Button>
               <Button variant="outline" className="flex-col h-auto py-3" disabled={isProcessing}>
                <GooglePayIcon />
                {t('googlePayLabel', "Google Pay")}
              </Button>
            </div>
             <p className="text-xs text-muted-foreground mt-2 text-center"> (Payment simulation only) </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between items-center">
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={isProcessing}>
              {t('cancelButton', "Cancel")}
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleUpgrade} disabled={isProcessing} className="bg-primary hover:bg-primary/90">
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Star className="mr-2 h-4 w-4"/>}
            {t('upgradeNowButton', "Upgrade Now")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeProDialog;

