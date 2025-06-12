
'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useState } from 'react';

const Mascot = () => {
  const { t } = useLanguage();
  const [greeting, setGreeting] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setGreeting(t('mascotGreeting', 'Hello!'));
    // Show mascot after a short delay to avoid layout shift and make it noticeable
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, [t]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end group animate-fade-in">
      <div className="relative mb-2 mr-8">
        <div className="bg-card text-card-foreground p-3 rounded-lg shadow-lg text-sm max-w-xs text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {greeting}
        </div>
        <div className="absolute bottom-0 right-[-6px] transform translate-y-1/2 rotate-45 w-3 h-3 bg-card shadow-md"></div>
      </div>
      
      <svg 
        width="100" 
        height="120" 
        viewBox="0 0 150 180" 
        className="drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
        aria-label="Friendly AI Mascot"
        data-ai-hint="cartoon brain mascot"
      >
        {/* Legs */}
        <path d="M50 150 Q55 160 60 150 T70 150" stroke="hsl(var(--primary))" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M80 150 Q85 160 90 150 T100 150" stroke="hsl(var(--primary))" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <ellipse cx="65" cy="165" rx="15" ry="8" fill="hsl(var(--accent))" />
        <ellipse cx="85" cy="165" rx="15" ry="8" fill="hsl(var(--accent))" />

        {/* Body/Brain */}
        <path 
          d="M75 20 C20 20 10 75 75 130 C140 75 130 20 75 20 Z" 
          fill="hsl(var(--secondary))" 
          stroke="hsl(var(--primary))" 
          strokeWidth="5"
        />
        <path 
          d="M75 20 Q60 40 75 60 Q90 40 75 20" 
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="3" 
          opacity="0.7"
        />
        <path 
          d="M55 50 Q75 30 95 50" 
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="3" 
          opacity="0.7"
        />
         <path 
          d="M40 70 Q75 50 110 70" 
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="3" 
          opacity="0.7"
        />
        <path 
          d="M35 90 Q75 70 115 90" 
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="3" 
          opacity="0.7"
        />
         <path 
          d="M75 60 V 130" 
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="3" 
          opacity="0.7"
        />

        {/* Eyes */}
        <circle cx="55" cy="75" r="10" fill="white" />
        <circle cx="55" cy="75" r="5" fill="hsl(var(--foreground))" />
        <circle cx="95" cy="75" r="10" fill="white" />
        <circle cx="95" cy="75" r="5" fill="hsl(var(--foreground))" />

        {/* Mouth */}
        <path d="M60 100 Q75 115 90 100" stroke="hsl(var(--foreground))" strokeWidth="4" fill="none" strokeLinecap="round"/>
        
        {/* Waving Arm */}
        <path d="M105 90 Q125 80 135 60 Q140 80 120 100 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="5" className="group-hover:animate-wave origin-[110px_95px]" />
        <ellipse cx="138" cy="58" rx="8" ry="6" fill="hsl(var(--accent))" className="group-hover:animate-wave origin-[110px_95px]" />
        
         {/* Other Arm */}
        <path d="M45 90 Q25 80 15 60 Q10 80 30 100 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="5" />
        <ellipse cx="12" cy="58" rx="8" ry="6" fill="hsl(var(--accent))" />

        <style jsx>{`
          .group:hover .origin-\\[110px_95px\\] {
            animation: wave-animation 2s infinite;
          }
          @keyframes wave-animation {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(14deg); }
            20% { transform: rotate(-8deg); }
            30% { transform: rotate(14deg); }
            40% { transform: rotate(-4deg); }
            50% { transform: rotate(10deg); }
            60% { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
      </svg>
    </div>
  );
};

export default Mascot;
