
"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserToPro } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: any) => { render: (selector: string) => void };
    };
  }
}

interface PayPalButtonProps {
    onSuccess: () => void;
}

export default function PayPalButton({ onSuccess }: PayPalButtonProps) {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const payPalButtonRef = useRef(false);

  useEffect(() => {
    // Prevent re-initialization on re-renders
    if (payPalButtonRef.current) return;
    payPalButtonRef.current = true;

    const loadPayPalSDK = () => {
      return new Promise<boolean>((resolve) => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
        script.async = true;
        
        script.setAttribute('data-merchant-id', 'WORLDAI_VERCEL');
        script.setAttribute('data-csp-nonce', 'world-ai-nonce');
        
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        
        document.head.appendChild(script);
      });
    };

    const initializePayPal = async () => {
      const loaded = await loadPayPalSDK();
      
      if (loaded && window.paypal) {
        try {
          window.paypal.Buttons({
            createOrder: (_data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: '1.00'
                  }
                }],
                application_context: {
                  brand_name: 'World AI',
                  user_action: 'PAY_NOW',
                  shipping_preference: 'NO_SHIPPING'
                }
              });
            },
            onApprove: (_data, actions) => {
              return actions.order!.capture().then(async (details) => {
                 if (!currentUser) {
                    setError('User not logged in. Cannot complete purchase.');
                    return;
                 }
                 try {
                    await updateUserToPro(currentUser.uid, 'paypal', details.id);
                    toast({
                      title: t('upgradeSuccessTitle', 'Upgrade Successful!'),
                      description: t('upgradeSuccessDescription', 'Welcome to World AI PRO! Your new features are now active.'),
                      action: <CheckCircle className="text-green-500" />
                    });
                    onSuccess(); // Close the dialog
                 } catch (updateError) {
                    console.error("Error updating user to PRO:", updateError);
                    setError('Payment was successful, but we could not update your account. Please contact support.');
                 }
              });
            },
            onError: (err: any) => {
              console.error('PayPal button error:', err);
              setError('An error occurred during payment: ' + err.message);
            },
            enableStandardCardFields: true,
            commit: true
          }).render('#paypal-button-container');
          
          setPaypalLoaded(true);
        } catch (err: any) {
          console.error('Error initializing PayPal:', err);
          setError('Failed to initialize PayPal buttons: ' + err.message);
        }
      } else {
        setError('Could not load the PayPal SDK. Please check your connection and try again.');
      }
    };

    initializePayPal();
  }, [currentUser, onSuccess, t, toast]);

  if (error) {
    return (
      <div className="paypal-fallback">
        <p>⚠️ {error}</p>
        <p>Please complete the payment manually:</p>
        <a 
          href={`https://www.paypal.com/paypalme/joaquin_b2001/1.00USD?note=Upgrade+World+AI+PRO`}
          target="_blank"
          rel="noopener noreferrer"
          className="manual-pay-button"
        >
          Pay $1.00 with PayPal
        </a>
      </div>
    );
  }

  return <div id="paypal-button-container">{!paypalLoaded && <p>Loading PayPal...</p>}</div>;
}
