
export const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  zh: { name: '中文', flag: '🇨🇳' },
  ja: { name: '日本語', flag: '🇯🇵' },
  pt: { name: 'Português', flag: '🇵🇹' },
} as const;

export type LanguageCode = keyof typeof languages;

// Defines keys for general UI strings that are not part of dynamic data like AI tools/categories
export type CoreTranslationKey = 
  // Header
  | 'navHome'
  | 'navCategories'
  | 'tooltipLanguageSwitcher' // Added new key
  // Mascot
  | 'mascotGreeting'
  // Homepage
  | 'homeTitle'
  | 'homeSubtitle'
  | 'homeExploreButton'
  | 'homeChatButton'
  | 'featuredAITools'
  | 'viewAllButton'
  // AI Chat Assistant
  | 'aiChatTitle'
  | 'aiChatDescription'
  | 'aiChatPlaceholder'
  | 'aiChatSend'
  | 'aiChatConnecting'
  | 'aiChatError'
  | 'aiChatErrorResponse'
  // Categories Page
  | 'categoriesTitle'
  | 'categoriesSubtitle'
  | 'viewToolsButton'
  // Category Detail Page
  | 'noToolsInCategory'
  | 'noToolsInCategorySuggestion'
  | 'allCategoriesButton'
  // AI Detail Page
  | 'backToHomeButton'
  | 'aboutSectionTitle'
  | 'visitWebsiteButton'
  // Generic
  | 'learnMoreButton'
  | 'loadingText';


export type TranslationSet = {
  [key in CoreTranslationKey]: string;
};

export type Translations = {
  [key in LanguageCode]: TranslationSet;
};

