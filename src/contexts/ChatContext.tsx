
'use client';
import type { ReactNode } from 'react';
import { createContext, useState, useCallback, useContext } from 'react';
import type { AiToolChatContext as AiToolChatContextType } from '@/lib/types'; // Renamed import to avoid conflict

interface ChatContextValue {
  isChatOpen: boolean;
  aiContextForChat: AiToolChatContextType | null;
  openChat: (context?: AiToolChatContextType) => void;
  closeChat: () => void;
  // setAiContext: (context: AiToolChatContextType | null) => void; // Not strictly needed if context is set on open
}

export const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [aiContextForChat, setAiContextForChat] = useState<AiToolChatContextType | null>(null);

  const openChat = useCallback((context?: AiToolChatContextType) => {
    if (context) {
      setAiContextForChat(context);
    } else {
      setAiContextForChat(null); 
    }
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    // Optionally reset context when chat is closed, or let it persist until next openChat
    // setAiContextForChat(null); 
  }, []);
  
  // const setAiContext = useCallback((context: AiToolChatContextType | null) => {
  //    setAiContextForChat(context);
  // }, []);

  return (
    <ChatContext.Provider value={{ isChatOpen, aiContextForChat, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
