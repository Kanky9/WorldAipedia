
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
  | 'registerButton'
  | 'navAdmin'
  | 'navAccount'
  | 'proMemberLabel'
  // Mascot
  | 'mascotGreeting'
  // Homepage (Blog Listing)
  | 'blogTitle'
  | 'blogSubtitle'
  | 'exploreCategoriesButton' 
  | 'featuredPostsTitle' 
  | 'viewAllPostsButton'
  // Post Card
  | 'readMoreButton'
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
  // Categories Page (Post Categories)
  | 'categoriesTitle'
  | 'categoriesSubtitle'
  | 'viewPostsButton' 
  | 'noCategoriesAvailable'
  // Category Detail Page (Posts in Category)
  | 'noPostsInCategory' 
  | 'noPostsInCategorySuggestion' 
  | 'allCategoriesButton'
  // Post Detail Page
  | 'backToBlogButton' 
  | 'postContentTitle' 
  | 'visitAiToolWebsiteButton' 
  | 'additionalVisualsTitle'
  | 'visualDetailAlt'
  // Login Page
  | 'loginPageTitle'
  | 'loginPageSubtitle'
  | 'emailLabel'
  | 'emailPlaceholder'
  | 'passwordLabel'
  | 'forgotPasswordLink'
  | 'orContinueWith'
  | 'noAccountPrompt'
  | 'signUpLink'
  | 'loginAttemptMessage'
  | 'socialLoginAttemptMessage'
  // Register Page
  | 'registerPageTitle'
  | 'registerPageSubtitle'
  | 'usernameLabel'
  | 'usernamePlaceholder'
  | 'confirmPasswordLabel'
  | 'orSignUpWith'
  | 'alreadyHaveAccountPrompt'
  | 'loginLink'
  | 'registrationAttemptMessage'
  // Admin Page
  | 'adminPanelTitle'
  | 'adminCreatePostButton'
  | 'adminManagePostsTitle'
  | 'adminManagePostsDescription'
  | 'adminTableTitle'
  | 'adminTableDate'
  | 'adminTableStatus'
  | 'adminTableActions'
  | 'editButton'
  | 'deleteButton'
  | 'deletePostConfirm'
  | 'adminNoPosts'
  // Account Page
  | 'accountPageTitle'
  | 'accountPageSubtitle'
  | 'changeProfilePictureButton'
  | 'memberSinceLabel'
  | 'profileDetailsTitle'
  | 'currentPasswordLabel'
  | 'newPasswordLabel'
  | 'leaveBlankNoChange'
  | 'updateProfileButton'
  | 'profileUpdateSimulated'
  | 'subscriptionDetailsTitle'
  | 'currentPlanLabel'
  | 'nextBillingDateLabel'
  | 'paymentMethodLabel'
  | 'updatePaymentButton'
  | 'cancelSubscriptionButton'
  | 'cancelSubscriptionSimulated'
  | 'noActiveSubscription'
  | 'upgradeToProButton'
  | 'upgradeToProSimulated'
  // User Reviews & Comments
  | 'userReviewsTitle'
  | 'noCommentsYet'
  | 'addYourCommentTitle'
  | 'ratingLabel'
  | 'commentLabel'
  | 'anonymousCommentLabel'
  | 'submitCommentButton'
  | 'loginToCommentTitle'
  | 'loginToCommentDescription'
  | 'subscribeToCommentTitle'
  | 'subscribeToCommentDescription'
  | 'subscribeButton'
  | 'cancelButton'
  | 'loginToCommentPrompt'
  // Generic
  | 'loadingText';