export const translations: Translations = {
  en: {
    navHome: 'Home',
    navCategories: 'Categories',
    tooltipLanguageSwitcher: 'Change language',
    mascotGreeting: 'Hello! Explore the world of AI with me!',
    homeTitle: 'Unlock the Power of AI',
    homeSubtitle: 'Welcome to World AI – your ultimate launchpad for discovering groundbreaking AI tools. Dive in, explore, and revolutionize your world.',
    homeExploreButton: 'Explore AI Categories',
    homeChatButton: 'Chat with AI Guide',
    featuredAITools: 'Featured AI Innovations',
    viewAllButton: 'View All AI Tools & Categories',
    aiChatTitle: 'AI Assistant',
    aiChatDescription: 'Ask me about WorldAIpedia or general AI topics!',
    aiChatPlaceholder: 'Type your message...',
    aiChatSend: 'Send',
    aiChatConnecting: 'Connecting to assistant...',
    aiChatError: "Sorry, I couldn't connect right now. Please try again later.",
    aiChatErrorResponse: "I'm having trouble responding right now. Please try again.",
    categoriesTitle: 'Explore AI by Category',
    categoriesSubtitle: 'Find AI tools tailored to your needs, organized into relevant categories for easy browsing.',
    viewToolsButton: 'View Tools',
    noToolsInCategory: 'No AI tools found in the "{categoryName}" category yet.',
    noToolsInCategorySuggestion: 'Check back soon, or explore other categories!',
    allCategoriesButton: 'All Categories',
    backToHomeButton: 'Back to Home',
    aboutSectionTitle: 'About {toolTitle}',
    visitWebsiteButton: "Visit Website",
    learnMoreButton: 'Learn More',
    loadingText: 'Loading...'
  },
  es: {
    navHome: 'Inicio',
    navCategories: 'Categorías',
    tooltipLanguageSwitcher: 'Cambiar idioma',
    mascotGreeting: '¡Hola! ¡Explora el mundo de la IA conmigo!',
    homeTitle: 'Desbloquea el Poder de la IA',
    homeSubtitle: 'Bienvenido a World AI: tu plataforma definitiva para descubrir herramientas de IA innovadoras. Sumérgete, explora y revoluciona tu mundo.',
    homeExploreButton: 'Explorar Categorías de IA',
    homeChatButton: 'Chatear con Guía IA',
    featuredAITools: 'Innovaciones Destacadas en IA',
    viewAllButton: 'Ver Todas las Herramientas y Categorías de IA',
    aiChatTitle: 'Asistente IA',
    aiChatDescription: '¡Pregúntame sobre WorldAIpedia o temas generales de IA!',
    aiChatPlaceholder: 'Escribe tu mensaje...',
    aiChatSend: 'Enviar',
    aiChatConnecting: 'Conectando con el asistente...',
    aiChatError: 'Lo siento, no pude conectarme en este momento. Por favor, inténtalo de nuevo más tarde.',
    aiChatErrorResponse: 'Estoy teniendo problemas para responder en este momento. Por favor, inténtalo de nuevo.',
    categoriesTitle: 'Explora la IA por Categoría',
    categoriesSubtitle: 'Encuentra herramientas de IA adaptadas a tus necesidades, organizadas en categorías relevantes para facilitar la navegación.',
    viewToolsButton: 'Ver Herramientas',
    noToolsInCategory: 'Aún no se han encontrado herramientas de IA en la categoría "{categoryName}".',
    noToolsInCategorySuggestion: '¡Vuelve pronto o explora otras categorías!',
    allCategoriesButton: 'Todas las Categorías',
    backToHomeButton: 'Volver al Inicio',
    aboutSectionTitle: 'Acerca de {toolTitle}',
    visitWebsiteButton: "Visitar Sitio Web",
    learnMoreButton: 'Saber Más',
    loadingText: 'Cargando...'
  },
  it: {
    navHome: 'Home',
    navCategories: 'Categorie',
    tooltipLanguageSwitcher: 'Cambia lingua',
    mascotGreeting: 'Ciao! Esplora il mondo dell\'IA con me!',
    homeTitle: 'Sblocca il Potere dell\'IA',
    homeSubtitle: 'Benvenuto in World AI – la tua piattaforma definitiva per scoprire strumenti IA rivoluzionari. Immergiti, esplora e rivoluziona il tuo mondo.',
    homeExploreButton: 'Esplora Categorie IA',
    homeChatButton: 'Chatta con la Guida IA',
    featuredAITools: 'Innovazioni IA in Evidenza',
    viewAllButton: 'Visualizza Tutti gli Strumenti e le Categorie IA',
    aiChatTitle: 'Assistente IA',
    aiChatDescription: 'Chiedimi di WorldAIpedia o argomenti generali sull\'IA!',
    aiChatPlaceholder: 'Scrivi il tuo messaggio...',
    aiChatSend: 'Invia',
    aiChatConnecting: 'Connessione all\'assistente...',
    aiChatError: "Spiacente, non sono riuscito a connettermi ora. Riprova più tardi.",
    aiChatErrorResponse: "Sto avendo problemi a rispondere ora. Riprova.",
    categoriesTitle: 'Esplora l\'IA per Categoria',
    categoriesSubtitle: 'Trova strumenti IA su misura per le tue esigenze, organizzati in categorie pertinenti per una facile navigazione.',
    viewToolsButton: 'Vedi Strumenti',
    noToolsInCategory: 'Nessuno strumento IA trovato nella categoria "{categoryName}" per ora.',
    noToolsInCategorySuggestion: 'Torna presto o esplora altre categorie!',
    allCategoriesButton: 'Tutte le Categorie',
    backToHomeButton: 'Torna alla Home',
    aboutSectionTitle: 'Informazioni su {toolTitle}',
    visitWebsiteButton: "Visita il Sito",
    learnMoreButton: 'Scopri di Più',
    loadingText: 'Caricamento...'
  },
  zh: {
    navHome: '首页',
    navCategories: '类别',
    tooltipLanguageSwitcher: '更改语言',
    mascotGreeting: '你好！和我一起探索AI的世界吧！',
    homeTitle: '解锁人工智能的力量',
    homeSubtitle: '欢迎来到 World AI – 您发现突破性人工智能工具的终极平台。潜入、探索并彻底改变您的世界。',
    homeExploreButton: '探索AI类别',
    homeChatButton: '与AI指南聊天',
    featuredAITools: '特色AI创新',
    viewAllButton: '查看所有AI工具和类别',
    aiChatTitle: 'AI助手',
    aiChatDescription: '问我关于WorldAIpedia或一般AI主题的问题！',
    aiChatPlaceholder: '输入您的消息...',
    aiChatSend: '发送',
    aiChatConnecting: '正在连接到助手...',
    aiChatError: "抱歉，我现在无法连接。请稍后再试。",
    aiChatErrorResponse: "我现在无法回应。请再试一次。",
    categoriesTitle: '按类别探索AI',
    categoriesSubtitle: '查找根据您的需求量身定制的AI工具，这些工具已组织到相关类别中以便于浏览。',
    viewToolsButton: '查看工具',
    noToolsInCategory: '"{categoryName}" 类别中尚未找到AI工具。',
    noToolsInCategorySuggestion: '请稍后回来查看，或探索其他类别！',
    allCategoriesButton: '所有类别',
    backToHomeButton: '返回首页',
    aboutSectionTitle: '关于 {toolTitle}',
    visitWebsiteButton: "访问网站",
    learnMoreButton: '了解更多',
    loadingText: '加载中...'
  },
  ja: {
    navHome: 'ホーム',
    navCategories: 'カテゴリー',
    tooltipLanguageSwitcher: '言語を変更',
    mascotGreeting: 'こんにちは！私と一緒にAIの世界を探検しましょう！',
    homeTitle: 'AIの力を解き放つ',
    homeSubtitle: 'World AIへようこそ – 画期的なAIツールを発見するための究極のランチパッドです。飛び込み、探求し、あなたの世界を革命的に変えましょう。',
    homeExploreButton: 'AIカテゴリーを探す',
    homeChatButton: 'AIガイドとチャット',
    featuredAITools: '注目のAIイノベーション',
    viewAllButton: 'すべてのAIツールとカテゴリーを見る',
    aiChatTitle: 'AIアシスタント',
    aiChatDescription: 'WorldAIpediaや一般的なAIのトピックについて私に尋ねてください！',
    aiChatPlaceholder: 'メッセージを入力してください...',
    aiChatSend: '送信',
    aiChatConnecting: 'アシスタントに接続しています...',
    aiChatError: "申し訳ありませんが、現在接続できませんでした。後でもう一度お試しください。",
    aiChatErrorResponse: "現在、応答に問題が発生しています。もう一度お試しください。",
    categoriesTitle: 'カテゴリー別にAIを探す',
    categoriesSubtitle: 'ニーズに合わせたAIツールを、関連するカテゴリーに整理して簡単に見つけられます。',
    viewToolsButton: 'ツールを見る',
    noToolsInCategory: '「{categoryName}」カテゴリーにはまだAIツールが見つかりません。',
    noToolsInCategorySuggestion: 'しばらくしてから再度確認するか、他のカテゴリーを探索してください！',
    allCategoriesButton: 'すべてのカテゴリー',
    backToHomeButton: 'ホームに戻る',
    aboutSectionTitle: '{toolTitle}について',
    visitWebsiteButton: "ウェブサイトへ",
    learnMoreButton: '詳しく見る',
    loadingText: '読み込み中...'
  },
  pt: {
    navHome: 'Início',
    navCategories: 'Categorias',
    tooltipLanguageSwitcher: 'Mudar idioma',
    mascotGreeting: 'Olá! Explore o mundo da IA comigo!',
    homeTitle: 'Desbloqueie o Poder da IA',
    homeSubtitle: 'Bem-vindo à World AI – sua plataforma definitiva para descobrir ferramentas de IA inovadoras. Mergulhe, explore e revolucione seu mundo.',
    homeExploreButton: 'Explorar Categorias de IA',
    homeChatButton: 'Conversar com o Guia de IA',
    featuredAITools: 'Inovações em IA em Destaque',
    viewAllButton: 'Ver Todas as Ferramentas e Categorias de IA',
    aiChatTitle: 'Assistente de IA',
    aiChatDescription: 'Pergunte-me sobre a WorldAIpedia ou tópicos gerais de IA!',
    aiChatPlaceholder: 'Digite sua mensagem...',
    aiChatSend: 'Enviar',
    aiChatConnecting: 'Conectando ao assistente...',
    aiChatError: "Desculpe, não consegui conectar agora. Por favor, tente novamente mais tarde.",
    aiChatErrorResponse: "Estou com problemas para responder agora. Por favor, tente novamente.",
    categoriesTitle: 'Explore IA por Categoria',
    categoriesSubtitle: 'Encontre ferramentas de IA adaptadas às suas necessidades, organizadas em categorias relevantes para fácil navegação.',
    viewToolsButton: 'Ver Ferramentas',
    noToolsInCategory: 'Nenhuma ferramenta de IA encontrada na categoria "{categoryName}" ainda.',
    noToolsInCategorySuggestion: 'Volte em breve ou explore outras categorias!',
    allCategoriesButton: 'Todas as Categorias',
    backToHomeButton: 'Voltar para Início',
    aboutSectionTitle: 'Sobre {toolTitle}',
    visitWebsiteButton: "Visitar Site",
    learnMoreButton: 'Saiba Mais',
    loadingText: 'Carregando...'
  },
};
