"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { explainPage } from '@/ai/flows/pageExplainerFlow';
import { chatWithAI } from '@/ai/flows/chatFlow';

interface AIChatAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const AIChatAssistant: FC<AIChatAssistantProps> = ({ open, onOpenChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setIsInitialLoading(true);
      explainPage()
        .then(response => {
          setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: 'ai', text: response.explanation, timestamp: new Date() }]);
        })
        .catch(error => {
          console.error("Error fetching initial explanation:", error);
          setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: 'ai', text: "Sorry, I couldn't connect right now. Please try again later.", timestamp: new Date() }]);
        })
        .finally(() => {
          setIsInitialLoading(false);
        });
    }
  }, [open]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = { id: crypto.randomUUID(), sender: 'user', text: userInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI({ userInput: userMessage.text });
      setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: 'ai', text: response.aiResponse, timestamp: new Date() }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages(prev => [...prev, {id: crypto.randomUUID(), sender: 'ai', text: "I'm having trouble responding right now. Please try again.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset messages when dialog is closed, so it starts fresh next time.
      // Or, you could persist them if desired. For now, reset.
      // setMessages([]); 
    }
    onOpenChange(isOpen);
  };


  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[525px] h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Assistant
          </DialogTitle>
          <DialogDescription>
            Ask me about WorldAIpedia or general AI topics!
            <br/>
            <small className="text-xs text-muted-foreground/80">(Voice functionality is simulated with text for this prototype.)</small>
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto px-6" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {isInitialLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-2">Connecting to assistant...</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && <Bot className="h-6 w-6 text-primary flex-shrink-0 mb-1" />}
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.sender === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0 mb-1" />}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t">
          <div className="flex w-full items-center space-x-2">
            <Textarea
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
              className="flex-grow resize-none min-h-[40px]"
              disabled={isLoading || isInitialLoading}
            />
            <Button type="button" onClick={handleSendMessage} disabled={isLoading || isInitialLoading || !userInput.trim()} className="bg-primary hover:bg-primary/90">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIChatAssistant;
