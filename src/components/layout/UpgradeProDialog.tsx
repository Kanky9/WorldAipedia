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
import { Star, CheckCircle, XCircle, Loader2, CreditCard } from 'lucide-react';
import Script from 'next/script';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

const PayPalIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current mb-3">
      <title>PayPal</title>
      <path d="M7.418 16.146c.33.08.536.14.717.18.237.054.4.106.52.145.21.066.36.14.47.23a.89.89 0 0 1 .18.33c.02.09.02.19.01.3-.01.12-.05.23-.11.34a.8.8 0 0 1-.21.28c-.12.1-.28.18-.47.23-.18.05-.4.1-.64.14-.23.05-.48.09-.72.11-.25.02-.48.03-.7.03h-.38c-1.12 0-2.2-.37-3.05-1.12-1.28-1.14-1.9-2.73-1.9-4.32 0-1.8.68-3.41 2.05-4.57 1.36-1.15 3.2-1.74 5.3-1.74h2.53c.18 0 .36.01.53.04.17.02.34.06.5.1.16.04.3.1.43.18.13.07.24.18.32.3.09.12.14.26.15.42.01.16 0 .3-.03.43a.87.87 0 0 1-.14.34c-.08.1-.19.18-.32.24-.13.06-.29.11-.47.14a4.1 4.1 0 0 1-.56.12c-.2.03-.39.04-.59.04h-.2c-1.2 0-2.23.27-3.08.8-1.07.67-1.6 1.63-1.6 2.85 0 .02 0 .05.01.09.01.04.01.07.02.1.05.21.16.4.3.56.15.16.32.3.5.42.18.12.38.22.58.3zm8.324-7.425c-1.34-1.1-3.1-1.64-5.14-1.64h-2.9c-.2 0-.39.01-.58.04-.19.02-.38.06-.55.11-.18.05-.34.12-.48.2a.9.9 0 0 0-.35.33c-.09.13-.14.28-.15.45-.01.17 0 .33.04.47.04.14.1.27.19.38.09.11.2.2.32.28.12.07.27.13.43.17.16.04.34.08.52.1.18.02.37.03.55.03h.36c1.17 0 2.22.33 3.1.98 1.1 1.02 1.64 2.37 1.64 4.04 0 1.2-.36 2.27-1.07 3.2-.6.78-1.4 1.34-2.3 1.65-.92.32-1.91.48-2.94.48h-1.32c-.16 0-.32-.01-.48-.04a3.6 3.6 0 0 1-.48-.11c-.15-.04-.29-.1-.42-.18s-.24-.17-.33-.28-.15-.24-.19-.36a.82.82 0 0 1-.05-.4c0-.16.03-.3.08-.43s.14-.25.24-.34c.1-.09.22-.17.36-.23.14-.06.3-.11.48-.15.18-.04.38-.08.58-.1.2-.02.4-.03.62-.03h.2c.63 0 1.17-.11 1.64-.34.46-.23.82-.56 1.07-.98.25-.42.38-.92.38-1.5 0-1.04-.3-1.87-.9-2.5-.6-.62-1.42-.94-2.45-.94h-1.03c-.15 0-.29.01-.42.02-.13.02-.26.04-.38.08-.12.03-.24.08-.34.13-.1.05-.2.12-.28.2-.08.08-.15.17-.19.27-.04.1-.07.2-.07.3s0 .2.02.3c.02.1.05.19.09.27.04.08.1.15.17.21.07.06.15.11.24.15.09.04.19.07.29.09.1.02.2.04.3.05h.35s.01 0 .01 0h.02c.01 0 .02 0 .03 0 .19-.02.38-.05.57-.1.19-.05.37-.11.53-.19.16-.08.3-.18.4-.29.1-.11.18-.24.22-.38.04-.14.06-.29.06-.45 0-.52-.16-.96-.48-1.32-.32-.36-.76-.54-1.32-.54h-1.2c-.17 0-.34.01-.5.04-.16.02-.32.06-.46.1-.14.04-.28.1-.4.17-.12.07-.23.16-.32.26-.09.1-.16.22-.2.34a.97.97 0 0 0-.08.42c0 .16.02.3.07.43a.9.9 0 0 0 .2.35c.09.1.2.18.33.24.13.06.28.11.45.14.17.03.35.06.54.07.19.01.38.02.57.02h.44c1.52 0 2.8-.48 3.82-1.45.9-1.04 1.36-2.3 1.36-3.78 0-1.7-.58-3.15-1.73-4.3z"/>
    </svg>
  );

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
            
            <div className="border-t pt-4">
               <h3 className="text-lg font-semibold text-center mb-4">{t('paymentMethodsTitle', "Choose Your Payment Method")}</h3>
              
              <RadioGroup defaultValue="paypal" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                      <RadioGroupItem value="card" id="r-card" className="peer sr-only" disabled/>
                      <Label htmlFor="r-card" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary opacity-50 cursor-not-allowed">
                          <CreditCard className="mb-3 h-6 w-6" />
                          {t('creditCardLabel', 'Credit/Debit Card')}
                      </Label>
                  </div>
                  <div>
                      <RadioGroupItem value="paypal" id="r-paypal" className="peer sr-only" />
                      <Label htmlFor="r-paypal" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                          <PayPalIcon />
                          {t('paypalLabel', 'PayPal')}
                      </Label>
                  </div>
              </RadioGroup>

              <p className="text-xs text-center text-muted-foreground mb-4">
                  {t('paypalGatewayInfo', "All payments are processed securely through PayPal. You can use your PayPal balance or any major credit/debit card.")}
              </p>

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
