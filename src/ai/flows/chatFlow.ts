'use server';
/**
 * @fileOverview A Genkit flow for handling chat conversations on WorldAIpedia.
 *
 * - chatWithAI - A function that takes user input and returns an AI response.
 * - ChatInput - The input type for the chatWithAI function.
 * - ChatOutput - The return type for the chatWithAI function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatInputSchema = z.object({
  userInput: z.string().describe('The message sent by the user.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  aiResponse: z.string().describe('The AI assistant\'s response to the user.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chatWithAI(input: ChatInput): Promise<ChatOutput> {
  return chatContinuationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'worldAIpediaChatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are a friendly and helpful AI assistant for WorldAIpedia, a website where users discover and learn about AI tools.
The user has said: "{{userInput}}"
Respond helpfully and concisely. If the user asks about specific AI tools or how to find them, encourage them to browse the categories on the site.
Maintain a positive and engaging tone. Avoid making up information if you don't know the answer.
`,
});

const chatContinuationFlow = ai.defineFlow(
  {
    name: 'chatContinuationFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
