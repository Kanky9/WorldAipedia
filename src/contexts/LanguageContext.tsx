
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useMemo } from 'react';
import { translations, type LanguageCode, type Translations } from '@/lib/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: keyof Translations[LanguageCode], fallback?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: keyof Translations[LanguageCode], fallback?: string): string => {
    const langTranslations = translations[language] as Translations[LanguageCode];
    const translation = langTranslations[key];
    if (typeof translation === 'string') {
      return translation;
    }
    if (fallback) return fallback;
    // Fallback to English if translation not found and no specific fallback provided
    if (language !== 'en') {
      const enTranslation = translations.en[key];
      if (typeof enTranslation === 'string') return enTranslation;
    }
    return String(key); // Return key if no translation found anywhere
  };
  

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
