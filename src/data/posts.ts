
import type { Post, Category, LocalizedString, UserComment } from '@/lib/types';
import { subDays, subHours } from 'date-fns';

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

const sampleComments: UserComment[] = [
  {
    id: 'comment-1',
    postId: 'chatgpt-post',
    username: 'AI Enthusiast',
    isAnonymous: false,
    rating: 5,
    text: 'This is a great overview of ChatGPT. Really helped me understand its potential!',
    timestamp: subHours(new Date(), 2),
    profileImageUrl: 'https://placehold.co/40x40.png?text=AE'
  },
  {
    id: 'comment-2',
    postId: 'chatgpt-post',
    username: 'TechGeek',
    isAnonymous: false,
    rating: 4,
    text: 'Good points, but I wish it delved deeper into the ethical implications.',
    timestamp: subHours(new Date(), 5),
    profileImageUrl: 'https://placehold.co/40x40.png?text=TG'
  },
  {
    id: 'comment-3',
    postId: 'midjourney-art-post',
    username: 'ArtLover',
    isAnonymous: true,
    rating: 5,
    text: 'Midjourney is amazing for artists! The possibilities are endless.',
    timestamp: subHours(new Date(), 1),
  }
];


export const posts: Post[] = [
  {
    id: 'chatgpt-post',
    title: LS('The Rise of ChatGPT: A New Era in AI Conversation', 'El Auge de ChatGPT: Una Nueva Era en la Conversación IA'),
    shortDescription: LS(
      'An in-depth look at ChatGPT, its capabilities, and its impact on various industries.',
      'Una mirada profunda a ChatGPT, sus capacidades y su impacto en diversas industrias.'
    ),
    longDescription: LS(
      'ChatGPT, developed by OpenAI, has revolutionized how we interact with AI. This post explores its underlying technology (GPT models), showcases its ability to generate human-like text, answer complex questions, write code, and more. We delve into its applications in customer service, content creation, education, and its potential future developments. While powerful, we also discuss the ethical considerations and limitations of such advanced conversational AI. This tool has set a new benchmark for language models, paving the way for more sophisticated AI interactions.',
      'ChatGPT, desarrollado por OpenAI, ha revolucionado la forma en que interactuamos con la IA. Esta publicación explora su tecnología subyacente (modelos GPT), muestra su capacidad para generar texto similar al humano, responder preguntas complejas, escribir código y más. Profundizamos en sus aplicaciones en servicio al cliente, creación de contenido, educación y sus posibles desarrollos futuros. Si bien es poderoso, también discutimos las consideraciones éticas y las limitaciones de una IA conversacional tan avanzada. Esta herramienta ha establecido un nuevo punto de referencia para los modelos de lenguaje, allanando el camino para interacciones de IA más sofisticadas.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI conversation interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'OpenAI logo',
    category: 'Information',
    categorySlug: 'information',
    tags: ['LLM', 'OpenAI', 'Conversational AI', 'NLP'],
    publishedDate: subDays(new Date(), 2),
    link: 'https://openai.com/chatgpt',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'chatbot interface concept',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'abstract neural network',
    comments: sampleComments.filter(c => c.postId === 'chatgpt-post')
  },
  {
    id: 'midjourney-art-post',
    title: LS('Midjourney: Crafting Visual Dreams with AI', 'Midjourney: Creando Sueños Visuales con IA'),
    shortDescription: LS(
      'Discover how Midjourney transforms text prompts into stunning, artistic images.',
      'Descubre cómo Midjourney transforma prompts de texto en imágenes artísticas e impresionantes.'
    ),
    longDescription: LS(
      'Midjourney stands out in the AI art generation space with its unique artistic interpretations. This post covers how to get started with Midjourney (often via Discord), crafting effective prompts, and understanding its stylistic nuances. We showcase examples of its capabilities, from fantasy landscapes to abstract designs. It\'s a tool that empowers artists and hobbyists alike to explore visual creativity in unprecedented ways. We also touch upon the community around Midjourney and how users share and iterate on their creations.',
      'Midjourney se destaca en el espacio de generación de arte con IA por sus interpretaciones artísticas únicas. Esta publicación cubre cómo comenzar con Midjourney (a menudo a través de Discord), la creación de prompts efectivos y la comprensión de sus matices estilísticos. Mostramos ejemplos de sus capacidades, desde paisajes de fantasía hasta diseños abstractos. Es una herramienta que capacita tanto a artistas como a aficionados para explorar la creatividad visual de maneras sin precedentes. También mencionamos la comunidad en torno a Midjourney y cómo los usuarios comparten e iteran en sus creaciones.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI generated art gallery',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Midjourney logo symbol',
    category: 'Photos',
    categorySlug: 'photos',
    tags: ['AI Art', 'Image Generation', 'Creative Tools', 'Discord Bot'],
    publishedDate: subDays(new Date(), 5),
    link: 'https://www.midjourney.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'surreal AI artwork',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'digital art creation process',
    comments: sampleComments.filter(c => c.postId === 'midjourney-art-post')
  },
  {
    id: 'github-copilot-review',
    title: LS('GitHub Copilot: Your AI Pair Programmer In-Depth', 'GitHub Copilot: Tu Programador IA a Fondo'),
    shortDescription: LS(
      'A comprehensive review of GitHub Copilot and its impact on developer productivity.',
      'Una revisión exhaustiva de GitHub Copilot y su impacto en la productividad del desarrollador.'
    ),
    longDescription: LS(
      'GitHub Copilot has changed the game for many developers. This post examines its features, how it integrates into IDEs like VS Code, and the quality of its code suggestions. We explore real-world use cases, from speeding up boilerplate code to learning new programming patterns. The post also discusses the training data behind Copilot (OpenAI Codex) and the ongoing debates about AI-assisted coding, including licensing and originality. Is it a helpful assistant or a replacement? We explore the nuances.',
      'GitHub Copilot ha cambiado el juego para muchos desarrolladores. Esta publicación examina sus características, cómo se integra en IDEs como VS Code y la calidad de sus sugerencias de código. Exploramos casos de uso del mundo real, desde acelerar el código repetitivo hasta aprender nuevos patrones de programación. La publicación también discute los datos de entrenamiento detrás de Copilot (OpenAI Codex) y los debates en curso sobre la codificación asistida por IA, incluyendo licencias y originalidad. ¿Es un asistente útil o un reemplazo? Exploramos los matices.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI coding assistant interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'GitHub Copilot icon',
    category: 'Programming',
    categorySlug: 'programming',
    tags: ['Development', 'AI Coding', 'Productivity', 'VS Code'],
    publishedDate: subDays(new Date(), 10),
    link: 'https://copilot.github.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'code suggestion example',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'developer workflow diagram',
    comments: []
  },
  {
    id: 'canva-magic-design-features',
    title: LS('Canva Magic Design: AI for Effortless Creativity', 'Canva Diseño Mágico: IA para Creatividad sin Esfuerzo'),
    shortDescription: LS(
      'Exploring Canva\'s AI-powered tools like Magic Write and Magic Edit.',
      'Explorando las herramientas de IA de Canva como Magic Write y Magic Edit.'
    ),
    longDescription: LS(
      'Canva continues to democratize design, and its "Magic" AI features are a testament to this. This post dives into Magic Design, Magic Write (for text generation), Magic Edit (for image manipulation), and Magic Presentations. We provide examples of how these tools can accelerate the creation of social media posts, marketing materials, and presentations, even for users with no prior design experience. The focus is on ease of use and the quick generation of visually appealing content.',
      'Canva continúa democratizando el diseño, y sus funciones de IA "Mágicas" son un testimonio de esto. Esta publicación se sumerge en Magic Design, Magic Write (para generación de texto), Magic Edit (para manipulación de imágenes) y Magic Presentations. Proporcionamos ejemplos de cómo estas herramientas pueden acelerar la creación de publicaciones en redes sociales, materiales de marketing y presentaciones, incluso para usuarios sin experiencia previa en diseño. El enfoque está en la facilidad de uso y la rápida generación de contenido visualmente atractivo.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI design tool interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Canva logo symbol',
    category: 'Design',
    categorySlug: 'design',
    tags: ['Graphic Design', 'AI Tools', 'Marketing', 'Presentations'],
    publishedDate: subDays(new Date(), 12),
    link: 'https://www.canva.com/magic-design/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'AI generated presentation slide',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'social media graphic design',
    comments: [
        {
            id: 'comment-4',
            postId: 'canva-magic-design-features',
            username: 'DesignerDan',
            isAnonymous: false,
            rating: 4,
            text: 'Magic Edit is a game changer for quick touch-ups!',
            timestamp: subHours(new Date(), 3),
            profileImageUrl: 'https://placehold.co/40x40.png?text=DD'
        }
    ]
  },
  {
    id: 'synthesia-video-generation',
    title: LS('Synthesia: AI Video Avatars for Business', 'Synthesia: Avatares de Video IA para Empresas'),
    shortDescription: LS(
      'How Synthesia enables quick creation of professional videos with AI presenters.',
      'Cómo Synthesia permite la creación rápida de videos profesionales con presentadores IA.'
    ),
    longDescription: LS(
      'Synthesia.io is revolutionizing video production by allowing users to create videos with AI-generated avatars from text. This post explores its features, including a wide selection of stock avatars, custom avatar creation, multi-language support, and various video templates. We discuss use cases such as corporate training, product explainers, and personalized marketing messages. The ease of updating video content by simply editing text is a significant advantage. Ethical considerations around AI avatars are also briefly touched upon.',
      'Synthesia.io está revolucionando la producción de video al permitir a los usuarios crear videos con avatares generados por IA a partir de texto. Esta publicación explora sus características, incluida una amplia selección de avatares de stock, creación de avatares personalizados, soporte multilingüe y diversas plantillas de video. Discutimos casos de uso como capacitación corporativa, explicadores de productos y mensajes de marketing personalizados. La facilidad para actualizar el contenido de video simplemente editando texto es una ventaja significativa. También se mencionan brevemente las consideraciones éticas en torno a los avatares de IA.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI avatar speaking',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Synthesia S icon',
    category: 'Videos',
    categorySlug: 'videos',
    tags: ['Video Generation', 'AI Avatars', 'Corporate Communication'],
    publishedDate: subDays(new Date(), 15),
    link: 'https://www.synthesia.io/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'video script editor',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'avatar customization options'
  },
  {
    id: 'elevenlabs-voice-synthesis',
    title: LS('ElevenLabs: The Future of AI Voice Synthesis', 'ElevenLabs: El Futuro de la Síntesis de Voz IA'),
    shortDescription: LS(
      'Exploring the capabilities of ElevenLabs for realistic text-to-speech and voice cloning.',
      'Explorando las capacidades de ElevenLabs para texto a voz realista y clonación de voz.'
    ),
    longDescription: LS(
      'ElevenLabs has gained significant attention for its highly realistic and expressive AI-generated voices. This post delves into its text-to-speech technology, voice cloning features, and the quality of its output across different languages and emotional tones. We look at applications in audiobooks, podcasting, gaming, and accessibility. The ethical implications of advanced voice cloning technology are also discussed, highlighting the company\'s approach to responsible AI development.',
      'ElevenLabs ha ganado una atención significativa por sus voces generadas por IA altamente realistas y expresivas. Esta publicación profundiza en su tecnología de texto a voz, características de clonación de voz y la calidad de su salida en diferentes idiomas y tonos emocionales. Analizamos aplicaciones en audiolibros, podcasting, juegos y accesibilidad. También se discuten las implicaciones éticas de la tecnología avanzada de clonación de voz, destacando el enfoque de la compañía hacia el desarrollo responsable de la IA.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'sound wave audio',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'ElevenLabs E symbol',
    category: 'Audio',
    categorySlug: 'audio',
    tags: ['Voice Synthesis', 'TTS', 'Voice Cloning', 'Audio AI'],
    publishedDate: subDays(new Date(), 18),
    link: 'https://elevenlabs.io/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'voice selection panel',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'audio editing software'
  },
  {
    id: 'grammarly-writing-assistant',
    title: LS('Grammarly: More Than Just a Spell Checker', 'Grammarly: Más que un Simple Corrector Ortográfico'),
    shortDescription: LS(
      'A deep dive into how Grammarly\'s AI helps improve clarity, tone, and style in writing.',
      'Una inmersión profunda en cómo la IA de Grammarly ayuda a mejorar la claridad, el tono y el estilo en la escritura.'
    ),
    longDescription: LS(
      'Grammarly has become an indispensable tool for writers of all levels. This post goes beyond its well-known grammar and spell-checking features to explore its AI-powered suggestions for clarity, conciseness, engagement, and delivery. We examine its tone detector, style guide adherence, and plagiarism checker. The post also covers its various integrations (browser extensions, desktop app, mobile keyboard) and how it adapts to different writing goals (academic, business, casual).',
      'Grammarly se ha convertido en una herramienta indispensable para escritores de todos los niveles. Esta publicación va más allá de sus conocidas funciones de corrección gramatical y ortográfica para explorar sus sugerencias impulsadas por IA para la claridad, concisión, compromiso y entrega. Examinamos su detector de tono, la adherencia a guías de estilo y el verificador de plagio. La publicación también cubre sus diversas integraciones (extensiones de navegador, aplicación de escritorio, teclado móvil) y cómo se adapta a diferentes objetivos de escritura (académico, empresarial, informal).'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'text editing software',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Grammarly G logo',
    category: 'Writing',
    categorySlug: 'writing',
    tags: ['Writing Assistant', 'Grammar', 'Style Improvement', 'AI Editing'],
    publishedDate: subDays(new Date(), 21),
    link: 'https://www.grammarly.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'writing suggestions example',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'tone analysis report'
  },
  {
    id: 'stable-diffusion-open-source',
    title: LS('Stable Diffusion: Powering Open-Source AI Art', 'Stable Diffusion: Impulsando el Arte IA de Código Abierto'),
    shortDescription: LS(
      'Understanding the impact and versatility of the Stable Diffusion text-to-image model.',
      'Comprendiendo el impacto y la versatilidad del modelo de texto a imagen Stable Diffusion.'
    ),
    longDescription: LS(
      'Stable Diffusion, released by Stability AI, has significantly democratized AI image generation due to its open-source nature. This post explains its core technology (latent diffusion models) and how it differs from other models like DALL-E or Midjourney. We explore its capabilities beyond simple text-to-image, including inpainting, outpainting, and image-to-image transformations. The vibrant community around Stable Diffusion, with its custom models (checkpoints/LoRAs) and user interfaces (e.g., Automatic1111), is a key focus.',
      'Stable Diffusion, lanzado por Stability AI, ha democratizado significativamente la generación de imágenes con IA debido a su naturaleza de código abierto. Esta publicación explica su tecnología central (modelos de difusión latente) y cómo difiere de otros modelos como DALL-E o Midjourney. Exploramos sus capacidades más allá del simple texto a imagen, incluyendo inpainting, outpainting y transformaciones de imagen a imagen. La vibrante comunidad en torno a Stable Diffusion, con sus modelos personalizados (checkpoints/LoRAs) e interfaces de usuario (p. ej., Automatic1111), es un enfoque clave.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'abstract generative art',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'StabilityAI S icon',
    category: 'Photos',
    categorySlug: 'photos',
    tags: ['Open Source', 'AI Art', 'Image Generation', 'Diffusion Models'],
    publishedDate: subDays(new Date(), 25),
    link: 'https://stability.ai/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'image generation parameters UI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'community art showcase'
  },
  {
    id: 'runwayml-gen2-video',
    title: LS('Runway Gen-2: Text-to-Video and Beyond', 'Runway Gen-2: De Texto a Video y Más Allá'),
    shortDescription: LS(
      'A look at RunwayML\'s Gen-2 model for AI video generation from text and images.',
      'Una mirada al modelo Gen-2 de RunwayML para la generación de video IA a partir de texto e imágenes.'
    ),
    longDescription: LS(
      'RunwayML continues to push the boundaries of AI-driven creative tools, and their Gen-2 model is a prime example. This post focuses on its text-to-video and image-to-video capabilities, allowing creators to bring dynamic scenes to life from simple prompts. We explore the quality of generated videos, control parameters, and potential applications in filmmaking, advertising, and art. The post also touches on other "AI Magic Tools" offered by Runway that complement video generation.',
      'RunwayML continúa empujando los límites de las herramientas creativas impulsadas por IA, y su modelo Gen-2 es un excelente ejemplo. Esta publicación se centra en sus capacidades de texto a video e imagen a video, permitiendo a los creadores dar vida a escenas dinámicas a partir de simples prompts. Exploramos la calidad de los videos generados, los parámetros de control y las posibles aplicaciones en cine, publicidad y arte. La publicación también menciona otras "Herramientas Mágicas de IA" ofrecidas por Runway que complementan la generación de video.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI video sequence',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'RunwayML R symbol',
    category: 'Videos',
    categorySlug: 'videos',
    tags: ['Text-to-Video', 'AI Video', 'Creative Suite', 'RunwayML'],
    publishedDate: subDays(new Date(), 28),
    link: 'https://runwayml.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'video generation prompt interface',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'animated scene example'
  }
];

export const getPostById = (id: string): Post | undefined => {
  return posts.find(post => post.id === id);
};

export const getPostsByCategory = (categorySlug: string): Post[] => {
  const categoryInfo = categories.find(cat => cat.slug === categorySlug);
  if (!categoryInfo) return [];
  return posts.filter(post => post.categorySlug === categorySlug || post.tags.includes(categoryInfo.name.en));
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(cat => cat.slug === slug);
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
