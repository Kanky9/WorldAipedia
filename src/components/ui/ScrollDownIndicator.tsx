
'use client';
import { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ScrollDownIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.offsetHeight;
      
      // Hide if scrolled past a certain point (e.g., half a viewport down) or near the bottom
      if (scrollPosition > windowHeight / 3 || (windowHeight + scrollPosition >= documentHeight - 50)) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check in case the page loads already scrolled (less likely with scrollRestoration)
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToContent = () => {
    // Scroll down by a portion of the viewport height, e.g., 70%
    window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToContent}
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-30 p-3 rounded-full bg-primary/90 text-primary-foreground shadow-xl hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-opacity duration-300 flex items-center justify-center animate-bounce-subtle hover:animate-none",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      aria-label="Scroll down for more content"
    >
      <ArrowDown className="h-6 w-6" />
    </button>
  );
}
