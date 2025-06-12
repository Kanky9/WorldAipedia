
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Mascot from '@/components/layout/Mascot';
import { ChatProvider } from '@/contexts/ChatContext';
// Remove AIChatAssistant and FloatingChatButton direct imports
// import AIChatAssistant from '@/components/ai/AIChatAssistant';
// import FloatingChatButton from '@/components/layout/FloatingChatButton';
// Remove useChat import here if it was present for the old ChatElements
// import { useChat } from '@/contexts/ChatContext'; 
import ChatElements from '@/components/layout/ChatElements'; // Import the new component

export const metadata: Metadata = {
  title: 'World AI - Your Guide to Artificial Intelligence',
  description: 'Discover news and information about existing and emerging AI tools, categorized for easy exploration.',
};

// Old ChatElements component is now in its own file.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <LanguageProvider>
          <ChatProvider>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-4">
              {children}
            </main>
            <Footer />
            <Mascot />
            <ChatElements /> {/* Use the imported component */}
            <Toaster />
          </ChatProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
