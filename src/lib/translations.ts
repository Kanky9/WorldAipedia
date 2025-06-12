
export const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  zh: { name: '中文', flag: '🇨🇳' }, // Chinese
  ja: { name: '日本語', flag: '🇯🇵' }, // Japanese
  pt: { name: 'Português', flag: '🇵🇹' }, // Portuguese
} as const;

export type LanguageCode = keyof typeof languages;

export type TranslationSet = {
  // Header
  navHome: string;
  navCategories: string;
  // Mascot
  mascotGreeting: string;
  // Homepage
  homeTitle: string;
  homeSubtitle: string;
  homeExploreButton: string;
  homeChatButton: string;
  featuredAITools: string;
  viewAllButton: string;
};

export type Translations = {
  [key in LanguageCode]: TranslationSet;
};

export const translations: Translations = {
  en: {
    navHome: 'Home',
    navCategories: 'Categories',
    mascotGreeting: 'Hello!',
    homeTitle: 'Unlock the Power of AI',
    homeSubtitle: 'Welcome to World AI – your ultimate launchpad for discovering groundbreaking AI tools. Dive in, explore, and revolutionize your world.',
    homeExploreButton: 'Explore AI Categories',
    homeChatButton: 'Chat with AI Guide',
    featuredAITools: 'Featured AI Innovations',
    viewAllButton: 'View All AI Tools & Categories',
  },
  es: {
    navHome: 'Inicio',
    navCategories: 'Categorías',
    mascotGreeting: '¡Hola!',
    homeTitle: 'Desbloquea el Poder de la IA',
    homeSubtitle: 'Bienvenido a World AI: tu plataforma definitiva para descubrir herramientas de IA innovadoras. Sumérgete, explora y revoluciona tu mundo.',
    homeExploreButton: 'Explorar Categorías de IA',
    homeChatButton: 'Chatear con Guía IA',
    featuredAITools: 'Innovaciones Destacadas en IA',
    viewAllButton: 'Ver Todas las Herramientas y Categorías de IA',
  },
  it: {
    navHome: 'Home',
    navCategories: 'Categorie',
    mascotGreeting: 'Ciao!',
    homeTitle: 'Sblocca il Potere dell\'IA',
    homeSubtitle: 'Benvenuto in World AI – la tua piattaforma definitiva per scoprire strumenti IA rivoluzionari. Immergiti, esplora e rivoluziona il tuo mondo.',
    homeExploreButton: 'Esplora Categorie IA',
    homeChatButton: 'Chatta con la Guida IA',
    featuredAITools: 'Innovazioni IA in Evidenza',
    viewAllButton: 'Visualizza Tutti gli Strumenti e le Categorie IA',
  },
  zh: {
    navHome: '首页',
    navCategories: '类别',
    mascotGreeting: '你好!',
    homeTitle: '解锁人工智能的力量',
    homeSubtitle: '欢迎来到 World AI – 您发现突破性人工智能工具的终极平台。潜入、探索并彻底改变您的世界。',
    homeExploreButton: '探索AI类别',
    homeChatButton: '与AI指南聊天',
    featuredAITools: '特色AI创新',
    viewAllButton: '查看所有AI工具和类别',
  },
  ja: {
    navHome: 'ホーム',
    navCategories: 'カテゴリー',
    mascotGreeting: 'こんにちは!',
    homeTitle: 'AIの力を解き放つ',
    homeSubtitle: 'World AIへようこそ – 画期的なAIツールを発見するための究極のランチパッドです。飛び込み、探求し、あなたの世界を革命的に変えましょう。',
    homeExploreButton: 'AIカテゴリーを探す',
    homeChatButton: 'AIガイドとチャット',
    featuredAITools: '注目のAIイノベーション',
    viewAllButton: 'すべてのAIツールとカテゴリーを見る',
  },
  pt: {
    navHome: 'Início',
    navCategories: 'Categorias',
    mascotGreeting: 'Olá!',
    homeTitle: 'Desbloqueie o Poder da IA',
    homeSubtitle: 'Bem-vindo à World AI – sua plataforma definitiva para descobrir ferramentas de IA inovadoras. Mergulhe, explore e revolucione seu mundo.',
    homeExploreButton: 'Explorar Categorias de IA',
    homeChatButton: 'Conversar com o Guia de IA',
    featuredAITools: 'Inovações em IA em Destaque',
    viewAllButton: 'Ver Todas as Ferramentas e Categorias de IA',
  },
};
