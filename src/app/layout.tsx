
import type { Metadata } from 'next';
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
import Script from 'next/script';


export const metadata: Metadata = {
  title: 'World AI - Your Guide to Artificial Intelligence',
  description: 'Discover news and information about existing and emerging AI tools, categorized for easy exploration.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">{/* Sets dark theme as default */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8517722132136281"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <LanguageProvider>
          <AuthProvider> {/* Wrap with AuthProvider */}
            <ChatProvider>
              <Header />
              <main className="flex-grow container mx-auto px-4 py-3">
                {children}
              </main>
              <Footer />
              <ClientOnly>
                <Mascot />
              </ClientOnly>
              <ChatElements />
              <UpgradeProButton /> {/* Add PRO button here */}
              <Toaster />
            </ChatProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
