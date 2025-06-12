
"use client"; // Ensure this is a client component

import { useChat } from '@/contexts/ChatContext';
import AIChatAssistant from '@/components/ai/AIChatAssistant';
import FloatingChatButton from '@/components/layout/FloatingChatButton';

// Helper component to use useChat hook within the provider's scope
export default function ChatElements() {
  const { isChatOpen, closeChat, aiContextForChat } = useChat();
  return (
    <>
      <AIChatAssistant
        open={isChatOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeChat();
          }
        }}
        initialContext={aiContextForChat}
      />
      <FloatingChatButton />
    </>
  );
}
