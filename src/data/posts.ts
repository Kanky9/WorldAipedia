
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
  // This data can be used to manually seed Firestore or kept as a reference.
  // For the live application, it's no longer the direct source.
  // Example structure (ensure 'id' is unique if manually seeding):
  /*
  {
    id: 'chatgpt-example', // Use a unique ID for Firestore
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
    publishedDate: new Date('2023-10-26T10:00:00Z'), // Use actual Date objects
    link: 'https://openai.com/chatgpt',
    detailImageUrl1: 'https://placehold.co/400x300.png',
    detailImageHint1: 'chatbot interface concept',
    detailImageUrl2: 'https://placehold.co/400x300.png',
    detailImageHint2: 'abstract neural network',
  },
  // ... other example posts
  */
];

// These functions are still useful for working with the static 'categories' array.
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
