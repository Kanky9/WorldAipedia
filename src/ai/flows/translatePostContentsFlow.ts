
'use server';
/**
 * @fileOverview A flow to translate post content (title, short description, long description) to a target language using the LibreTranslate API.
 *
 * - translatePostContents - Translates given text fields to a specified language.
 * - TranslatePostContentsInput - Input type.
 * - TranslatePostContentsOutput - Output type.
 */

import { z } from 'zod';
import type { LanguageCode } from '@/lib/translations';

// Defines the structure of texts to be translated, allowing for optional fields
const TextsToTranslateSchema = z.object({
  title: z.string().optional().describe('The title to translate.'),
  shortDescription: z.string().optional().describe('The short description to translate.'),
  longDescription: z.string().optional().describe('The long description (content) to translate.'),
}).describe('An object containing text fields to be translated. All fields are optional.');

// Zod schema for input - used for type inference
const TranslatePostContentsInputSchema = z.object({
  textsToTranslate: TextsToTranslateSchema,
  targetLanguageCode: z.string().describe('The ISO 639-1 code of the language to translate to (e.g., "es", "fr", "ja").'),
  sourceLanguageCode: z.string().describe('The ISO 639-1 code of the source language of the texts (e.g., "en", "es").'),
});
export type TranslatePostContentsInput = z.infer<typeof TranslatePostContentsInputSchema>;

// Zod schema for output - used for type inference
const TranslatePostContentsOutputSchema = z.object({
  translatedTexts: TextsToTranslateSchema.describe('An object containing the translated text fields.'),
});
export type TranslatePostContentsOutput = z.infer<typeof TranslatePostContentsOutputSchema>;

export async function translatePostContents(input: TranslatePostContentsInput): Promise<TranslatePostContentsOutput> {
  const { textsToTranslate, sourceLanguageCode, targetLanguageCode } = input;

  // Filter out empty or nullish values and keep track of the keys
  const keysToTranslate = (Object.keys(textsToTranslate) as (keyof typeof textsToTranslate)[]).filter(
    key => textsToTranslate[key] && textsToTranslate[key]!.trim() !== ''
  );
  
  const valuesToTranslate = keysToTranslate.map(key => textsToTranslate[key]!);

  if (valuesToTranslate.length === 0) {
    return { translatedTexts: {} };
  }

  try {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      body: JSON.stringify({
        q: valuesToTranslate,
        source: sourceLanguageCode,
        target: targetLanguageCode,
        format: "text",
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`LibreTranslate API error (${res.status}): ${errorBody}`);
      // On failure, return an empty object to avoid breaking the client
      return { translatedTexts: {} };
    }

    const responseData = await res.json();
    
    // Correctly parse the response from LibreTranslate
    // It returns an array of objects like [{ translatedText: "..." }], not a single object.
    if (!Array.isArray(responseData)) {
      console.error('Unexpected response format from LibreTranslate API. Expected an array.', responseData);
      return { translatedTexts: {} };
    }
    
    const translatedValues: string[] = (responseData as Array<{ translatedText: string }>).map(
      item => item.translatedText
    );


    if (!translatedValues || translatedValues.length !== keysToTranslate.length) {
      console.error('Mismatched translation results from LibreTranslate API.');
      return { translatedTexts: {} };
    }

    const translatedTexts: Partial<Record<keyof typeof textsToTranslate, string>> = {};
    keysToTranslate.forEach((key, index) => {
      translatedTexts[key] = translatedValues[index];
    });

    return { translatedTexts: translatedTexts as any };

  } catch (error) {
    console.error("Error calling LibreTranslate API:", error);
    // On failure, return an empty object to prevent breaking the client
    return { translatedTexts: {} };
  }
}
