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

// This is a pre-configured Plan ID on PayPal for a $1.00 USD monthly subscription.
const PAYPAL_PLAN_ID = 'P-35G735787Y247515UMUCN7IA';

const PayPalButton = ({ onSuccess }: PayPalButtonProps) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const { currentUser } = useAuth();
    const { toast } = useToast();
    const { t } = useLanguage();

    const createSubscription = (data: any, actions: any) => {
        return actions.subscription.create({
            'plan_id': PAYPAL_PLAN_ID
        });
    };

    const onApprove = (data: any, actions: any) => {
        if (!currentUser) {
            toast({ variant: 'destructive', title: t('errorDefaultTitle'), description: 'User not logged in.' });
            return Promise.resolve();
        }
        try {
            // The approval is successful, now update the user's status in Firestore.
            // The `data.subscriptionID` is the unique identifier for this new subscription.
             updateUserToPro(currentUser.uid, 'paypal', data.subscriptionID);
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
        // It's important to return a promise here, even if it's just resolving.
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
            style={{ layout: "vertical", label: "subscribe" }}
            createSubscription={createSubscription}
            onApprove={onApprove}
            onError={onError}
        />
    );
};

export default PayPalButton;
