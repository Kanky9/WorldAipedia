
'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';
import { useChat } from '@/contexts/ChatContext'; // Import useChat
import type { CoreTranslationKey } from '@/lib/translations';


const Mascot = () => {
  const { t, language } = useLanguage();
  const { isChatOpen } = useChat(); // Get chat state

  const [initialGreeting, setInitialGreeting] = useState('');
  const [isMascotVisible, setIsMascotVisible] = useState(false);
  const [showDefaultBubble, setShowDefaultBubble] = useState(true);

  // New state for chat-specific bubbles
  const chatBubbleMessagesKeys: CoreTranslationKey[] = ['mascotChatGreeting1', 'mascotChatGreeting2'];
  const [currentChatBubbleIndex, setCurrentChatBubbleIndex] = useState(-1); // -1 means sequence is not active
  const [currentChatBubbleText, setCurrentChatBubbleText] = useState('');


  // Effect for initial mascot visibility and default greeting
  useEffect(() => {
    setInitialGreeting(t('mascotGreeting'));
    // setShowDefaultBubble(true); // Default bubble shows initially, managed by its own state

    const visibilityTimer = setTimeout(() => {
      setIsMascotVisible(true);
    }, 700);

    return () => {
      clearTimeout(visibilityTimer);
    };
  }, [t]); // t changes when language changes, re-fetch default greeting

  // Effect for handling chat-specific bubble sequence
  useEffect(() => {
    let bubbleTimer: NodeJS.Timeout;

    if (isChatOpen) {
      setIsMascotVisible(true); // Ensure mascot is visible when chat opens
      setShowDefaultBubble(false); // Hide default bubble when chat is open

      if (currentChatBubbleIndex === -1) { // Chat just opened, or sequence reset, start sequence
        setCurrentChatBubbleIndex(0);
      } else if (currentChatBubbleIndex < chatBubbleMessagesKeys.length) {
        setCurrentChatBubbleText(t(chatBubbleMessagesKeys[currentChatBubbleIndex]));
        bubbleTimer = setTimeout(() => {
          setCurrentChatBubbleIndex(prevIndex => prevIndex + 1);
        }, 3000);
      } else {
        // Sequence finished, chat is still open, hide chat bubble text
        setCurrentChatBubbleText('');
      }
    } else {
      // Chat closed, reset chat bubble sequence
      setCurrentChatBubbleIndex(-1);
      setCurrentChatBubbleText('');
      // Default bubble visibility is handled by showDefaultBubble state now
    }

    return () => clearTimeout(bubbleTimer);
  }, [isChatOpen, currentChatBubbleIndex, t, language, chatBubbleMessagesKeys]);


  const handleMascotClick = () => {
    // Clicking the mascot only toggles the default bubble if chat is NOT open
    // and the chat-specific sequence is not active.
    // Or, more simply, let it always toggle showDefaultBubble.
    // The rendering logic will decide what to show.
    if (!isChatOpen) {
      setShowDefaultBubble(prev => !prev);
    }
  };

  if (!isMascotVisible) return null;

  // Determine what to display in the bubble
  let bubbleContent = '';
  let shouldShowSpeechBubble = false;

  if (isChatOpen && currentChatBubbleIndex >= 0 && currentChatBubbleIndex < chatBubbleMessagesKeys.length) {
    // Chat is open and chat-specific sequence is active
    bubbleContent = currentChatBubbleText;
    shouldShowSpeechBubble = !!currentChatBubbleText; // Only show if there's text (handles end of sequence)
  } else if (!isChatOpen && showDefaultBubble) {
    // Chat is closed, and default bubble is allowed to show
    bubbleContent = initialGreeting;
    shouldShowSpeechBubble = true;
  }

  return (
    <div 
      className="fixed bottom-5 right-5 z-50 flex flex-col items-center group"
      style={{ animation: isMascotVisible ? 'mascotAppearAnimation 0.5s ease-out forwards' : 'none' }}
    >
      {/* Speech Bubble */}
      {shouldShowSpeechBubble && (
        <div 
          className={`relative mb-2 ${shouldShowSpeechBubble ? 'speech-bubble-enter' : 'speech-bubble-exit'}`}
          style={{ pointerEvents: shouldShowSpeechBubble ? 'auto' : 'none' }}
        >
          <div className="bg-card text-card-foreground p-3 rounded-lg shadow-xl text-sm max-w-[180px] text-center border border-border">
            {bubbleContent}
          </div>
          {/* Speech bubble tail */}
          <div className="absolute left-1/2 bottom-[-7px] transform -translate-x-1/2 w-3.5 h-3.5 bg-card rotate-45 shadow-sm border-b border-r border-border"></div>
        </div>
      )}
      
      {/* New Robot Mascot SVG */}
      <svg
        onClick={handleMascotClick}
        width="90"
        height="110"
        viewBox="0 0 90 110"
        className="drop-shadow-lg transition-transform duration-300 group-hover:scale-105 filter group-hover:brightness-110 cursor-pointer robot-body-animation"
        aria-label="Friendly AI Robot Mascot"
        data-ai-hint="friendly AI robot"
      >
        <defs>
          <linearGradient id="robotMetallicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: "hsl(var(--secondary))"}} />
            <stop offset="50%" style={{stopColor: "hsl(var(--muted))"}} />
            <stop offset="100%" style={{stopColor: "hsl(var(--secondary))"}} />
          </linearGradient>
           <filter id="subtleRobotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feComponentTransfer in="blur" result="softBlur">
                <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="softBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Antenna */}
        <line x1="45" y1="12" x2="45" y2="2" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="2.5" />
        <circle cx="45" cy="12" r="4" fill="hsl(var(--primary))" className="antenna-light-animation" />

        {/* Head */}
        <rect x="25" y="18" width="40" height="30" rx="8" fill="url(#robotMetallicGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
        
        {/* Eye Visor */}
        <rect x="30" y="25" width="30" height="12" rx="3" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1"/>
        {/* Eye Light Scan */}
        <rect x="33" y="28" width="4" height="6" rx="1.5" fill="hsl(var(--primary))" className="eye-scan-animation"/>
        
        {/* Neck */}
        <rect x="40" y="48" width="10" height="5" fill="hsl(var(--muted))" />

        {/* Body */}
        <rect x="20" y="53" width="50" height="35" rx="8" fill="url(#robotMetallicGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
        
        {/* Arms */}
        <rect x="10" y="58" width="8" height="25" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" className="robot-arm-left-animation" />
        <rect x="72" y="58" width="8" height="25" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" className="robot-arm-right-animation" />

        {/* Legs/Base (simple rounded block) */}
        <rect x="30" y="88" width="30" height="12" rx="5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5"/>

        <style jsx>{`
          @keyframes mascotAppearAnimation { /* Renamed from fadeInUp to be specific */
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .robot-body-animation {
            animation: robot-float 3.5s ease-in-out infinite;
          }
          @keyframes robot-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }

          .antenna-light-animation {
            animation: antenna-pulse 2s infinite ease-in-out;
          }
          @keyframes antenna-pulse {
            0%, 100% { opacity: 0.6; box-shadow: 0 0 2px hsl(var(--primary)/0.5); }
            50% { opacity: 1; box-shadow: 0 0 5px hsl(var(--primary)/0.8); }
          }

          .eye-scan-animation {
            animation: eye-scan 3s linear infinite;
          }
          @keyframes eye-scan {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(22px); } /* 30 (visor width) - 4 (light width) - 3 (padding x2 from visor edge) */
          }
          
          .robot-arm-left-animation {
            transform-origin: 50% 0%; /* Pivot from top-center of arm */
            animation: arm-wave 4s ease-in-out infinite;
          }
          .robot-arm-right-animation {
            transform-origin: 50% 0%;
            animation: arm-wave 4s ease-in-out infinite reverse; /* Reverse for opposite motion */
          }
          @keyframes arm-wave {
            0%, 100% { transform: rotate(0deg) translateY(0px); }
            25% { transform: rotate(-8deg) translateY(-1px); }
            75% { transform: rotate(5deg) translateY(0px); }
          }

          /* Speech bubble animations */
          .speech-bubble-enter {
            opacity: 1;
            transform: translateY(0) scale(1);
            animation: speech-bubble-enter-anim 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
          }
          .speech-bubble-exit {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
            animation: speech-bubble-exit-anim 0.3s ease-in forwards;
          }

          @keyframes speech-bubble-enter-anim {
            from { opacity: 0; transform: translateY(10px) scale(0.8); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes speech-bubble-exit-anim {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(10px) scale(0.8); }
          }
        `}</style>
      </svg>
    </div>
  );
};

export default Mascot;
