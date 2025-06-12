
'use server';
/**
 * @fileOverview A Genkit flow for Lace, the AI chat assistant on WorldAIpedia.
 *
 * - chatWithLace - A function that takes user input (text and optional image) and returns an AI response.
 * - LaceChatInput - The input type for the chatWithLace function.
 * - LaceChatOutput - The return type for the chatWithLace function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { aiTools, categories } from '@/data/ai-tools'; 
import type { LanguageCode } from '@/lib/translations';


const toolsSummary = aiTools.map(tool => {
  const title = (typeof tool.title === 'object' ? tool.title.en : tool.title) || tool.id;
  return `- ${title} (Category: ${tool.category})`;
}).join('\\n');

const categoriesSummary = categories.map(cat => {
  const name = (typeof cat.name === 'object' ? cat.name.en : cat.name) || cat.slug;
  return `- ${name}`;
}).join('\\n');


const LaceChatInputSchema = z.object({
  userInput: z.string().describe('The message sent by the user.'),
  language: z.string().describe('The language code (e.g., "en", "es") for the conversation.'),
  history: z.array(z.object({role: z.enum(['user', 'model']), parts: z.array(z.object({text: z.string().optional(), media: z.object({url: z.string()}).optional()}))})).optional().describe('The conversation history. User messages can include text and/or media. Model messages only include text.'),
  imageDataUri: z.string().optional().describe("An optional image provided by the user, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type LaceChatInput = z.infer<typeof LaceChatInputSchema>;

const LaceChatOutputSchema = z.object({
  aiResponse: z.string().describe('Lace\'s response to the user, in the specified language.'),
});
export type LaceChatOutput = z.infer<typeof LaceChatOutputSchema>;

export async function chatWithLace(input: LaceChatInput): Promise<LaceChatOutput> {
  return laceChatContinuationFlow(input);
}

const lacePrompt = ai.definePrompt({
  name: 'laceChatPrompt', // Renamed
  input: { schema: LaceChatInputSchema },
  output: { schema: LaceChatOutputSchema },
  prompt: `You are Lace, a friendly, knowledgeable, and highly capable AI assistant for WorldAIpedia, a website dedicated to discovering and learning about AI tools. You also function as a general-purpose AI assistant, much like ChatGPT.
The user is conversing in language: {{{language}}}. Please respond comprehensively and naturally in this language.
Your primary goal is to be helpful, engaging, and provide accurate information or creative solutions.

If the user provides an image, analyze it and incorporate your understanding of the image into your response.
{{#if imageDataUri}}
User has provided this image: {{media url=imageDataUri}}
{{/if}}

If the user asks about specific AI tools or how to find them on WorldAIpedia, you can refer to the following list of tools and categories available on the site. Encourage them to browse the site for more details.

Available AI Tool Categories on WorldAIpedia:
{{{categoriesSummary}}}

Available AI Tools on WorldAIpedia (summary):
{{{toolsSummary}}}

---
{{#if history}}
Conversation History (respect this context and language):
{{#each history}}
  {{#if (eq role "user")}}User: {{#if parts.[0].text}}{{parts.[0].text}}{{/if}}{{#if parts.[0].media}} [User sent an image]{{/if}}{{/if}}
  {{#if (eq role "model")}}Lace: {{parts.[0].text}}{{/if}}
{{/each}}
{{/if}}

Current user query: "{{userInput}}"

Your Responsibilities:
1.  **Be Conversational & Comprehensive**: Respond like a top-tier AI (e.g., GPT-4). Provide detailed explanations, creative ideas, and thorough answers.
2.  **WorldAIpedia Guide**: If relevant, guide users on how to find AI tools on WorldAIpedia, mention categories, or specific tools.
3.  **General AI Assistant**: For general queries not related to WorldAIpedia, act as a versatile AI assistant. You can help with writing, brainstorming, problem-solving, explaining concepts, etc.
4.  **Image Understanding**: If an image is provided with the current query, describe it or use it as context for your response.
5.  **Provide Links (When Sensible)**: If you mention specific external resources, tools, or concepts where a direct link would be helpful and you can reasonably infer one (e.g. a very well-known site for a tool), you may suggest the user search for it or provide a general link if appropriate. Do not invent URLs.
6.  **Maintain Context**: Refer to the conversation history to provide relevant and non-repetitive responses. Do NOT greet the user again if there is conversation history.
7.  **Language**: Strictly respond in the user's specified language: {{{language}}}.
8.  **Tone**: Maintain a positive, helpful, and engaging tone. Avoid making up information. If you don't know, say so.

Respond to "{{userInput}}" now.
`,
});

const laceChatContinuationFlow = ai.defineFlow(
  {
    name: 'laceChatContinuationFlow', // Renamed
    inputSchema: LaceChatInputSchema,
    outputSchema: LaceChatOutputSchema,
  },
  async (input) => {
    const promptInput = {
      ...input,
      toolsSummary,
      categoriesSummary,
    };
    const { output } = await lacePrompt(promptInput);
    return output!;
  }
);

    