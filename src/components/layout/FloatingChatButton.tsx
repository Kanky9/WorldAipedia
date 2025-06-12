
'use client';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useChat } from '@/contexts/ChatContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function FloatingChatButton() {
  const { openChat } = useChat();
  const { t } = useLanguage();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-xl animate-pulse-glow group hover:scale-110 transition-transform duration-300" // Adjusted size and position slightly
            onClick={() => openChat()} // Opens chat with no specific AI context
            aria-label={t('homeChatButton', 'Chat with Lace')}
          >
            <MessageCircle className="h-8 w-8 transition-transform group-hover:rotate-[15deg] duration-300" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="mr-2">
          <p>{t('homeChatButton', 'Chat with Lace')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
