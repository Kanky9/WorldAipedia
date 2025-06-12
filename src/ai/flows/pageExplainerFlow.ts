
'use server';
/**
 * @fileOverview A Genkit flow to provide a welcome message and explanation for WorldAIpedia.
 *
 * - explainPage - A function that returns a greeting and brief explanation of the site in the specified language.
 * - PageExplainerInput - Input type for explainPage.
 * - PageExplainerOutput - The return type for the explainPage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { LanguageCode } from '@/lib/translations';

const PageExplainerInputSchema = z.object({
  language: z.string().describe('The language code (e.g., "en", "es") for the response.'),
});
export type PageExplainerInput = z.infer<typeof PageExplainerInputSchema>;

const PageExplainerOutputSchema = z.object({
  explanation: z.string().describe('A welcoming message that briefly explains what WorldAIpedia is about, in the specified language.'),
});
export type PageExplainerOutput = z.infer<typeof PageExplainerOutputSchema>;

export async function explainPage(input: PageExplainerInput): Promise<PageExplainerOutput> {
  return pageExplainerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pageExplainerPrompt',
  input: { schema: PageExplainerInputSchema },
  output: { schema: PageExplainerOutputSchema },
  prompt: `You are a friendly and helpful AI assistant for a website called WorldAIpedia.
Your goal is to greet the user and provide a very brief, welcoming explanation of what WorldAIpedia is.
WorldAIpedia is a site where users can discover, explore, and learn about various AI tools, neatly categorized.
Respond in the language specified by the language code: {{{language}}}.
Keep your response concise, warm, and inviting. Start with a friendly greeting.
For example, if language is "en": "Hello! Welcome to WorldAIpedia, your guide to discovering the amazing world of AI tools. Explore different categories to find the perfect AI for your needs!"
If language is "es": "¡Hola! Bienvenido/a a WorldAIpedia, tu guía para descubrir el increíble mundo de las herramientas de IA. ¡Explora diferentes categorías para encontrar la IA perfecta para tus necesidades!"
Provide only the explanation text.`,
});

const pageExplainerFlow = ai.defineFlow(
  {
    name: 'pageExplainerFlow',
    inputSchema: PageExplainerInputSchema,
    outputSchema: PageExplainerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
