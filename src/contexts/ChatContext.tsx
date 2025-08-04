
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useCallback, useContext } from 'react';
import type { AiToolChatContext as AiToolChatContextType } from '@/lib/types'; // Renamed import to avoid conflict
import type { CoreTranslationKey } from '@/lib/translations';


export type MascotDisplayMode = 'default' | 'chat_contextual' | 'ranking_intro' | 'custom_queue';
export interface MascotAdHocMessage {
  textKey: CoreTranslationKey;
  duration: number; // in milliseconds
}

interface ChatContextValue {
  isChatOpen: boolean;
  isUpgradeDialogOpen: boolean;
  aiContextForChat: AiToolChatContextType | null;
  openChat: (context?: AiToolChatContextType) => void;
  closeChat: () => void;
  openUpgradeDialog: () => void;
  closeUpgradeDialog: () => void;
  mascotDisplayMode: MascotDisplayMode;
  setMascotDisplayMode: (mode: MascotDisplayMode) => void;
  mascotAdHocMessages: MascotAdHocMessage[];
  setMascotAdHocMessages: (messages: MascotAdHocMessage[]) => void;
}

export const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [aiContextForChat, setAiContextForChat] = useState<AiToolChatContextType | null>(null);
  const [mascotDisplayMode, setMascotDisplayModeState] = useState<MascotDisplayMode>('default');
  const [mascotAdHocMessages, setMascotAdHocMessagesState] = useState<MascotAdHocMessage[]>([]);


  const openChat = useCallback((context?: AiToolChatContextType) => {
    if (context) {
      setAiContextForChat(context);
    } else {
      setAiContextForChat(null); 
    }
    setMascotDisplayModeState('chat_contextual');
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    setMascotDisplayModeState('default'); // Reset mascot mode when chat closes
  }, []);
  
  const openUpgradeDialog = useCallback(() => {
    setIsUpgradeDialogOpen(true);
  }, []);

  const closeUpgradeDialog = useCallback(() => {
    setIsUpgradeDialogOpen(false);
  }, []);

  const setMascotDisplayMode = useCallback((mode: MascotDisplayMode) => {
    setMascotDisplayModeState(mode);
  }, []);

  const setMascotAdHocMessages = useCallback((messages: MascotAdHocMessage[]) => {
    if (messages.length > 0) {
      setMascotDisplayModeState('custom_queue');
      setMascotAdHocMessagesState(messages);
    } else {
      setMascotAdHocMessagesState([]);
      // Revert to default or previous sensible mode if queue is cleared
      if (isChatOpen) {
        setMascotDisplayModeState('default');
      } else {
        setMascotDisplayModeState('default');
      }
    }
  }, [isChatOpen]);


  return (
    <ChatContext.Provider value={{ 
      isChatOpen, 
      isUpgradeDialogOpen,
      aiContextForChat, 
      openChat, 
      closeChat, 
      openUpgradeDialog,
      closeUpgradeDialog,
      mascotDisplayMode, 
      setMascotDisplayMode,
      mascotAdHocMessages,
      setMascotAdHocMessages
    }}>
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
