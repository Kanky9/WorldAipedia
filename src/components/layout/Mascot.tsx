
'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';

const Mascot = () => {
  const { t } = useLanguage();
  const [greeting, setGreeting] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(true); // Bubble is visible by default

  useEffect(() => {
    setGreeting(t('mascotGreeting'));
    setShowBubble(true); // Ensure bubble is visible when greeting/language changes
    
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 700); // Delay mascot appearance

    return () => {
      clearTimeout(visibilityTimer);
    };
  }, [t]); // 't' changes when language changes, so greeting updates & bubble reappears

  const handleMascotClick = () => {
    setShowBubble(false); // Clicking mascot hides the bubble
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-5 right-5 z-50 flex flex-col items-center group" // Adjusted bottom/right slightly
      style={{ animation: isVisible ? 'fadeInUp 0.5s ease-out forwards' : 'none' }}
    >
      {/* Speech Bubble */}
      <div 
        className={`relative mb-2 transition-all duration-300 ease-out transform ${showBubble ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
        style={{ pointerEvents: showBubble ? 'auto' : 'none' }}
      >
        <div className="bg-card text-card-foreground p-3 rounded-lg shadow-xl text-sm max-w-[180px] text-center border border-border">
          {greeting}
        </div>
        {/* Speech bubble tail */}
        <div className="absolute left-1/2 bottom-[-7px] transform -translate-x-1/2 w-3.5 h-3.5 bg-card rotate-45 shadow-sm border-b border-r border-border"></div>
      </div>
      
      {/* Friendlier Mascot SVG - Smaller */}
      <svg 
        onClick={handleMascotClick}
        width="90" // Smaller width
        height="105" // Smaller height, maintaining aspect ratio
        viewBox="0 0 200 230" // Original viewBox to scale down elements
        className="drop-shadow-lg transition-transform duration-300 group-hover:scale-110 filter group-hover:brightness-105 cursor-pointer"
        aria-label="Friendly AI Mascot"
        data-ai-hint="friendly animated brain mascot"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/> {/* Softer glow */}
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main Brain Shape - Softer, rounder */}
        <path 
          d="M100 35 C45 35 25 80 55 150 Q100 185 145 150 C175 80 155 35 100 35 Z" 
          fill="hsl(var(--secondary))" 
          stroke="hsl(var(--primary))" 
          strokeWidth="7"
          className="animate-subtle-pulse"
        />
        
        {/* Simplified Brain Texture/Details */}
        <path d="M100 50 C85 75 80 100 100 130 C120 100 115 75 100 50 Z" fill="hsl(var(--primary)/0.1)" stroke="hsl(var(--primary)/0.4)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M80 80 Q90 65 100 80 T120 80" fill="none" stroke="hsl(var(--primary)/0.3)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M70 115 Q85 100 100 115 T130 115" fill="none" stroke="hsl(var(--primary)/0.3)" strokeWidth="3" strokeLinecap="round"/>

        {/* Eyes - Slightly larger pupils, friendly expression */}
        <ellipse cx="78" cy="100" rx="16" ry="20" fill="white" stroke="hsl(var(--primary)/0.6)" strokeWidth="2.5"/>
        <circle cx="78" cy="102" r="9" fill="hsl(var(--foreground))" className="animate-eye-shine" /> {/* Pupil */}
        <circle cx="73" cy="95" r="4" fill="white" opacity="0.8"/> {/* Shine */}
        
        <ellipse cx="122" cy="100" rx="16" ry="20" fill="white" stroke="hsl(var(--primary)/0.6)" strokeWidth="2.5"/>
        <circle cx="122" cy="102" r="9" fill="hsl(var(--foreground))" className="animate-eye-shine" /> {/* Pupil */}
        <circle cx="117" cy="95" r="4" fill="white" opacity="0.8"/> {/* Shine */}

        {/* Cheerful Mouth - Wider smile */}
        <path d="M75 140 Q100 160 125 140" stroke="hsl(var(--foreground))" strokeWidth="5" fill="none" strokeLinecap="round"/>
        
        {/* Waving Arm - Adjusted origin if body shape changed much */}
        <path d="M148 115 Q178 105 190 75 Q195 105 170 135 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="5" className="animate-wave origin-[158px_125px]" strokeLinecap="round" strokeLinejoin="round"/>
        <ellipse cx="192" cy="70" rx="11" ry="9" fill="hsl(var(--accent))" stroke="hsl(var(--primary)/0.7)" strokeWidth="2" className="animate-wave origin-[158px_125px]" />
        
        {/* Other Arm */}
        <path d="M52 115 Q22 105 10 75 Q5 105 30 135 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <ellipse cx="8" cy="70" rx="11" ry="9" fill="hsl(var(--accent))" stroke="hsl(var(--primary)/0.7)" strokeWidth="2"/>

        {/* Simple Feet/Legs - Slightly smaller */}
        <ellipse cx="80" cy="200" rx="22" ry="13" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="3.5"/>
        <line x1="80" y1="180" x2="80" y2="195" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round"/>
        
        <ellipse cx="120" cy="200" rx="22" ry="13" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="3.5"/>
        <line x1="120" y1="180" x2="120" y2="195" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round"/>

        <style jsx>{`
          @keyframes wave-animation {
            0% { transform: rotate(0deg); }
            15% { transform: rotate(12deg); } /* Slightly less wave */
            30% { transform: rotate(-8deg); }
            45% { transform: rotate(12deg); }
            60% { transform: rotate(-4deg); }
            75% { transform: rotate(8deg); }
            100% { transform: rotate(0deg); }
          }
          .animate-wave {
            animation: wave-animation 2.8s infinite ease-in-out; /* Slightly slower */
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); } /* Less Y travel */
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes subtle-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.015); } /* More subtle pulse */
            100% { transform: scale(1); }
          }
          .animate-subtle-pulse {
            animation: subtle-pulse 3.5s infinite ease-in-out; /* Slower pulse */
          }

          @keyframes eye-shine-animation {
            0%, 100% { transform: translate(0, 0) scale(1); }
            20% { transform: translate(0.5px, -0.5px) scale(1.03); } /* More subtle shine movement */
            80% { transform: translate(-0.5px, 0.5px) scale(0.97); }
          }
          .animate-eye-shine {
            animation: eye-shine-animation 4.5s infinite ease-in-out;
          }
        `}</style>
      </svg>
    </div>
  );
};

export default Mascot;
