
import type { Post, Category, LocalizedString } from '@/lib/types';
import { subDays } from 'date-fns';

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

// Sample posts data
export const posts: Post[] = [
  {
    id: 'chatgpt-post', // Changed ID to reflect it's a post
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
    tags: ['LLM', 'OpenAI', 'Conversational AI'],
    publishedDate: subDays(new Date(), 2),
    link: 'https://openai.com/chatgpt',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'chatbot interface concept',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'abstract neural network'
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
    tags: ['AI Art', 'Image Generation', 'Creative Tools'],
    publishedDate: subDays(new Date(), 5),
    link: 'https://www.midjourney.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'surreal AI artwork',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'digital art creation process'
  },
  // Add more adapted posts here, ensure they have publishedDate and tags
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
    tags: ['Development', 'AI Coding', 'Productivity'],
    publishedDate: subDays(new Date(), 10),
    link: 'https://copilot.github.com/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'code suggestion example',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'developer workflow diagram'
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
    tags: ['Graphic Design', 'AI Tools', 'Marketing'],
    publishedDate: subDays(new Date(), 12),
    link: 'https://www.canva.com/magic-design/',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'AI generated presentation slide',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'social media graphic design'
  }
];

export const getPostById = (id: string): Post | undefined => {
  return posts.find(post => post.id === id);
};

export const getPostsByCategory = (categorySlug: string): Post[] => {
  const categoryInfo = categories.find(cat => cat.slug === categorySlug);
  if (!categoryInfo) return [];
  return posts.filter(post => post.categorySlug === categorySlug || post.tags.includes(categoryInfo.name.en)); // Check main category or if tag matches
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
