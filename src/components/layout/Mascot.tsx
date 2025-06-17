
'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import type { CoreTranslationKey } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const DIALOG_MAX_WIDTH_PX = 525; // Max width of the chat dialog
const MASCOT_SVG_HEIGHT_PX = 110;
const MASCOT_SVG_WIDTH_PX = 90;
const CHAT_BUTTON_SIZE_REM = 3; // w-12 h-12 (48px)
const CHAT_BUTTON_OFFSET_REM = 1.5; // bottom-6 right-6 (24px)

const Mascot = () => {
  const { t, language } = useLanguage();
  const { isChatOpen } = useChat();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const [initialGreeting, setInitialGreeting] = useState('');
  const [isMascotVisible, setIsMascotVisible] = useState(false);
  const [showDefaultBubble, setShowDefaultBubble] = useState(true);

  const chatBubbleMessagesKeys: CoreTranslationKey[] = ['mascotChatGreeting1', 'mascotChatGreeting2'];
  const [currentChatBubbleIndex, setCurrentChatBubbleIndex] = useState(-1);
  const [currentChatBubbleText, setCurrentChatBubbleText] = useState('');

  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const isSmallScreen = windowSize.width < 640; // Tailwind 'sm' breakpoint (640px)

  useEffect(() => {
    setMounted(true);
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }
  }, []);


  useEffect(() => {
    setInitialGreeting(t('mascotGreeting'));
    const visibilityTimer = setTimeout(() => {
      if (!isChatOpen) {
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
      setIsMascotVisible(true); 
      setShowDefaultBubble(false); 

      if (currentChatBubbleIndex === -1) { 
        setCurrentChatBubbleIndex(0);
      } else if (currentChatBubbleIndex < chatBubbleMessagesKeys.length) {
        setCurrentChatBubbleText(t(chatBubbleMessagesKeys[currentChatBubbleIndex]));
        bubbleTimer = setTimeout(() => {
          setCurrentChatBubbleIndex(prevIndex => prevIndex + 1);
        }, 4000); 
      } else {
        setCurrentChatBubbleText(''); 
      }
    } else {
      setCurrentChatBubbleIndex(-1);
      setCurrentChatBubbleText('');
      setShowDefaultBubble(true); 
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

  if (pathname.startsWith('/admin')) {
    return null;
  }

  if (!mounted) {
    return null;
  }

  if (!isMascotVisible && !isChatOpen) return null;

  let bubbleContent = '';
  let shouldShowSpeechBubble = false;

  if (isChatOpen && currentChatBubbleIndex >= 0 && currentChatBubbleIndex < chatBubbleMessagesKeys.length) {
    bubbleContent = currentChatBubbleText;
    shouldShowSpeechBubble = !!currentChatBubbleText;
  } else if (!isChatOpen && showDefaultBubble) {
    bubbleContent = initialGreeting;
    shouldShowSpeechBubble = !!bubbleContent;
  }

  const mascotBaseClasses = "fixed z-[60] flex flex-col items-center group transition-all duration-500 ease-in-out";
  const mascotAnimation = (isMascotVisible || isChatOpen) ? 'mascotAppearAnimation 0.5s ease-out forwards' : 'none';
  const mascotOpacity = (isMascotVisible || isChatOpen) ? 1 : 0;

  let mascotPositionStyle: React.CSSProperties = {
    animation: mascotAnimation,
    opacity: mascotOpacity,
  };

  if (isChatOpen) {
    if (isSmallScreen) { 
      mascotPositionStyle = {
        ...mascotPositionStyle,
        top: '3vh', 
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
        bottom: 'auto',
      };
    } else { 
      mascotPositionStyle = {
        ...mascotPositionStyle,
        top: `calc(50vh - ${MASCOT_SVG_HEIGHT_PX / 2}px)`, 
        left: `calc(50vw + ${DIALOG_MAX_WIDTH_PX / 2}px + 20px)`, 
        right: 'auto',
        bottom: 'auto',
        transform: 'none', 
      };
    }
  } else { 
    const mascotRightOffsetRem = CHAT_BUTTON_OFFSET_REM + CHAT_BUTTON_SIZE_REM + 1; 
    mascotPositionStyle = {
      ...mascotPositionStyle,
      bottom: '1.25rem', 
      right: `${mascotRightOffsetRem}rem`, 
      top: 'auto',
      left: 'auto',
      transform: 'none',
    };
  }

  return (
    <div
      className={cn(mascotBaseClasses)}
      style={mascotPositionStyle}
    >
      {shouldShowSpeechBubble && (
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 w-max max-w-[180px] z-10",
            "bottom-[115px]", 
            shouldShowSpeechBubble ? 'speech-bubble-enter' : 'speech-bubble-exit'
          )}
          style={{ pointerEvents: shouldShowSpeechBubble ? 'auto' : 'none' }}
        >
          <div className="bg-card text-card-foreground p-3 rounded-lg shadow-xl text-sm text-center border border-border">
            {bubbleContent}
          </div>
          <div className="absolute left-1/2 bottom-[-7px] transform -translate-x-1/2 w-3.5 h-3.5 bg-card rotate-45 shadow-sm border-b border-r border-border"></div>
        </div>
      )}

      <svg
        onClick={handleMascotClick}
        width={MASCOT_SVG_WIDTH_PX}
        height={MASCOT_SVG_HEIGHT_PX}
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
        <line x1="45" y1="12" x2="45" y2="2" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="2.5" />
        <circle cx="45" cy="12" r="4" fill="hsl(var(--primary))" className="antenna-light-animation" />
        <rect x="25" y="18" width="40" height="30" rx="8" fill="url(#robotMetallicGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
        <rect x="30" y="25" width="30" height="12" rx="3" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1"/>
        <rect x="33" y="28" width="4" height="6" rx="1.5" fill="hsl(var(--primary))" className="eye-scan-animation"/>
        <rect x="40" y="48" width="10" height="5" fill="hsl(var(--muted))" />
        <rect x="20" y="53" width="50" height="35" rx="8" fill="url(#robotMetallicGradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
        <rect x="10" y="58" width="8" height="25" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" className="robot-arm-left-animation" />
        <rect x="72" y="58" width="8" height="25" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" className="robot-arm-right-animation" />
        <rect x="30" y="88" width="30" height="12" rx="5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5"/>
        <style jsx>{\`
          @keyframes mascotAppearAnimation {
            from { opacity: 0; transform: translateY(15px) scale(0.95); }
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
            0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 1px hsl(var(--primary)/0.5)); }
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
            transform-origin: 50% 15%;
            animation: arm-wave 4s ease-in-out infinite;
          }
          .robot-arm-right-animation {
            transform-origin: 50% 15%;
            animation: arm-wave 4s ease-in-out infinite reverse;
          }
          @keyframes arm-wave {
            0%, 100% { transform: rotate(0deg) translateY(0px); }
            25% { transform: rotate(-10deg) translateY(-1px); }
            75% { transform: rotate(6deg) translateY(0px); }
          }
          .speech-bubble-enter {
            opacity: 1;
            transform: translateY(0) scale(1) translateX(-50%);
            animation: speech-bubble-enter-anim 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
          }
          .speech-bubble-exit {
            opacity: 0;
            transform: translateY(10px) scale(0.8) translateX(-50%);
            animation: speech-bubble-exit-anim 0.3s ease-in forwards;
          }
          @keyframes speech-bubble-enter-anim {
            from { opacity: 0; transform: translateY(10px) scale(0.8) translateX(-50%); }
            to { opacity: 1; transform: translateY(0) scale(1) translateX(-50%); }
          }
          @keyframes speech-bubble-exit-anim {
            from { opacity: 1; transform: translateY(0) scale(1) translateX(-50%); }
            to { opacity: 0; transform: translateY(10px) scale(0.8) translateX(-50%); }
          }
        \`}</style>
      </svg>
    </div>
  );
};

export default Mascot;
    