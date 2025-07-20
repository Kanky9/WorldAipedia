
'use client'; // This directive marks the entire layout as a Client Component

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
import WelcomeDialog from '@/components/layout/WelcomeDialog';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';


// Note: Metadata export is not supported in Client Components. 
// For SEO, this would typically be moved to a parent server component or configured differently.
// However, for application functionality, this change is necessary.
/*
export const metadata: Metadata = {
  title: 'World AI - Your Guide to Artificial Intelligence',
  description: 'Discover news and information about existing and emerging AI tools, categorized for easy exploration.',
};
*/

const initialPayPalOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    "enable-funding": "card",
    "disable-funding": "venmo",
    "data-sdk-integration-source": "integrationbuilder_ac",
    currency: "USD",
    intent: "subscription",
    "vault": true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">{/* Sets dark theme as default */}
      <head>
        <title>World AI - Your Guide to Artificial Intelligence</title>
        <meta name="description" content="Discover news and information about existing and emerging AI tools, categorized for easy exploration." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <PayPalScriptProvider options={initialPayPalOptions}>
            <LanguageProvider>
              <AuthProvider>
                <ChatProvider>
                  <Header />
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
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
