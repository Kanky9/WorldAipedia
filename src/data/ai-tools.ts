
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
    link: 'https://stability.ai/',
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

    