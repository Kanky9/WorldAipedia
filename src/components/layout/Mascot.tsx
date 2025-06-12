
'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';

const Mascot = () => {
  const { t } = useLanguage(); // language variable is not directly used here, t() changes based on context
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
      className="fixed bottom-5 right-5 z-50 flex flex-col items-center group"
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
      
      {/* More Realistic Animated Brain Mascot SVG - Smaller */}
      <svg 
        onClick={handleMascotClick}
        width="100" // Slightly adjusted size
        height="115" // Slightly adjusted size
        viewBox="0 0 200 220" // Adjusted viewBox for better fit
        className="drop-shadow-lg transition-transform duration-300 group-hover:scale-110 filter group-hover:brightness-105 cursor-pointer"
        aria-label="Realistic animated AI Mascot"
        data-ai-hint="realistic animated brain mascot"
      >
        <defs>
          <filter id="subtleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Brain Stem/Base */}
        <path d="M90 180 Q100 215 110 180" fill="hsl(var(--secondary)/0.8)" stroke="hsl(var(--primary)/0.7)" strokeWidth="3"/>

        {/* Main Brain Lobes Shape - more organic */}
        <path 
          d="M100 20 
             C40 20 30 70 50 120 
             Q60 150 75 170 
             C80 185 90 190 100 190 
             C110 190 120 185 125 170 
             Q140 150 150 120 
             C170 70 160 20 100 20 Z"
          fill="hsl(var(--secondary))" 
          stroke="hsl(var(--primary))" 
          strokeWidth="6"
          className="animate-subtle-pulse"
        />
        
        {/* Brain Gyri/Sulci Details - stylized for "animated realism" */}
        <path d="M100 50 Q80 60 70 80 T80 110 Q90 130 100 140 T120 110 Q130 80 120 60 Q110 50 100 50" fill="none" stroke="hsl(var(--primary)/0.25)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M65 90 Q55 100 60 115 T75 130" fill="none" stroke="hsl(var(--primary)/0.2)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M135 90 Q145 100 140 115 T125 130" fill="none" stroke="hsl(var(--primary)/0.2)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M100 70 Q90 80 90 95 T100 110 T110 95 Q110 80 100 70" fill="hsl(var(--primary)/0.05)" stroke="hsl(var(--primary)/0.15)" strokeWidth="2" />
        <ellipse cx="85" cy="75" rx="10" ry="5" fill="hsl(var(--primary)/0.1)" transform="rotate(-15 85 75)"/>
        <ellipse cx="115" cy="75" rx="10" ry="5" fill="hsl(var(--primary)/0.1)" transform="rotate(15 115 75)"/>


        {/* Eyes - friendly expression */}
        <g className="animate-eye-blink">
          <ellipse cx="78" cy="105" rx="14" ry="18" fill="white" stroke="hsl(var(--primary)/0.6)" strokeWidth="2"/>
          <circle cx="78" cy="108" r="7" fill="hsl(var(--foreground))" /> {/* Pupil */}
          <circle cx="74" cy="102" r="3" fill="white" opacity="0.9"/> {/* Shine */}
          
          <ellipse cx="122" cy="105" rx="14" ry="18" fill="white" stroke="hsl(var(--primary)/0.6)" strokeWidth="2"/>
          <circle cx="122" cy="108" r="7" fill="hsl(var(--foreground))" /> {/* Pupil */}
          <circle cx="118" cy="102" r="3" fill="white" opacity="0.9"/> {/* Shine */}
        </g>

        {/* Cheerful Mouth */}
        <path d="M80 145 Q100 155 120 145" stroke="hsl(var(--foreground))" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        
        {/* Waving Arm */}
        <g className="animate-wave origin-[150px_125px]">
          <path d="M145 115 Q165 105 175 80 Q180 105 160 130 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <ellipse cx="177" cy="75" rx="9" ry="7" fill="hsl(var(--accent))" stroke="hsl(var(--primary)/0.7)" strokeWidth="1.5"/>
        </g>
        
        {/* Other Arm */}
        <g>
          <path d="M55 115 Q35 105 25 80 Q20 105 40 130 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <ellipse cx="23" cy="75" rx="9" ry="7" fill="hsl(var(--accent))" stroke="hsl(var(--primary)/0.7)" strokeWidth="1.5"/>
        </g>

        {/* Simple Feet - adjusted position for new brain base */}
        <ellipse cx="82" cy="195" rx="18" ry="10" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="3"/>
        <line x1="85" y1="175" x2="82" y2="190" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round"/>
        
        <ellipse cx="118" cy="195" rx="18" ry="10" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="3"/>
        <line x1="115" y1="175" x2="118" y2="190" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round"/>

        <style jsx>{`
          @keyframes wave-animation {
            0% { transform: rotate(0deg); }
            15% { transform: rotate(10deg); }
            30% { transform: rotate(-6deg); }
            45% { transform: rotate(10deg); }
            60% { transform: rotate(-3deg); }
            75% { transform: rotate(6deg); }
            100% { transform: rotate(0deg); }
          }
          .animate-wave {
            animation: wave-animation 2.5s infinite ease-in-out;
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes subtle-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.01); }
            100% { transform: scale(1); }
          }
          .animate-subtle-pulse {
            animation: subtle-pulse 3s infinite ease-in-out;
          }

          @keyframes eye-blink-animation {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          .animate-eye-blink g, .animate-eye-blink ellipse, .animate-eye-blink circle {
             /* Apply to group for synchronized blink if needed, or individual elements */
          }
          .animate-eye-blink { /* Apply this class to the group wrapping the eyes */
            animation: eye-blink-animation 4s infinite ease-in-out;
          }
        `}</style>
      </svg>
    </div>
  );
};

export default Mascot;
