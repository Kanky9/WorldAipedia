
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
  }, [t]);

  const handleMascotClick = () => {
    setShowBubble(prev => !prev); // Toggle bubble visibility
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
      
      {/* New Mascot SVG based on provided image */}
      <svg
        onClick={handleMascotClick}
        width="120" // Adjusted size
        height="120" // Adjusted size
        viewBox="0 0 150 150" // Adjusted viewBox
        className="drop-shadow-lg transition-transform duration-300 group-hover:scale-110 filter group-hover:brightness-105 cursor-pointer"
        aria-label="Friendly AI Brain Mascot with glasses"
        data-ai-hint="pink brain mascot glasses"
      >
        <defs>
          <filter id="subtleGlowMascot" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
           <linearGradient id="glassesLens" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: "rgba(220, 230, 255, 0.3)"}} />
            <stop offset="100%" style={{stopColor: "rgba(200, 210, 240, 0.1)"}} />
          </linearGradient>
        </defs>

        {/* Main Brain Body - Pink */}
        <path 
          d="M75 20
             C40 20 25 40 30 75
             C35 110 60 130 75 130
             C90 130 115 110 120 75
             C125 40 110 20 75 20 Z
             M75 20
             Q60 25 50 35 Q35 50 35 75 Q35 100 50 115 Q60 125 75 130
             Q90 125 100 115 Q115 100 115 75 Q115 50 100 35 Q90 25 75 20 Z
             M50 45 C45 55 45 65 50 70 
             M100 45 C105 55 105 65 100 70
             M40 80 C45 90 55 95 65 90
             M110 80 C105 90 95 95 85 90
             M75 115 Q65 110 60 100
             M75 115 Q85 110 90 100
            "
          fill="#FFC0CB" /* Pink */
          stroke="#E75480" /* Darker Pink Outline */
          strokeWidth="3"
          className="animate-subtle-pulse-mascot"
        />

        {/* Glasses - White Frames, Light Blue Lenses */}
        {/* Left Lens */}
        <circle cx="58" cy="70" r="14" fill="url(#glassesLens)" stroke="white" strokeWidth="2.5"/>
        <circle cx="58" cy="70" r="13" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
        {/* Right Lens */}
        <circle cx="92" cy="70" r="14" fill="url(#glassesLens)" stroke="white" strokeWidth="2.5"/>
        <circle cx="92" cy="70" r="13" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
        {/* Bridge */}
        <path d="M72 70 Q75 67 78 70" stroke="white" strokeWidth="2.5" fill="none"/>

        {/* Eyes (Closed, curved lines) */}
        <path d="M52 72 Q58 75 64 72" stroke="#4A3B31" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M86 72 Q92 75 98 72" stroke="#4A3B31" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

        {/* Blush */}
        <ellipse cx="53" cy="82" rx="5" ry="3" fill="#FF8A8A" opacity="0.8"/>
        <ellipse cx="97" cy="82" rx="5" ry="3" fill="#FF8A8A" opacity="0.8"/>

        {/* Smile */}
        <path d="M65 88 Q75 95 85 88" stroke="#4A3B31" strokeWidth="2" fill="none" strokeLinecap="round"/>
        
        {/* Arms - Brown */}
        {/* Left Arm */}
        <path d="M30 70 Q20 60 25 45" stroke="#6F4E37" strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* Right Arm */}
        <path d="M120 70 Q130 60 125 45" stroke="#6F4E37" strokeWidth="5" fill="none" strokeLinecap="round"/>

        {/* Hands/Gloves - Light Blue Outline */}
        {/* Left Hand */}
        <path d="M118 115 
                 A 8 8 0 0 1 110 120
                 A 5 5 0 0 0 115 125
                 A 5 5 0 0 0 120 120 Z" 
              fill="none" stroke="#7AF8F8" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
        />
         {/* Right Hand */}
        <path d="M32 115
                 A 8 8 0 0 0 40 120
                 A 5 5 0 0 1 35 125
                 A 5 5 0 0 1 30 120 Z"
              fill="none" stroke="#7AF8F8" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
        />

        {/* Legs - Brown */}
        <line x1="55" y1="120" x2="50" y2="135" stroke="#6F4E37" strokeWidth="5" strokeLinecap="round"/>
        <line x1="95" y1="120" x2="100" y2="135" stroke="#6F4E37" strokeWidth="5" strokeLinecap="round"/>
        
        {/* Feet - Light Blue Outline */}
        <ellipse cx="48" cy="138" rx="8" ry="4" fill="none" stroke="#7AF8F8" strokeWidth="3"/>
        <ellipse cx="102" cy="138" rx="8" ry="4" fill="none" stroke="#7AF8F8" strokeWidth="3"/>


        <style jsx>{`
          @keyframes wave-animation-subtle { /* More subtle wave if needed */
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(5deg); }
          }
          .animate-wave {
            /* animation: wave-animation-subtle 2.5s infinite ease-in-out; */
            /* For this design, static arms might be better */
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes subtle-pulse-mascot {
            0% { transform: scale(1); }
            50% { transform: scale(1.015); }
            100% { transform: scale(1); }
          }
          .animate-subtle-pulse-mascot {
            animation: subtle-pulse-mascot 3.5s infinite ease-in-out;
          }
        `}</style>
      </svg>
    </div>
  );
};

export default Mascot;
