
"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react'; // Corrected import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { explainPage } from '@/ai/flows/pageExplainerFlow';
import { chatWithAI } from '@/ai/flows/chatFlow';
import { useLanguage } from '@/hooks/useLanguage';

interface AIChatAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: string;
  role: 'user' | 'model'; // Matched with Genkit history
  text: string;
  timestamp: Date;
}

const AIChatAssistant: FC<AIChatAssistantProps> = ({ open, onOpenChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    if (open && messages.length === 0) {
      setIsInitialLoading(true);
      explainPage({ language })
        .then(response => {
          setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', text: response.explanation, timestamp: new Date() }]);
        })
        .catch(error => {
          console.error("Error fetching initial explanation:", error);
          setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', text: t('aiChatError'), timestamp: new Date() }]);
        })
        .finally(() => {
          setIsInitialLoading(false);
        });
    }
  }, [open, language, t, messages.length]); // Added messages.length back to ensure initial message fetches if dialog reopens empty

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: Message = { id: crypto.randomUUID(), role: 'user', text: userInput, timestamp: new Date() };
    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    setUserInput('');
    setIsLoading(true);

    // Prepare history for Genkit flow
    const historyForAI = currentMessages.slice(0, -1).map(msg => ({ // Exclude the latest user message as it's the current input
        role: msg.role,
        parts: [{ text: msg.text }],
    }));


    try {
      const response = await chatWithAI({ 
        userInput: newUserMessage.text, 
        language,
        history: historyForAI 
      });
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', text: response.aiResponse, timestamp: new Date() }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages(prev => [...prev, {id: crypto.randomUUID(), role: 'model', text: t('aiChatErrorResponse'), timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDialogClose = (isOpen: boolean) => {
    // Optionally reset messages when dialog is closed, or persist them.
    // if (!isOpen) { setMessages([]); } 
    onOpenChange(isOpen);
  };


  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[525px] h-[70vh] flex flex-col p-0 rounded-xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            {t('aiChatTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('aiChatDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto px-6" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {isInitialLoading && messages.length === 0 && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-2">{t('aiChatConnecting')}</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0 mb-1" />}
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.role === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0 mb-1" />}
              </div>
            ))}
             {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && ( // Show loading indicator only when user was the last to message
              <div className="flex items-center justify-start p-4">
                <Bot className="h-6 w-6 text-primary flex-shrink-0 mb-1" />
                <div className="max-w-[75%] rounded-lg px-3 py-2 shadow-sm bg-card text-card-foreground border">
                   <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t">
          <div className="flex w-full items-center space-x-2">
            <Textarea
              placeholder={t('aiChatPlaceholder')}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
              className="flex-grow resize-none min-h-[40px] rounded-lg"
              disabled={isLoading || (isInitialLoading && messages.length === 0)}
            />
            <Button type="button" onClick={handleSendMessage} disabled={isLoading || (isInitialLoading && messages.length === 0) || !userInput.trim()} className="bg-primary hover:bg-primary/90 rounded-lg">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">{t('aiChatSend')}</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIChatAssistant;
