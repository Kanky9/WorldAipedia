'use server';
/**
 * @fileOverview A Genkit flow to translate post content (title, short description, long description) to a target language.
 *
 * - translatePostContents - Translates given text fields to a specified language.
 * - TranslatePostContentsInput - Input type.
 * - TranslatePostContentsOutput - Output type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { LanguageCode } from '@/lib/translations';

// Defines the structure of texts to be translated, allowing for optional fields
const TextsToTranslateSchema = z.object({
  title: z.string().optional().describe('The title to translate.'),
  shortDescription: z.string().optional().describe('The short description to translate.'),
  longDescription: z.string().optional().describe('The long description (content) to translate.'),
}).describe('An object containing text fields to be translated. All fields are optional.');

export const TranslatePostContentsInputSchema = z.object({
  textsToTranslate: TextsToTranslateSchema,
  targetLanguageCode: z.string().describe('The ISO 639-1 code of the language to translate to (e.g., "es", "fr", "ja").'),
  sourceLanguageCode: z.string().describe('The ISO 639-1 code of the source language of the texts (e.g., "en", "es").'),
});
export type TranslatePostContentsInput = z.infer<typeof TranslatePostContentsInputSchema>;

export const TranslatePostContentsOutputSchema = z.object({
  translatedTexts: TextsToTranslateSchema.describe('An object containing the translated text fields.'),
});
export type TranslatePostContentsOutput = z.infer<typeof TranslatePostContentsOutputSchema>;

export async function translatePostContents(input: TranslatePostContentsInput): Promise<TranslatePostContentsOutput> {
  return translatePostContentsFlow(input);
}

const systemPrompt = `You are an expert multilingual translator. Your task is to translate the provided text fields (title, shortDescription, longDescription) from the source language ({{{sourceLanguageCode}}}) to the target language ({{{targetLanguageCode}}}).

Ensure the translations are accurate, natural-sounding, and maintain the original meaning and tone of each field.
If a field is not provided in the input, do not include it in the output.
Respond ONLY with a JSON object matching the output schema, containing the translated texts. Do not add any explanations or conversational fluff.
Example for translating "title": "Hello World" and "shortDescription": "My first post" from "en" to "es":
Output: { "translatedTexts": { "title": "Hola Mundo", "shortDescription": "Mi primera publicación" } }
If only "title": "Hello" is provided for translation from "en" to "es":
Output: { "translatedTexts": { "title": "Hola" } }

Do not invent translations for fields not provided.
The JSON output should strictly adhere to the schema: { "translatedTexts": { "title": "...", "shortDescription": "...", "longDescription": "..." } } where each field is optional.
`;

const userPromptTemplate = `
Please translate the following texts from {{sourceLanguageCode}} to {{targetLanguageCode}}:
{{#if textsToTranslate.title}}
Title:
\`\`\`text
{{{textsToTranslate.title}}}
\`\`\`
{{/if}}

{{#if textsToTranslate.shortDescription}}
Short Description:
\`\`\`text
{{{textsToTranslate.shortDescription}}}
\`\`\`
{{/if}}

{{#if textsToTranslate.longDescription}}
Long Description:
\`\`\`text
{{{textsToTranslate.longDescription}}}
\`\`\`
{{/if}}
`;

const translationPrompt = ai.definePrompt({
  name: 'translatePostContentsPrompt',
  input: { schema: TranslatePostContentsInputSchema },
  output: { schema: TranslatePostContentsOutputSchema },
  system: systemPrompt,
  prompt: userPromptTemplate,
  config: {
    temperature: 0.3, // Lower temperature for more deterministic translations
  }
});

const translatePostContentsFlow = ai.defineFlow(
  {
    name: 'translatePostContentsFlow',
    inputSchema: TranslatePostContentsInputSchema,
    outputSchema: TranslatePostContentsOutputSchema,
  },
  async (input: TranslatePostContentsInput) => {
    // Filter out empty or undefined texts before sending to the prompt
    const textsToActuallyTranslate: Record<string, string> = {};
    if (input.textsToTranslate.title && input.textsToTranslate.title.trim() !== '') {
      textsToActuallyTranslate.title = input.textsToTranslate.title;
    }
    if (input.textsToTranslate.shortDescription && input.textsToTranslate.shortDescription.trim() !== '') {
      textsToActuallyTranslate.shortDescription = input.textsToTranslate.shortDescription;
    }
    if (input.textsToTranslate.longDescription && input.textsToTranslate.longDescription.trim() !== '') {
      textsToActuallyTranslate.longDescription = input.textsToTranslate.longDescription;
    }

    if (Object.keys(textsToActuallyTranslate).length === 0) {
      return { translatedTexts: {} }; // No actual text to translate
    }
    
    const promptInput = {
        ...input,
        textsToTranslate: textsToActuallyTranslate
    };

    const { output } = await translationPrompt(promptInput);
    
    // Ensure output is not null and has the translatedTexts property
    if (!output || !output.translatedTexts) {
        console.error('Translation prompt returned invalid output:', output);
        // Return empty translations for fields that were supposed to be translated,
        // or re-construct based on input if some but not all failed.
        // For simplicity, if the whole structure is missing, return empty.
        return { translatedTexts: {} };
    }
    return output;
  }
);
