
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
import { useToast } from "@/hooks/use-toast";
import { Star, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { updateUserToPro } from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import type { OnApproveData, CreateSubscriptionActions } from "@paypal/paypal-js";


interface UpgradeProDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpgradeProDialog: React.FC<UpgradeProDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [{ isPending }] = usePayPalScriptReducer();

  const handleSuccess = useCallback(async (subscriptionId?: string) => {
    if (!currentUser) return;
    setIsProcessing(true);
    setError('');
    try {
      await updateUserToPro(currentUser.uid, 'paypal', subscriptionId);
      toast({
        title: t('upgradeSuccessTitle', 'Upgrade Successful!'),
        description: t('upgradeSuccessDescription', 'Welcome to World AI PRO! Your new features are now active.'),
        action: <CheckCircle className="text-green-500" />
      });
      onOpenChange(false);
    } catch (err) {
      console.error("Upgrade failed:", err);
      setError(t('upgradeFailedDescription', 'Could not update your profile. Please contact support.'));
    } finally {
      setIsProcessing(false);
    }
  }, [currentUser, onOpenChange, t, toast]);

  const handleLoginRedirect = useCallback(() => {
    toast({
      title: t('loginRequiredForProTitle', 'Login Required'),
      description: t('loginRequiredForProDescription', 'Please log in or create an account to upgrade to PRO.'),
      variant: 'destructive',
    });
    onOpenChange(false);
    router.push('/login');
  }, [onOpenChange, router, t, toast]);
  
  const createSubscription = (data: Record<string, unknown>, actions: CreateSubscriptionActions) => {
      if (!currentUser) { 
        handleLoginRedirect(); 
        return Promise.reject(new Error("User not logged in")); 
      }
      const PAYPAL_PLAN_ID = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;
      if(!PAYPAL_PLAN_ID) {
          setError("PayPal Plan ID is not configured. Please contact support.");
          console.error("PayPal Plan ID environment variable is not set.");
          return Promise.reject(new Error("PayPal plan not configured"));
      }
      return actions.subscription.create({
          plan_id: PAYPAL_PLAN_ID
      });
  };
  
  const onApprove = (data: OnApproveData) => {
      return handleSuccess(data.subscriptionID);
  };
  
  const onError = (err: any) => {
    console.error("PayPal button error:", err);
    setError(t('paymentErrorTitle', "An error occurred with PayPal. Please try again."));
    setIsProcessing(false);
  }

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

        <div className="relative py-4 space-y-4">
          {(isProcessing || isPending) && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-20 rounded-md">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2"/>
                <p className="text-sm text-muted-foreground">{isPending ? "Loading payment options..." : t('processingPayment', 'Processing your payment...')}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('upgradeToProBenefits', "PRO Benefits:")}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
              {proBenefits.map((benefit, index) => <li key={index}>{benefit}</li>)}
            </ul>
          </div>

          <div className="text-center my-4">
            <p className="text-3xl font-bold text-primary">{t('upgradeToProPrice', "Just $1.00!")}</p>
          </div>
          
          <div className="border-t pt-4">
             <p className="text-center text-sm text-muted-foreground mb-4">
              {t('paypalGatewayInfo', "All payments are processed securely through PayPal. You can use your PayPal balance or any major credit/debit card.")}
            </p>
            
            {!isPending && !process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID && (
                <Alert variant="destructive" className="mt-4">
                    <XCircle className="h-4 w-4"/>
                    <AlertTitle>Configuration Error</AlertTitle>
                    <AlertDescription>PayPal payments cannot be processed at this time. Please contact support.</AlertDescription>
                </Alert>
            )}

            {!isPending && process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID && (
                <PayPalButtons
                  style={{ layout: "vertical", shape: "pill", color: "gold", tagline: false }}
                  createSubscription={createSubscription}
                  onApprove={onApprove}
                  onError={onError}
                  disabled={isProcessing}
                />
            )}
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <XCircle className="h-4 w-4"/>
                <AlertTitle>{t('paymentErrorTitle', 'Payment Error')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={isProcessing}>
              {t('cancelButton', "Cancel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default UpgradeProDialog;