export type TranslationSet = {
  [key in CoreTranslationKey]?: string; 
} & { 
  navHome: string;
  navCategories: string;
  featuredPostsTitle: string; 
  userReviewsTitle: string;
  loginToCommentPrompt: string;
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
    myProfileTooltip: 'My Account',
    registerButton: 'Sign Up',
    navAdmin: 'Admin',
    navAccount: 'My Account',
    proMemberLabel: 'PRO Member',
    mascotGreeting: 'Hi, I\'m Lace! Ready to explore AI?',
    blogTitle: 'The World AI Blog',
    blogSubtitle: 'Stay updated with the latest news, insights, and tools in the world of Artificial Intelligence.',
    exploreCategoriesButton: 'Explore Categories',
    featuredPostsTitle: 'Featured Posts',
    viewAllPostsButton: 'View All Posts & Categories',
    readMoreButton: 'Read More',
    laceChatTitle: 'Chat with Lace',
    laceChatDescription: 'I\'m Lace! Ask me about World AI, AI tools, or let\'s just chat.',
    laceChatPlaceholder: 'Type your message or upload an image...',
    laceChatSend: 'Send',
    laceChatConnecting: 'Lace is connecting...',
    laceChatError: "Sorry, Lace couldn't connect right now. Please try again later.",
    laceChatErrorResponse: "Lace is having trouble responding. Please try again.",
    laceChatImageUploadTooltip: 'Upload Image',
    laceChatImagePreviewAlt: 'Selected image preview',
    categoriesTitle: 'Explore Posts by Category',
    categoriesSubtitle: 'Find posts tailored to your interests, organized into relevant categories for easy browsing.',
    viewPostsButton: 'View Posts',
    noCategoriesAvailable: 'No categories available at the moment.',
    noPostsInCategory: 'No posts found in the "{categoryName}" category yet.',
    noPostsInCategorySuggestion: 'Check back soon, or explore other categories!',
    allCategoriesButton: 'All Categories',
    backToBlogButton: 'Back to Blog',
    postContentTitle: 'Post Content',
    visitAiToolWebsiteButton: "Visit Tool Website",
    additionalVisualsTitle: 'Visual Insights',
    visualDetailAlt: 'Visual Detail {number}',
    loadingText: 'Loading...',
    loginPageTitle: 'Welcome Back!',
    loginPageSubtitle: 'Log in to access your account and PRO features.',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    forgotPasswordLink: 'Forgot your password?',
    orContinueWith: 'Or continue with',
    noAccountPrompt: "Don't have an account?",
    signUpLink: 'Sign up',
    loginAttemptMessage: 'Login attempt (simulated)',
    socialLoginAttemptMessage: 'Login with {provider} (simulated)',
    registerPageTitle: 'Create your Account',
    registerPageSubtitle: 'Join World AI to discover and discuss AI tools.',
    usernameLabel: 'Username',
    usernamePlaceholder: 'Choose a username',
    confirmPasswordLabel: 'Confirm Password',
    orSignUpWith: 'Or sign up with',
    alreadyHaveAccountPrompt: 'Already have an account?',
    loginLink: 'Log in',
    registrationAttemptMessage: 'Registration attempt (simulated)',
    adminPanelTitle: 'Admin Panel',
    adminCreatePostButton: 'Create New Post',
    adminManagePostsTitle: 'Manage Posts',
    adminManagePostsDescription: 'Here you can edit, delete, and manage all blog posts.',
    adminTableTitle: 'Title',
    adminTableDate: 'Date',
    adminTableStatus: 'Status',
    adminTableActions: 'Actions',
    editButton: 'Edit',
    deleteButton: 'Delete',
    deletePostConfirm: 'Delete post {postId} (simulated)?',
    adminNoPosts: 'No posts found.',
    accountPageTitle: 'My Account',
    accountPageSubtitle: 'Manage your profile, subscription, and settings.',
    changeProfilePictureButton: 'Change Picture',
    memberSinceLabel: 'Member since',
    profileDetailsTitle: 'Profile Details',
    currentPasswordLabel: 'Current Password',
    newPasswordLabel: 'New Password (optional)',
    leaveBlankNoChange: 'Leave blank to keep current',
    updateProfileButton: 'Update Profile',
    profileUpdateSimulated: "Profile update (simulated).",
    subscriptionDetailsTitle: 'Subscription Details',
    currentPlanLabel: 'Current Plan',
    nextBillingDateLabel: 'Next Billing Date',
    paymentMethodLabel: 'Payment Method',
    updatePaymentButton: 'Update Payment Method',
    cancelSubscriptionButton: 'Cancel Subscription',
    cancelSubscriptionSimulated: "Subscription cancellation (simulated).",
    noActiveSubscription: 'You do not have an active PRO subscription.',
    upgradeToProButton: 'Upgrade to PRO - $1/month',
    upgradeToProSimulated: "Upgrade to PRO (simulated payment flow).",
    // User Reviews & Comments
    userReviewsTitle: "User Reviews & Comments",
    noCommentsYet: "No comments yet. Be the first to share your thoughts!",
    addYourCommentTitle: "Add Your Comment",
    ratingLabel: "Your Rating",
    commentLabel: "Your Comment",
    anonymousCommentLabel: "Comment Anonymously",
    submitCommentButton: "Submit Comment",
    loginToCommentTitle: "Login Required",
    loginToCommentDescription: "Please log in to post comments and ratings.",
    subscribeToCommentTitle: "PRO Feature",
    subscribeToCommentDescription: "Commenting and rating is a PRO feature. Please upgrade your account to participate.",
    subscribeButton: "Upgrade to PRO",
    cancelButton: "Cancel",
    loginToCommentPrompt: "Please log in to leave a comment.",
  },
  es: {
    navHome: 'Inicio',
    navCategories: 'Categorías',
    tooltipLanguageSwitcher: 'Cambiar idioma',
    loginButton: 'Iniciar Sesión',
    logoutButton: 'Cerrar Sesión',
    myProfileTooltip: 'Mi Cuenta',
    registerButton: 'Registrarse',
    navAdmin: 'Admin',
    navAccount: 'Mi Cuenta',
    proMemberLabel: 'Miembro PRO',
    mascotGreeting: '¡Hola, soy Lace! ¿Listo para explorar la IA?',
    blogTitle: 'El Blog de World AI',
    blogSubtitle: 'Mantente actualizado con las últimas noticias, ideas y herramientas en el mundo de la Inteligencia Artificial.',
    exploreCategoriesButton: 'Explorar Categorías',
    featuredPostsTitle: 'Publicaciones Destacadas',
    viewAllPostsButton: 'Ver Todas las Publicaciones y Categorías',
    readMoreButton: 'Leer Más',
    laceChatTitle: 'Chatear con Lace',
    laceChatDescription: '¡Soy Lace! Pregúntame sobre World AI, herramientas de IA, o simplemente charlemos.',
    laceChatPlaceholder: 'Escribe tu mensaje o sube una imagen...',
    laceChatSend: 'Enviar',
    laceChatConnecting: 'Lace se está conectando...',
    laceChatError: 'Lo siento, Lace no pudo conectarse en este momento. Por favor, inténtalo de nuevo más tarde.',
    laceChatErrorResponse: 'Lace está teniendo problemas para responder. Por favor, inténtalo de nuevo.',
    laceChatImageUploadTooltip: 'Subir Imagen',
    laceChatImagePreviewAlt: 'Vista previa de la imagen seleccionada',
    categoriesTitle: 'Explora Publicaciones por Categoría',
    categoriesSubtitle: 'Encuentra publicaciones adaptadas a tus intereses, organizadas en categorías relevantes para facilitar la navegación.',
    viewPostsButton: 'Ver Publicaciones',
    noCategoriesAvailable: 'No hay categorías disponibles en este momento.',
    noPostsInCategory: 'Aún no se han encontrado publicaciones en la categoría "{categoryName}".',
    noPostsInCategorySuggestion: '¡Vuelve pronto o explora otras categorías!',
    allCategoriesButton: 'Todas las Categorías',
    backToBlogButton: 'Volver al Blog',
    postContentTitle: 'Contenido de la Publicación',
    visitAiToolWebsiteButton: "Visitar Sitio Web de la Herramienta",
    additionalVisualsTitle: 'Perspectivas Visuales',
    visualDetailAlt: 'Detalle Visual {number}',
    loadingText: 'Cargando...',
    loginPageTitle: '¡Bienvenido de Nuevo!',
    loginPageSubtitle: 'Inicia sesión para acceder a tu cuenta y funciones PRO.',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'tu@ejemplo.com',
    passwordLabel: 'Contraseña',
    forgotPasswordLink: '¿Olvidaste tu contraseña?',
    orContinueWith: 'O continuar con',
    noAccountPrompt: '¿No tienes una cuenta?',
    signUpLink: 'Regístrate',
    loginAttemptMessage: 'Intento de inicio de sesión (simulado)',
    socialLoginAttemptMessage: 'Iniciar sesión con {provider} (simulado)',
    registerPageTitle: 'Crea tu Cuenta',
    registerPageSubtitle: 'Únete a World AI para descubrir y discutir herramientas de IA.',
    usernameLabel: 'Nombre de Usuario',
    usernamePlaceholder: 'Elige un nombre de usuario',
    confirmPasswordLabel: 'Confirmar Contraseña',
    orSignUpWith: 'O regístrate con',
    alreadyHaveAccountPrompt: '¿Ya tienes una cuenta?',
    loginLink: 'Iniciar sesión',
    registrationAttemptMessage: 'Intento de registro (simulado)',
    adminPanelTitle: 'Panel de Administración',
    adminCreatePostButton: 'Crear Nueva Publicación',
    adminManagePostsTitle: 'Gestionar Publicaciones',
    adminManagePostsDescription: 'Aquí puedes editar, eliminar y gestionar todas las publicaciones del blog.',
    adminTableTitle: 'Título',
    adminTableDate: 'Fecha',
    adminTableStatus: 'Estado',
    adminTableActions: 'Acciones',
    editButton: 'Editar',
    deleteButton: 'Eliminar',
    deletePostConfirm: '¿Eliminar publicación {postId} (simulado)?',
    adminNoPosts: 'No se encontraron publicaciones.',
    accountPageTitle: 'Mi Cuenta',
    accountPageSubtitle: 'Gestiona tu perfil, suscripción y configuraciones.',
    changeProfilePictureButton: 'Cambiar Foto',
    memberSinceLabel: 'Miembro desde',
    profileDetailsTitle: 'Detalles del Perfil',
    currentPasswordLabel: 'Contraseña Actual',
    newPasswordLabel: 'Nueva Contraseña (opcional)',
    leaveBlankNoChange: 'Dejar en blanco para mantener actual',
    updateProfileButton: 'Actualizar Perfil',
    profileUpdateSimulated: "Actualización de perfil (simulada).",
    subscriptionDetailsTitle: 'Detalles de Suscripción',
    currentPlanLabel: 'Plan Actual',
    nextBillingDateLabel: 'Próxima Fecha de Facturación',
    paymentMethodLabel: 'Método de Pago',
    updatePaymentButton: 'Actualizar Método de Pago',
    cancelSubscriptionButton: 'Cancelar Suscripción',
    cancelSubscriptionSimulated: "Cancelación de suscripción (simulada).",
    noActiveSubscription: 'No tienes una suscripción PRO activa.',
    upgradeToProButton: 'Actualizar a PRO - $1/mes',
    upgradeToProSimulated: "Actualización a PRO (flujo de pago simulado).",
    // User Reviews & Comments
    userReviewsTitle: "Reseñas y Comentarios de Usuarios",
    noCommentsYet: "Aún no hay comentarios. ¡Sé el primero en compartir tu opinión!",
    addYourCommentTitle: "Añade Tu Comentario",
    ratingLabel: "Tu Calificación",
    commentLabel: "Tu Comentario",
    anonymousCommentLabel: "Comentar Anónimamente",
    submitCommentButton: "Enviar Comentario",
    loginToCommentTitle: "Inicio de Sesión Requerido",
    loginToCommentDescription: "Por favor, inicia sesión para publicar comentarios y calificaciones.",
    subscribeToCommentTitle: "Función PRO",
    subscribeToCommentDescription: "Comentar y calificar es una función PRO. Por favor, actualiza tu cuenta para participar.",
    subscribeButton: "Actualizar a PRO",
    cancelButton: "Cancelar",
    loginToCommentPrompt: "Por favor, inicia sesión para dejar un comentario.",
  },
  it: {
    navHome: 'Home',
    navCategories: 'Categorie',
    loginButton: 'Accedi',
    registerButton: 'Registrati',
    blogTitle: 'Il Blog di World AI',
    featuredPostsTitle: 'Post in Evidenza',
    readMoreButton: 'Leggi di più',
    categoriesTitle: 'Esplora Post per Categoria',
    viewPostsButton: 'Vedi Post',
    backToBlogButton: 'Torna al Blog',
    postContentTitle: 'Contenuto del Post',
    adminPanelTitle: 'Pannello Admin',
    adminCreatePostButton: 'Crea Nuovo Post',
    accountPageTitle: 'Il Mio Account',
    updateProfileButton: 'Aggiorna Profilo',
    upgradeToProButton: 'Passa a PRO - $1/mese',
    userReviewsTitle: "Recensioni e Commenti",
    loginToCommentPrompt: "Accedi per lasciare un commento.",
  },
  zh: {
    navHome: '首页',
    navCategories: '分类',
    loginButton: '登录',
    registerButton: '注册',
    blogTitle: 'World AI 博客',
    featuredPostsTitle: '精选帖子',
    readMoreButton: '阅读更多',
    categoriesTitle: '按分类浏览帖子',
    viewPostsButton: '查看帖子',
    backToBlogButton: '返回博客',
    postContentTitle: '帖子内容',
    adminPanelTitle: '管理面板',
    adminCreatePostButton: '创建新帖子',
    accountPageTitle: '我的账户',
    updateProfileButton: '更新个人资料',
    upgradeToProButton: '升级到PRO - $1/月',
    userReviewsTitle: "用户评论",
    loginToCommentPrompt: "请登录后发表评论。",
  },
  ja: {
    navHome: 'ホーム',
    navCategories: 'カテゴリー',
    loginButton: 'ログイン',
    registerButton: '登録',
    blogTitle: 'World AI ブログ',
    featuredPostsTitle: 'おすすめ記事',
    readMoreButton: '続きを読む',
    categoriesTitle: 'カテゴリーで記事を探す',
    viewPostsButton: '記事を見る',
    backToBlogButton: 'ブログに戻る',
    postContentTitle: '記事内容',
    adminPanelTitle: '管理パネル',
    adminCreatePostButton: '新しい記事を作成',
    accountPageTitle: 'マイアカウント',
    updateProfileButton: 'プロフィール更新',
    upgradeToProButton: 'PROにアップグレード - $1/月',
    userReviewsTitle: "ユーザーレビュー",
    loginToCommentPrompt: "コメントするにはログインしてください。",
  },
  pt: {
    navHome: 'Início',
    navCategories: 'Categorias',
    loginButton: 'Entrar',
    registerButton: 'Cadastre-se',
    blogTitle: 'O Blog World AI',
    featuredPostsTitle: 'Postagens em Destaque',
    readMoreButton: 'Leia Mais',
    categoriesTitle: 'Explore Postagens por Categoria',
    viewPostsButton: 'Ver Postagens',
    backToBlogButton: 'Voltar ao Blog',
    postContentTitle: 'Conteúdo da Postagem',
    adminPanelTitle: 'Painel Admin',
    adminCreatePostButton: 'Criar Nova Postagem',
    accountPageTitle: 'Minha Conta',
    updateProfileButton: 'Atualizar Perfil',
    upgradeToProButton: 'Atualizar para PRO - $1/mês',
    userReviewsTitle: "Avaliações e Comentários",
    loginToCommentPrompt: "Faça login para deixar um comentário.",
  },
};
