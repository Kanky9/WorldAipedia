
import type { AITool, Category, LocalizedString } from '@/lib/types';

// Helper function to create LocalizedString for titles, descriptions, etc.
const LS = (en: string, es: string, it?: string, zh?: string, ja?: string, pt?: string): LocalizedString => ({
  en,
  es,
  it: it || en, // Fallback to English if not provided
  zh: zh || en,
  ja: ja || en,
  pt: pt || en,
});

export const categories: Category[] = [
  {
    name: LS('Information', 'Información', 'Informazione', '信息', '情報', 'Informação'),
    slug: 'information',
    iconName: 'FileText',
    description: LS(
      'AI tools for finding and processing information.',
      'Herramientas de IA para encontrar y procesar información.',
      'Strumenti IA per trovare ed elaborare informazioni.',
      '用于查找和处理信息的人工智能工具。',
      '情報を見つけて処理するためのAIツール。',
      'Ferramentas de IA para encontrar e processar informações.'
    )
  },
  {
    name: LS('Design', 'Diseño', 'Design', '设计', 'デザイン', 'Design'),
    slug: 'design',
    iconName: 'Palette',
    description: LS(
      'AI tools for creative design and visual content.',
      'Herramientas de IA para diseño creativo y contenido visual.',
      'Strumenti IA per design creativo e contenuti visivi.',
      '用于创意设计和视觉内容的人工智能工具。',
      'クリエイティブなデザインとビジュアルコンテンツのためのAIツール。',
      'Ferramentas de IA para design criativo e conteúdo visual.'
    )
  },
  {
    name: LS('Programming', 'Programación', 'Programmazione', '编程', 'プログラミング', 'Programação'),
    slug: 'programming',
    iconName: 'Code2',
    description: LS(
      'AI tools to assist in software development.',
      'Herramientas de IA para asistir en el desarrollo de software.',
      'Strumenti IA di assistenza allo sviluppo software.',
      '协助软件开发的人工智能工具。',
      'ソフトウェア開発を支援するAIツール。',
      'Ferramentas de IA para auxiliar no desenvolvimento de software.'
    )
  },
  {
    name: LS('Photos', 'Fotos', 'Foto', '照片', '写真', 'Fotos'),
    slug: 'photos',
    iconName: 'Image',
    description: LS(
      'AI tools for generating and editing images.',
      'Herramientas de IA para generar y editar imágenes.',
      'Strumenti IA per generare e modificare immagini.',
      '用于生成和编辑图像的人工智能工具。',
      '画像を生成および編集するためのAIツール。',
      'Ferramentas de IA para gerar e editar imagens.'
    )
  },
  {
    name: LS('Videos', 'Videos', 'Video', '视频', 'ビデオ', 'Vídeos'),
    slug: 'videos',
    iconName: 'Film',
    description: LS(
      'AI tools for creating and editing video content.',
      'Herramientas de IA para crear y editar contenido de video.',
      'Strumenti IA per creare e modificare contenuti video.',
      '用于创建和编辑视频内容的人工智能工具。',
      'ビデオコンテンツを作成および編集するためのAIツール。',
      'Ferramentas de IA para criar e editar conteúdo de vídeo.'
    )
  },
  {
    name: LS('Audio', 'Audio', 'Audio', '音频', 'オーディオ', 'Áudio'),
    slug: 'audio',
    iconName: 'AudioWaveform',
    description: LS(
      'AI tools for generating and editing audio.',
      'Herramientas de IA para generar y editar audio.',
      'Strumenti IA per generare e modificare audio.',
      '用于生成和编辑音频的人工智能工具。',
      'オーディオを生成および編集するためのAIツール。',
      'Ferramentas de IA para gerar e editar áudio.'
    )
  },
  {
    name: LS('Writing', 'Escritura', 'Scrittura', '写作', 'ライティング', 'Escrita'),
    slug: 'writing',
    iconName: 'PenTool',
    description: LS(
      'AI tools for content creation and writing assistance.',
      'Herramientas de IA para creación de contenido y asistencia en escritura.',
      'Strumenti IA per la creazione di contenuti e assistenza alla scrittura.',
      '用于内容创作和写作辅助的人工智能工具。',
      'コンテンツ作成とライティング支援のためのAIツール。',
      'Ferramentas de IA para criação de conteúdo e assistência à escrita.'
    )
  },
];

