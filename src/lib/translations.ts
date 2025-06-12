
export const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  zh: { name: '中文', flag: '🇨🇳' },
  ja: { name: '日本語', flag: '🇯🇵' },
  pt: { name: 'Português', flag: '🇵🇹' },
} as const;

export type LanguageCode = keyof typeof languages;

export type CoreTranslationKey = 
  // Header
  | 'navHome'
  | 'navCategories'
  | 'tooltipLanguageSwitcher'
  | 'loginButton'
  | 'logoutButton'
  | 'myProfileTooltip'
  // Mascot
  | 'mascotGreeting'
  // Homepage
  | 'homeTitle'
  | 'homeSubtitle'
  | 'homeExploreButton'
  | 'homeChatButton' // Used for FAB tooltip now
  | 'featuredAITools'
  | 'viewAllButton'
  // AI Chat Assistant "Lace"
  | 'laceChatTitle'
  | 'laceChatDescription'
  | 'laceChatPlaceholder'
  | 'laceChatSend'
  | 'laceChatConnecting'
  | 'laceChatError'
  | 'laceChatErrorResponse'
  | 'laceChatImageUploadTooltip'
  | 'laceChatImagePreviewAlt'
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
  | 'additionalVisualsTitle'
  | 'visualDetailAlt'
  | 'userReviewsTitle'
  | 'noCommentsYet'
  | 'addYourCommentTitle'
  | 'ratingLabel'
  | 'commentLabel'
  | 'anonymousCommentLabel'
  | 'submitCommentButton'
  | 'subscribeToCommentTitle'
  | 'subscribeToCommentDescription'
  | 'subscribeButton'
  | 'cancelButton'
  | 'loginToCommentPrompt'
  | 'chatAboutAiButton' // New key
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
    loginButton: 'Login',
    logoutButton: 'Logout',
    myProfileTooltip: 'My Profile',
    mascotGreeting: 'Hi, I\'m Lace! Ready to explore AI?',
    homeTitle: 'Unlock the Power of AI',
    homeSubtitle: 'Welcome to World AI – your ultimate launchpad for discovering groundbreaking AI tools. Dive in, explore, and revolutionize your world.',
    homeExploreButton: 'Explore AI Categories',
    homeChatButton: 'Chat with Lace',
    featuredAITools: 'Featured AI Innovations',
    viewAllButton: 'View All AI Tools & Categories',
    laceChatTitle: 'Chat with Lace',
    laceChatDescription: 'I\'m Lace! Ask me about World AI, AI tools, or let\'s just chat.',
    laceChatPlaceholder: 'Type your message or upload an image...',
    laceChatSend: 'Send',
    laceChatConnecting: 'Lace is connecting...',
    laceChatError: "Sorry, Lace couldn't connect right now. Please try again later.",
    laceChatErrorResponse: "Lace is having trouble responding. Please try again.",
    laceChatImageUploadTooltip: 'Upload Image',
    laceChatImagePreviewAlt: 'Selected image preview',
    categoriesTitle: 'Explore AI by Category',
    categoriesSubtitle: 'Find AI tools tailored to your needs, organized into relevant categories for easy browsing.',
    viewToolsButton: 'View Tools',
    noToolsInCategory: 'No AI tools found in the "{categoryName}" category yet.',
    noToolsInCategorySuggestion: 'Check back soon, or explore other categories!',
    allCategoriesButton: 'All Categories',
    backToHomeButton: 'Back to Home',
    aboutSectionTitle: 'About {toolTitle}',
    visitWebsiteButton: "Visit Website",
    additionalVisualsTitle: 'Visual Insights',
    visualDetailAlt: 'Visual Detail {number}',
    userReviewsTitle: 'User Reviews & Comments',
    noCommentsYet: 'No comments yet. Be the first to share your thoughts!',
    addYourCommentTitle: 'Add Your Comment',
    ratingLabel: 'Your Rating',
    commentLabel: 'Your Comment',
    anonymousCommentLabel: 'Comment anonymously',
    submitCommentButton: 'Submit Comment',
    subscribeToCommentTitle: 'Subscription Required',
    subscribeToCommentDescription: 'To comment and rate AIs, you need to be a PRO member. Subscribe now for just $1/month!',
    subscribeButton: 'Subscribe ($1/month)',
    cancelButton: 'Cancel',
    loginToCommentPrompt: 'Please log in to leave a comment and rate this AI.',
    chatAboutAiButton: 'Chat with Lace about {toolName}',
    learnMoreButton: 'Learn More',
    loadingText: 'Loading...'
  },
  es: {
    navHome: 'Inicio',
    navCategories: 'Categorías',
    tooltipLanguageSwitcher: 'Cambiar idioma',
    loginButton: 'Iniciar Sesión',
    logoutButton: 'Cerrar Sesión',
    myProfileTooltip: 'Mi Perfil',
    mascotGreeting: '¡Hola, soy Lace! ¿Listo para explorar la IA?',
    homeTitle: 'Desbloquea el Poder de la IA',
    homeSubtitle: 'Bienvenido a World AI: tu plataforma definitiva para descubrir herramientas de IA innovadoras. Sumérgete, explora y revoluciona tu mundo.',
    homeExploreButton: 'Explorar Categorías de IA',
    homeChatButton: 'Chatear con Lace',
    featuredAITools: 'Innovaciones Destacadas en IA',
    viewAllButton: 'Ver Todas las Herramientas y Categorías de IA',
    laceChatTitle: 'Chatear con Lace',
    laceChatDescription: '¡Soy Lace! Pregúntame sobre World AI, herramientas de IA, o simplemente charlemos.',
    laceChatPlaceholder: 'Escribe tu mensaje o sube una imagen...',
    laceChatSend: 'Enviar',
    laceChatConnecting: 'Lace se está conectando...',
    laceChatError: 'Lo siento, Lace no pudo conectarse en este momento. Por favor, inténtalo de nuevo más tarde.',
    laceChatErrorResponse: 'Lace está teniendo problemas para responder. Por favor, inténtalo de nuevo.',
    laceChatImageUploadTooltip: 'Subir Imagen',
    laceChatImagePreviewAlt: 'Vista previa de la imagen seleccionada',
    categoriesTitle: 'Explora la IA por Categoría',
    categoriesSubtitle: 'Encuentra herramientas de IA adaptadas a tus necesidades, organizadas en categorías relevantes para facilitar la navegación.',
    viewToolsButton: 'Ver Herramientas',
    noToolsInCategory: 'Aún no se han encontrado herramientas de IA en la categoría "{categoryName}".',
    noToolsInCategorySuggestion: '¡Vuelve pronto o explora otras categorías!',
    allCategoriesButton: 'Todas las Categorías',
    backToHomeButton: 'Volver al Inicio',
    aboutSectionTitle: 'Acerca de {toolTitle}',
    visitWebsiteButton: "Visitar Sitio Web",
    additionalVisualsTitle: 'Perspectivas Visuales',
    visualDetailAlt: 'Detalle Visual {number}',
    userReviewsTitle: 'Reseñas y Comentarios de Usuarios',
    noCommentsYet: 'Aún no hay comentarios. ¡Sé el primero en compartir tu opinión!',
    addYourCommentTitle: 'Añade tu Comentario',
    ratingLabel: 'Tu Calificación',
    commentLabel: 'Tu Comentario',
    anonymousCommentLabel: 'Comentar anónimamente',
    submitCommentButton: 'Enviar Comentario',
    subscribeToCommentTitle: 'Se Requiere Suscripción',
    subscribeToCommentDescription: 'Para comentar y calificar IAs, necesitas ser miembro PRO. ¡Suscríbete ahora por solo $1/mes!',
    subscribeButton: 'Suscribirse ($1/mes)',
    cancelButton: 'Cancelar',
    loginToCommentPrompt: 'Por favor, inicia sesión para dejar un comentario y calificar esta IA.',
    chatAboutAiButton: 'Chatear con Lace sobre {toolName}',
    learnMoreButton: 'Saber Más',
    loadingText: 'Cargando...'
  },
  it: {
    navHome: 'Home',
    navCategories: 'Categorie',
    tooltipLanguageSwitcher: 'Cambia lingua',
    loginButton: 'Accedi',
    logoutButton: 'Esci',
    myProfileTooltip: 'Il Mio Profilo',
    mascotGreeting: 'Ciao, sono Lace! Pronto a esplorare l\'IA?',
    homeTitle: 'Sblocca il Potere dell\'IA',
    homeSubtitle: 'Benvenuto in World AI – la tua piattaforma definitiva per scoprire strumenti IA rivoluzionari. Immergiti, esplora e rivoluziona il tuo mondo.',
    homeExploreButton: 'Esplora Categorie IA',
    homeChatButton: 'Chatta con Lace',
    featuredAITools: 'Innovazioni IA in Evidenza',
    viewAllButton: 'Visualizza Tutti gli Strumenti e le Categorie IA',
    laceChatTitle: 'Chatta con Lace',
    laceChatDescription: 'Sono Lace! Chiedimi di World AI, strumenti IA, o semplicemente chattiamo.',
    laceChatPlaceholder: 'Scrivi il tuo messaggio o carica un\'immagine...',
    laceChatSend: 'Invia',
    laceChatConnecting: 'Lace si sta connettendo...',
    laceChatError: "Spiacente, Lace non è riuscito a connettersi ora. Riprova più tardi.",
    laceChatErrorResponse: "Lace sta avendo problemi a rispondere ora. Riprova.",
    laceChatImageUploadTooltip: 'Carica Immagine',
    laceChatImagePreviewAlt: 'Anteprima immagine selezionata',
    categoriesTitle: 'Esplora l\'IA per Categoria',
    categoriesSubtitle: 'Trova strumenti IA su misura per le tue esigenze, organizzati in categorie pertinenti per una facile navigazione.',
    viewToolsButton: 'Vedi Strumenti',
    noToolsInCategory: 'Nessuno strumento IA trovato nella categoria "{categoryName}" per ora.',
    noToolsInCategorySuggestion: 'Torna presto o esplora altre categorie!',
    allCategoriesButton: 'Tutte le Categorie',
    backToHomeButton: 'Torna alla Home',
    aboutSectionTitle: 'Informazioni su {toolTitle}',
    visitWebsiteButton: "Visita il Sito",
    additionalVisualsTitle: 'Approfondimenti Visivi',
    visualDetailAlt: 'Dettaglio Visivo {number}',
    userReviewsTitle: 'Recensioni e Commenti degli Utenti',
    noCommentsYet: 'Nessun commento ancora. Sii il primo a condividere la tua opinione!',
    addYourCommentTitle: 'Aggiungi il Tuo Commento',
    ratingLabel: 'La Tua Valutazione',
    commentLabel: 'Il Tuo Commento',
    anonymousCommentLabel: 'Commenta in modo anonimo',
    submitCommentButton: 'Invia Commento',
    subscribeToCommentTitle: 'Abbonamento Richiesto',
    subscribeToCommentDescription: 'Per commentare e valutare le IA, devi essere un membro PRO. Abbonati ora per solo $1/mese!',
    subscribeButton: 'Abbonati ($1/mese)',
    cancelButton: 'Annulla',
    loginToCommentPrompt: 'Effettua il login per lasciare un commento e valutare questa IA.',
    chatAboutAiButton: 'Chatta con Lace su {toolName}',
    learnMoreButton: 'Scopri di Più',
    loadingText: 'Caricamento...'
  },
  zh: {
    navHome: '首页',
    navCategories: '类别',
    tooltipLanguageSwitcher: '更改语言',
    loginButton: '登录',
    logoutButton: '登出',
    myProfileTooltip: '我的个人资料',
    mascotGreeting: '你好，我是Lace！准备好探索AI的世界了吗？',
    homeTitle: '解锁人工智能的力量',
    homeSubtitle: '欢迎来到 World AI – 您发现突破性人工智能工具的终极平台。潜入、探索并彻底改变您的世界。',
    homeExploreButton: '探索AI类别',
    homeChatButton: '与Lace聊天',
    featuredAITools: '特色AI创新',
    viewAllButton: '查看所有AI工具和类别',
    laceChatTitle: '与Lace聊天',
    laceChatDescription: '我是Lace！问我关于World AI、AI工具的问题，或者我们聊聊天吧。',
    laceChatPlaceholder: '输入您的消息或上传图片...',
    laceChatSend: '发送',
    laceChatConnecting: 'Lace正在连接...',
    laceChatError: "抱歉，Lace现在无法连接。请稍后再试。",
    laceChatErrorResponse: "Lace现在无法回应。请再试一次。",
    laceChatImageUploadTooltip: '上传图片',
    laceChatImagePreviewAlt: '选定图片预览',
    categoriesTitle: '按类别探索AI',
    categoriesSubtitle: '查找根据您的需求量身定制的AI工具，这些工具已组织到相关类别中以便于浏览。',
    viewToolsButton: '查看工具',
    noToolsInCategory: '"{categoryName}" 类别中尚未找到AI工具。',
    noToolsInCategorySuggestion: '请稍后回来查看，或探索其他类别！',
    allCategoriesButton: '所有类别',
    backToHomeButton: '返回首页',
    aboutSectionTitle: '关于 {toolTitle}',
    visitWebsiteButton: "访问网站",
    additionalVisualsTitle: '视觉洞察',
    visualDetailAlt: '视觉细节 {number}',
    userReviewsTitle: '用户评论和评论',
    noCommentsYet: '暂无评论。成为第一个分享您的想法的人！',
    addYourCommentTitle: '添加您的评论',
    ratingLabel: '您的评分',
    commentLabel: '您的评论',
    anonymousCommentLabel: '匿名评论',
    submitCommentButton: '提交评论',
    subscribeToCommentTitle: '需要订阅',
    subscribeToCommentDescription: '要评论和评价AI，您需要成为PRO会员。立即订阅，每月仅需1美元！',
    subscribeButton: '订阅 ($1/月)',
    cancelButton: '取消',
    loginToCommentPrompt: '请登录以发表评论并评价此AI。',
    chatAboutAiButton: '与Lace聊聊 {toolName}',
    learnMoreButton: '了解更多',
    loadingText: '加载中...'
  },
  ja: {
    navHome: 'ホーム',
    navCategories: 'カテゴリー',
    tooltipLanguageSwitcher: '言語を変更',
    loginButton: 'ログイン',
    logoutButton: 'ログアウト',
    myProfileTooltip: 'マイプロフィール',
    mascotGreeting: 'こんにちは、Laceです！AIの世界を探検する準備はできましたか？',
    homeTitle: 'AIの力を解き放つ',
    homeSubtitle: 'World AIへようこそ – 画期的なAIツールを発見するための究極のランチパッドです。飛び込み、探求し、あなたの世界を革命的に変えましょう。',
    homeExploreButton: 'AIカテゴリーを探す',
    homeChatButton: 'Laceとチャット',
    featuredAITools: '注目のAIイノベーション',
    viewAllButton: 'すべてのAIツールとカテゴリーを見る',
    laceChatTitle: 'Laceとチャット',
    laceChatDescription: '私はLaceです！World AIやAIツールについて尋ねるか、ただおしゃべりしましょう。',
    laceChatPlaceholder: 'メッセージを入力するか、画像をアップロードしてください...',
    laceChatSend: '送信',
    laceChatConnecting: 'Laceが接続しています...',
    laceChatError: "申し訳ありませんが、Laceは現在接続できませんでした。後でもう一度お試しください。",
    laceChatErrorResponse: "Laceは現在、応答に問題が発生しています。もう一度お試しください。",
    laceChatImageUploadTooltip: '画像をアップロード',
    laceChatImagePreviewAlt: '選択した画像のプレビュー',
    categoriesTitle: 'カテゴリー別にAIを探す',
    categoriesSubtitle: 'ニーズに合わせたAIツールを、関連するカテゴリーに整理して簡単に見つけられます。',
    viewToolsButton: 'ツールを見る',
    noToolsInCategory: '「{categoryName}」カテゴリーにはまだAIツールが見つかりません。',
    noToolsInCategorySuggestion: 'しばらくしてから再度確認するか、他のカテゴリーを探索してください！',
    allCategoriesButton: 'すべてのカテゴリー',
    backToHomeButton: 'ホームに戻る',
    aboutSectionTitle: '{toolTitle}について',
    visitWebsiteButton: "ウェブサイトへ",
    additionalVisualsTitle: 'ビジュアルインサイト',
    visualDetailAlt: 'ビジュアル詳細 {number}',
    userReviewsTitle: 'ユーザーレビューとコメント',
    noCommentsYet: 'コメントはまだありません。あなたの考えを最初に共有しましょう！',
    addYourCommentTitle: 'コメントを追加',
    ratingLabel: 'あなたの評価',
    commentLabel: 'あなたのコメント',
    anonymousCommentLabel: '匿名でコメントする',
    submitCommentButton: 'コメントを送信',
    subscribeToCommentTitle: 'サブスクリプションが必要です',
    subscribeToCommentDescription: 'AIにコメントして評価するには、PROメンバーである必要があります。月額わずか1ドルで今すぐ購読しましょう！',
    subscribeButton: '購読する ($1/月)',
    cancelButton: 'キャンセル',
    loginToCommentPrompt: 'コメントを残してこのAIを評価するには、ログインしてください。',
    chatAboutAiButton: '{toolName}についてLaceとチャットする',
    learnMoreButton: '詳しく見る',
    loadingText: '読み込み中...'
  },
  pt: {
    navHome: 'Início',
    navCategories: 'Categorias',
    tooltipLanguageSwitcher: 'Mudar idioma',
    loginButton: 'Entrar',
    logoutButton: 'Sair',
    myProfileTooltip: 'Meu Perfil',
    mascotGreeting: 'Olá, sou Lace! Pronto para explorar a IA?',
    homeTitle: 'Desbloqueie o Poder da IA',
    homeSubtitle: 'Bem-vindo à World AI – sua plataforma definitiva para descobrir ferramentas de IA inovadoras. Mergulhe, explore e revolucione seu mundo.',
    homeExploreButton: 'Explorar Categorias de IA',
    homeChatButton: 'Conversar com Lace',
    featuredAITools: 'Inovações em IA em Destaque',
    viewAllButton: 'Ver Todas as Ferramentas e Categorias de IA',
    laceChatTitle: 'Conversar com Lace',
    laceChatDescription: 'Sou Lace! Pergunte-me sobre a World AI, ferramentas de IA, ou vamos apenas conversar.',
    laceChatPlaceholder: 'Digite sua mensagem ou carregue uma imagem...',
    laceChatSend: 'Enviar',
    laceChatConnecting: 'Lace está conectando...',
    laceChatError: "Desculpe, Lace não pôde conectar agora. Por favor, tente novamente mais tarde.",
    laceChatErrorResponse: "Lace está com problemas para responder agora. Por favor, tente novamente.",
    laceChatImageUploadTooltip: 'Carregar Imagem',
    laceChatImagePreviewAlt: 'Pré-visualização da imagem selecionada',
    categoriesTitle: 'Explore IA por Categoria',
    categoriesSubtitle: 'Encontre ferramentas de IA adaptadas às suas necessidades, organizadas em categorias relevantes para fácil navegação.',
    viewToolsButton: 'Ver Ferramentas',
    noToolsInCategory: 'Nenhuma ferramenta de IA encontrada na categoria "{categoryName}" ainda.',
    noToolsInCategorySuggestion: 'Volte em breve ou explore outras categorias!',
    allCategoriesButton: 'Todas as Categorias',
    backToHomeButton: 'Voltar para Início',
    aboutSectionTitle: 'Sobre {toolTitle}',
    visitWebsiteButton: "Visitar Site",
    additionalVisualsTitle: 'Insights Visuais',
    visualDetailAlt: 'Detalhe Visual {number}',
    userReviewsTitle: 'Avaliações e Comentários de Usuários',
    noCommentsYet: 'Nenhum comentário ainda. Seja o primeiro a compartilhar suas opiniões!',
    addYourCommentTitle: 'Adicione Seu Comentário',
    ratingLabel: 'Sua Avaliação',
    commentLabel: 'Seu Comentário',
    anonymousCommentLabel: 'Comentar anonimamente',
    submitCommentButton: 'Enviar Comentário',
    subscribeToCommentTitle: 'Assinatura Necessária',
    subscribeToCommentDescription: 'Para comentar e avaliar IAs, você precisa ser um membro PRO. Assine agora por apenas $1/mês!',
    subscribeButton: 'Assinar ($1/mês)',
    cancelButton: 'Cancelar',
    loginToCommentPrompt: 'Faça login para deixar um comentário e avaliar esta IA.',
    chatAboutAiButton: 'Conversar com Lace sobre {toolName}',
    learnMoreButton: 'Saiba Mais',
    loadingText: 'Carregando...'
  },
};
