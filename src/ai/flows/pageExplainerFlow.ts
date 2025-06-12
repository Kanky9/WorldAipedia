'use server';
/**
 * @fileOverview A Genkit flow to provide a welcome message and explanation for WorldAIpedia.
 *
 * - explainPage - A function that returns a greeting and brief explanation of the site.
 * - PageExplainerOutput - The return type for the explainPage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PageExplainerOutputSchema = z.object({
  explanation: z.string().describe('A welcoming message that briefly explains what WorldAIpedia is about.'),
});
export type PageExplainerOutput = z.infer<typeof PageExplainerOutputSchema>;

export async function explainPage(): Promise<PageExplainerOutput> {
  return pageExplainerFlow({});
}

const prompt = ai.definePrompt({
  name: 'pageExplainerPrompt',
  output: { schema: PageExplainerOutputSchema },
  prompt: `You are a friendly and helpful AI assistant for a website called WorldAIpedia.
Your goal is to greet the user and provide a very brief, welcoming explanation of what WorldAIpedia is.
WorldAIpedia is a site where users can discover, explore, and learn about various AI tools, neatly categorized.
Keep your response concise, warm, and inviting. Start with a friendly greeting.
For example: "Hello! Welcome to WorldAIpedia, your guide to discovering the amazing world of AI tools. Explore different categories to find the perfect AI for your needs!"
`,
});

const pageExplainerFlow = ai.defineFlow(
  {
    name: 'pageExplainerFlow',
    outputSchema: PageExplainerOutputSchema,
  },
  async () => {
    const { output } = await prompt({});
    return output!;
  }
);
