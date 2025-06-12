
'use server';
/**
 * @fileOverview A Genkit flow to provide a welcome message for a specific AI tool page.
 *
 * - getAiToolWelcome - Generates a welcome message for a specific AI tool.
 * - AiToolWelcomeInput - Input type.
 * - AiToolWelcomeOutput - Output type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiToolWelcomeInputSchema = z.object({
  toolTitle: z.string().describe('The title of the AI tool the user is viewing.'),
  toolDescription: z.string().describe('A short description of what the AI tool does.'),
  toolLink: z.string().describe('The website link for the AI tool.'),
  language: z.string().describe('The language code (e.g., "en", "es") for the response.'),
});
export type AiToolWelcomeInput = z.infer<typeof AiToolWelcomeInputSchema>;

const AiToolWelcomeOutputSchema = z.object({
  welcomeMessage: z.string().describe('A personalized welcome message from Lace about the AI tool, in the specified language.'),
});
export type AiToolWelcomeOutput = z.infer<typeof AiToolWelcomeOutputSchema>;

export async function getAiToolWelcome(input: AiToolWelcomeInput): Promise<AiToolWelcomeOutput> {
  return aiToolWelcomeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiToolWelcomePrompt',
  input: { schema: AiToolWelcomeInputSchema },
  output: { schema: AiToolWelcomeOutputSchema },
  prompt: `You are Lace, a friendly AI assistant for World AI.
The user has just opened the chat while viewing the page for an AI tool called "{{toolTitle}}".
This tool is described as: "{{toolDescription}}".
Its website is: {{toolLink}}.

Your task is to provide a brief, welcoming message.
1. Acknowledge the AI tool they are viewing ({{toolTitle}}).
2. Briefly mention its purpose based on "{{toolDescription}}".
3. Invite them to visit its website (you can mention the link: {{toolLink}} but do not use markdown for the link, just state it).
4. Ask if they have any questions about this tool or anything else on World AI, or if they'd like general assistance.
Respond in the language specified by the language code: {{{language}}}.
Keep it concise and friendly. Use a conversational tone.
For example, if language is "en" and tool is "CoolWriter" (website coolwriter.com): "Hi there! I see you're checking out CoolWriter. It's a neat tool for helping with creative writing. You can find out more at its website, coolwriter.com. Do you have any questions about CoolWriter, or is there anything else I can help you with today?"
For example, if language is "es" and tool is "CoolWriter" (website coolwriter.com): "¡Hola! Veo que estás viendo CoolWriter. Es una herramienta genial para ayudar con la escritura creativa. Puedes encontrar más información en su sitio web, coolwriter.com. ¿Tienes alguna pregunta sobre CoolWriter o hay algo más en lo que pueda ayudarte hoy?"
`,
});

const aiToolWelcomeFlow = ai.defineFlow(
  {
    name: 'aiToolWelcomeFlow',
    inputSchema: AiToolWelcomeInputSchema,
    outputSchema: AiToolWelcomeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
