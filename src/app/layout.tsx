
'use client'; // This directive marks the entire layout as a Client Component

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext'; // Import AuthProvider
import Mascot from '@/components/layout/Mascot';
import { ChatProvider } from '@/contexts/ChatContext';
import ChatElements from '@/components/layout/ChatElements';
import UpgradeProButton from '@/components/layout/UpgradeProButton';
import ClientOnly from '@/components/layout/ClientOnly';
import WelcomeDialog from '@/components/layout/WelcomeDialog';
import { Inter, Space_Grotesk } from 'next/font/google';
import AdSenseUnit from '@/components/ads/AdSenseUnit';

// Setup fonts with next/font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <head>
        <title>World AI - Your Guide to Artificial Intelligence</title>
        <meta name="description" content="Discover news and information about existing and emerging AI tools, categorized for easy exploration." />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <LanguageProvider>
          <AuthProvider>
            <ChatProvider>
              <Header />
              <div id="ads-header" className="text-center my-4 container mx-auto min-h-[100px] flex items-center justify-center">
                 {/* Placeholder para el anuncio de la cabecera */}
              </div>
              <main className="flex-grow container mx-auto px-4 py-3">
                {children}
              </main>
              <Footer />
              <ClientOnly>
                <Mascot />
                <WelcomeDialog />
              </ClientOnly>
              <ChatElements />
              <UpgradeProButton />
              <Toaster />
            </ChatProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
