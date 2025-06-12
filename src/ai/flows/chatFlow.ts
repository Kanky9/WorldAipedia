
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
import { aiTools, categories } from '@/data/ai-tools'; // Import AI tools data
import type { LanguageCode } from '@/lib/translations';

// Prepare a summary of AI tools for the prompt
// This is a simplified version. For many tools, you might need a more sophisticated way
// to manage context window size, perhaps by using a RAG pattern or more selective inclusion.
const toolsSummary = aiTools.map(tool => {
  // For simplicity, we're assuming 'title' is an object with language keys
  // and we'll use English as a fallback for the summary.
  const title = (typeof tool.title === 'object' ? tool.title.en : tool.title) || tool.id;
  return `- ${title} (Category: ${tool.category})`;
}).join('\\n');

const categoriesSummary = categories.map(cat => {
  const name = (typeof cat.name === 'object' ? cat.name.en : cat.name) || cat.slug;
  return `- ${name}`;
}).join('\\n');


const ChatInputSchema = z.object({
  userInput: z.string().describe('The message sent by the user.'),
  language: z.string().describe('The language code (e.g., "en", "es") for the conversation.'),
  history: z.array(z.object({role: z.enum(['user', 'model']), parts: z.array(z.object({text: z.string()}))})).optional().describe('The conversation history.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  aiResponse: z.string().describe('The AI assistant\'s response to the user, in the specified language.'),
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
The user is conversing in language: {{{language}}}. Please respond in this language.
Do NOT greet the user again if there is conversation history. Continue the conversation naturally.
If the user asks about specific AI tools or how to find them, you can refer to the following list of tools available on the site.
You can also mention their categories. Encourage them to browse the categories on the site for more details.

Available AI Tool Categories:
{{{categoriesSummary}}}

Available AI Tools (summary):
{{{toolsSummary}}}

---
{{#if history}}
Conversation History:
{{#each history}}
  {{#if (eq role "user")}}User: {{parts.[0].text}}{{/if}}
  {{#if (eq role "model")}}AI: {{parts.[0].text}}{{/if}}
{{/each}}
{{/if}}

Current user query: "{{userInput}}"

Respond helpfully and concisely in {{{language}}}. Maintain a positive and engaging tone. Avoid making up information if you don't know the answer.
If asked about a specific tool, you can mention its category and suggest exploring the site for more details.
Do not list all tools unless specifically asked for a general overview.
Focus on answering the current user query based on the provided context and history.
`,
});

const chatContinuationFlow = ai.defineFlow(
  {
    name: 'chatContinuationFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    // Construct the prompt input, including the summaries
    const promptInput = {
      ...input,
      toolsSummary,
      categoriesSummary,
    };
    const { output } = await prompt(promptInput);
    return output!;
  }
);
