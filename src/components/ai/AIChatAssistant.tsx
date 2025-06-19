
"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, User, Bot, Paperclip, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { explainPage } from '@/ai/flows/pageExplainerFlow';
import { chatWithLace } from '@/ai/flows/chatFlow';
import { getAiToolWelcome } from '@/ai/flows/aiToolWelcomeFlow';
import { useLanguage } from '@/hooks/useLanguage';
import type { AiToolChatContext } from '@/lib/types';

interface AIChatAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContext: AiToolChatContext | null;
}

interface MessagePart {
  text?: string;
  media?: { url: string; type: 'image' };
}
interface Message {
  id: string;
  role: 'user' | 'model';
  parts: MessagePart[];
  timestamp: Date;
}

const AIChatAssistant: FC<AIChatAssistantProps> = ({ open, onOpenChange, initialContext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    if (open && messages.length === 0) {
      setIsInitialLoading(true);
      if (initialContext) {
        getAiToolWelcome({
          toolTitle: initialContext.title,
          toolDescription: initialContext.shortDescription,
          toolLink: initialContext.link,
          language,
        })
        .then(response => {
          setMessages([{ id: crypto.randomUUID(), role: 'model', parts: [{ text: response.welcomeMessage }], timestamp: new Date() }]);
        })
        .catch(error => {
          console.error("Error fetching AI tool welcome:", error);
          setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', parts: [{ text: t('laceChatErrorWelcomeTool', "I'm having a bit of trouble introducing this tool, but feel free to ask me anything about it or other topics!") }], timestamp: new Date() }]);
        })
        .finally(() => {
          setIsInitialLoading(false);
        });
      } else {
        explainPage({ language })
          .then(response => {
            setMessages([{ id: crypto.randomUUID(), role: 'model', parts: [{ text: response.explanation }], timestamp: new Date() }]);
          })
          .catch(error => {
            console.error("Error fetching initial explanation:", error);
            setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', parts: [{ text: t('laceChatErrorWelcomeGeneral', "Hi there! I'm Lace, your AI assistant. How can I help you today?") }], timestamp: new Date() }]);
          })
          .finally(() => {
            setIsInitialLoading(false);
          });
      }
    } else if (!open) {
      setMessages([]);
      clearSelectedImage();
    }
  }, [open, initialContext, language, t, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setSelectedImageFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async () => {
    if ((!userInput.trim() && !selectedImage) || isLoading) return;

    const newUserMessageParts: MessagePart[] = [];
    if (userInput.trim()) {
      newUserMessageParts.push({ text: userInput });
    }
    if (selectedImage) {
      newUserMessageParts.push({ media: { url: selectedImage, type: 'image' } });
    }

    const newUserMessage: Message = { id: crypto.randomUUID(), role: 'user', parts: newUserMessageParts, timestamp: new Date() };
    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    
    const textInputForFlow = userInput;
    setUserInput('');
    const imageForFlow = selectedImage;
    clearSelectedImage();

    setIsLoading(true);

    const historyForAI = currentMessages.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: msg.parts.map(part => {
        const genkitPart: any = {};
        if (part.text) genkitPart.text = part.text;
        // For history, only send text representation of media if you want the AI to "know" an image was sent.
        // Don't resend the actual media data URI for past messages unless the flow specifically needs it.
        // The current chatFlow's history schema expects text parts.
        if (part.media) genkitPart.text = (genkitPart.text ? genkitPart.text + " " : "") + t('laceChatImagePreviewAlt', "[User sent an image previously]");
        return genkitPart;
      }),
    }));

    try {
      const response = await chatWithLace({ 
        userInput: textInputForFlow, 
        language,
        history: historyForAI,
        imageDataUri: imageForFlow || undefined,
      });
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', parts: [{ text: response.aiResponse }], timestamp: new Date() }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages(prev => [...prev, {id: crypto.randomUUID(), role: 'model', parts: [{ text: t('laceChatErrorResponse', "Lace is having trouble responding. Please try again.") }], timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[525px] h-auto max-h-[calc(100dvh-4rem)] sm:max-h-[70vh] flex flex-col p-0 rounded-xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            {t('laceChatTitle', 'Chat with Lace')}
          </DialogTitle>
          <DialogDescription>
            {t('laceChatDescription', "I'm Lace! Ask me about World AI, AI tools, or let's just chat.")}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea type="always" className="flex-grow min-h-0 px-6" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {isInitialLoading && messages.length === 0 && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-2">{t('laceChatConnecting', 'Lace is connecting...')}</p>
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
                  {msg.parts.map((part, index) => (
                    <div key={index}>
                      {part.text && <p className="text-sm whitespace-pre-wrap">{part.text}</p>}
                      {part.media && part.media.type === 'image' && (
                        <Image 
                          src={part.media.url} 
                          alt={t('laceChatImagePreviewAlt', 'Selected image preview')}
                          width={200} 
                          height={150} 
                          className="rounded-md mt-2 max-w-full h-auto" 
                        />
                      )}
                    </div>
                  ))}
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.role === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0 mb-1" />}
              </div>
            ))}
             {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
              <div className="flex items-center justify-start p-4">
                <Bot className="h-6 w-6 text-primary flex-shrink-0 mb-1" />
                <div className="max-w-[75%] rounded-lg px-3 py-2 shadow-sm bg-card text-card-foreground border">
                   <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t flex-col space-y-2">
          {selectedImage && (
            <div className="relative group w-32 h-24">
              <Image src={selectedImage} alt={t('laceChatImagePreviewAlt', 'Selected image preview')} layout="fill" objectFit="cover" className="rounded-md border" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 bg-black/50 text-white hover:bg-black/70 group-hover:opacity-100 opacity-0 transition-opacity rounded-full"
                onClick={clearSelectedImage}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex w-full items-center space-x-2">
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading || (isInitialLoading && messages.length === 0)}>
                            <Paperclip className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{t('laceChatImageUploadTooltip', 'Upload Image')}</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />

            <Textarea
              placeholder={t('laceChatPlaceholder', 'Type your message or upload an image...')}
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
            <Button 
              type="button" 
              onClick={handleSendMessage} 
              disabled={isLoading || (isInitialLoading && messages.length === 0) || (!userInput.trim() && !selectedImage)} 
              className="bg-primary hover:bg-primary/90 rounded-lg"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">{t('laceChatSend', 'Send')}</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIChatAssistant;
