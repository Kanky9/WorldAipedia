
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useMemo, useCallback } from 'react';
import { translations, type LanguageCode, type CoreTranslationKey, type TranslationSet } from '@/lib/translations';
import type { LocalizedString } from '@/lib/types';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  // Updated t function to handle both CoreTranslationKey and LocalizedString
  t: (input: CoreTranslationKey | LocalizedString, fallback?: string, interpolations?: Record<string, string>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<LanguageCode>('es');

  const t = useCallback((input: CoreTranslationKey | LocalizedString, fallback?: string, interpolations: Record<string, string> = {}): string => {
    let translatedString: string | undefined;

    if (typeof input === 'string') { // CoreTranslationKey
      const langTranslations = translations[language] as TranslationSet;
      translatedString = langTranslations[input as CoreTranslationKey];
    } else if (typeof input === 'object' && input !== null) { // LocalizedString object
      translatedString = input[language] || input.en; // Fallback to English if current lang not present
    }

    if (typeof translatedString !== 'string') {
      if (fallback) {
        translatedString = fallback;
      } else if (typeof input === 'string' && language !== 'en') { // Fallback to English for CoreTranslationKey
        const enTranslation = translations.en[input as CoreTranslationKey];
        if (typeof enTranslation === 'string') translatedString = enTranslation;
      }
      if (typeof translatedString !== 'string') {
        translatedString = String(input); // Return key/object as string if no translation found anywhere
      }
    }
    
    // Perform interpolations
    if (interpolations) {
      Object.keys(interpolations).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'g');
        translatedString = translatedString!.replace(regex, interpolations[key]);
      });
    }

    return translatedString!;
  }, [language]);
  

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
