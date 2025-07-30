"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import UpgradeProDialog from './UpgradeProDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialPayPalOptions = {
    "client-id": "AawNqjRyKwRCZ5SKI8G1_AZO60WduRtM3upWJXaEP5YefZ3qMOe0auGUj4lVQMh3J1BiyQwapKT4_Y3n",
    "enable-funding": "card",
    "disable-funding": "venmo",
    "data-sdk-integration-source": "integrationbuilder_ac",
    currency: "USD",
    intent: "subscription",
    "vault": true,
};


const UpgradeProButton = () => {
  const { t } = useLanguage();
  const { currentUser, loading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pathname = usePathname();

  if (loading) {
    return null; // Don't show anything while auth state is loading
  }

  if (currentUser?.isSubscribed) {
    return null; // Don't show if user is already PRO
  }

  const authPages = ['/login', '/register'];
  if (pathname.startsWith('/admin') || authPages.includes(pathname)) {
    return null;
  }

  return (
    <PayPalScriptProvider options={initialPayPalOptions}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full shadow-xl group hover:scale-110 transition-transform duration-300 animate-pulse-glow-subtle bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              onClick={() => setIsDialogOpen(true)}
              aria-label={t('proButtonTooltip', "Upgrade to PRO")}
            >
              <Star className="h-6 w-6 fill-white transition-transform group-hover:rotate-[15deg] duration-300" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <p>{t('proButtonTooltip', "Upgrade to PRO")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpgradeProDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </PayPalScriptProvider>
  );
};

export default UpgradeProButton;