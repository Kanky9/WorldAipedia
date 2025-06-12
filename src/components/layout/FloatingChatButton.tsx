
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
            className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-xl group hover:scale-110 transition-transform duration-300 animate-fab-attention" // Adjusted size
            onClick={() => openChat()}
            aria-label={t('laceChatTitle', 'Chat with Lace')}
          >
            <MessageCircle className="h-6 w-6 transition-transform group-hover:rotate-[15deg] duration-300" /> {/* Adjusted icon size */}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="mr-2">
          <p>{t('laceChatTitle', 'Chat with Lace')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
