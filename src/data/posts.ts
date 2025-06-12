
import type { Post, Category, LocalizedString } from '@/lib/types';
// Note: The `posts` array below is now for example/initial seeding reference.
// The application will primarily fetch posts from Firestore.
// The `categories` array, however, will remain the source of truth for category definitions.

// Helper function to create LocalizedString for titles, descriptions, etc.
const LS = (en: string, es: string, it?: string, zh?: string, ja?: string, pt?: string): LocalizedString => ({
  en,
  es,
  it: it || en,
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
  {
    name: LS('Productivity', 'Productividad', 'Produttività', '生产力', '生産性', 'Produtividade'),
    slug: 'productivity',
    iconName: 'Briefcase',
    description: LS(
      'AI tools to enhance productivity and organization.',
      'Herramientas de IA para mejorar la productividad y la organización.',
      'Strumenti IA per migliorare produttività e organizzazione.',
      '提高生产力和组织能力的人工智能工具。',
      '生産性と組織を向上させるためのAIツール。',
      'Ferramentas de IA para aumentar a produtividade e organização.'
    )
  },
  {
    name: LS('Education', 'Educación', 'Educazione', '教育', '教育', 'Educação'),
    slug: 'education',
    iconName: 'BookOpen',
    description: LS(
      'AI tools for learning, teaching, and educational purposes.',
      'Herramientas de IA para aprendizaje, enseñanza y fines educativos.',
      'Strumenti IA per apprendimento, insegnamento e scopi educativi.',
      '用于学习、教学和教育目的的人工智能工具。',
      '学習、教育、および教育目的のためのAIツール。',
      'Ferramentas de IA para aprendizado, ensino e fins educacionais.'
    )
  },
];


// The 'posts' array below is now for reference/seeding only.
// The application fetches live post data from Firestore.
export const posts: Post[] = [
  {
    id: 'chatgpt',
    title: LS('The Rise of ChatGPT: A New Era in AI Conversation', 'El Auge de ChatGPT: Una Nueva Era en la Conversación IA'),
    shortDescription: LS(
      'An in-depth look at ChatGPT, its capabilities, and its impact on various industries.',
      'Una mirada profunda a ChatGPT, sus capacidades y su impacto en diversas industrias.'
    ),
    longDescription: LS(
      'ChatGPT, developed by OpenAI, has revolutionized how we interact with AI. This post explores its underlying technology (GPT models), showcases its ability to generate human-like text, answer complex questions, write code, and more. We delve into its applications in customer service, content creation, education, and its potential future developments. While powerful, we also discuss the ethical considerations and limitations of such advanced conversational AI. This tool has set a new benchmark for language models, paving the way for more sophisticated AI interactions.',
      'ChatGPT, creado por OpenAI, ha revolucionado nuestra interacción con la IA. Este artículo explora su tecnología subyacente (modelos GPT), demostrando su habilidad para generar texto similar al humano, responder preguntas complejas, escribir código y más. Investigamos sus aplicaciones en servicio al cliente, creación de contenido, educación y sus posibles evoluciones. Aunque potente, también analizamos las consideraciones éticas y las limitaciones de esta avanzada IA conversacional. Esta herramienta marca un nuevo estándar para los modelos lingüísticos, abriendo camino a interacciones de IA más sofisticadas.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI conversation interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'OpenAI logo',
    category: 'Information', // English name from categories
    categorySlug: 'information',
    tags: ['LLM', 'OpenAI', 'Conversational AI', 'NLP'],
    publishedDate: new Date('2024-07-01T10:00:00Z'), 
    link: 'https://openai.com/chatgpt',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'chatbot interface concept',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'abstract neural network',
  },
  {
    id: 'midjourney',
    title: LS('Midjourney: Crafting Visual Worlds with AI', 'Midjourney: Creando Mundos Visuales con IA'),
    shortDescription: LS(
      'Explore Midjourney, the AI image generator known for its artistic and surreal outputs.',
      'Explora Midjourney, el generador de imágenes IA conocido por sus resultados artísticos y surrealistas.'
    ),
    longDescription: LS(
      'Midjourney stands out in the AI art landscape for its unique aesthetic and powerful image generation capabilities. Accessed via Discord, users can craft intricate visual narratives from simple text prompts. This post covers how to get started with Midjourney, effective prompting techniques, and showcases some of its stunning artistic creations. We also touch upon its community and the evolving landscape of AI-generated art. Ideal for artists, designers, and anyone looking to bring their imaginative visions to life.',
      'Midjourney se destaca en el panorama del arte IA por su estética única y sus potentes capacidades de generación de imágenes. Accesible a través de Discord, los usuarios pueden crear intrincadas narrativas visuales a partir de simples prompts de texto. Este artículo cubre cómo empezar con Midjourney, técnicas efectivas de prompting y muestra algunas de sus impresionantes creaciones artísticas. También abordamos su comunidad y el cambiante panorama del arte generado por IA. Ideal para artistas, diseñadores y cualquiera que busque dar vida a sus visiones imaginativas.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'artistic AI generation example',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Midjourney boat logo',
    category: 'Photos',
    categorySlug: 'photos',
    tags: ['AI Art', 'Image Generation', 'Discord', 'Creative AI'],
    publishedDate: new Date('2024-06-28T11:00:00Z'),
    link: 'https://www.midjourney.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'fantasy landscape art',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'abstract digital creation'
  },
  {
    id: 'github-copilot',
    title: LS('GitHub Copilot: Your AI Pair Programmer', 'GitHub Copilot: Tu Programador de IA en Pareja'),
    shortDescription: LS(
      'A deep dive into GitHub Copilot, the AI assistant that helps you write code faster.',
      'Un análisis profundo de GitHub Copilot, el asistente de IA que te ayuda a escribir código más rápido.'
    ),
    longDescription: LS(
      'GitHub Copilot, powered by OpenAI Codex, integrates directly into your editor to suggest code and entire functions in real-time. This post explores its features, benefits for developer productivity, supported languages, and how it learns from context. We also discuss common use cases, from autocompleting boilerplate code to generating unit tests and even translating code snippets. As AI continues to transform software development, Copilot represents a significant step towards more intelligent coding tools.',
      'GitHub Copilot, impulsado por OpenAI Codex, se integra directamente en tu editor para sugerir código y funciones completas en tiempo real. Este artículo explora sus características, los beneficios para la productividad del desarrollador, los lenguajes compatibles y cómo aprende del contexto. También discutimos casos de uso comunes, desde autocompletar código repetitivo hasta generar pruebas unitarias e incluso traducir fragmentos de código. A medida que la IA continúa transformando el desarrollo de software, Copilot representa un paso significativo hacia herramientas de codificación más inteligentes.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'code editor AI assistant',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'GitHub Copilot icon',
    category: 'Programming',
    categorySlug: 'programming',
    tags: ['AI Coding', 'Developer Tools', 'OpenAI Codex', 'Productivity'],
    publishedDate: new Date('2024-06-25T09:00:00Z'),
    link: 'https://copilot.github.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'code suggestions example',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'programming workflow diagram'
  },
  {
    id: 'canva-magic-design',
    title: LS('Canva Magic Design: AI-Powered Creativity', 'Canva Diseño Mágico: Creatividad Impulsada por IA'),
    shortDescription: LS(
      'Discover Canva\'s suite of AI tools that make graphic design accessible to everyone.',
      'Descubre el conjunto de herramientas de IA de Canva que hacen el diseño gráfico accesible para todos.'
    ),
    longDescription: LS(
      'Canva has integrated powerful AI features into its popular design platform. "Magic Design" allows users to generate presentations, social media posts, and other visuals simply by describing what they need. This post reviews key AI tools like Magic Write for text generation, Magic Edit for image manipulation, and how these features streamline the creative process. Whether you\'re a seasoned designer or a complete beginner, Canva\'s AI tools aim to boost your productivity and unlock new creative possibilities. We explore examples and tips for getting the most out of these "magic" features.',
      'Canva ha integrado potentes funciones de IA en su popular plataforma de diseño. "Diseño Mágico" permite a los usuarios generar presentaciones, publicaciones en redes sociales y otros elementos visuales simplemente describiendo lo que necesitan. Este artículo revisa herramientas clave de IA como Magic Write para la generación de texto, Magic Edit para la manipulación de imágenes y cómo estas funciones agilizan el proceso creativo. Ya seas un diseñador experimentado o un principiante total, las herramientas de IA de Canva buscan impulsar tu productividad y desbloquear nuevas posibilidades creativas. Exploramos ejemplos y consejos para aprovechar al máximo estas funciones "mágicas".'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'graphic design interface AI',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Canva logo C',
    category: 'Design',
    categorySlug: 'design',
    tags: ['Graphic Design', 'AI Tools', 'Canva', 'User-Friendly'],
    publishedDate: new Date('2024-06-22T14:00:00Z'),
    link: 'https://www.canva.com/magic-design/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'AI generated presentation slide',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'social media post design example'
  },
  {
    id: 'synthesia',
    title: LS('Synthesia: AI Video Generation with Digital Avatars', 'Synthesia: Generación de Video IA con Avatares Digitales'),
    shortDescription: LS(
      'Learn how Synthesia uses AI avatars to create professional videos from text.',
      'Aprende cómo Synthesia utiliza avatares de IA para crear videos profesionales a partir de texto.'
    ),
    longDescription: LS(
      'Synthesia is at the forefront of AI video creation, enabling users to produce videos with realistic AI avatars simply by typing text. This technology eliminates the need for cameras, actors, or microphones. In this post, we explore how Synthesia works, its diverse range of avatars and languages, and its applications in corporate training, marketing, and personalized communication. We also discuss the ethical implications and future potential of AI-generated video content. Synthesia is making video production faster, more affordable, and accessible to a wider audience.',
      'Synthesia está a la vanguardia de la creación de video con IA, permitiendo a los usuarios producir videos con avatares de IA realistas simplemente escribiendo texto. Esta tecnología elimina la necesidad de cámaras, actores o micrófonos. En este artículo, exploramos cómo funciona Synthesia, su diversa gama de avatares e idiomas, y sus aplicaciones en capacitación corporativa, marketing y comunicación personalizada. También discutimos las implicaciones éticas y el potencial futuro del contenido de video generado por IA. Synthesia está haciendo la producción de video más rápida, asequible y accesible para una audiencia más amplia.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI avatar presenting video',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Synthesia S logo mark',
    category: 'Videos',
    categorySlug: 'videos',
    tags: ['AI Video', 'Avatars', 'Text-to-Video', 'Content Creation'],
    publishedDate: new Date('2024-06-20T16:00:00Z'),
    link: 'https://www.synthesia.io/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'avatar selection screen interface',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'video editing timeline example'
  },
  {
    id: 'elevenlabs',
    title: LS('ElevenLabs: The Future of AI Voice Synthesis', 'ElevenLabs: El Futuro de la Síntesis de Voz IA'),
    shortDescription: LS(
      'An overview of ElevenLabs and its hyper-realistic text-to-speech and voice cloning AI.',
      'Una visión general de ElevenLabs y su IA hiperrealista de texto a voz y clonación de voz.'
    ),
    longDescription: LS(
      'ElevenLabs is making waves in the AI audio space with its incredibly natural and expressive voice synthesis technology. This post delves into their advanced text-to-speech (TTS) capabilities, which can generate audio in multiple languages and emotional styles. We also explore their voice cloning feature, allowing users to create digital replicas of voices from short audio samples. Applications range from audiobooks and podcasts to gaming and virtual assistants. We discuss the technology, ethical considerations of voice cloning, and the potential impact on various industries.',
      'ElevenLabs está causando sensación en el espacio del audio IA con su tecnología de síntesis de voz increíblemente natural y expresiva. Este artículo profundiza en sus capacidades avanzadas de texto a voz (TTS), que pueden generar audio en múltiples idiomas y estilos emocionales. También exploramos su función de clonación de voz, que permite a los usuarios crear réplicas digitales de voces a partir de muestras de audio cortas. Las aplicaciones van desde audiolibros y podcasts hasta videojuegos y asistentes virtuales. Discutimos la tecnología, las consideraciones éticas de la clonación de voz y el impacto potencial en diversas industrias.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'audio sound waves interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'ElevenLabs E symbol icon',
    category: 'Audio',
    categorySlug: 'audio',
    tags: ['AI Audio', 'Text-to-Speech', 'Voice Cloning', 'Voice AI'],
    publishedDate: new Date('2024-06-18T10:00:00Z'),
    link: 'https://elevenlabs.io/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'voice selection control panel',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'audio waveform editor display'
  },
  {
    id: 'grammarly',
    title: LS('Grammarly: More Than Just a Spell Checker', 'Grammarly: Más que un Simple Corrector Ortográfico'),
    shortDescription: LS(
      'How Grammarly\'s AI enhances writing clarity, tone, and style for effective communication.',
      'Cómo la IA de Grammarly mejora la claridad, el tono y el estilo de escritura para una comunicación efectiva.'
    ),
    longDescription: LS(
      'Grammarly has become an indispensable tool for millions, offering AI-powered assistance to improve writing. This post goes beyond its well-known grammar and spell-checking features to explore how it helps refine clarity, conciseness, tone, and style. We look at its suggestions for vocabulary enhancement, plagiarism detection, and its newer features for understanding writing intent and audience. Whether for academic papers, professional emails, or creative writing, Grammarly aims to help users communicate more effectively and confidently.',
      'Grammarly se ha convertido en una herramienta indispensable para millones de personas, ofreciendo asistencia impulsada por IA para mejorar la escritura. Este artículo va más allá de sus conocidas funciones de corrección gramatical y ortográfica para explorar cómo ayuda a refinar la claridad, concisión, tono y estilo. Analizamos sus sugerencias para mejorar el vocabulario, la detección de plagio y sus funciones más nuevas para comprender la intención de la escritura y la audiencia. Ya sea para trabajos académicos, correos electrónicos profesionales o escritura creativa, Grammarly tiene como objetivo ayudar a los usuarios a comunicarse de manera más efectiva y segura.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'text correction software interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Grammarly G logo circular',
    category: 'Writing',
    categorySlug: 'writing',
    tags: ['Writing Assistant', 'Grammar', 'AI Editing', 'Communication'],
    publishedDate: new Date('2024-06-15T13:00:00Z'),
    link: 'https://www.grammarly.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'grammar suggestions example popup',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'tone detection analysis feature'
  },
  {
    id: 'stable-diffusion',
    title: LS('Stable Diffusion: The Open-Source AI Art Revolution', 'Stable Diffusion: La Revolución del Arte IA de Código Abierto'),
    shortDescription: LS(
      'An introduction to Stable Diffusion, its capabilities, and its impact on the open-source AI community.',
      'Una introducción a Stable Diffusion, sus capacidades y su impacto en la comunidad de IA de código abierto.'
    ),
    longDescription: LS(
      'Stable Diffusion, by Stability AI, has democratized access to powerful text-to-image generation technology by being open-source. This post explains the basics of how Stable Diffusion works, its various models (like SDXL), and how users can run it locally or use online services. We showcase its versatility in creating diverse artistic styles, photorealistic images, and its use in inpainting and outpainting. The vibrant open-source community around Stable Diffusion is continually pushing its boundaries, making it a key player in the generative AI space.',
      'Stable Diffusion, de Stability AI, ha democratizado el acceso a la potente tecnología de generación de texto a imagen al ser de código abierto. Este artículo explica los conceptos básicos de cómo funciona Stable Diffusion, sus diversos modelos (como SDXL) y cómo los usuarios pueden ejecutarlo localmente o usar servicios en línea. Mostramos su versatilidad para crear diversos estilos artísticos, imágenes fotorrealistas y su uso en inpainting y outpainting. La vibrante comunidad de código abierto en torno a Stable Diffusion está continuamente superando sus límites, convirtiéndolo en un actor clave en el espacio de la IA generativa.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'generative abstract art creation',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'StabilityAI S abstract logo',
    category: 'Photos',
    categorySlug: 'photos',
    tags: ['Open Source', 'AI Art', 'Text-to-Image', 'Stability AI'],
    publishedDate: new Date('2024-06-12T15:00:00Z'),
    link: 'https://stability.ai/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'image generation parameters UI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'collection diverse image styles'
  },
  {
    id: 'runwayml',
    title: LS('RunwayML: AI Magic Tools for Creators', 'RunwayML: Herramientas Mágicas de IA para Creadores'),
    shortDescription: LS(
      'Explore RunwayML\'s suite of AI tools for video editing, image generation, and more.',
      'Explora el conjunto de herramientas de IA de RunwayML para edición de video, generación de imágenes y más.'
    ),
    longDescription: LS(
      'RunwayML offers a comprehensive platform with over 30 AI-powered "magic tools" designed for artists, designers, and filmmakers. This post highlights key features like Gen-1 for video-to-video synthesis, Gen-2 for text-to-video and image-to-video, and various image editing tools like background removal and infinite image expansion. We discuss how Runway is making advanced AI accessible for creative workflows without requiring coding skills, fostering new forms of digital storytelling and artistic expression. Examples and use cases demonstrate the power of these tools.',
      'RunwayML ofrece una plataforma integral con más de 30 "herramientas mágicas" impulsadas por IA, diseñadas para artistas, diseñadores y cineastas. Este artículo destaca características clave como Gen-1 para la síntesis de video a video, Gen-2 para texto a video e imagen a video, y varias herramientas de edición de imágenes como eliminación de fondo y expansión infinita de imágenes. Discutimos cómo Runway está haciendo que la IA avanzada sea accesible para flujos de trabajo creativos sin requerir habilidades de codificación, fomentando nuevas formas de narración digital y expresión artística. Ejemplos y casos de uso demuestran el poder de estas herramientas.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'video editing AI tools suite',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'RunwayML R dynamic logo',
    category: 'Videos',
    categorySlug: 'videos',
    tags: ['Video Editing', 'GenAI', 'Creative Tools', 'Text-to-Video'],
    publishedDate: new Date('2024-06-10T09:30:00Z'),
    link: 'https://runwayml.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'text to video generation interface',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'AI motion capture example'
  },
  {
    id: 'jasper',
    title: LS('Jasper: AI Writing for Marketing and Beyond', 'Jasper: Escritura IA para Marketing y Más Allá'),
    shortDescription: LS(
      'How Jasper, the AI writing assistant, helps create compelling content at scale.',
      'Cómo Jasper, el asistente de escritura IA, ayuda a crear contenido atractivo a gran escala.'
    ),
    longDescription: LS(
      'Jasper (formerly Jarvis) is an AI writing platform tailored for marketers, entrepreneurs, and content creators. It offers a wide array of templates for various content types, including blog posts, ad copy, social media updates, and email campaigns. This post explores how Jasper uses AI to generate creative, persuasive, and on-brand content based on user inputs. We discuss its features for different writing styles, tone adjustments, and its ability to help overcome writer\'s block and scale content production. Real-world examples illustrate how businesses are leveraging Jasper for their content needs.',
      'Jasper (anteriormente Jarvis) es una plataforma de escritura con IA diseñada para especialistas en marketing, emprendedores y creadores de contenido. Ofrece una amplia gama de plantillas para diversos tipos de contenido, incluidas publicaciones de blog, textos publicitarios, actualizaciones de redes sociales y campañas de correo electrónico. Este artículo explora cómo Jasper utiliza la IA para generar contenido creativo, persuasivo y acorde con la marca basado en las entradas del usuario. Discutimos sus funciones para diferentes estilos de escritura, ajustes de tono y su capacidad para ayudar a superar el bloqueo del escritor y escalar la producción de contenido. Ejemplos del mundo real ilustran cómo las empresas están aprovechando Jasper para sus necesidades de contenido.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI writing marketing copy tool',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Jasper J diamond shape logo',
    category: 'Writing',
    categorySlug: 'writing',
    tags: ['AI Writing', 'Marketing', 'Content Creation', 'Copywriting'],
    publishedDate: new Date('2024-06-07T11:00:00Z'),
    link: 'https://www.jasper.ai/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'content template selection screen',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'AI generated blog post draft'
  },
  {
    id: 'otter-ai',
    title: LS('Otter.ai: Smart Notes for Voice Conversations', 'Otter.ai: Notas Inteligentes para Conversaciones de Voz'),
    shortDescription: LS(
      'Discover how Otter.ai uses AI to transcribe meetings and generate actionable notes.',
      'Descubre cómo Otter.ai utiliza IA para transcribir reuniones y generar notas accionables.'
    ),
    longDescription: LS(
      'Otter.ai provides real-time transcription and smart note-taking for voice conversations such as meetings, interviews, and lectures. This post covers its AI-powered features, including speaker identification, summary keywords, and integrations with platforms like Zoom and Google Meet. We explore how Otter.ai enhances productivity and collaboration by making voice information accessible, searchable, and shareable. Use cases for students, journalists, and business professionals highlight its value in capturing important details and streamlining workflows.',
      'Otter.ai proporciona transcripción en tiempo real y toma de notas inteligente para conversaciones de voz como reuniones, entrevistas y conferencias. Este artículo cubre sus funciones impulsadas por IA, incluida la identificación de hablantes, palabras clave de resumen e integraciones con plataformas como Zoom y Google Meet. Exploramos cómo Otter.ai mejora la productividad y la colaboración al hacer que la información de voz sea accesible, consultable y compartible. Casos de uso para estudiantes, periodistas y profesionales de negocios destacan su valor para capturar detalles importantes y optimizar los flujos de trabajo.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'audio transcription meeting software',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Otter animal face icon',
    category: 'Audio',
    categorySlug: 'audio',
    tags: ['Transcription', 'AI Notes', 'Productivity', 'Meeting Assistant'],
    publishedDate: new Date('2024-06-05T14:30:00Z'),
    link: 'https://otter.ai/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'live transcription interface mobile',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'meeting notes summary keywords'
  },
  {
    id: 'deepl',
    title: LS('DeepL Translator: AI-Powered Language Translation', 'Traductor DeepL: Traducción de Idiomas Impulsada por IA'),
    shortDescription: LS(
      'An in-depth look at DeepL, known for its accurate and nuanced AI translations.',
      'Un análisis profundo de DeepL, conocido por sus traducciones de IA precisas y matizadas.'
    ),
    longDescription: LS(
      'DeepL Translator has earned a reputation for providing exceptionally high-quality machine translations, often outperforming competitors in nuance and natural language flow. This post explores the neural network technology behind DeepL, its supported languages, and features like document translation and glossary customization. We compare its translation quality for various language pairs and discuss its applications for businesses, academics, and individuals needing reliable translation services. As AI translation evolves, DeepL remains a benchmark for accuracy and contextual understanding.',
      'El Traductor DeepL se ha ganado la reputación de proporcionar traducciones automáticas de una calidad excepcionalmente alta, superando a menudo a sus competidores en matices y fluidez del lenguaje natural. Este artículo explora la tecnología de redes neuronales detrás de DeepL, los idiomas que admite y funciones como la traducción de documentos y la personalización de glosarios. Comparamos su calidad de traducción para varios pares de idiomas y discutimos sus aplicaciones para empresas, académicos e individuos que necesitan servicios de traducción confiables. A medida que evoluciona la traducción con IA, DeepL sigue siendo un referente en precisión y comprensión contextual.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'language translation global map',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'DeepL D letter logo',
    category: 'Information',
    categorySlug: 'information',
    tags: ['Translation', 'AI Language', 'Neural Networks', 'Multilingual'],
    publishedDate: new Date('2024-06-03T10:00:00Z'),
    link: 'https://www.deepl.com/translator',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'text translation interface boxes',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'document translation process'
  },
  {
    id: 'taskmaster-ai',
    title: LS('TaskMaster AI: Intelligent Task Management', 'TaskMaster AI: Gestión Inteligente de Tareas'),
    shortDescription: LS(
      'Streamline your projects with AI-powered task prioritization and scheduling.',
      'Optimiza tus proyectos con priorización y programación de tareas impulsadas por IA.'
    ),
    longDescription: LS(
      'TaskMaster AI is designed to help individuals and teams manage their workloads more effectively. It uses AI algorithms to analyze tasks, estimate effort, suggest deadlines, and prioritize work based on importance and urgency. Features include natural language task input, automated scheduling, progress tracking, and integration with popular calendar and communication tools. This post explores how TaskMaster AI can reduce cognitive load and improve productivity by taking the guesswork out of project planning and daily task management. Learn how to leverage its smart features to stay organized and focused on what matters most.',
      'TaskMaster AI está diseñado para ayudar a individuos y equipos a gestionar sus cargas de trabajo de manera más efectiva. Utiliza algoritmos de IA para analizar tareas, estimar el esfuerzo, sugerir plazos y priorizar el trabajo según la importancia y la urgencia. Las características incluyen la entrada de tareas en lenguaje natural, programación automatizada, seguimiento del progreso e integración con herramientas populares de calendario y comunicación. Este artículo explora cómo TaskMaster AI puede reducir la carga cognitiva y mejorar la productividad eliminando las conjeturas en la planificación de proyectos y la gestión diaria de tareas. Aprende a aprovechar sus funciones inteligentes para mantenerte organizado y enfocado en lo más importante.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'task management dashboard AI',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'checkmark gear logo',
    category: 'Productivity',
    categorySlug: 'productivity',
    tags: ['Task Management', 'Productivity', 'AI Scheduling', 'Project Planning'],
    publishedDate: new Date('2024-07-18T09:00:00Z'),
    link: '#taskmaster-ai-website', // Placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'AI task prioritization list',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'gantt chart AI integration'
  },
  {
    id: 'inboxzero-ai',
    title: LS('InboxZero AI: Conquer Your Email Overload', 'InboxZero AI: Conquista tu Sobrecarga de Correo'),
    shortDescription: LS(
      'Achieve inbox zero with AI-powered email sorting, summarization, and reply suggestions.',
      'Alcanza la bandeja de entrada vacía con clasificación de correos, resumen y sugerencias de respuesta impulsados por IA.'
    ),
    longDescription: LS(
      'InboxZero AI aims to revolutionize email management. It intelligently categorizes incoming emails, summarizes long threads, drafts replies based on context, and helps unsubscribe from unwanted newsletters. This tool learns your email habits and preferences to provide a personalized and efficient inbox experience. This post dives into its core features, how it integrates with existing email clients, and the benefits of using AI to manage the daily deluge of emails. Say goodbye to email stress and hello to a more organized digital life with InboxZero AI.',
      'InboxZero AI tiene como objetivo revolucionar la gestión del correo electrónico. Clasifica inteligentemente los correos entrantes, resume hilos largos, redacta respuestas basadas en el contexto y ayuda a cancelar la suscripción a boletines no deseados. Esta herramienta aprende tus hábitos y preferencias de correo electrónico para proporcionar una experiencia de bandeja de entrada personalizada y eficiente. Este artículo profundiza en sus características principales, cómo se integra con los clientes de correo existentes y los beneficios de usar IA para gestionar el diluvio diario de correos electrónicos. Di adiós al estrés del correo electrónico y hola a una vida digital más organizada con InboxZero AI.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'email inbox AI organization',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'envelope zero logo',
    category: 'Productivity',
    categorySlug: 'productivity',
    tags: ['Email Management', 'AI Productivity', 'Inbox Zero', 'Summarization'],
    publishedDate: new Date('2024-07-17T10:00:00Z'),
    link: '#inboxzero-ai-website', // Placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'AI email summarization example',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'email categorization dashboard'
  },
  {
    id: 'learnsphere-ai',
    title: LS('LearnSphere AI: Personalized Learning Journeys', 'LearnSphere AI: Rutas de Aprendizaje Personalizadas'),
    shortDescription: LS(
      'An AI platform that adapts educational content to individual learning styles and paces.',
      'Una plataforma de IA que adapta el contenido educativo a los estilos y ritmos de aprendizaje individuales.'
    ),
    longDescription: LS(
      'LearnSphere AI is transforming education by creating adaptive learning experiences. It analyzes a student\'s performance, identifies strengths and weaknesses, and curates personalized learning paths with relevant content, quizzes, and feedback. This post explores how LearnSphere AI caters to different learning styles, offers real-time support through AI tutors, and provides educators with valuable insights into student progress. Discover how AI is making education more engaging, effective, and accessible for learners of all ages.',
      'LearnSphere AI está transformando la educación al crear experiencias de aprendizaje adaptativas. Analiza el rendimiento del estudiante, identifica fortalezas y debilidades, y selecciona rutas de aprendizaje personalizadas con contenido relevante, cuestionarios y retroalimentación. Este artículo explora cómo LearnSphere AI se adapta a diferentes estilos de aprendizaje, ofrece apoyo en tiempo real a través de tutores de IA y proporciona a los educadores información valiosa sobre el progreso del estudiante. Descubre cómo la IA está haciendo la educación más atractiva, efectiva y accesible para estudiantes de todas las edades.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI learning platform interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'brain globe logo',
    category: 'Education',
    categorySlug: 'education',
    tags: ['AI Education', 'Personalized Learning', 'EdTech', 'Adaptive Learning'],
    publishedDate: new Date('2024-07-16T11:00:00Z'),
    link: '#learnsphere-ai-website', // Placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'personalized learning path diagram',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'AI tutor chat interface'
  },
  {
    id: 'tutorbot-ai',
    title: LS('TutorBot AI: Your Personal Academic Assistant', 'TutorBot AI: Tu Asistente Académico Personal'),
    shortDescription: LS(
      'Get instant homework help, explanations, and study support from an AI tutor.',
      'Obtén ayuda instantánea con la tarea, explicaciones y apoyo para el estudio de un tutor de IA.'
    ),
    longDescription: LS(
      'TutorBot AI offers on-demand academic assistance across a wide range of subjects. Students can ask questions, get step-by-step explanations for complex problems, practice concepts with interactive exercises, and prepare for exams. This post examines how TutorBot AI uses natural language processing and subject-specific knowledge bases to provide accurate and helpful guidance. We also discuss its role in supplementing traditional education and making learning support more accessible 24/7.',
      'TutorBot AI ofrece asistencia académica bajo demanda en una amplia gama de materias. Los estudiantes pueden hacer preguntas, obtener explicaciones paso a paso para problemas complejos, practicar conceptos con ejercicios interactivos y prepararse para exámenes. Este artículo examina cómo TutorBot AI utiliza el procesamiento del lenguaje natural y bases de conocimiento específicas de la materia para proporcionar orientación precisa y útil. También discutimos su papel en la complementación de la educación tradicional y en hacer que el apoyo al aprendizaje sea más accesible las 24 horas del día, los 7 días de la semana.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI tutor helping student',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'robot graduation cap logo',
    category: 'Education',
    categorySlug: 'education',
    tags: ['AI Tutor', 'Homework Help', 'Academic Support', 'Study Tools'],
    publishedDate: new Date('2024-07-15T14:00:00Z'),
    link: '#tutorbot-ai-website', // Placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'math problem solving AI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'interactive quiz interface'
  },
  {
    id: 'insightfinder',
    title: LS('InsightFinder: Advanced Data Analysis & Research', 'InsightFinder: Análisis Avanzado de Datos e Investigación'),
    shortDescription: LS('AI tool for uncovering trends, patterns, and insights from complex datasets.', 'Herramienta de IA para descubrir tendencias, patrones e ideas de conjuntos de datos complejos.'),
    longDescription: LS('InsightFinder leverages machine learning to perform deep analysis on large datasets. It helps researchers and analysts identify correlations, predict future trends, and extract actionable insights that might be missed by traditional methods. This post explores its capabilities in areas like market research, scientific discovery, and business intelligence. We delve into its user interface, data visualization features, and how it supports hypothesis testing and model building without requiring extensive coding knowledge.', 'InsightFinder aprovecha el aprendizaje automático para realizar análisis profundos en grandes conjuntos de datos. Ayuda a investigadores y analistas a identificar correlaciones, predecir tendencias futuras y extraer ideas accionables que podrían pasar desapercibidas con métodos tradicionales. Esta publicación explora sus capacidades en áreas como la investigación de mercado, el descubrimiento científico y la inteligencia empresarial. Profundizamos en su interfaz de usuario, funciones de visualización de datos y cómo apoya la prueba de hipótesis y la creación de modelos sin requerir un amplio conocimiento de codificación.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'data analysis dashboard charts',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'magnifying glass brain logo',
    category: 'Information',
    categorySlug: 'information',
    tags: ['Data Analysis', 'Machine Learning', 'Research AI', 'Business Intelligence'],
    publishedDate: new Date('2024-07-26T10:00:00Z'),
    link: '#insightfinder-website',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'complex data visualization example',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'trend prediction graph'
  },
  {
    id: 'pixelperfect-ai',
    title: LS('PixelPerfect AI: Image Upscaling & Restoration', 'PixelPerfect AI: Escalado y Restauración de Imágenes'),
    shortDescription: LS('Enhance image resolution and restore old or damaged photos with AI precision.', 'Mejora la resolución de imágenes y restaura fotos antiguas o dañadas con precisión de IA.'),
    longDescription: LS('PixelPerfect AI specializes in improving image quality. It uses advanced AI algorithms to upscale low-resolution images without losing detail, remove noise and artifacts, and even colorize black and white photos or restore damaged areas in old photographs. This post showcases its effectiveness with before-and-after examples, discusses the underlying technology, and compares it with traditional image editing techniques. Ideal for photographers, archivists, and anyone looking to breathe new life into their images.', 'PixelPerfect AI se especializa en mejorar la calidad de la imagen. Utiliza algoritmos avanzados de IA para escalar imágenes de baja resolución sin perder detalle, eliminar ruido y artefactos, e incluso colorear fotos en blanco y negro o restaurar áreas dañadas en fotografías antiguas. Esta publicación muestra su efectividad con ejemplos de antes y después, discute la tecnología subyacente y la compara con técnicas de edición de imágenes tradicionales. Ideal para fotógrafos, archivistas y cualquiera que busque dar nueva vida a sus imágenes.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'image upscaling AI comparison',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'pixel arrow logo',
    category: 'Photos',
    categorySlug: 'photos',
    tags: ['Image Enhancement', 'AI Restoration', 'Photo Editing', 'Upscaling'],
    publishedDate: new Date('2024-07-25T11:00:00Z'),
    link: '#pixelperfect-ai-website',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'photo restoration before after',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'image resolution enhancement tool'
  },
  {
    id: 'devmate-ai',
    title: LS('DevMate AI: Automated Software Testing', 'DevMate AI: Pruebas de Software Automatizadas'),
    shortDescription: LS('AI-driven platform for generating test cases, executing tests, and identifying bugs.', 'Plataforma impulsada por IA para generar casos de prueba, ejecutar pruebas e identificar errores.'),
    longDescription: LS('DevMate AI assists software developers and QA teams by automating various aspects of the testing lifecycle. It can analyze code to generate relevant test cases, execute UI and API tests, identify anomalies, and provide detailed bug reports. This post explores how DevMate AI integrates with CI/CD pipelines, supports different programming languages and frameworks, and helps improve software quality while reducing manual testing efforts. Learn how AI is making software testing smarter and more efficient.', 'DevMate AI asiste a desarrolladores de software y equipos de QA automatizando varios aspectos del ciclo de vida de las pruebas. Puede analizar código para generar casos de prueba relevantes, ejecutar pruebas de UI y API, identificar anomalías y proporcionar informes de errores detallados. Esta publicación explora cómo DevMate AI se integra con pipelines de CI/CD, admite diferentes lenguajes de programación y frameworks, y ayuda a mejorar la calidad del software mientras reduce los esfuerzos de prueba manual. Aprenda cómo la IA está haciendo que las pruebas de software sean más inteligentes y eficientes.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'software testing automation AI',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'gears checkmark logo',
    category: 'Programming',
    categorySlug: 'programming',
    tags: ['Software Testing', 'AI Automation', 'QA Tools', 'Bug Detection'],
    publishedDate: new Date('2024-07-24T14:00:00Z'),
    link: '#devmate-ai-website',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'test case generation UI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'bug report dashboard AI'
  },
  {
    id: 'storyweaver-ai',
    title: LS('StoryWeaver AI: Crafting Interactive Narratives', 'StoryWeaver AI: Creando Narrativas Interactivas'),
    shortDescription: LS('AI tool for writers to develop branching storylines, characters, and dialogue.', 'Herramienta de IA para escritores para desarrollar tramas ramificadas, personajes y diálogos.'),
    longDescription: LS('StoryWeaver AI empowers writers and game designers to create complex interactive narratives. It provides tools for outlining branching storylines, developing character arcs with AI-suggested traits and motivations, and generating dynamic dialogue options. This post delves into how StoryWeaver AI can be used for interactive fiction, game development, and educational scenarios. We explore its features for managing narrative complexity and ensuring coherent storytelling across multiple paths.', 'StoryWeaver AI empodera a escritores y diseñadores de juegos para crear narrativas interactivas complejas. Proporciona herramientas para delinear tramas ramificadas, desarrollar arcos de personajes con rasgos y motivaciones sugeridos por IA, y generar opciones de diálogo dinámicas. Esta publicación profundiza en cómo StoryWeaver AI puede usarse para ficción interactiva, desarrollo de juegos y escenarios educativos. Exploramos sus características para gestionar la complejidad narrativa y asegurar una narración coherente a través de múltiples caminos.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'interactive story map AI',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'quill book logo',
    category: 'Writing',
    categorySlug: 'writing',
    tags: ['Interactive Fiction', 'Narrative Design', 'AI Writing', 'Game Development'],
    publishedDate: new Date('2024-07-23T09:00:00Z'),
    link: '#storyweaver-ai-website',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'branching storyline editor UI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'character development AI tool'
  },
  {
    id: 'artisan-canvas',
    title: LS('Artisan Canvas: AI Texture & Pattern Generation', 'Artisan Canvas: Generación de Texturas y Patrones con IA'),
    shortDescription: LS('Generate unique, seamless textures and artistic patterns with AI for design projects.', 'Genere texturas únicas y sin costuras y patrones artísticos con IA para proyectos de diseño.'),
    longDescription: LS('Artisan Canvas is an AI tool for designers and 3D artists that generates novel textures and patterns from text prompts or image inputs. It can create seamless materials for 3D models, unique backgrounds for graphic design, or inspiration for textile patterns. This post showcases its capabilities, control parameters for style and randomness, and how it integrates into existing design workflows. Explore how AI can expand your creative palette for surface design and visual detailing.', 'Artisan Canvas es una herramienta de IA para diseñadores y artistas 3D que genera texturas y patrones novedosos a partir de indicaciones de texto o entradas de imágenes. Puede crear materiales sin costuras para modelos 3D, fondos únicos para diseño gráfico o inspiración para patrones textiles. Esta publicación muestra sus capacidades, parámetros de control para estilo y aleatoriedad, y cómo se integra en los flujos de trabajo de diseño existentes. Explore cómo la IA puede expandir su paleta creativa para el diseño de superficies y detalles visuales.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI generated textures patterns',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'paint palette brush logo',
    category: 'Design',
    categorySlug: 'design',
    tags: ['Texture Generation', 'Pattern Design', 'AI Art', '3D Design'],
    publishedDate: new Date('2024-07-22T15:00:00Z'),
    link: '#artisan-canvas-website',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'seamless texture example AI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'pattern generation parameters tool'
  },
  {
    id: 'lingolink',
    title: LS('LingoLink: AI Document Translation & Referencing', 'LingoLink: Traducción de Documentos y Referencias con IA'),
    shortDescription: LS('Translate complex documents with AI, maintaining formatting and cross-references.', 'Traduzca documentos complejos con IA, manteniendo el formato y las referencias cruzadas.'),
    longDescription: LS('LingoLink goes beyond simple text translation by offering AI-powered translation for entire documents (like PDFs, Word files) while preserving layout and formatting. It also intelligently handles cross-references and terminology consistency across large documents. This post reviews its features for technical manual translation, legal document processing, and academic paper localization. Learn how LingoLink can save significant time and effort in multilingual document workflows.', 'LingoLink va más allá de la simple traducción de texto al ofrecer traducción impulsada por IA para documentos completos (como archivos PDF, Word) mientras conserva el diseño y el formato. También maneja inteligentemente las referencias cruzadas y la coherencia terminológica en documentos extensos. Esta publicación revisa sus características para la traducción de manuales técnicos, el procesamiento de documentos legales y la localización de artículos académicos. Aprenda cómo LingoLink puede ahorrar una cantidad significativa de tiempo y esfuerzo en los flujos de trabajo de documentos multilingües.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'document translation AI interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'globe link logo',
    category: 'Information',
    categorySlug: 'information',
    tags: ['Document Translation', 'AI Localization', 'NLP', 'Technical Writing'],
    publishedDate: new Date('2024-07-21T10:30:00Z'),
    link: '#lingolink-website',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'pdf translation tool UI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'terminology management AI'
  },
  {
    id: 'audiosculpt',
    title: LS('AudioSculpt: AI Sound Effect Generation', 'AudioSculpt: Generación de Efectos de Sonido con IA'),
    shortDescription: LS('Create unique sound effects from text prompts or by transforming existing audio.', 'Cree efectos de sonido únicos a partir de indicaciones de texto o transformando audio existente.'),
    longDescription: LS('AudioSculpt is an AI tool for sound designers and content creators that generates novel sound effects. Users can describe the sound they need (e.g., "a futuristic spaceship door opening") or upload an existing sound to be transformed by AI into something new. This post explores its generation capabilities, parameters for controlling sound characteristics, and its applications in game development, filmmaking, and music production. Discover a new way to craft the perfect soundscape with AI.', 'AudioSculpt es una herramienta de IA para diseñadores de sonido y creadores de contenido que genera efectos de sonido novedosos. Los usuarios pueden describir el sonido que necesitan (p. ej., "la puerta de una nave espacial futurista abriéndose") o cargar un sonido existente para que la IA lo transforme en algo nuevo. Esta publicación explora sus capacidades de generación, los parámetros para controlar las características del sonido y sus aplicaciones en el desarrollo de juegos, la realización de películas y la producción musical. Descubra una nueva forma de crear el paisaje sonoro perfecto con IA.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'sound effect generation AI',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'sound wave sculpt logo',
    category: 'Audio',
    categorySlug: 'audio',
    tags: ['Sound Design', 'AI Audio', 'SFX Generation', 'Game Audio'],
    publishedDate: new Date('2024-07-20T16:00:00Z'),
    link: '#audiosculpt-website',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'text to sound effect tool',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'audio transformation AI parameters'
  },
  {
    id: 'devoptimizer',
    title: LS('DevOptimizer: AI Code Performance & Cloud Optimization', 'DevOptimizer: Optimización de Rendimiento de Código y Nube con IA'),
    shortDescription: LS('AI tool to analyze code for performance bottlenecks and suggest cloud optimizations.', 'Herramienta de IA para analizar código en busca de cuellos de botella de rendimiento y sugerir optimizaciones en la nube.'),
    longDescription: LS('DevOptimizer helps developers improve the efficiency of their applications. It uses AI to analyze source code, identify performance bottlenecks, suggest refactoring opportunities, and recommend optimal cloud configurations for deployment. This post covers its static and dynamic analysis capabilities, support for various languages and cloud platforms, and how it can lead to reduced operational costs and better application responsiveness. Learn how to make your software faster and more cost-effective with AI-driven insights.', 'DevOptimizer ayuda a los desarrolladores a mejorar la eficiencia de sus aplicaciones. Utiliza IA para analizar el código fuente, identificar cuellos de botella de rendimiento, sugerir oportunidades de refactorización y recomendar configuraciones óptimas en la nube para la implementación. Esta publicación cubre sus capacidades de análisis estático y dinámico, el soporte para varios lenguajes y plataformas en la nube, y cómo puede conducir a costos operativos reducidos y una mejor capacidad de respuesta de la aplicación. Aprenda a hacer su software más rápido y rentable con información impulsada por IA.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'code performance analysis AI',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'rocket gear logo',
    category: 'Programming',
    categorySlug: 'programming',
    tags: ['Code Optimization', 'Performance AI', 'Cloud Computing', 'DevOps'],
    publishedDate: new Date('2024-07-19T12:00:00Z'),
    link: '#devoptimizer-website',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'performance bottleneck report UI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'cloud cost optimization AI tool'
  }
];

// These functions are still useful for working with the static 'categories' array.
export const getCategoryBySlug = (slug: string): Category | undefined => {
  if (!slug) return undefined;
  const lowerSlug = slug.toLowerCase();
  return categories.find(cat => cat.slug.toLowerCase() === lowerSlug);
};

export const getCategoryByName = (nameEN: string): Category | undefined => {
  return categories.find(cat => {
    const catName = cat.name;
    if (typeof catName === 'object' && catName !== null && 'en' in catName) {
      return catName.en === nameEN;
    }
    return catName === nameEN;
  });
};


    