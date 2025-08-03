
"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useAuth } from '@/contexts/AuthContext';
import { updateUserToPro } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface PayPalButtonProps {
    onSuccess: () => void;
}

const PayPalButton = ({ onSuccess }: PayPalButtonProps) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const { currentUser } = useAuth();
    const { toast } = useToast();
    const { t } = useLanguage();

    const createOrder = (data: any, actions: any) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: "World AI PRO - 1 Month Access",
                    amount: {
                        value: "1.00",
                        currency_code: "USD",
                    },
                },
            ],
            application_context: {
                shipping_preference: "NO_SHIPPING",
            },
        });
    };

    const onApprove = async (data: any, actions: any) => {
        if (!currentUser) {
            toast({ variant: 'destructive', title: t('errorDefaultTitle'), description: 'User not logged in.' });
            return Promise.resolve();
        }
        
        try {
            // It's good practice to capture the order on the server, but for simplicity here we assume client-side capture.
            const details = await actions.order.capture();
            
            // The approval is successful, now update the user's status in Firestore.
            const transactionId = details.id; // The PayPal transaction ID.
            updateUserToPro(currentUser.uid, 'paypal', transactionId);
            toast({
                title: t('upgradeSuccessTitle'),
                description: t('upgradeSuccessDescription'),
                action: <CheckCircle className="text-green-500" />
            });
            onSuccess(); // Close the dialog
        } catch (updateError) {
            console.error("Error updating user to PRO:", updateError);
            toast({ variant: 'destructive', title: t('upgradeFailedTitle'), description: 'Payment successful, but failed to update account. Please contact support.' });
        }
        return Promise.resolve();
    };
    
    const onError = (err: any) => {
        console.error('PayPal Checkout Error:', err);
        toast({ variant: 'destructive', title: t('paymentErrorTitle'), description: 'An error occurred with your payment. Please try again.' });
    };

    if (isPending) {
        return <div className="flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <PayPalButtons
            style={{ layout: "vertical", label: "pay" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
        />
    );
};

export default PayPalButton;
