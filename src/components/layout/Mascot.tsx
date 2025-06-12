
'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';

const Mascot = () => {
  const { t } = useLanguage(); // Only destructure t
  const [greeting, setGreeting] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    setGreeting(t('mascotGreeting'));
    const visibilityTimer = setTimeout(() => setIsVisible(true), 700); // Delay appearance
    const bubbleTimer = setTimeout(() => setShowBubble(true), 1200); // Show bubble after mascot
    
    const hideBubbleTimer = setTimeout(() => setShowBubble(false), 7000); // Hide bubble after some time

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(bubbleTimer);
      clearTimeout(hideBubbleTimer);
    };
  }, [t]); // Depend only on t. 't' function's identity changes when language changes.

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center group"
      style={{ animation: isVisible ? 'fadeInUp 0.5s ease-out forwards' : 'none' }}
      onMouseEnter={() => setShowBubble(true)}
      onMouseLeave={() => setTimeout(() => setShowBubble(false), 300)} // Keep bubble for a bit after mouse leave
    >
      {/* Speech Bubble */}
      <div 
        className={`relative mb-3 transition-all duration-500 ease-out transform ${showBubble ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}
        style={{ pointerEvents: showBubble ? 'auto' : 'none' }}
      >
        <div className="bg-card text-card-foreground p-3 rounded-xl shadow-xl text-sm max-w-[200px] text-center border border-border">
          {greeting}
        </div>
        {/* Speech bubble tail */}
        <div className="absolute left-1/2 bottom-[-8px] transform -translate-x-1/2 w-4 h-4 bg-card rotate-45 shadow-md border-b border-r border-border"></div>
      </div>
      
      {/* Mascot SVG */}
      <svg 
        width="120" 
        height="140" 
        viewBox="0 0 200 230" 
        className="drop-shadow-lg transition-transform duration-300 group-hover:scale-110 filter group-hover:brightness-110"
        aria-label="Friendly AI Mascot"
        data-ai-hint="animated brain mascot"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main Brain Shape - with subtle pulse animation */}
        <path 
          d="M100 30 C40 30 20 90 100 180 C180 90 160 30 100 30 Z" 
          fill="hsl(var(--secondary))" 
          stroke="hsl(var(--primary))" 
          strokeWidth="8"
          className="animate-subtle-pulse"
        />
        
        {/* Brain Texture/Details - stylized lines */}
        <path d="M100,32 Q80,70 100,100 T120,70 Q100,32 100,32" fill="none" stroke="hsl(var(--primary)/0.6)" strokeWidth="4" strokeLinecap="round"/>
        <path d="M70,60 Q100,40 130,60" fill="none" stroke="hsl(var(--primary)/0.5)" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50,100 Q100,70 150,100" fill="none" stroke="hsl(var(--primary)/0.6)" strokeWidth="4" strokeLinecap="round"/>
        <path d="M60,140 Q100,110 140,140" fill="none" stroke="hsl(var(--primary)/0.5)" strokeWidth="4" strokeLinecap="round"/>
        <path d="M100,100 V178" fill="none" stroke="hsl(var(--primary)/0.6)" strokeWidth="4" strokeLinecap="round"/>

        {/* Eyes - larger, more expressive with shine */}
        <circle cx="75" cy="100" r="18" fill="white" stroke="hsl(var(--primary)/0.7)" strokeWidth="2"/>
        <circle cx="80" cy="95" r="8" fill="hsl(var(--foreground))" className="animate-eye-shine" />
        <circle cx="72" cy="92" r="3" fill="white" opacity="0.9"/> 
        
        <circle cx="125" cy="100" r="18" fill="white" stroke="hsl(var(--primary)/0.7)" strokeWidth="2"/>
        <circle cx="130" cy="95" r="8" fill="hsl(var(--foreground))" className="animate-eye-shine" />
        <circle cx="122" cy="92" r="3" fill="white" opacity="0.9"/>

        {/* Cheerful Mouth */}
        <path d="M80 135 Q100 155 120 135" stroke="hsl(var(--foreground))" strokeWidth="5" fill="none" strokeLinecap="round"/>
        
        {/* Waving Arm */}
        <path d="M145 110 Q175 100 190 70 Q195 100 170 130 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="6" className="animate-wave origin-[155px_120px]" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Hand for waving arm */}
        <ellipse cx="193" cy="65" rx="12" ry="10" fill="hsl(var(--accent))" stroke="hsl(var(--primary)/0.8)" strokeWidth="2" className="animate-wave origin-[155px_120px]" />
        
        {/* Other Arm */}
        <path d="M55 110 Q25 100 10 70 Q5 100 30 130 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Hand for other arm */}
        <ellipse cx="7" cy="65" rx="12" ry="10" fill="hsl(var(--accent))" stroke="hsl(var(--primary)/0.8)" strokeWidth="2"/>

        {/* Simple Feet/Legs */}
        <ellipse cx="80" cy="195" rx="25" ry="15" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="4"/>
        <line x1="80" y1="180" x2="80" y2="190" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"/>
        
        <ellipse cx="120" cy="195" rx="25" ry="15" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="4"/>
        <line x1="120" y1="180" x2="120" y2="190" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"/>

        <style jsx>{`
          @keyframes wave-animation {
            0% { transform: rotate(0deg); }
            15% { transform: rotate(15deg); }
            30% { transform: rotate(-10deg); }
            45% { transform: rotate(15deg); }
            60% { transform: rotate(-5deg); }
            75% { transform: rotate(10deg); }
            100% { transform: rotate(0deg); }
          }
          .animate-wave {
            animation: wave-animation 2.5s infinite ease-in-out;
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes subtle-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
          .animate-subtle-pulse {
            animation: subtle-pulse 3s infinite ease-in-out;
          }

          @keyframes eye-shine-animation {
            0%, 100% { transform: translate(0, 0) scale(1); }
            20% { transform: translate(1px, -1px) scale(1.05); }
            80% { transform: translate(-1px, 1px) scale(0.95); }
          }
          .animate-eye-shine {
            animation: eye-shine-animation 4s infinite ease-in-out;
          }
        `}</style>
      </svg>
    </div>
  );
};

export default Mascot;
