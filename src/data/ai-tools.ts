
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

export const aiTools: AITool[] = [
  {
    id: 'chatgpt',
    title: LS('ChatGPT', 'ChatGPT'),
    shortDescription: LS(
      'A powerful conversational AI by OpenAI, excelling in text generation and understanding.',
      'Una potente IA conversacional de OpenAI, que sobresale en la generación y comprensión de texto.'
    ),
    longDescription: LS(
      'ChatGPT, developed by OpenAI, is a state-of-the-art large language model. It can engage in coherent and contextually relevant conversations, answer complex questions, draft emails, write articles, summarize long texts, translate languages, and even generate creative content like poems or scripts. Its underlying GPT (Generative Pre-trained Transformer) architecture allows it to understand nuances in human language and produce remarkably human-like responses. It is widely used for customer service, content creation, education, and as a versatile assistant for various tasks. Continuous improvements and fine-tuning expand its capabilities regularly.',
      'ChatGPT, desarrollado por OpenAI, es un modelo de lenguaje grande de última generación. Puede participar en conversaciones coherentes y contextualmente relevantes, responder preguntas complejas, redactar correos electrónicos, escribir artículos, resumir textos largos, traducir idiomas e incluso generar contenido creativo como poemas o guiones. Su arquitectura subyacente GPT (Transformador Generativo Preentrenado) le permite comprender matices en el lenguaje humano y producir respuestas notablemente similares a las humanas. Se utiliza ampliamente para servicio al cliente, creación de contenido, educación y como asistente versátil para diversas tareas. Las mejoras continuas y el ajuste fino expanden sus capacidades regularmente.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI conversation chat interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'OpenAI logo symbol',
    category: 'Information',
    categorySlug: 'information',
    link: 'https://openai.com/chatgpt',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'chatbot interface example',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'neural network concept'
  },
  {
    id: 'midjourney',
    title: LS('Midjourney', 'Midjourney'),
    shortDescription: LS(
      'AI image generation from text prompts with a distinct artistic focus and style.',
      'Generación de imágenes AI a partir de prompts de texto con un enfoque y estilo artístico distintivo.'
    ),
    longDescription: LS(
      'Midjourney is an independent research lab that produces an artificial intelligence program that creates images from textual descriptions, similar to OpenAI\'s DALL-E or Stability AI\'s Stable Diffusion. It is renowned for generating highly artistic, often surreal, and aesthetically pleasing images. Users typically interact with Midjourney via a Discord bot, using commands to submit prompts and refine generated images through variations or upscaling. Its unique artistic interpretation makes it a favorite among artists and designers for concept art and creative exploration.',
      'Midjourney es un laboratorio de investigación independiente que produce un programa de inteligencia artificial que crea imágenes a partir de descripciones textuales, similar a DALL-E de OpenAI o Stable Diffusion de Stability AI. Es reconocido por generar imágenes altamente artísticas, a menudo surrealistas y estéticamente agradables. Los usuarios suelen interactuar con Midjourney a través de un bot de Discord, utilizando comandos para enviar prompts y refinar imágenes generadas mediante variaciones o escalado. Su interpretación artística única lo convierte en un favorito entre artistas y diseñadores para arte conceptual y exploración creativa.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'artistic AI generation',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Midjourney ship icon',
    category: 'Photos',
    categorySlug: 'photos',
    link: 'https://www.midjourney.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'fantasy landscape art',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'abstract digital art'
  },
  {
    id: 'github-copilot',
    title: LS('GitHub Copilot', 'GitHub Copilot'),
    shortDescription: LS(
      'Your AI pair programmer, providing code suggestions and completions directly in your editor.',
      'Tu programador de IA, que proporciona sugerencias y finalizaciones de código directamente en tu editor.'
    ),
    longDescription: LS(
      'GitHub Copilot is an AI-powered code completion tool developed by GitHub and OpenAI. It integrates directly into popular code editors like Visual Studio Code, Neovim, and JetBrains IDEs. Copilot analyzes the context of the file you are editing, as well as related files, to suggest individual lines or entire functions. It can help write boilerplate code, generate unit tests, translate code between languages, and even explain code snippets. Trained on a massive dataset of public code repositories, it significantly speeds up development for many programmers.',
      'GitHub Copilot es una herramienta de finalización de código impulsada por IA desarrollada por GitHub y OpenAI. Se integra directamente en editores de código populares como Visual Studio Code, Neovim y los IDE de JetBrains. Copilot analiza el contexto del archivo que estás editando, así como archivos relacionados, para sugerir líneas individuales o funciones completas. Puede ayudar a escribir código repetitivo, generar pruebas unitarias, traducir código entre lenguajes e incluso explicar fragmentos de código. Entrenado en un conjunto masivo de datos de repositorios de código públicos, acelera significativamente el desarrollo para muchos programadores.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'code editor AI assistant',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Copilot bird icon',
    category: 'Programming',
    categorySlug: 'programming',
    link: 'https://copilot.github.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'code suggestions example',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'programming workflow'
  },
  {
    id: 'canva-magic-design',
    title: LS('Canva Magic Design', 'Canva Diseño Mágico'),
    shortDescription: LS(
      'AI-powered design tools within Canva to quickly create visuals and presentations.',
      'Herramientas de diseño impulsadas por IA dentro de Canva para crear rápidamente visuales y presentaciones.'
    ),
    longDescription: LS(
      'Canva\'s Magic Design suite incorporates AI to simplify and accelerate the design process. Users can generate entire design templates based on a text prompt or an uploaded image. Features include Magic Write for AI text generation, Magic Edit for object manipulation within images, and Magic Presentations for creating slideshows from a simple idea. These tools aim to make professional-quality design accessible to everyone, regardless of their design experience, for social media, marketing, and personal projects.',
      'La suite de Diseño Mágico de Canva incorpora IA para simplificar y acelerar el proceso de diseño. Los usuarios pueden generar plantillas de diseño completas basadas en un prompt de texto o una imagen cargada. Las características incluyen Magic Write para la generación de texto con IA, Magic Edit para la manipulación de objetos dentro de imágenes y Magic Presentations para crear presentaciones de diapositivas a partir de una idea simple. Estas herramientas tienen como objetivo hacer que el diseño de calidad profesional sea accesible para todos, independientemente de su experiencia en diseño, para redes sociales, marketing y proyectos personales.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'graphic design interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Canva C logo',
    category: 'Design',
    categorySlug: 'design',
    link: 'https://www.canva.com/magic-design/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'AI generated presentation',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'social media post design'
  },
  {
    id: 'synthesia',
    title: LS('Synthesia', 'Synthesia'),
    shortDescription: LS(
      'AI video generation platform featuring customizable AI avatars and voiceovers.',
      'Plataforma de generación de video AI con avatares y voces en off de IA personalizables.'
    ),
    longDescription: LS(
      'Synthesia allows users to create professional-looking videos by typing in text. The platform uses AI to generate a video of a digital avatar speaking that text, complete with realistic lip-syncing and a choice of numerous voices and languages. This technology is particularly useful for creating training materials, corporate communications, product demonstrations, and personalized video messages at scale, without the need for cameras, microphones, or actors.',
      'Synthesia permite a los usuarios crear videos de aspecto profesional escribiendo texto. La plataforma utiliza IA para generar un video de un avatar digital hablando ese texto, completo con sincronización de labios realista y una elección de numerosas voces e idiomas. Esta tecnología es particularmente útil para crear materiales de capacitación, comunicaciones corporativas, demostraciones de productos y mensajes de video personalizados a gran escala, sin necesidad de cámaras, micrófonos o actores.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI avatar presentation',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Synthesia S logo',
    category: 'Videos',
    categorySlug: 'videos',
    link: 'https://www.synthesia.io/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'avatar selection screen',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'video editing timeline'
  },
  {
    id: 'elevenlabs',
    title: LS('ElevenLabs', 'ElevenLabs'),
    shortDescription: LS(
      'Advanced AI voice synthesis for realistic text-to-speech and voice cloning.',
      'Síntesis de voz AI avanzada para texto a voz realista y clonación de voz.'
    ),
    longDescription: LS(
      'ElevenLabs is known for its high-quality, natural-sounding text-to-speech (TTS) and voice cloning capabilities. Their AI models can generate speech in a variety of voices, languages, and emotional styles. The platform allows users to create custom voice clones from short audio samples, making it suitable for applications like audiobooks, podcasting, video game voice-overs, and personalized digital assistants. They focus on providing voices that are expressive and difficult to distinguish from human speech.',
      'ElevenLabs es conocido por sus capacidades de texto a voz (TTS) y clonación de voz de alta calidad y sonido natural. Sus modelos de IA pueden generar habla en una variedad de voces, idiomas y estilos emocionales. La plataforma permite a los usuarios crear clones de voz personalizados a partir de muestras de audio cortas, lo que la hace adecuada para aplicaciones como audiolibros, podcasting, doblaje de videojuegos y asistentes digitales personalizados. Se centran en proporcionar voces que sean expresivas y difíciles de distinguir del habla humana.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'audio sound waves',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'ElevenLabs E symbol',
    category: 'Audio',
    categorySlug: 'audio',
    link: 'https://elevenlabs.io/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'voice selection interface',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'audio waveform editor'
  },
  {
    id: 'grammarly',
    title: LS('Grammarly', 'Grammarly'),
    shortDescription: LS(
      'AI-powered writing assistant for grammar, spelling, clarity, and tone.',
      'Asistente de escritura impulsado por IA para gramática, ortografía, claridad y tono.'
    ),
    longDescription: LS(
      'Grammarly is an AI-driven writing assistant that goes beyond basic spell-checking and grammar correction. It provides real-time feedback on writing clarity, conciseness, tone, vocabulary, and style. It can help users make their writing more impactful, professional, or appropriate for specific audiences. Grammarly integrates into various platforms, including web browsers, desktop applications, and mobile keyboards, making it a ubiquitous tool for students, professionals, and anyone who writes.',
      'Grammarly es un asistente de escritura impulsado por IA que va más allá de la simple revisión ortográfica y corrección gramatical. Proporciona retroalimentación en tiempo real sobre la claridad, concisión, tono, vocabulario y estilo de la escritura. Puede ayudar a los usuarios a hacer que su escritura sea más impactante, profesional o apropiada para audiencias específicas. Grammarly se integra en varias plataformas, incluyendo navegadores web, aplicaciones de escritorio y teclados móviles, lo que lo convierte en una herramienta omnipresente para estudiantes, profesionales y cualquiera que escriba.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'text correction interface',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Grammarly G logo',
    category: 'Writing',
    categorySlug: 'writing',
    link: 'https://www.grammarly.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'grammar suggestions example',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'tone detection feature'
  },
  {
    id: 'stable-diffusion',
    title: LS('Stable Diffusion', 'Stable Diffusion'),
    shortDescription: LS(
      'Powerful open-source text-to-image model for generating diverse visuals.',
      'Potente modelo de texto a imagen de código abierto para generar visuales diversos.'
    ),
    longDescription: LS(
      'Stable Diffusion is a deep learning, text-to-image model released by Stability AI. It is primarily used to generate detailed images conditioned on text descriptions, but it can also be applied to other tasks such as inpainting, outpainting, and generating image-to-image translations guided by a text prompt. Being open-source, it has fostered a large community of users and developers who create custom models, UIs, and integrations, making it highly versatile and adaptable for various artistic and commercial applications.',
      'Stable Diffusion es un modelo de aprendizaje profundo de texto a imagen lanzado por Stability AI. Se utiliza principalmente para generar imágenes detalladas condicionadas a descripciones de texto, pero también se puede aplicar a otras tareas como inpainting, outpainting y generar traducciones de imagen a imagen guiadas por un prompt de texto. Al ser de código abierto, ha fomentado una gran comunidad de usuarios y desarrolladores que crean modelos personalizados, interfaces de usuario e integraciones, lo que lo hace altamente versátil y adaptable para diversas aplicaciones artísticas y comerciales.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'generative abstract art',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'StabilityAI S logo',
    category: 'Photos',
    categorySlug: 'photos',
    link: 'https://stablediffusion.com/', // Note: Official site is stability.ai, stablediffusion.com is a community resource.
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'image generation parameters',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'diverse image styles'
  },
   {
    id: 'runwayml',
    title: LS('RunwayML', 'RunwayML'),
    shortDescription: LS('AI magic tools for video editing, image generation, and creative content.', 'Herramientas mágicas de IA para edición de video, generación de imágenes y contenido creativo.'),
    longDescription: LS('RunwayML provides a suite of over 30 AI-powered "magic tools" for creators, focusing on video and image manipulation. Key features include Gen-1 (video-to-video synthesis), Gen-2 (text-to-video and image-to-video), text-to-image generation, infinite image expansion, frame interpolation for smoother video, background removal, and 3D texture generation. Runway aims to make advanced AI capabilities accessible to artists, designers, and filmmakers without requiring coding expertise, fostering new forms of creative expression.', 'RunwayML ofrece un conjunto de más de 30 "herramientas mágicas" impulsadas por IA para creadores, centrándose en la manipulación de video e imágenes. Las características clave incluyen Gen-1 (síntesis de video a video), Gen-2 (texto a video e imagen a video), generación de texto a imagen, expansión infinita de imágenes, interpolación de fotogramas para videos más fluidos, eliminación de fondos y generación de texturas 3D. Runway tiene como objetivo hacer que las capacidades avanzadas de IA sean accesibles para artistas, diseñadores y cineastas sin requerir experiencia en codificación, fomentando nuevas formas de expresión creativa.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'video editing AI tools',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'RunwayML R symbol',
    category: 'Videos',
    categorySlug: 'videos',
    link: 'https://runwayml.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'text to video interface',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'AI motion capture'
  },
  {
    id: 'jasper',
    title: LS('Jasper (formerly Jarvis)', 'Jasper (antes Jarvis)'),
    shortDescription: LS('AI writing assistant for creating marketing copy, blog posts, and other content.', 'Asistente de escritura IA para crear textos de marketing, entradas de blog y otros contenidos.'),
    longDescription: LS('Jasper is an AI writing platform designed to help businesses and individuals create high-quality content efficiently. It offers numerous templates for different types of content, such as blog posts, social media updates, ad copy, email subject lines, and product descriptions. Jasper uses AI to generate creative and persuasive text based on user inputs and desired tone. It can help overcome writer\'s block, produce content at scale, and optimize copy for better engagement and conversions.', 'Jasper es una plataforma de escritura con IA diseñada para ayudar a empresas e individuos a crear contenido de alta calidad de manera eficiente. Ofrece numerosas plantillas para diferentes tipos de contenido, como entradas de blog, actualizaciones de redes sociales, textos publicitarios, líneas de asunto de correos electrónicos y descripciones de productos. Jasper utiliza IA para generar texto creativo y persuasivo basado en las entradas del usuario y el tono deseado. Puede ayudar a superar el bloqueo del escritor, producir contenido a gran escala y optimizar el texto para una mejor participación y conversiones.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'AI writing marketing copy',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Jasper J diamond',
    category: 'Writing',
    categorySlug: 'writing',
    link: 'https://www.jasper.ai/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'content template selection',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'AI generated blog post'
  },
  {
    id: 'otter-ai',
    title: LS('Otter.ai', 'Otter.ai'),
    shortDescription: LS('AI-powered transcription service for real-time notes from voice conversations.', 'Servicio de transcripción impulsado por IA para notas en tiempo real de conversaciones de voz.'),
    longDescription: LS('Otter.ai uses artificial intelligence to provide real-time transcription of meetings, interviews, lectures, and other voice conversations. It automatically generates rich notes with speaker identification, summary keywords, and the ability to search, play, edit, organize, and share notes. Otter.ai can integrate with platforms like Zoom and Google Meet, making it a valuable tool for productivity, collaboration, and accessibility for students and professionals alike.', 'Otter.ai utiliza inteligencia artificial para proporcionar transcripción en tiempo real de reuniones, entrevistas, conferencias y otras conversaciones de voz. Genera automáticamente notas enriquecidas con identificación de hablantes, palabras clave de resumen y la capacidad de buscar, reproducir, editar, organizar y compartir notas. Otter.ai puede integrarse con plataformas como Zoom y Google Meet, lo que la convierte en una herramienta valiosa para la productividad, la colaboración y la accesibilidad tanto para estudiantes como para profesionales.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'audio transcription meeting',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'Otter animal icon',
    category: 'Audio',
    categorySlug: 'audio',
    link: 'https://otter.ai/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'live transcription interface',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'meeting notes summary'
  },
  {
    id: 'deepl',
    title: LS('DeepL Translator', 'Traductor DeepL'),
    shortDescription: LS('High-quality AI-powered language translation known for its accuracy and nuance.', 'Traducción de idiomas de alta calidad impulsada por IA, conocida por su precisión y matices.'),
    longDescription: LS('DeepL Translator is an online machine translation service that is highly regarded for producing more natural-sounding and nuanced translations compared to many other services. It utilizes deep learning and neural networks trained on vast amounts of multilingual text data. DeepL supports a growing number of languages and offers features like document translation, a glossary for custom terminology, and API access for businesses. Its ability to capture context and subtle meanings makes it a preferred choice for professional and personal translation needs.', 'El Traductor DeepL es un servicio de traducción automática en línea muy apreciado por producir traducciones más naturales y matizadas en comparación con muchos otros servicios. Utiliza aprendizaje profundo y redes neuronales entrenadas en grandes cantidades de datos de texto multilingües. DeepL admite un número creciente de idiomas y ofrece características como la traducción de documentos, un glosario para terminología personalizada y acceso a API para empresas. Su capacidad para capturar el contexto y los significados sutiles lo convierte en una opción preferida para necesidades de traducción profesionales y personales.'),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'language translation globe',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'DeepL D logo',
    category: 'Information',
    categorySlug: 'information',
    link: 'https://www.deepl.com/translator',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'text translation interface',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'document translation feature'
  },
  {
    id: 'dream-weaver',
    title: LS('Dream Weaver', 'Tejedor de Sueños'),
    shortDescription: LS(
      'Generates dream-like artistic visuals from your imagination and textual prompts.',
      'Genera visuales artísticos oníricos a partir de tu imaginación y prompts textuales.'
    ),
    longDescription: LS(
      'Dream Weaver is an AI specialized in creating surreal and abstract art based on textual descriptions or even vague concepts. It excels at producing unique, dream-like imagery that can be used for inspiration, concept art, or purely aesthetic purposes. Its algorithms interpret emotional context and stylistic cues to deliver truly imaginative visuals. Dive into a world of endless creativity and bring your most abstract thoughts to visual life. It allows for iterative refinement, enabling users to guide the AI towards their desired artistic vision through subsequent prompts and parameter adjustments.',
      'Dream Weaver es una IA especializada en crear arte surrealista y abstracto basado en descripciones textuales o incluso conceptos vagos. Sobresale en la producción de imágenes oníricas únicas que pueden usarse para inspiración, arte conceptual o fines puramente estéticos. Sus algoritmos interpretan el contexto emocional y las señales estilísticas para ofrecer visuales verdaderamente imaginativos. Sumérgete en un mundo de creatividad infinita y da vida visual a tus pensamientos más abstractos. Permite el refinamiento iterativo, permitiendo a los usuarios guiar la IA hacia su visión artística deseada a través de prompts posteriores y ajustes de parámetros.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'surreal dreamlike art',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'abstract spiral logo',
    category: 'Photos',
    categorySlug: 'photos',
    link: '#dream-weaver', // Example placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'surreal digital painting',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'abstract concept visualization'
  },
  {
    id: 'codesynth',
    title: LS('CodeSynth', 'Sintetizador de Código'),
    shortDescription: LS(
      'AI assistant for refactoring, optimizing, and understanding codebases.',
      'Asistente IA para refactorizar, optimizar y comprender bases de código.'
    ),
    longDescription: LS(
      'CodeSynth analyzes your existing code and suggests improvements for readability, performance, and maintainability. It can help automate parts of the refactoring process, identify potential bugs or inefficient patterns, and even generate documentation for complex functions. Ideal for keeping large projects clean and efficient, CodeSynth integrates with your workflow to make code optimization a seamless process. It supports multiple programming languages and provides explanations for its suggestions.',
      'CodeSynth analiza tu código existente y sugiere mejoras para la legibilidad, el rendimiento y la mantenibilidad. Puede ayudar a automatizar partes del proceso de refactorización, identificar posibles errores o patrones ineficientes e incluso generar documentación para funciones complejas. Ideal para mantener proyectos grandes limpios y eficientes, CodeSynth se integra con tu flujo de trabajo para hacer de la optimización de código un proceso fluido. Admite múltiples lenguajes de programación y proporciona explicaciones para sus sugerencias.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'abstract code structure',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'gear cog logo',
    category: 'Programming',
    categorySlug: 'programming',
    link: '#codesynth', // Example placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'code refactoring suggestions',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'performance optimization chart'
  },
  {
    id: 'polyglot-reader',
    title: LS('Polyglot Reader', 'Lector Políglota'),
    shortDescription: LS(
      'Reads text aloud in multiple languages with natural intonation and voice choices.',
      'Lee texto en voz alta en múltiples idiomas con entonación natural y opciones de voz.'
    ),
    longDescription: LS(
      'Polyglot Reader uses advanced voice synthesis to provide natural-sounding audio for written text in a wide array of languages. It is perfect for language learners, accessibility (e.g., for visually impaired users), or simply listening to content on the go. It captures nuances in pronunciation and intonation for a pleasant listening experience, supporting documents, articles, and custom text inputs. Users can often select different voice profiles and adjust reading speed.',
      'Lector Políglota utiliza síntesis de voz avanzada para proporcionar audio con sonido natural para texto escrito en una amplia gama de idiomas. Es perfecto para estudiantes de idiomas, accesibilidad (p. ej., para usuarios con discapacidad visual) o simplemente para escuchar contenido sobre la marcha. Captura matices en la pronunciación y entonación para una experiencia auditiva agradable, admitiendo documentos, artículos y entradas de texto personalizadas. Los usuarios a menudo pueden seleccionar diferentes perfiles de voz y ajustar la velocidad de lectura.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'multilingual audio playback',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'global speech bubble',
    category: 'Audio',
    categorySlug: 'audio',
    link: '#polyglot-reader', // Example placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'language selection menu',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'text to speech controls'
  },
  {
    id: 'narrative-ai',
    title: LS('Narrative AI', 'IA Narrativa'),
    shortDescription: LS(
      'Helps craft compelling story outlines, character arcs, and plot developments.',
      'Ayuda a crear esquemas de historias, arcos de personajes y desarrollos de trama convincentes.'
    ),
    longDescription: LS(
      'Narrative AI is a creative partner for writers, playwrights, and game developers. It assists in brainstorming plot points, developing complex characters with believable motivations, and structuring compelling narratives. Feed it your core ideas, themes, or even just a genre, and it can help you expand them into rich story worlds, suggesting plot twists, character backstories, dialogue snippets, and thematic explorations. It aims to augment human creativity, not replace it.',
      'IA Narrativa es un socio creativo para escritores, dramaturgos y desarrolladores de juegos. Ayuda en la lluvia de ideas de puntos de la trama, el desarrollo de personajes complejos con motivaciones creíbles y la estructuración de narrativas convincentes. Aliméntalo con tus ideas centrales, temas o incluso solo un género, y te ayudará a expandirlas en ricos mundos de historias, sugiriendo giros argumentales, trasfondos de personajes, fragmentos de diálogo y exploraciones temáticas. Su objetivo es aumentar la creatividad humana, no reemplazarla.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'story manuscript book',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'quill pen scroll',
    category: 'Writing',
    categorySlug: 'writing',
    link: '#narrative-ai', // Example placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'character development map',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'plot structure diagram'
  },
  {
    id: 'vibe-editor',
    title: LS('Vibe Editor', 'Editor de Ambiente'),
    shortDescription: LS(
      'Automatically edits video clips to match a music track\'s mood, tempo, and energy.',
      'Edita automáticamente videoclips para que coincidan con el ambiente, tempo y energía de una pista de música.'
    ),
    longDescription: LS(
      'Vibe Editor analyzes the tempo, energy, and mood of a selected music track and intelligently cuts, arranges, and applies effects to your video footage to match. It can create dynamic montages, emotionally resonant sequences, or perfectly synchronized edits, saving hours of manual editing. Perfect for social media content, music videos, vlogs, or personal projects, Vibe Editor makes professional video editing techniques more accessible and efficient by automating rhythm-based editing.',
      'Editor de Ambiente analiza el tempo, la energía y el ambiente de una pista de música seleccionada y corta, organiza y aplica efectos inteligentemente a tu metraje de video para que coincida. Puede crear montajes dinámicos, secuencias emocionalmente resonantes o ediciones perfectamente sincronizadas, ahorrando horas de edición manual. Perfecto para contenido de redes sociales, videos musicales, vlogs o proyectos personales, Editor de Ambiente hace que las técnicas de edición de video profesional sean más accesibles y eficientes al automatizar la edición basada en el ritmo.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'video music synchronization',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'play button music note',
    category: 'Videos',
    categorySlug: 'videos',
    link: '#vibe-editor', // Example placeholder link
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'music editing interface',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'video timeline effects'
  },
  {
    id: 'insightfinder',
    title: LS('InsightFinder', 'BuscadorDeIdeas'),
    shortDescription: LS(
      'AI for advanced research, data analysis, and knowledge discovery from vast text sources.',
      'IA para investigación avanzada, análisis de datos y descubrimiento de conocimiento desde vastas fuentes de texto.'
    ),
    longDescription: LS(
      'InsightFinder employs sophisticated Natural Language Processing (NLP) and machine learning algorithms to rapidly sift through massive volumes of text-based data. This includes academic papers, industry reports, news articles, patents, and internal company documents. It excels at identifying key themes, emerging trends, sentiment analysis, relationship extraction between entities, and generating concise summaries of complex information. Researchers, business analysts, and students can leverage InsightFinder to significantly accelerate their information discovery process, uncover hidden connections, and stay ahead of the curve in their respective fields. It provides interactive dashboards and customizable queries for tailored exploration.',
      'InsightFinder emplea sofisticados algoritmos de Procesamiento de Lenguaje Natural (PLN) y aprendizaje automático para examinar rápidamente volúmenes masivos de datos basados en texto. Esto incluye artículos académicos, informes de la industria, artículos de noticias, patentes y documentos internos de la empresa. Sobresale en la identificación de temas clave, tendencias emergentes, análisis de sentimientos, extracción de relaciones entre entidades y generación de resúmenes concisos de información compleja. Investigadores, analistas de negocios y estudiantes pueden aprovechar InsightFinder para acelerar significativamente su proceso de descubrimiento de información, descubrir conexiones ocultas y mantenerse a la vanguardia en sus respectivos campos. Proporciona paneles interactivos y consultas personalizables para una exploración a medida.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'data graph network',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'magnifying glass brain',
    category: 'Information',
    categorySlug: 'information',
    link: '#insightfinder',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'complex data network',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'research analysis dashboard'
  },
  {
    id: 'pixelperfect',
    title: LS('PixelPerfect AI', 'IA PixelPerfecto'),
    shortDescription: LS(
      'AI-powered image upscaling, restoration, and enhancement for crystal-clear visuals.',
      'Mejora, restauración y realce de imágenes impulsado por IA para visuales nítidos.'
    ),
    longDescription: LS(
      'PixelPerfect AI utilizes advanced deep learning models to intelligently upscale images, increasing their resolution while preserving and often enhancing details. It effectively reduces noise, sharpens blurry areas, and can even restore colors in faded photographs without introducing common artifacts associated with traditional resizing methods. This tool is ideal for photographers looking to improve low-resolution shots, graphic designers preparing visuals for print or large displays, and individuals wanting to restore cherished old photos. It supports batch processing and offers various enhancement models tailored to different types of images (e.g., portraits, landscapes, digital art).',
      'PixelPerfect AI utiliza modelos avanzados de aprendizaje profundo para mejorar inteligentemente la resolución de las imágenes, aumentando su resolución mientras preserva y a menudo mejora los detalles. Reduce eficazmente el ruido, enfoca áreas borrosas e incluso puede restaurar colores en fotografías descoloridas sin introducir los artefactos comunes asociados con los métodos de redimensionamiento tradicionales. Esta herramienta es ideal para fotógrafos que buscan mejorar tomas de baja resolución, diseñadores gráficos que preparan visuales para impresión o pantallas grandes, e individuos que desean restaurar fotos antiguas queridas. Admite el procesamiento por lotes y ofrece varios modelos de mejora adaptados a diferentes tipos de imágenes (p. ej., retratos, paisajes, arte digital).'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'high resolution enhanced image',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'camera lens sparkle',
    category: 'Photos',
    categorySlug: 'photos',
    link: '#pixelperfect',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'before after image enhancement',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'photo editing tool interface'
  },
  {
    id: 'devmate',
    title: LS('DevMate AI', 'IA DevMate'),
    shortDescription: LS(
      'AI assistant for automated software testing, bug detection, and code quality analysis.',
      'Asistente de IA para pruebas de software automatizadas, detección de errores y análisis de calidad de código.'
    ),
    longDescription: LS(
      'DevMate AI integrates into your software development lifecycle, particularly within CI/CD pipelines, to automate critical aspects of quality assurance. It intelligently generates comprehensive test cases based on your codebase and specifications, identifies potential bugs and security vulnerabilities with high accuracy, and offers suggestions for fixes and code optimizations. DevMate learns from your project\'s coding patterns and historical bug data to provide context-aware testing solutions, significantly reducing manual QA effort and helping teams deliver more robust and reliable software faster. It provides detailed reports and integrates with popular issue trackers.',
      'DevMate AI se integra en tu ciclo de vida de desarrollo de software, particularmente dentro de los pipelines de CI/CD, para automatizar aspectos críticos del aseguramiento de la calidad. Genera inteligentemente casos de prueba exhaustivos basados en tu base de código y especificaciones, identifica posibles errores y vulnerabilidades de seguridad con alta precisión, y ofrece sugerencias para correcciones y optimizaciones de código. DevMate aprende de los patrones de codificación de tu proyecto y de los datos históricos de errores para proporcionar soluciones de prueba conscientes del contexto, reduciendo significativamente el esfuerzo manual de QA y ayudando a los equipos a entregar software más robusto y confiable más rápido. Proporciona informes detallados y se integra con los populares rastreadores de problemas.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'code bug analysis',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'shield checkmark code',
    category: 'Programming',
    categorySlug: 'programming',
    link: '#devmate',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'test results dashboard graph',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'code error highlighting IDE'
  },
  {
    id: 'storyweaver-ai',
    title: LS('StoryWeaver AI', 'IA TejedoraDeHistorias'),
    shortDescription: LS(
      'AI for crafting interactive narratives, dynamic dialogues, and branching storylines for games.',
      'IA para crear narrativas interactivas, diálogos dinámicos y líneas argumentales ramificadas para juegos.'
    ),
    longDescription: LS(
      'StoryWeaver AI is a specialized tool for writers and developers creating interactive fiction, role-playing games, and other narrative-driven experiences. It assists in designing complex branching narratives, generating dynamic character dialogues that respond to player choices, and maintaining narrative consistency across multiple plot paths. Users can define characters, settings, and plot points, and StoryWeaver AI can then suggest dialogue options, story developments, and even help balance the narrative impact of different choices. It aims to empower creators to build richer, more replayable interactive stories.',
      'StoryWeaver AI es una herramienta especializada para escritores y desarrolladores que crean ficción interactiva, juegos de rol y otras experiencias narrativas. Ayuda a diseñar narrativas ramificadas complexas, generar diálogos de personajes dinámicos que responden a las elecciones del jugador y mantener la coherencia narrativa a través de múltiples caminos argumentales. Los usuarios pueden definir personajes, escenarios y puntos de la trama, y StoryWeaver AI puede sugerir opciones de diálogo, desarrollos de la historia e incluso ayudar a equilibrar el impacto narrativo de diferentes elecciones. Su objetivo es capacitar a los creadores para construir historias interactivas más ricas y rejugables.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'interactive story map',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'branching path book',
    category: 'Writing',
    categorySlug: 'writing',
    link: '#storyweaver-ai',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'narrative flowchart tool',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'game dialogue editor'
  },
  {
    id: 'artisan-canvas',
    title: LS('Artisan Canvas', 'Lienzo Artesano'),
    shortDescription: LS(
      'AI for generating unique textures, patterns, and artistic backgrounds for digital design.',
      'IA para generar texturas, patrones y fondos artísticos únicos para diseño digital.'
    ),
    longDescription: LS(
      'Artisan Canvas empowers digital artists and designers by providing an AI-driven platform to create bespoke textures and intricate patterns. Users can guide the AI with style prompts, color palettes, or even by uploading reference images. The tool then generates seamless, high-resolution materials suitable for 3D rendering, graphic design, game development, and web backgrounds. It features controls for adjusting complexity, randomness, and an "evolution" feature to iterate on generated designs, pushing creative boundaries.',
      'Artisan Canvas empodera a artistas digitales y diseñadores proporcionando una plataforma impulsada por IA para crear texturas a medida y patrones intrincados. Los usuarios pueden guiar la IA con prompts de estilo, paletas de colores o incluso subiendo imágenes de referencia. La herramienta luego genera materiales sin costuras y de alta resolución adecuados para renderizado 3D, diseño gráfico, desarrollo de juegos y fondos web. Cuenta con controles para ajustar la complejidad, la aleatoriedad y una función de "evolución" para iterar sobre los diseños generados, superando los límites creativos.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'abstract texture generation',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'paintbrush palette icon',
    category: 'Design',
    categorySlug: 'design',
    link: '#artisan-canvas',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'texture detail showcase',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'pattern design options'
  },
  {
    id: 'lingo-link',
    title: LS('LingoLink', 'LingoEnlace'),
    shortDescription: LS(
      'Advanced AI for translating complex documents and cross-referencing information across languages.',
      'IA avanzada para traducir documentos complejos y cruzar información entre idiomas.'
    ),
    longDescription: LS(
      'LingoLink goes beyond simple text translation. It is designed for professionals and researchers working with dense, technical, or extensive multilingual documentation. The AI not only translates accurately, preserving context and nuance, but also identifies and links related concepts, definitions, and citations across different language versions of documents. This facilitates deeper understanding and comparative analysis of information, making it invaluable for legal, academic, and international business contexts. It supports version control for translations and collaborative annotation.',
      'LingoLink va más allá de la simple traducción de texto. Está diseñado para profesionales e investigadores que trabajan con documentación multilingüe densa, técnica o extensa. La IA no solo traduce con precisión, preservando el contexto y los matices, sino que también identifica y enlaza conceptos relacionados, definiciones y citas entre diferentes versiones lingüísticas de los documentos. Esto facilita una comprensión más profunda y un análisis comparativo de la información, haciéndolo invaluable para contextos legales, académicos y de negocios internacionales. Admite control de versiones para traducciones y anotación colaborativa.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'document translation network',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'connected globe icon',
    category: 'Information',
    categorySlug: 'information',
    link: '#lingo-link',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'multilingual document view',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'concept linking interface'
  },
  {
    id: 'audiosculpt',
    title: LS('AudioSculpt', 'AudioEsculpir'),
    shortDescription: LS(
      'AI-powered sound effect generation and ambient music creation for immersive experiences.',
      'Generación de efectos de sonido y creación de música ambiental impulsada por IA para experiencias inmersivas.'
    ),
    longDescription: LS(
      'AudioSculpt allows game developers, filmmakers, and content creators to generate unique sound effects and adaptive ambient music. Users can describe the desired sound (e.g., "footsteps on gravel," "futuristic spaceship hum") or mood for music (e.g., "tense and mysterious," "calm and uplifting"), and the AI synthesizes audio accordingly. It offers parameters to fine-tune the generated sounds, such as duration, intensity, and variation. The music generation can adapt to in-game events or video pacing, creating truly dynamic soundscapes.',
      'AudioSculpt permite a desarrolladores de juegos, cineastas y creadores de contenido generar efectos de sonido únicos y música ambiental adaptativa. Los usuarios pueden describir el sonido deseado (p. ej., "pasos sobre grava", "zumbido de nave espacial futurista") o el ambiente para la música (p. ej., "tenso y misterioso", "calmado y edificante"), y la IA sintetiza el audio en consecuencia. Ofrece parámetros para ajustar los sonidos generados, como duración, intensidad y variación. La generación de música puede adaptarse a eventos del juego o al ritmo del video, creando paisajes sonoros verdaderamente dinámicos.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'sound waveform design',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'sound wave icon',
    category: 'Audio',
    categorySlug: 'audio',
    link: '#audiosculpt',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'sound effect editor',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'ambient music generator'
  },
  {
    id: 'devoptimizer',
    title: LS('DevOptimizer', 'OptimizadorDev'),
    shortDescription: LS(
      'AI analyzes code for performance bottlenecks and suggests cloud deployment optimizations.',
      'IA analiza código en busca de cuellos de botella de rendimiento y sugiere optimizaciones de implementación en la nube.'
    ),
    longDescription: LS(
      'DevOptimizer is a tool for software engineers and DevOps teams focused on maximizing application performance and efficiency. It integrates with code repositories and CI/CD pipelines to perform deep static and dynamic analysis, identifying performance bottlenecks, memory leaks, and inefficient algorithms. Furthermore, it provides tailored recommendations for optimizing cloud resource allocation (e.g., instance types, scaling policies) based on the application\'s profile, potentially leading to significant cost savings and improved user experience. It supports various programming languages and cloud providers.',
      'DevOptimizer es una herramienta para ingenieros de software y equipos de DevOps enfocada en maximizar el rendimiento y la eficiencia de las aplicaciones. Se integra con repositorios de código y pipelines de CI/CD para realizar análisis estáticos y dinámicos profundos, identificando cuellos de botella de rendimiento, fugas de memoria y algoritmos ineficientes. Además, proporciona recomendaciones personalizadas para optimizar la asignación de recursos en la nube (p. ej., tipos de instancia, políticas de escalado) basadas en el perfil de la aplicación, lo que podría generar ahorros de costos significativos y una mejor experiencia de usuario. Admite varios lenguajes de programación y proveedores de nube.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'performance graph code',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'rocket gear icon',
    category: 'Programming',
    categorySlug: 'programming',
    link: '#devoptimizer',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'code profiler dashboard',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'cloud cost optimization'
  },
  {
    id: 'taskmaster-ai',
    title: LS('TaskMaster AI', 'IA Gestor de Tareas'),
    shortDescription: LS(
      'Intelligent task management and project planning for teams and individuals.',
      'Gestión inteligente de tareas y planificación de proyectos para equipos e individuos.'
    ),
    longDescription: LS(
      'TaskMaster AI helps you organize your projects, prioritize tasks, and collaborate with your team efficiently. It uses AI to suggest optimal workflows, predict task durations based on historical data, and identify potential bottlenecks before they impact your deadlines. With integrations for popular calendars and communication tools, TaskMaster AI streamlines your entire project lifecycle, from initial planning to final delivery, ensuring everyone stays on track and informed.',
      'TaskMaster AI te ayuda a organizar tus proyectos, priorizar tareas y colaborar con tu equipo de manera eficiente. Utiliza IA para sugerir flujos de trabajo óptimos, predecir la duración de las tareas basándose en datos históricos e identificar posibles cuellos de botella antes de que afecten tus plazos. Con integraciones para calendarios y herramientas de comunicación populares, TaskMaster AI optimiza todo el ciclo de vida de tu proyecto, desde la planificación inicial hasta la entrega final, asegurando que todos se mantengan encaminados e informados.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'project management dashboard tasks',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'checkmark list icon',
    category: 'Productivity',
    categorySlug: 'productivity',
    link: '#taskmaster-ai',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'gantt chart project planning',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'team collaboration interface kanban'
  },
  {
    id: 'inboxzero-ai',
    title: LS('InboxZero AI', 'IA Bandeja Cero'),
    shortDescription: LS(
      'AI-powered email management to keep your inbox organized and decluttered.',
      'Gestión de correo electrónico impulsada por IA para mantener tu bandeja de entrada organizada y despejada.'
    ),
    longDescription: LS(
      'InboxZero AI analyzes your incoming emails, intelligently categorizes them based on content and sender, drafts smart replies for common queries, and helps you achieve the elusive inbox zero. It learns your email habits and preferences to prioritize important messages, snooze less critical ones, and effectively filter out spam or promotional content, saving you significant time each week and reducing email-related stress.',
      'InboxZero AI analiza tus correos entrantes, los categoriza inteligentemente según el contenido y el remitente, redacta respuestas inteligentes para consultas comunes y te ayuda a alcanzar la esquiva bandeja de entrada cero. Aprende tus hábitos y preferencias de correo electrónico para priorizar mensajes importantes, posponer los menos críticos y filtrar eficazmente el spam o contenido promocional, ahorrándote tiempo significativo cada semana y reduciendo el estrés relacionado con el correo electrónico.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'clean organized email inbox',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'email envelope shield',
    category: 'Productivity',
    categorySlug: 'productivity',
    link: '#inboxzero-ai',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'email categorization filters',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'AI smart reply suggestion'
  },
  {
    id: 'learnsphere-ai',
    title: LS('LearnSphere AI', 'IA Esfera de Aprendizaje'),
    shortDescription: LS(
      'Personalized AI learning platform with adaptive courses and skill tracking.',
      'Plataforma de aprendizaje personalizada con IA, cursos adaptativos y seguimiento de habilidades.'
    ),
    longDescription: LS(
      'LearnSphere AI offers a vast library of courses across numerous disciplines that dynamically adapt to your individual learning pace and style. The AI engine identifies your existing knowledge, strengths, and areas needing improvement, then crafts a personalized learning path with interactive exercises, multimedia content, and real-time feedback. This ensures you master new skills effectively and efficiently, making learning more engaging and impactful.',
      'LearnSphere AI ofrece una vasta biblioteca de cursos en numerosas disciplinas que se adaptan dinámicamente a tu ritmo y estilo de aprendizaje individual. El motor de IA identifica tus conocimientos existentes, fortalezas y áreas que necesitan mejora, luego crea una ruta de aprendizaje personalizada con ejercicios interactivos, contenido multimedia y retroalimentación en tiempo real. Esto asegura que domines nuevas habilidades de manera efectiva y eficiente, haciendo el aprendizaje más atractivo e impactante.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'interactive online learning platform',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'graduation cap atom',
    category: 'Education',
    categorySlug: 'education',
    link: '#learnsphere-ai',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'adaptive learning module',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'skill progress dashboard'
  },
  {
    id: 'tutorbot-ai',
    title: LS('TutorBot AI', 'IA TutorBot'),
    shortDescription: LS(
      'AI tutor providing instant, step-by-step help and explanations for various academic subjects.',
      'Tutor de IA que proporciona ayuda instantánea y explicaciones paso a paso para diversas materias académicas.'
    ),
    longDescription: LS(
      'TutorBot AI acts as your personal 24/7 academic assistant. You can ask questions on a wide range of subjects, from math and science to history and literature, and receive clear, step-by-step explanations. It can help with homework problems, explain complex concepts through interactive dialogue, and offer practice quizzes to reinforce learning, making education more accessible and personalized.',
      'TutorBot AI actúa como tu asistente académico personal 24/7. Puedes hacer preguntas sobre una amplia gama de materias, desde matemáticas y ciencias hasta historia y literatura, y recibir explicaciones claras y paso a paso. Puede ayudar con problemas de tarea, explicar conceptos complejos a través del diálogo interactivo y ofrecer cuestionarios de práctica para reforzar el aprendizaje, haciendo la educación más accesible y personalizada.'
    ),
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'student AI tutor interaction',
    logoUrl: 'https://placehold.co/50x50.png',
    logoHint: 'robot teacher book',
    category: 'Education',
    categorySlug: 'education',
    link: '#tutorbot-ai',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'math problem explanation',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'interactive learning chat'
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
    // Ensure cat.name is treated as LocalizedString for comparison
    const catName = cat.name;
    if (typeof catName === 'object' && catName !== null && 'en' in catName) {
      return catName.en === nameEN;
    }
    // Fallback for older string-only category names, though LS should be standard
    return catName === nameEN;
  });
};

