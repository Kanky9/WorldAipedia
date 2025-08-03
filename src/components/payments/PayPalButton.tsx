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

    const createSubscription = (data: any, actions: any) => {
        // This function is for creating a subscription, which is more complex.
        // For a simple one-time payment, we should use createOrder.
        // Let's stick with a one-time payment for the $1 PRO as it's simpler.
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '1.00',
                    currency_code: 'USD'
                }
            }],
            application_context: {
                brand_name: 'World AI',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW'
            }
        });
    };

    const onApprove = (data: any, actions: any) => {
        return actions.order.capture().then(async (details: any) => {
            if (!currentUser) {
                toast({ variant: 'destructive', title: t('errorDefaultTitle'), description: 'User not logged in.' });
                return;
            }
            try {
                await updateUserToPro(currentUser.uid, 'paypal', details.id);
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
        });
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
            createOrder={createSubscription}
            onApprove={onApprove}
            onError={onError}
        />
    );
};

export default PayPalButton;
