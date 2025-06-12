
import type { Post, Category, LocalizedString, UserComment } from '@/lib/types';
import { subDays, subHours, addMinutes } from 'date-fns';

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
    postId: 'chatgpt', // Updated postId to match new scheme
    username: 'AI Enthusiast',
    isAnonymous: false,
    rating: 5,
    text: 'This is a great overview of ChatGPT. Really helped me understand its potential!',
    timestamp: subHours(new Date(), 2),
    profileImageUrl: 'https://placehold.co/40x40.png?text=AE'
  },
  {
    id: 'comment-2',
    postId: 'chatgpt', // Updated postId
    username: 'TechGeek',
    isAnonymous: false,
    rating: 4,
    text: 'Good points, but I wish it delved deeper into the ethical implications.',
    timestamp: subHours(new Date(), 5),
    profileImageUrl: 'https://placehold.co/40x40.png?text=TG'
  },
  {
    id: 'comment-3',
    postId: 'midjourney', // Updated postId
    username: 'ArtLover',
    isAnonymous: true,
    rating: 5,
    text: 'Midjourney is amazing for artists! The possibilities are endless.',
    timestamp: subHours(new Date(), 1),
  }
];


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
    category: 'Information',
    categorySlug: 'information',
    tags: ['LLM', 'OpenAI', 'Conversational AI', 'NLP'],
    publishedDate: subDays(new Date(), 2),
    link: 'https://openai.com/chatgpt',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'chatbot interface concept',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'abstract neural network',
    comments: sampleComments.filter(c => c.postId === 'chatgpt')
  },
  {
    id: 'midjourney',
    title: LS('Midjourney: Crafting Visual Dreams with AI', 'Midjourney: Creando Sueños Visuales con IA'),
    shortDescription: LS(
      'Discover how Midjourney transforms text prompts into stunning, artistic images.',
      'Descubre cómo Midjourney transforma indicaciones de texto en imágenes artísticas e impresionantes.'
    ),
    longDescription: LS(
      'Midjourney stands out in the AI art generation space with its unique artistic interpretations. This post covers how to get started with Midjourney (often via Discord), crafting effective prompts, and understanding its stylistic nuances. We showcase examples of its capabilities, from fantasy landscapes to abstract designs. It\'s a tool that empowers artists and hobbyists alike to explore visual creativity in unprecedented ways. We also touch upon the community around Midjourney and how users share and iterate on their creations.',
      'Midjourney se distingue en el campo de la generación de arte por IA gracias a sus interpretaciones artísticas únicas. Este artículo explica cómo empezar con Midjourney (usualmente vía Discord), cómo crear prompts efectivos y entender sus matices estilísticos. Presentamos ejemplos de sus capacidades, desde paisajes fantásticos hasta diseños abstractos. Es una herramienta que permite a artistas y aficionados explorar la creatividad visual de formas innovadoras. También abordamos la comunidad de Midjourney y cómo los usuarios comparten y refinan sus creaciones.'
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
    comments: sampleComments.filter(c => c.postId === 'midjourney')
  },
  {
    id: 'github-copilot',
    title: LS('GitHub Copilot: Your AI Pair Programmer In-Depth', 'GitHub Copilot: Tu Programador IA Compañero a Fondo'),
    shortDescription: LS(
      'A comprehensive review of GitHub Copilot and its impact on developer productivity.',
      'Una revisión exhaustiva de GitHub Copilot y su impacto en la productividad del desarrollador.'
    ),
    longDescription: LS(
      'GitHub Copilot has changed the game for many developers. This post examines its features, how it integrates into IDEs like VS Code, and the quality of its code suggestions. We explore real-world use cases, from speeding up boilerplate code to learning new programming patterns. The post also discusses the training data behind Copilot (OpenAI Codex) and the ongoing debates about AI-assisted coding, including licensing and originality. Is it a helpful assistant or a replacement? We explore the nuances.',
      'GitHub Copilot ha transformado la experiencia de muchos desarrolladores. Este artículo analiza sus funciones, su integración en IDEs como VS Code y la calidad de sus sugerencias de código. Exploramos casos de uso reales, desde acelerar la escritura de código repetitivo hasta aprender nuevos patrones de programación. También se discuten los datos de entrenamiento de Copilot (OpenAI Codex) y los debates actuales sobre la codificación asistida por IA, incluyendo licencias y originalidad. ¿Es un asistente útil o un sustituto? Profundizamos en estos matices.'
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
    id: 'canva-magic-design',
    title: LS('Canva Magic Design: AI for Effortless Creativity', 'Canva Diseño Mágico: IA para Creatividad sin Esfuerzo'),
    shortDescription: LS(
      'Exploring Canva\'s AI-powered tools like Magic Write and Magic Edit.',
      'Explorando las herramientas de IA de Canva como Escritura Mágica y Edición Mágica.'
    ),
    longDescription: LS(
      'Canva continues to democratize design, and its "Magic" AI features are a testament to this. This post dives into Magic Design, Magic Write (for text generation), Magic Edit (for image manipulation), and Magic Presentations. We provide examples of how these tools can accelerate the creation of social media posts, marketing materials, and presentations, even for users with no prior design experience. The focus is on ease of use and the quick generation of visually appealing content.',
      'Canva sigue democratizando el diseño, y sus funciones de IA "Mágicas" son prueba de ello. Este artículo se enfoca en Diseño Mágico, Escritura Mágica (para generación de texto), Edición Mágica (para manipulación de imágenes) y Presentaciones Mágicas. Ofrecemos ejemplos de cómo estas herramientas aceleran la creación de publicaciones para redes sociales, materiales de marketing y presentaciones, incluso para usuarios sin experiencia en diseño. El énfasis está en la facilidad de uso y la rápida generación de contenido visualmente atractivo.'
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
            postId: 'canva-magic-design', // Updated postId
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
    id: 'synthesia',
    title: LS('Synthesia: AI Video Avatars for Business', 'Synthesia: Avatares de Video con IA para Negocios'),
    shortDescription: LS(
      'How Synthesia enables quick creation of professional videos with AI presenters.',
      'Cómo Synthesia permite la creación rápida de videos profesionales con presentadores de IA.'
    ),
    longDescription: LS(
      'Synthesia.io is revolutionizing video production by allowing users to create videos with AI-generated avatars from text. This post explores its features, including a wide selection of stock avatars, custom avatar creation, multi-language support, and various video templates. We discuss use cases such as corporate training, product explainers, and personalized marketing messages. The ease of updating video content by simply editing text is a significant advantage. Ethical considerations around AI avatars are also briefly touched upon.',
      'Synthesia.io está revolucionando la producción de video al permitir a los usuarios crear videos con avatares generados por IA a partir de texto. Este artículo explora sus características, incluyendo una amplia selección de avatares de stock, creación de avatares personalizados, soporte multilingüe y diversas plantillas de video. Discutimos casos de uso como capacitación corporativa, explicaciones de productos y mensajes de marketing personalizados. La facilidad para actualizar el contenido del video simplemente editando el texto es una ventaja significativa. También se abordan brevemente las consideraciones éticas sobre los avatares de IA.'
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
    id: 'elevenlabs',
    title: LS('ElevenLabs: The Future of AI Voice Synthesis', 'ElevenLabs: El Futuro de la Síntesis de Voz con IA'),
    shortDescription: LS(
      'Exploring the capabilities of ElevenLabs for realistic text-to-speech and voice cloning.',
      'Explorando las capacidades de ElevenLabs para texto a voz realista y clonación de voz.'
    ),
    longDescription: LS(
      'ElevenLabs has gained significant attention for its highly realistic and expressive AI-generated voices. This post delves into its text-to-speech technology, voice cloning features, and the quality of its output across different languages and emotional tones. We look at applications in audiobooks, podcasting, gaming, and accessibility. The ethical implications of advanced voice cloning technology are also discussed, highlighting the company\'s approach to responsible AI development.',
      'ElevenLabs ha captado una atención considerable por sus voces generadas por IA, altamente realistas y expresivas. Este artículo profundiza en su tecnología de texto a voz, funciones de clonación de voz y la calidad de su producción en diferentes idiomas y tonos emocionales. Analizamos sus aplicaciones en audiolibros, podcasts, videojuegos y accesibilidad. También se discuten las implicaciones éticas de la tecnología avanzada de clonación de voz, destacando el enfoque de la empresa hacia un desarrollo responsable de la IA.'
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
    id: 'grammarly',
    title: LS('Grammarly: More Than Just a Spell Checker', 'Grammarly: Más que un Simple Corrector Ortográfico'),
    shortDescription: LS(
      'A deep dive into how Grammarly\'s AI helps improve clarity, tone, and style in writing.',
      'Un análisis profundo de cómo la IA de Grammarly ayuda a mejorar la claridad, el tono y el estilo en la escritura.'
    ),
    longDescription: LS(
      'Grammarly has become an indispensable tool for writers of all levels. This post goes beyond its well-known grammar and spell-checking features to explore its AI-powered suggestions for clarity, conciseness, engagement, and delivery. We examine its tone detector, style guide adherence, and plagiarism checker. The post also covers its various integrations (browser extensions, desktop app, mobile keyboard) and how it adapts to different writing goals (academic, business, casual).',
      'Grammarly se ha convertido en una herramienta esencial para escritores de todos los niveles. Este artículo va más allá de sus conocidas funciones de corrección gramatical y ortográfica para explorar sus sugerencias impulsadas por IA sobre claridad, concisión, atractivo y entrega. Examinamos su detector de tono, la adherencia a guías de estilo y el verificador de plagio. También cubre sus diversas integraciones (extensiones de navegador, aplicación de escritorio, teclado móvil) y cómo se adapta a diferentes objetivos de escritura (académica, de negocios, informal).'
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
    id: 'stable-diffusion',
    title: LS('Stable Diffusion: Powering Open-Source AI Art', 'Stable Diffusion: Impulsando el Arte IA de Código Abierto'),
    shortDescription: LS(
      'Understanding the impact and versatility of the Stable Diffusion text-to-image model.',
      'Comprendiendo el impacto y la versatilidad del modelo de texto a imagen Stable Diffusion.'
    ),
    longDescription: LS(
      'Stable Diffusion, released by Stability AI, has significantly democratized AI image generation due to its open-source nature. This post explains its core technology (latent diffusion models) and how it differs from other models like DALL-E or Midjourney. We explore its capabilities beyond simple text-to-image, including inpainting, outpainting, and image-to-image transformations. The vibrant community around Stable Diffusion, with its custom models (checkpoints/LoRAs) and user interfaces (e.g., Automatic1111), is a key focus.',
      'Stable Diffusion, lanzado por Stability AI, ha democratizado notablemente la generación de imágenes por IA gracias a su naturaleza de código abierto. Este artículo explica su tecnología central (modelos de difusión latente) y en qué se diferencia de otros modelos como DALL-E o Midjourney. Exploramos sus capacidades más allá del simple texto a imagen, incluyendo el rellenado (inpainting), la extensión de imagen (outpainting) y las transformaciones de imagen a imagen. La activa comunidad en torno a Stable Diffusion, con sus modelos personalizados (checkpoints/LoRAs) e interfaces de usuario (p. ej., Automatic1111), es un punto central.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'abstract generative art',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'StabilityAI S icon',
    category: 'Photos',
    categorySlug: 'photos',
    tags: ['Open Source', 'AI Art', 'Image Generation', 'Diffusion Models'],
    publishedDate: subDays(new Date(), 25),
    link: 'https://stability.ai/', // Updated link to official source
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'image generation parameters UI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'community art showcase'
  },
  {
    id: 'runwayml',
    title: LS('RunwayML Gen-2: Text-to-Video and Beyond', 'RunwayML Gen-2: De Texto a Video y Mucho Más'),
    shortDescription: LS(
      'A look at RunwayML\'s Gen-2 model for AI video generation from text and images.',
      'Un vistazo al modelo Gen-2 de RunwayML para la generación de video con IA a partir de texto e imágenes.'
    ),
    longDescription: LS(
      'RunwayML continues to push the boundaries of AI-driven creative tools, and their Gen-2 model is a prime example. This post focuses on its text-to-video and image-to-video capabilities, allowing creators to bring dynamic scenes to life from simple prompts. We explore the quality of generated videos, control parameters, and potential applications in filmmaking, advertising, and art. The post also touches on other "AI Magic Tools" offered by Runway that complement video generation.',
      'RunwayML sigue ampliando las fronteras de las herramientas creativas impulsadas por IA, y su modelo Gen-2 es un claro ejemplo. Este artículo se centra en sus capacidades de texto a video y de imagen a video, permitiendo a los creadores dar vida a escenas dinámicas a partir de simples indicaciones. Exploramos la calidad de los videos generados, los parámetros de control y las posibles aplicaciones en cine, publicidad y arte. El artículo también menciona otras "Herramientas Mágicas de IA" que ofrece Runway y que complementan la generación de video.'
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
  },
  {
    id: 'jasper',
    title: LS('Jasper (formerly Jarvis): AI Writing Assistant', 'Jasper (antes Jarvis): Asistente de Escritura IA'),
    shortDescription: LS(
      'Create marketing copy, blog posts, and more with Jasper\'s AI writing platform.',
      'Crea textos de marketing, entradas de blog y más con la plataforma de escritura IA de Jasper.'
    ),
    longDescription: LS(
      'Jasper is an AI writing platform designed to help businesses and individuals create high-quality content efficiently. It offers numerous templates for different types of content, such as blog posts, social media updates, ad copy, email subject lines, and product descriptions. Jasper uses AI to generate creative and persuasive text based on user inputs and desired tone. It can help overcome writer\'s block, produce content at scale, and optimize copy for better engagement and conversions.',
      'Jasper es una plataforma de escritura con IA diseñada para ayudar a empresas e individuos a crear contenido de alta calidad de manera eficiente. Ofrece numerosas plantillas para diferentes tipos de contenido, como entradas de blog, actualizaciones de redes sociales, textos publicitarios, líneas de asunto de correos electrónicos y descripciones de productos. Jasper utiliza IA para generar texto creativo y persuasivo basado en las entradas del usuario y el tono deseado. Puede ayudar a superar el bloqueo del escritor, producir contenido a gran escala y optimizar el texto para una mejor participación y conversiones.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI writing tool dashboard',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Jasper J diamond logo',
    category: 'Writing',
    categorySlug: 'writing',
    tags: ['Content Generation', 'Marketing Copy', 'AI Writing', 'SEO'],
    publishedDate: subDays(new Date(), 30),
    link: 'https://www.jasper.ai/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'content template selection',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'AI generated blog post draft'
  },
  {
    id: 'otter-ai',
    title: LS('Otter.ai: Real-Time Transcription and Notes', 'Otter.ai: Transcripción y Notas en Tiempo Real'),
    shortDescription: LS(
      'AI-powered transcription service for voice conversations, meetings, and interviews.',
      'Servicio de transcripción impulsado por IA para conversaciones de voz, reuniones y entrevistas.'
    ),
    longDescription: LS(
      'Otter.ai uses artificial intelligence to provide real-time transcription of meetings, interviews, lectures, and other voice conversations. It automatically generates rich notes with speaker identification, summary keywords, and the ability to search, play, edit, organize, and share notes. Otter.ai can integrate with platforms like Zoom and Google Meet, making it a valuable tool for productivity, collaboration, and accessibility for students and professionals alike.',
      'Otter.ai utiliza inteligencia artificial para proporcionar transcripción en tiempo real de reuniones, entrevistas, conferencias y otras conversaciones de voz. Genera automáticamente notas enriquecidas con identificación de hablantes, palabras clave de resumen y la capacidad de buscar, reproducir, editar, organizar y compartir notas. Otter.ai puede integrarse con plataformas como Zoom y Google Meet, lo que la convierte en una herramienta valiosa para la productividad, la colaboración y la accesibilidad tanto para estudiantes como para profesionales.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'audio transcription interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Otter animal icon',
    category: 'Audio',
    categorySlug: 'audio',
    tags: ['Transcription', 'Meeting Notes', 'Productivity', 'Voice AI'],
    publishedDate: subDays(new Date(), 32),
    link: 'https://otter.ai/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'live transcription text',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'meeting summary keywords'
  },
  {
    id: 'deepl',
    title: LS('DeepL Translator: Accurate AI Translation', 'Traductor DeepL: Traducción IA Precisa'),
    shortDescription: LS(
      'High-quality AI-powered language translation known for its accuracy and nuance.',
      'Traducción de idiomas de alta calidad impulsada por IA, conocida por su precisión y matices.'
    ),
    longDescription: LS(
      'DeepL Translator is an online machine translation service that is highly regarded for producing more natural-sounding and nuanced translations compared to many other services. It utilizes deep learning and neural networks trained on vast amounts of multilingual text data. DeepL supports a growing number of languages and offers features like document translation, a glossary for custom terminology, and API access for businesses. Its ability to capture context and subtle meanings makes it a preferred choice for professional and personal translation needs.',
      'El Traductor DeepL es un servicio de traducción automática en línea muy apreciado por producir traducciones más naturales y matizadas en comparación con muchos otros servicios. Utiliza aprendizaje profundo y redes neuronales entrenadas en grandes cantidades de datos de texto multilingües. DeepL admite un número creciente de idiomas y ofrece características como la traducción de documentos, un glosario para terminología personalizada y acceso a API para empresas. Su capacidad para capturar el contexto y los significados sutiles lo convierte en una opción preferida para necesidades de traducción profesionales y personales.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'language translation interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'DeepL D logo',
    category: 'Information',
    categorySlug: 'information',
    tags: ['Translation', 'Machine Translation', 'NLP', 'Multilingual'],
    publishedDate: subDays(new Date(), 35),
    link: 'https://www.deepl.com/translator',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'text translation example',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'document translation feature showcase'
  }
];

export const getPostById = (id: string): Post | undefined => {
  return posts.find(post => post.id === id);
};

export const getPostsByCategory = (categorySlug: string): Post[] => {
  const categoryInfo = categories.find(cat => cat.slug === categorySlug);
  if (!categoryInfo) return [];
  return posts.filter(post => post.categorySlug === categorySlug);
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

    