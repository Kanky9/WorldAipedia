
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { PartyPopper, TriangleAlert } from 'lucide-react';

export default function WelcomeDialog() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show the dialog every time the component mounts (page loads)
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 7000); // Auto-close after 7 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <PartyPopper className="h-6 w-6 text-primary" />
            {t('welcomeModalTitle', 'Welcome to WorldAI!')}
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            {t('welcomeModalBeta', "We're excited to have you here! Please note that our site is currently in a beta version, so you might encounter some unexpected behavior as we continue to improve.")}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <TriangleAlert className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
          <div>
             <h3 className="font-semibold text-destructive">{t('welcomeModalTranslateTitle', 'Translation Notice')}</h3>
             <p className="text-sm text-destructive/90">
                {t('welcomeModalTranslateWarning', "Using your browser's automatic translation feature may cause display issues on the site. For the best experience, we recommend using our built-in language switcher.")}
             </p>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" className="w-full">
              {t('welcomeModalButton', 'Got it, let\'s explore!')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
