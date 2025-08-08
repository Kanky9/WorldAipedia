"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const messages = [
  "¡Hola, soy Lace! ¿Listo para explorar la IA?",
  "Denle click al enlace de abajo y visita la web."
];

const LaceRobotSVG = ({ className }: { className?: string }) => (
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 90 110"
        className={cn("drop-shadow-lg transition-transform duration-300 filter robot-body-animation", className)}
        aria-label="Friendly AI Robot Mascot"
        data-ai-hint="friendly AI robot"
      >
        <defs>
          <linearGradient id="robotMetallicGradientMascot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: "hsl(var(--secondary))"}} />
            <stop offset="50%" style={{stopColor: "hsl(var(--muted))"}} />
            <stop offset="100%" style={{stopColor: "hsl(var(--secondary))"}} />
          </linearGradient>
        </defs>
        <line x1="45" y1="12" x2="45" y2="2" stroke="hsl(var(--foreground) / 0.7)" strokeWidth="2.5" />
        <circle cx="45" cy="12" r="4" fill="hsl(var(--primary))" className="antenna-light-animation" />
        <rect x="25" y="18" width="40" height="30" rx="8" fill="url(#robotMetallicGradientMascot)" stroke="hsl(var(--border))" strokeWidth="1.5" />
        <rect x="30" y="25" width="30" height="12" rx="3" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1"/>
        <rect x="33" y="28" width="4" height="6" rx="1.5" fill="hsl(var(--primary))" className="eye-scan-animation"/>
        <rect x="40" y="48" width="10" height="5" fill="hsl(var(--muted))" />
        <rect x="20" y="53" width="50" height="35" rx="8" fill="url(#robotMetallicGradientMascot)" stroke="hsl(var(--border))" strokeWidth="1.5" />
        <rect x="10" y="58" width="8" height="25" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" className="robot-arm-left-animation" />
        <rect x="72" y="58" width="8" height="25" rx="4" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" className="robot-arm-right-animation" />
        <rect x="30" y="88" width="30" height="12" rx="5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5"/>
        <style jsx>{`
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
        `}</style>
    </svg>
);

const SpeechBubble = ({ text }: { text: string }) => {
    return (
        <div key={text} className="relative w-max max-w-xs speech-bubble-enter">
            <div className="bg-card text-card-foreground p-3 rounded-lg shadow-xl text-center border border-border">
                {text}
            </div>
            <div className="absolute left-1/2 bottom-[-7px] transform -translate-x-1/2 w-3.5 h-3.5 bg-card rotate-45 shadow-sm border-b border-r border-border"></div>
            <style jsx>{`
                .speech-bubble-enter {
                    animation: speech-bubble-enter-anim 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
                }
                @keyframes speech-bubble-enter-anim {
                    from { opacity: 0; transform: translateY(10px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default function AdminDashboardPage() {
    const { currentUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        if (!authLoading && !currentUser?.isAdmin) {
            router.replace('/admin');
        }
    }, [currentUser, authLoading, router]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 4000);

        return () => clearInterval(intervalId);
    }, []);

    if (authLoading || !currentUser?.isAdmin) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center p-4">
            <Button variant="outline" asChild className="absolute top-4 left-4">
                <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Admin
                </Link>
            </Button>

            <div className="flex flex-col items-center justify-center space-y-6">
                <SpeechBubble text={messages[currentMessageIndex]} />
                <div className="w-48 h-auto sm:w-56">
                    <LaceRobotSVG />
                </div>
                <div className="mt-4">
                    <Link href="https://lacelabs-dab81.web.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                        lacelabs-dab81.web.app
                    </Link>
                </div>
            </div>
        </div>
    );
}
