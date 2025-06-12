
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
    comments: sampleComments.filter(c => c.postId === 'chatgpt-post')
  },
  {
    id: 'midjourney-art-post',
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
    comments: sampleComments.filter(c => c.postId === 'midjourney-art-post')
  },
  {
    id: 'github-copilot-review',
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
    id: 'canva-magic-design-features',
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
    id: 'elevenlabs-voice-synthesis',
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
    id: 'grammarly-writing-assistant',
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
    id: 'stable-diffusion-open-source',
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
    link: 'https://stability.ai/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'image generation parameters UI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'community art showcase'
  },
  {
    id: 'runwayml-gen2-video',
    title: LS('Runway Gen-2: Text-to-Video and Beyond', 'Runway Gen-2: De Texto a Video y Mucho Más'),
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
    id: 'taskmaster-ai-post',
    title: LS('TaskMaster AI: Intelligent Project Planning', 'TaskMaster AI: Planificación Inteligente de Proyectos'),
    shortDescription: LS(
      'Manage tasks and projects efficiently with AI-driven insights and automation.',
      'Gestiona tareas y proyectos eficientemente con información y automatización impulsadas por IA.'
    ),
    longDescription: LS(
      'TaskMaster AI helps you organize your projects, prioritize tasks, and collaborate with your team efficiently. It uses AI to suggest optimal workflows, predict task durations based on historical data, and identify potential bottlenecks before they impact your deadlines. With integrations for popular calendars and communication tools, TaskMaster AI streamlines your entire project lifecycle, from initial planning to final delivery, ensuring everyone stays on track and informed. This post explores how TaskMaster AI can transform your productivity.',
      'TaskMaster AI te ayuda a organizar tus proyectos, priorizar tareas y colaborar con tu equipo de manera eficiente. Utiliza IA para sugerir flujos de trabajo óptimos, predecir la duración de las tareas basándose en datos históricos e identificar posibles cuellos de botella antes de que afecten tus plazos. Con integraciones para calendarios y herramientas de comunicación populares, TaskMaster AI optimiza todo el ciclo de vida de tu proyecto, desde la planificación inicial hasta la entrega final, asegurando que todos se mantengan encaminados e informados. Este post explora cómo TaskMaster AI puede transformar tu productividad.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'project management dashboard tasks',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'checkmark list icon',
    category: 'Productivity',
    categorySlug: 'productivity',
    tags: ['Project Management', 'Task Automation', 'Team Collaboration', 'AI Productivity'],
    publishedDate: subDays(new Date(), 1), // Recent post
    link: '#taskmaster-ai', // Placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'gantt chart project planning',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'team collaboration interface kanban',
    comments: []
  },
  {
    id: 'inboxzero-ai-post',
    title: LS('Achieve Inbox Zero with AI Assistance', 'Alcanza la Bandeja de Entrada Cero con Asistencia IA'),
    shortDescription: LS(
      'Discover how InboxZero AI declutters your email and boosts your focus.',
      'Descubre cómo InboxZero AI despeja tu correo electrónico y aumenta tu concentración.'
    ),
    longDescription: LS(
      'Overwhelmed by emails? InboxZero AI analyzes your incoming messages, intelligently categorizes them, drafts smart replies for common queries, and helps you achieve the elusive inbox zero. It learns your email habits and preferences to prioritize important messages, snooze less critical ones, and effectively filter out spam or promotional content. This post details its features and how it can save you significant time each week, reducing email-related stress and enhancing productivity.',
      '¿Abrumado por los correos electrónicos? InboxZero AI analiza tus mensajes entrantes, los categoriza inteligentemente, redacta respuestas inteligentes para consultas comunes y te ayuda a alcanzar la esquiva bandeja de entrada cero. Aprende tus hábitos y preferencias de correo electrónico para priorizar mensajes importantes, posponer los menos críticos y filtrar eficazmente el spam o contenido promocional. Este post detalla sus funciones y cómo puede ahorrarte tiempo significativo cada semana, reduciendo el estrés relacionado con el correo electrónico y mejorando la productividad.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'clean organized email inbox',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'email envelope shield',
    category: 'Productivity',
    categorySlug: 'productivity',
    tags: ['Email Management', 'AI Organization', 'Productivity Hacks', 'Anti-Spam'],
    publishedDate: subHours(new Date(), 12), // Very recent post
    link: '#inboxzero-ai', // Placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'email categorization filters',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'AI smart reply suggestion',
    comments: []
  },
  {
    id: 'learnsphere-ai-post',
    title: LS('LearnSphere AI: Personalized Education for All', 'LearnSphere AI: Educación Personalizada para Todos'),
    shortDescription: LS(
      'Explore adaptive learning paths and skill tracking with LearnSphere AI.',
      'Explora rutas de aprendizaje adaptativas y seguimiento de habilidades con LearnSphere AI.'
    ),
    longDescription: LS(
      'LearnSphere AI offers a vast library of courses across numerous disciplines that dynamically adapt to your individual learning pace and style. The AI engine identifies your existing knowledge, strengths, and areas needing improvement, then crafts a personalized learning path with interactive exercises, multimedia content, and real-time feedback. This post explores how LearnSphere AI makes learning more engaging, effective, and accessible, ensuring you master new skills efficiently.',
      'LearnSphere AI ofrece una vasta biblioteca de cursos en numerosas disciplinas que se adaptan dinámicamente a tu ritmo y estilo de aprendizaje individual. El motor de IA identifica tus conocimientos existentes, fortalezas y áreas que necesitan mejora, luego crea una ruta de aprendizaje personalizada con ejercicios interactivos, contenido multimedia y retroalimentación en tiempo real. Este post explora cómo LearnSphere AI hace el aprendizaje más atractivo, efectivo y accesible, asegurando que domines nuevas habilidades eficientemente.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'interactive online learning platform',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'graduation cap atom',
    category: 'Education',
    categorySlug: 'education',
    tags: ['E-learning', 'Adaptive Learning', 'Skill Development', 'AI Education'],
    publishedDate: subDays(new Date(), 3),
    link: '#learnsphere-ai', // Placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'adaptive learning module interface',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'skill progress dashboard chart',
    comments: []
  },
  {
    id: 'tutorbot-ai-post',
    title: LS('TutorBot AI: Your 24/7 Academic Assistant', 'TutorBot AI: Tu Asistente Académico 24/7'),
    shortDescription: LS(
      'Get instant, step-by-step help across various subjects with TutorBot AI.',
      'Obtén ayuda instantánea y paso a paso en diversas materias con TutorBot AI.'
    ),
    longDescription: LS(
      'Struggling with homework or complex concepts? TutorBot AI acts as your personal 24/7 academic assistant. You can ask questions on a wide range of subjects, from math and science to history and literature, and receive clear, step-by-step explanations. This post demonstrates how TutorBot AI can help with problem-solving, explain difficult topics through interactive dialogue, and offer practice quizzes to reinforce learning, making education more accessible and personalized for everyone.',
      '¿Luchando con la tarea o conceptos complejos? TutorBot AI actúa como tu asistente académico personal 24/7. Puedes hacer preguntas sobre una amplia gama de materias, desde matemáticas y ciencias hasta historia y literatura, y recibir explicaciones claras y paso a paso. Este post demuestra cómo TutorBot AI puede ayudar con la resolución de problemas, explicar temas difíciles a través del diálogo interactivo y ofrecer cuestionarios de práctica para reforzar el aprendizaje, haciendo la educación más accesible y personalizada para todos.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'student AI tutor interaction chat',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'robot teacher book icon',
    category: 'Education',
    categorySlug: 'education',
    tags: ['AI Tutor', 'Homework Help', 'Personalized Learning', 'Academic Support'],
    publishedDate: subDays(new Date(), 4),
    link: '#tutorbot-ai', // Placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'math problem explanation steps',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'interactive learning chat interface',
    comments: []
  },
  {
    id: 'scholarai-post',
    title: LS('ScholarAI: Your Academic Research Partner', 'IA Académico: Tu Compañero de Investigación Académica'),
    shortDescription: LS(
      'Leverage AI for summarizing academic papers, finding citations, and accelerating research.',
      'Aprovecha la IA para resumir artículos académicos, encontrar citas y acelerar la investigación.'
    ),
    longDescription: LS(
      'ScholarAI assists researchers and students by quickly summarizing academic papers, extracting key findings, and identifying relevant citations. It can help navigate complex scientific literature, track research trends, and build bibliographies more efficiently. Its natural language processing capabilities allow it to understand the context of research papers and provide concise, accurate summaries. This post details how ScholarAI can streamline your academic workflow.',
      'ScholarAI asiste a investigadores y estudiantes resumiendo rápidamente artículos académicos, extrayendo hallazgos clave e identificando citas relevantes. Puede ayudar a navegar por literatura científica compleja, rastrear tendencias de investigación y construir bibliografías de manera más eficiente. Sus capacidades de procesamiento de lenguaje natural le permiten comprender el contexto de los artículos de investigación y proporcionar resúmenes concisos y precisos. Este post detalla cómo ScholarAI puede optimizar tu flujo de trabajo académico.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'academic research analysis',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'scholar cap book',
    category: 'Information',
    categorySlug: 'information',
    tags: ['Research', 'Academia', 'NLP', 'Citation Management'],
    publishedDate: subHours(new Date(), 6), // New post
    link: '#scholarai-post',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'paper summary UI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'research data visualization',
    comments: []
  },
  {
    id: 'designspark-ai-post',
    title: LS('Unleash Creativity with DesignSpark AI', 'Desata la Creatividad con IA ChispaDeDiseño'),
    shortDescription: LS(
      'Generate mood boards, color palettes, and design inspiration effortlessly with AI.',
      'Genera mood boards, paletas de colores e inspiración de diseño sin esfuerzo con IA.'
    ),
    longDescription: LS(
      'DesignSpark AI helps designers overcome creative blocks by generating mood boards, color palettes, and visual inspiration based on text prompts or uploaded images. It analyzes stylistic elements and suggests complementary design assets, helping to kickstart the creative process for branding, web design, or artistic projects. Users can refine suggestions and explore various aesthetic directions. This post shows you how to get started.',
      'DesignSpark AI ayuda a los diseñadores a superar bloqueos creativos generando mood boards, paletas de colores e inspiración visual basados en prompts de texto o imágenes cargadas. Analiza elementos estilísticos y sugiere activos de diseño complementarios, ayudando a iniciar el proceso creativo para branding, diseño web o proyectos artísticos. Los usuarios pueden refinar sugerencias y explorar diversas direcciones estéticas. Este post te muestra cómo empezar.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'design inspiration moodboard',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'creative spark palette',
    category: 'Design',
    categorySlug: 'design',
    tags: ['Design Tools', 'Mood Boards', 'Color Palettes', 'Creative AI'],
    publishedDate: subHours(new Date(), 5), // New post
    link: '#designspark-ai-post',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'AI color palette tool',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'moodboard generation example',
    comments: []
  },
  {
    id: 'codeguardian-ai-post',
    title: LS('Secure Your Code with CodeGuardian AI', 'Asegura Tu Código con IA GuardiánDeCódigo'),
    shortDescription: LS(
      'Automated static code analysis for security vulnerabilities and best practice adherence.',
      'Análisis estático de código automatizado para vulnerabilidades de seguridad y cumplimiento de mejores prácticas.'
    ),
    longDescription: LS(
      'CodeGuardian AI integrates with development workflows to automatically scan code for potential security vulnerabilities, bugs, and deviations from coding best practices. It provides actionable feedback and suggestions for remediation, helping developers write more secure and maintainable code. This post explores its features and integration into CI/CD pipelines.',
      'CodeGuardian AI se integra con los flujos de trabajo de desarrollo para escanear automáticamente el código en busca de posibles vulnerabilidades de seguridad, errores y desviaciones de las mejores prácticas de codificación. Proporciona retroalimentación procesable y sugerencias para la remediación, ayudando a los desarrolladores a escribir código más seguro y mantenible. Este post explora sus características y su integración en pipelines de CI/CD.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'code security scan',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'secure code shield',
    category: 'Programming',
    categorySlug: 'programming',
    tags: ['Code Security', 'Static Analysis', 'DevSecOps', 'CI/CD'],
    publishedDate: subHours(new Date(), 4), // New post
    link: '#codeguardian-ai-post',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'vulnerability report UI',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'IDE integration screenshot',
    comments: []
  },
  {
    id: 'videotune-ai-post',
    title: LS('Professional Video Post-Production with VideoTune AI', 'Postproducción de Video Profesional con IA VideoAfinador'),
    shortDescription: LS(
      'Automate color correction, audio enhancement, and stabilization for your videos.',
      'Automatiza la corrección de color, la mejora de audio y la estabilización para tus videos.'
    ),
    longDescription: LS(
      'VideoTune AI simplifies video post-production by automatically analyzing footage and applying color correction, enhancing audio quality (noise reduction, equalization), and stabilizing shaky scenes. It helps creators achieve a more professional look and sound for their videos with minimal manual effort. Learn how it can elevate your vlogs, social media content, and quick video projects in this post.',
      'VideoTune AI simplifica la postproducción de video analizando automáticamente el metraje y aplicando corrección de color, mejorando la calidad del audio (reducción de ruido, ecualización) y estabilizando escenas movidas. Ayuda a los creadores a lograr un aspecto y sonido más profesional para sus videos con un mínimo esfuerzo manual. Aprende cómo puede elevar tus vlogs, contenido de redes sociales y proyectos de video rápidos en este post.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'video editing software timeline',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'video film reel',
    category: 'Videos',
    categorySlug: 'videos',
    tags: ['Video Editing', 'Post-Production', 'Color Correction', 'Audio Enhancement'],
    publishedDate: subHours(new Date(), 3), // New post
    link: '#videotune-ai-post',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'before after color correction',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'audio waveform editing',
    comments: []
  },
  {
    id: 'audiocraft-ai-post',
    title: LS('Create Custom Audio with AudioCraft AI', 'Crea Audio Personalizado con IA AudioCrear'),
    shortDescription: LS(
      'Generate unique music, sound effects, and ambient soundscapes using text prompts.',
      'Genera música única, efectos de sonido y paisajes sonoros ambientales usando prompts de texto.'
    ),
    longDescription: LS(
      'AudioCraft AI allows users to create original music tracks, sound effects, and ambient soundscapes by simply describing what they want in text. It can generate audio in various genres and styles, offering parameters to control mood, tempo, and instrumentation. This post explores how game developers, filmmakers, and content creators can leverage AudioCraft AI for their projects.',
      'AudioCraft AI permite a los usuarios crear pistas de música originales, efectos de sonido y paisajes sonoros ambientales simplemente describiendo lo que quieren en texto. Puede generar audio en diversos géneros y estilos, ofreciendo parámetros para controlar el estado de ánimo, el tempo y la instrumentación. Este post explora cómo los desarrolladores de juegos, cineastas y creadores de contenido pueden aprovechar AudioCraft AI para sus proyectos.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI music generation interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'music notes staff',
    category: 'Audio',
    categorySlug: 'audio',
    tags: ['Music Generation', 'Sound Effects', 'AI Audio', 'Content Creation'],
    publishedDate: subHours(new Date(), 2), // New post
    link: '#audiocraft-ai-post',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'text to music prompt',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'sound effect library view',
    comments: []
  },
  {
    id: 'edugamemaker-ai-post',
    title: LS('Engaging Learning with EduGameMaker AI', 'Aprendizaje Atractivo con IA CreaJuegosEdu'),
    shortDescription: LS(
      'Assist educators in creating interactive educational games and quizzes effortlessly.',
      'Asiste a educadores en la creación de juegos educativos interactivos y quizzes sin esfuerzo.'
    ),
    longDescription: LS(
      'EduGameMaker AI empowers educators to design and develop simple educational games and interactive quizzes without needing coding skills. Users can define learning objectives, topics, and question types, and the AI helps generate game mechanics, character interactions, and quiz content. This post showcases how to make learning more fun and effective by incorporating gamification.',
      'EduGameMaker AI empodera a los educadores para diseñar y desarrollar juegos educativos simples y quizzes interactivos sin necesidad de habilidades de codificación. Los usuarios pueden definir objetivos de aprendizaje, temas y tipos de preguntas, y la IA ayuda a generar mecánicas de juego, interacciones de personajes y contenido de quizzes. Este post muestra cómo hacer el aprendizaje más divertido y efectivo incorporando la gamificación.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'interactive educational game',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'game controller book',
    category: 'Education',
    categorySlug: 'education',
    tags: ['Educational Games', 'Gamification', 'Interactive Learning', 'AI Education'],
    publishedDate: subHours(new Date(), 1), // New post
    link: '#edugamemaker-ai-post',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'game creation interface',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'sample educational quiz',
    comments: []
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


