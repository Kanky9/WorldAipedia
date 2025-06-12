import type { AITool, Category } from '@/lib/types';

export const categories: Category[] = [
  { name: 'Information', slug: 'information', iconName: 'FileText', description: 'AI tools for finding and processing information.' },
  { name: 'Design', slug: 'design', iconName: 'Palette', description: 'AI tools for creative design and visual content.' },
  { name: 'Programming', slug: 'programming', iconName: 'Code2', description: 'AI tools to assist in software development.' },
  { name: 'Photos', slug: 'photos', iconName: 'Image', description: 'AI tools for generating and editing images.' },
  { name: 'Videos', slug: 'videos', iconName: 'Film', description: 'AI tools for creating and editing video content.' },
  { name: 'Audio', slug: 'audio', iconName: 'AudioWaveform', description: 'AI tools for generating and editing audio.' },
  { name: 'Writing', slug: 'writing', iconName: 'PenTool', description: 'AI tools for content creation and writing assistance.' },
];

export const aiTools: AITool[] = [
  {
    id: 'chatgpt',
    title: 'ChatGPT',
    shortDescription: 'A powerful conversational AI by OpenAI.',
    longDescription: 'ChatGPT is a large language model developed by OpenAI, known for its ability to generate human-like text, answer questions, write code, and much more. It is built upon the GPT (Generative Pre-trained Transformer) architecture.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI conversation',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'OpenAI logo',
    category: 'Information',
    link: 'https://openai.com/chatgpt',
  },
  {
    id: 'midjourney',
    title: 'Midjourney',
    shortDescription: 'An independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species.',
    longDescription: 'Midjourney generates images from natural language descriptions, called "prompts", similar to OpenAI\'s DALL-E and Stable Diffusion. It is known for its artistic and high-quality image outputs.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'artistic generation',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Midjourney ship',
    category: 'Photos',
    link: 'https://www.midjourney.com/',
  },
  {
    id: 'github-copilot',
    title: 'GitHub Copilot',
    shortDescription: 'Your AI pair programmer.',
    longDescription: 'GitHub Copilot is an AI pair programmer that helps you write code faster and with less work. It draws context from comments and code to suggest individual lines and whole functions instantly.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'code editor',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Copilot icon',
    category: 'Programming',
    link: 'https://copilot.github.com/',
  },
  {
    id: 'canva-magic-design',
    title: 'Canva Magic Design',
    shortDescription: 'AI-powered design tool within Canva.',
    longDescription: 'Canva\'s Magic Design features use AI to help you create stunning designs, presentations, and videos quickly. Generate designs from text prompts, or let AI enhance your existing creations.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'design interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Canva logo',
    category: 'Design',
    link: 'https://www.canva.com/magic-design/',
  },
  {
    id: 'synthesia',
    title: 'Synthesia',
    shortDescription: 'AI video generation platform.',
    longDescription: 'Synthesia allows you to create professional videos with AI avatars and voiceovers in minutes. Simply type your script, choose an avatar, and generate your video in multiple languages.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI avatar',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Synthesia S',
    category: 'Videos',
    link: 'https://www.synthesia.io/',
  },
  {
    id: 'elevenlabs',
    title: 'ElevenLabs',
    shortDescription: 'AI voice synthesis and text-to-speech.',
    longDescription: 'ElevenLabs provides cutting-edge text-to-speech and voice cloning technology. Generate realistic and expressive audio in various languages and voices for your projects.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'sound waves',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'ElevenLabs E',
    category: 'Audio',
    link: 'https://elevenlabs.io/',
  },
  {
    id: 'grammarly',
    title: 'Grammarly',
    shortDescription: 'AI-powered writing assistant.',
    longDescription: 'Grammarly helps you communicate more effectively. Beyond grammar and spelling, Grammarly\'s AI-powered suggestions help with clarity, conciseness, tone, and more, ensuring your writing is polished and impactful.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'text correction',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Grammarly G',
    category: 'Writing',
    link: 'https://www.grammarly.com/',
  },
  {
    id: 'stable-diffusion',
    title: 'Stable Diffusion',
    shortDescription: 'A deep learning, text-to-image model.',
    longDescription: 'Stable Diffusion is a latent text-to-image diffusion model capable of generating photo-realistic images given any text input. It is open-source and widely used for various image generation tasks.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'generative art',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'StabilityAI logo',
    category: 'Photos',
    link: 'https://stablediffusion.com/',
  }
];

export const getAiToolById = (id: string): AITool | undefined => {
  return aiTools.find(tool => tool.id === id);
};

export const getAiToolsByCategory = (categorySlug: string): AITool[] => {
  const category = categories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  return aiTools.filter(tool => tool.category === category.name);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(cat => cat.slug === slug);
};
