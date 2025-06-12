
'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import type { CoreTranslationKey } from '@/lib/translations';
import { cn } from '@/lib/utils';


const Mascot = () => {
  const { t, language } = useLanguage();
  const { isChatOpen } = useChat(); 

  const [initialGreeting, setInitialGreeting] = useState('');
  const [isMascotVisible, setIsMascotVisible] = useState(false);
  const [showDefaultBubble, setShowDefaultBubble] = useState(true);

  const chatBubbleMessagesKeys: CoreTranslationKey[] = ['mascotChatGreeting1', 'mascotChatGreeting2'];
  const [currentChatBubbleIndex, setCurrentChatBubbleIndex] = useState(-1); 
  const [currentChatBubbleText, setCurrentChatBubbleText] = useState('');


  useEffect(() => {
    setInitialGreeting(t('mascotGreeting'));
    const visibilityTimer = setTimeout(() => {
      if (!isChatOpen) { // Only make initially visible if chat is not already open
        setIsMascotVisible(true);
      }
    }, 700);

    return () => {
      clearTimeout(visibilityTimer);
    };
  }, [t, isChatOpen]); 

  useEffect(() => {
    let bubbleTimer: NodeJS.Timeout | undefined;

    if (isChatOpen) {
      setIsMascotVisible(true); // Ensure mascot is visible when chat opens
      setShowDefaultBubble(false); 

      if (currentChatBubbleIndex === -1) { 
        setCurrentChatBubbleIndex(0); // Start the sequence
      } else if (currentChatBubbleIndex < chatBubbleMessagesKeys.length) {
        setCurrentChatBubbleText(t(chatBubbleMessagesKeys[currentChatBubbleIndex]));
        bubbleTimer = setTimeout(() => {
          setCurrentChatBubbleIndex(prevIndex => prevIndex + 1);
        }, 3000);
      } else {
        // Sequence finished, clear text but keep mascot visible
        setCurrentChatBubbleText(''); 
      }
    } else {
      // Chat closed
      setCurrentChatBubbleIndex(-1); // Reset sequence
      setCurrentChatBubbleText('');
      setShowDefaultBubble(true); // Show default greeting bubble again
      // Optionally, start timer to hide mascot if it was only visible due to chat
      // For now, let's keep it visible if it was made visible by initial timer or chat
    }

    return () => {
      if (bubbleTimer) clearTimeout(bubbleTimer);
    };
  }, [isChatOpen, currentChatBubbleIndex, t, language, chatBubbleMessagesKeys]);


  const handleMascotClick = () => {
    if (!isChatOpen) {
      setShowDefaultBubble(prev => !prev);
    }
  };

  // Determine if mascot should be rendered at all (initial delay for non-chat state)
  if (!isMascotVisible && !isChatOpen) return null;

  let bubbleContent = '';
  let shouldShowSpeechBubble = false;

  if (isChatOpen && currentChatBubbleIndex >= 0 && currentChatBubbleIndex < chatBubbleMessagesKeys.length) {
    bubbleContent = currentChatBubbleText;
    shouldShowSpeechBubble = !!currentChatBubbleText; 
  } else if (!isChatOpen && showDefaultBubble) {
    bubbleContent = initialGreeting;
    shouldShowSpeechBubble = !!bubbleContent; // Only show if greeting is not empty
  }
  
  const mascotBaseClasses = "fixed z-[60] flex flex-col items-center group transition-all duration-500 ease-in-out";
  const mascotAnimation = (isMascotVisible || isChatOpen) ? 'mascotAppearAnimation 0.5s ease-out forwards' : 'none';
  const mascotOpacity = (isMascotVisible || isChatOpen) ? 1 : 0;

  let mascotPositionStyle: React.CSSProperties = {
    animation: mascotAnimation,
    opacity: mascotOpacity,
    // Default to avoid type errors, will be overridden
    top: 'auto',
    left: 'auto',
    bottom: 'auto',
    right: 'auto',
  };

  if (isChatOpen) {
    mascotPositionStyle = {
      ...mascotPositionStyle,
      top: 'calc(50vh - 30px)', // Vertically align with mid-lower part of centered dialog
      left: 'calc(50vw + 262.5px + 15px)', // Position to the right of the 525px dialog (262.5px is half) + 15px offset
      bottom: 'auto',
      right: 'auto',
      transform: 'none', // Ensure no other transforms interfere
    };
  } else {
    mascotPositionStyle = {
      ...mascotPositionStyle,
      bottom: '1.25rem', // 20px (tailwind bottom-5)
      right: '1.25rem',  // 20px (tailwind right-5)
      top: 'auto',
      left: 'auto',
    };
  }


  return (
    <div
      className={cn(mascotBaseClasses)}
      style={mascotPositionStyle}
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
          @keyframes mascotAppearAnimation { 
            from { opacity: 0; transform: translateY(15px) scale(0.95); } /* Added scale for pop */
            to { opacity: 1; transform: translateY(0) scale(1); }
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
            0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 1px hsl(var(--primary)/0.5)); } /* Using filter for shadow */
            50% { opacity: 1; filter: drop-shadow(0 0 3px hsl(var(--primary)/0.8)); }
          }

          .eye-scan-animation {
            animation: eye-scan 3s linear infinite;
          }
          @keyframes eye-scan {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(22px); } 
          }
          
          .robot-arm-left-animation {
            transform-origin: 50% 15%; /* Adjusted origin for better swing */
            animation: arm-wave 4s ease-in-out infinite;
          }
          .robot-arm-right-animation {
            transform-origin: 50% 15%; /* Adjusted origin for better swing */
            animation: arm-wave 4s ease-in-out infinite reverse; 
          }
          @keyframes arm-wave {
            0%, 100% { transform: rotate(0deg) translateY(0px); }
            25% { transform: rotate(-10deg) translateY(-1px); } /* Increased angle */
            75% { transform: rotate(6deg) translateY(0px); }
          }

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
