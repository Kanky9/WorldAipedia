
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLaceMascot = () => (
    <div className="relative flex flex-col items-center group">
        <div className={cn("absolute -top-16 left-1/2 -translate-x-1/2 w-max max-w-[220px] z-10")}>
            <div className="bg-card text-card-foreground p-3 rounded-lg shadow-xl text-md text-center border border-border">
                ¡Hola, soy Lace! ¿Listo para explorar la IA?
            </div>
            <div className="absolute left-1/2 bottom-[-7px] transform -translate-x-1/2 w-3.5 h-3.5 bg-card rotate-45 shadow-sm border-b border-r border-border"></div>
        </div>
        <svg
            width={180}
            height={220}
            viewBox="0 0 90 110"
            className="drop-shadow-lg transition-transform duration-300 group-hover:scale-105 filter group-hover:brightness-110 robot-body-animation"
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
                50% { transform: translateX(22px); } /* Max X for eye scan */
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
    </div>
);


export default function AdminDashboardPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser?.isAdmin) {
    if (typeof window !== 'undefined') {
        router.replace('/');
    }
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
        <Button onClick={() => router.push('/')} className="mt-4">Go to Homepage</Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <AdminLaceMascot />
    </div>
  );
}