export const aiTools: AITool[] = [
  {
    id: 'chatgpt',
    title: LS('ChatGPT', 'ChatGPT'),
    shortDescription: LS(
      'A powerful conversational AI by OpenAI.',
      'Una potente IA conversacional de OpenAI.'
    ),
    longDescription: LS(
      'ChatGPT is a large language model developed by OpenAI, known for its ability to generate human-like text, answer questions, write code, and much more. It is built upon the GPT (Generative Pre-trained Transformer) architecture.',
      'ChatGPT es un modelo de lenguaje grande desarrollado por OpenAI, conocido por su capacidad para generar texto similar al humano, responder preguntas, escribir código y mucho más. Está construido sobre la arquitectura GPT (Transformador Generativo Preentrenado).'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI conversation',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'OpenAI logo',
    category: 'Information', // Refers to the English name of category, which is then localized via categories array
    categorySlug: 'information',
    link: 'https://openai.com/chatgpt',
  },
  {
    id: 'midjourney',
    title: LS('Midjourney', 'Midjourney'),
    shortDescription: LS(
      'AI image generation from text prompts with an artistic focus.',
      'Generación de imágenes AI a partir de prompts de texto con enfoque artístico.'
    ),
    longDescription: LS(
      'Midjourney generates images from natural language descriptions, called "prompts", similar to OpenAI\'s DALL-E and Stable Diffusion. It is known for its artistic and high-quality image outputs.',
      'Midjourney genera imágenes a partir de descripciones en lenguaje natural, llamadas "prompts", similar a DALL-E de OpenAI y Stable Diffusion. Es conocido por sus resultados de imágenes artísticas y de alta calidad.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'artistic generation',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Midjourney ship',
    category: 'Photos',
    categorySlug: 'photos',
    link: 'https://www.midjourney.com/',
  },
  {
    id: 'github-copilot',
    title: LS('GitHub Copilot', 'GitHub Copilot'),
    shortDescription: LS(
      'Your AI pair programmer for faster coding.',
      'Tu programador de IA para codificar más rápido.'
    ),
    longDescription: LS(
      'GitHub Copilot is an AI pair programmer that helps you write code faster and with less work. It draws context from comments and code to suggest individual lines and whole functions instantly.',
      'GitHub Copilot es un programador de IA que te ayuda a escribir código más rápido y con menos trabajo. Extrae contexto de comentarios y código para sugerir líneas individuales y funciones completas al instante.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'code editor',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Copilot icon',
    category: 'Programming',
    categorySlug: 'programming',
    link: 'https://copilot.github.com/',
  },
  {
    id: 'canva-magic-design',
    title: LS('Canva Magic Design', 'Canva Diseño Mágico'),
    shortDescription: LS(
      'AI-powered design tool within Canva.',
      'Herramienta de diseño impulsada por IA dentro de Canva.'
    ),
    longDescription: LS(
      'Canva\'s Magic Design features use AI to help you create stunning designs, presentations, and videos quickly. Generate designs from text prompts, or let AI enhance your existing creations.',
      'Las funciones de Diseño Mágico de Canva utilizan IA para ayudarte a crear diseños, presentaciones y videos impresionantes rápidamente. Genera diseños a partir de prompts de texto o deja que la IA mejore tus creaciones existentes.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'design interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Canva logo',
    category: 'Design',
    categorySlug: 'design',
    link: 'https://www.canva.com/magic-design/',
  },
  {
    id: 'synthesia',
    title: LS('Synthesia', 'Synthesia'),
    shortDescription: LS(
      'AI video generation platform with avatars.',
      'Plataforma de generación de video AI con avatares.'
    ),
    longDescription: LS(
      'Synthesia allows you to create professional videos with AI avatars and voiceovers in minutes. Simply type your script, choose an avatar, and generate your video in multiple languages.',
      'Synthesia te permite crear videos profesionales con avatares y voces en off de IA en minutos. Simplemente escribe tu guion, elige un avatar y genera tu video en múltiples idiomas.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI avatar',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Synthesia S',
    category: 'Videos',
    categorySlug: 'videos',
    link: 'https://www.synthesia.io/',
  },
  {
    id: 'elevenlabs',
    title: LS('ElevenLabs', 'ElevenLabs'),
    shortDescription: LS(
      'AI voice synthesis and text-to-speech.',
      'Síntesis de voz AI y texto a voz.'
    ),
    longDescription: LS(
      'ElevenLabs provides cutting-edge text-to-speech and voice cloning technology. Generate realistic and expressive audio in various languages and voices for your projects.',
      'ElevenLabs proporciona tecnología de vanguardia de texto a voz y clonación de voz. Genera audio realista y expresivo en varios idiomas y voces para tus proyectos.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'sound waves',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'ElevenLabs E',
    category: 'Audio',
    categorySlug: 'audio',
    link: 'https://elevenlabs.io/',
  },
  {
    id: 'grammarly',
    title: LS('Grammarly', 'Grammarly'),
    shortDescription: LS(
      'AI-powered writing assistant for clarity and correctness.',
      'Asistente de escritura impulsado por IA para claridad y corrección.'
    ),
    longDescription: LS(
      'Grammarly helps you communicate more effectively. Beyond grammar and spelling, Grammarly\'s AI-powered suggestions help with clarity, conciseness, tone, and more, ensuring your writing is polished and impactful.',
      'Grammarly te ayuda a comunicarte de manera más efectiva. Más allá de la gramática y la ortografía, las sugerencias impulsadas por IA de Grammarly ayudan con la claridad, la concisión, el tono y más, asegurando que tu escritura sea pulida e impactante.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'text correction',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Grammarly G',
    category: 'Writing',
    categorySlug: 'writing',
    link: 'https://www.grammarly.com/',
  },
  {
    id: 'stable-diffusion',
    title: LS('Stable Diffusion', 'Stable Diffusion'),
    shortDescription: LS(
      'Open-source text-to-image generation model.',
      'Modelo de generación de texto a imagen de código abierto.'
    ),
    longDescription: LS(
      'Stable Diffusion is a latent text-to-image diffusion model capable of generating photo-realistic images given any text input. It is open-source and widely used for various image generation tasks.',
      'Stable Diffusion es un modelo de difusión latente de texto a imagen capaz de generar imágenes fotorrealistas a partir de cualquier entrada de texto. Es de código abierto y se utiliza ampliamente para diversas tareas de generación de imágenes.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'generative art',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'StabilityAI logo',
    category: 'Photos',
    categorySlug: 'photos',
    link: 'https://stablediffusion.com/',
  },
   {
    id: 'runwayml',
    title: LS('RunwayML', 'RunwayML'),
    shortDescription: LS('AI magic tools for video editing and content creation.', 'Herramientas mágicas de IA para edición de video y creación de contenido.'),
    longDescription: LS('RunwayML offers a suite of AI-powered tools for creators, including advanced video editing features like text-to-video, image-to-video, background removal, and generative art.', 'RunwayML ofrece un conjunto de herramientas impulsadas por IA para creadores, que incluyen funciones avanzadas de edición de video como texto a video, imagen a video, eliminación de fondo y arte generativo.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'video editing tools',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'RunwayML R',
    category: 'Videos',
    categorySlug: 'videos',
    link: 'https://runwayml.com/',
  },
  {
    id: 'jasper',
    title: LS('Jasper (formerly Jarvis)', 'Jasper (antes Jarvis)'),
    shortDescription: LS('AI writing assistant for marketing copy and content.', 'Asistente de escritura IA para textos de marketing y contenido.'),
    longDescription: LS('Jasper is an AI writing tool that helps you create high-quality content for blogs, social media, websites, and marketing campaigns. It uses advanced AI to generate creative and persuasive text.', 'Jasper es una herramienta de escritura IA que te ayuda a crear contenido de alta calidad para blogs, redes sociales, sitios web y campañas de marketing. Utiliza IA avanzada para generar texto creativo y persuasivo.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'marketing copy',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Jasper J',
    category: 'Writing',
    categorySlug: 'writing',
    link: 'https://www.jasper.ai/',
  },
  {
    id: 'otter-ai',
    title: LS('Otter.ai', 'Otter.ai'),
    shortDescription: LS('AI-powered transcription service for voice conversations.', 'Servicio de transcripción impulsado por IA para conversaciones de voz.'),
    longDescription: LS('Otter.ai provides real-time transcription for meetings, interviews, and lectures. It uses AI to generate rich notes with speaker identification, summaries, and keyword extraction.', 'Otter.ai proporciona transcripción en tiempo real para reuniones, entrevistas y conferencias. Utiliza IA para generar notas enriquecidas con identificación de hablantes, resúmenes y extracción de palabras clave.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'audio transcription',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Otter icon',
    category: 'Audio',
    categorySlug: 'audio',
    link: 'https://otter.ai/',
  },
  {
    id: 'deepl',
    title: LS('DeepL Translator', 'Traductor DeepL'),
    shortDescription: LS('High-quality AI-powered language translation.', 'Traducción de idiomas de alta calidad impulsada por IA.'),
    longDescription: LS('DeepL is renowned for its nuanced and accurate translations. It supports multiple languages and offers services for individuals and businesses, providing natural-sounding translations.', 'DeepL es reconocido por sus traducciones matizadas y precisas. Admite múltiples idiomas y ofrece servicios para particulares y empresas, proporcionando traducciones que suenan naturales.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'language globe',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'DeepL logo',
    category: 'Information',
    categorySlug: 'information',
    link: 'https://www.deepl.com/translator',
  },
  {
    id: 'dream-weaver',
    title: LS('Dream Weaver', 'Tejedor de Sueños'),
    shortDescription: LS(
      'Generates dream-like artistic visuals from your imagination.',
      'Genera visuales artísticos oníricos a partir de tu imaginación.'
    ),
    longDescription: LS(
      'Dream Weaver is an AI specialized in creating surreal and abstract art based on textual descriptions or even vague concepts. It excels at producing unique, dream-like imagery that can be used for inspiration, concept art, or purely aesthetic purposes. Its algorithms interpret emotional context and stylistic cues to deliver truly imaginative visuals.',
      'Dream Weaver es una IA especializada en crear arte surrealista y abstracto basado en descripciones textuales o incluso conceptos vagos. Sobresale en la producción de imágenes oníricas únicas que pueden usarse para inspiración, arte conceptual o fines puramente estéticos. Sus algoritmos interpretan el contexto emocional y las señales estilísticas para ofrecer visuales verdaderamente imaginativos.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'dreamlike art',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'spiral logo',
    category: 'Photos',
    categorySlug: 'photos',
    link: '#dream-weaver',
  },
  {
    id: 'codesynth',
    title: LS('CodeSynth', 'Sintetizador de Código'),
    shortDescription: LS(
      'AI assistant for refactoring and optimizing codebases.',
      'Asistente IA para refactorizar y optimizar bases de código.'
    ),
    longDescription: LS(
      'CodeSynth analyzes your existing code and suggests improvements for readability, performance, and maintainability. It can help automate parts of the refactoring process and identify potential bugs or inefficient patterns. Ideal for keeping large projects clean and efficient.',
      'CodeSynth analiza tu código existente y sugiere mejoras para la legibilidad, el rendimiento y la mantenibilidad. Puede ayudar a automatizar partes del proceso de refactorización e identificar posibles errores o patrones ineficientes. Ideal para mantener proyectos grandes limpios y eficientes.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'code abstract',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'gear logo',
    category: 'Programming',
    categorySlug: 'programming',
    link: '#codesynth',
  },
  {
    id: 'polyglot-reader',
    title: LS('Polyglot Reader', 'Lector Políglota'),
    shortDescription: LS(
      'Reads text aloud in multiple languages with natural intonation.',
      'Lee texto en voz alta en múltiples idiomas con entonación natural.'
    ),
    longDescription: LS(
      'Polyglot Reader uses advanced voice synthesis to provide natural-sounding audio for written text in a wide array of languages. It is perfect for language learners, accessibility, or simply listening to content on the go. It captures nuances in pronunciation and intonation for a pleasant listening experience.',
      'Lector Políglota utiliza síntesis de voz avanzada para proporcionar audio con sonido natural para texto escrito en una amplia gama de idiomas. Es perfecto para estudiantes de idiomas, accesibilidad o simplemente para escuchar contenido sobre la marcha. Captura matices en la pronunciación y entonación para una experiencia auditiva agradable.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'multilingual audio',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'speech bubble',
    category: 'Audio',
    categorySlug: 'audio',
    link: '#polyglot-reader',
  },
  {
    id: 'narrative-ai',
    title: LS('Narrative AI', 'IA Narrativa'),
    shortDescription: LS(
      'Helps craft compelling story outlines and character arcs.',
      'Ayuda a crear esquemas de historias y arcos de personajes convincentes.'
    ),
    longDescription: LS(
      'Narrative AI is a creative partner for writers, playwrights, and game developers. It assists in brainstorming plot points, developing complex characters, and structuring compelling narratives. Feed it your core ideas, and it can help you expand them into rich story worlds.',
      'IA Narrativa es un socio creativo para escritores, dramaturgos y desarrolladores de juegos. Ayuda en la lluvia de ideas de puntos de la trama, el desarrollo de personajes complejos y la estructuración de narrativas convincentes. Aliméntalo con tus ideas centrales y te ayudará a expandirlas en ricos mundos de historias.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'story manuscript',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'quill pen',
    category: 'Writing',
    categorySlug: 'writing',
    link: '#narrative-ai',
  },
  {
    id: 'vibe-editor',
    title: LS('Vibe Editor', 'Editor de Ambiente'),
    shortDescription: LS(
      'Automatically edits video clips to match a music track\'s mood.',
      'Edita automáticamente videoclips para que coincidan con el ambiente de una pista de música.'
    ),
    longDescription: LS(
      'Vibe Editor analyzes the tempo, energy, and mood of a selected music track and intelligently cuts and arranges your video footage to match. It can create dynamic montages or emotionally resonant sequences, saving hours of manual editing. Perfect for social media content, music videos, or personal projects.',
      'Editor de Ambiente analiza el tempo, la energía y el ambiente de una pista de música seleccionada y corta y organiza inteligentemente tu metraje de video para que coincida. Puede crear montajes dinámicos o secuencias emocionalmente resonantes, ahorrando horas de edición manual. Perfecto para contenido de redes sociales, videos musicales o proyectos personales.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'video music',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'play note',
    category: 'Videos',
    categorySlug: 'videos',
    link: '#vibe-editor',
  }
];

export const getAiToolById = (id: string): AITool | undefined => {
  return aiTools.find(tool => tool.id === id);
};

export const getAiToolsByCategory = (categorySlug: string): AITool[] => {
  // Find the category object first to ensure we match based on its non-localized slug
  const categoryInfo = categories.find(cat => cat.slug === categorySlug);
  if (!categoryInfo) return [];
  // Then filter tools that have a matching categorySlug
  return aiTools.filter(tool => tool.categorySlug === categorySlug);
};


export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(cat => cat.slug === slug);
};

// Helper to get category name based on its English name (as stored in AITool.category)
// This is used if you need to find a category object based on the `category` string in AITool
export const getCategoryByName = (nameEN: string): Category | undefined => {
  return categories.find(cat => {
    if (typeof cat.name === 'string') return cat.name === nameEN; // Should not happen with new structure
    return cat.name.en === nameEN;
  });
};

