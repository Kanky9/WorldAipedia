
"use client";

import { useState, useEffect } from 'react';
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
import { Star, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Script from 'next/script';

// Extend window type to include paypal
declare global {
  interface Window {
    paypal?: any;
  }
}

interface UpgradeProDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PAYPAL_CLIENT_ID = "AVN5icg5lMBN8lqsNdEBdvk2oBbNld31kjvJxpbG3cN8voCELmkA2qoUV6TlI9GdxyzKndAgLj2tKUih";
const PAYPAL_PLAN_ID = "P-7W9736313L373491LNBTLTLI";

const UpgradeProDialog: React.FC<UpgradeProDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const { currentUser, updateUserProfileInFirestore } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSDKReady, setIsSDKReady] = useState(false);

  // This effect will run when the dialog opens and will render the PayPal button
  useEffect(() => {
    if (open && isSDKReady && window.paypal) {
      const paypalButtonContainer = document.getElementById('paypal-button-container');
      
      // Clear previous buttons and render a new one
      if (paypalButtonContainer) {
        paypalButtonContainer.innerHTML = ''; // Clear previous instances to avoid duplicates
        window.paypal.Buttons({
          style: {
            shape: 'pill',
            color: 'gold',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: function(data: any, actions: any) {
            return actions.subscription.create({
              plan_id: PAYPAL_PLAN_ID
            });
          },
          onApprove: async function(data: any, actions: any) {
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
            try {
              await updateUserProfileInFirestore(currentUser.uid, {
                isSubscribed: true,
                subscriptionPlan: "PRO Monthly (PayPal)",
                paypalSubscriptionID: data.subscriptionID,
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
          },
          onError: (err: any) => {
            console.error("PayPal button error:", err);
            toast({
              title: "PayPal Error",
              description: "An error occurred with PayPal. Please try again.",
              variant: "destructive",
            });
          }
        }).render('#paypal-button-container');
      }
    }
  }, [open, isSDKReady, currentUser, onOpenChange, router, t, toast, updateUserProfileInFirestore]);
  
  const proBenefits = [
    t('proBenefit1', "Full access to all AI tools & posts"),
    t('proBenefit2', "Comment and rate AI tools"),
    t('proBenefit3', "Priority support"),
  ];

  return (
    <>
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`}
        onReady={() => {
          setIsSDKReady(true);
        }}
        data-sdk-integration-source="button-factory"
      />
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

            <div className="text-center my-4">
              <p className="text-3xl font-bold text-primary">{t('upgradeToProPrice', "Just $1/month!")}</p>
              <p className="text-xs text-muted-foreground">({t('cancelButton', "Billed monthly, cancel anytime")})</p>
            </div>
            
            <div className="relative min-h-[150px] flex items-center justify-center">
              {isProcessing && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-20 rounded-md">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2"/>
                    <p className="text-sm text-muted-foreground">Processing your subscription...</p>
                </div>
              )}
              {!isSDKReady && !isProcessing && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                 </div>
              )}
              <div id="paypal-button-container" className="w-full"></div>
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
    </>
  );
};

export default UpgradeProDialog;
