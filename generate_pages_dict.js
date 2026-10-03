const fs = require('fs');

const pagesDict = {
  en: {
    dashboard: {
      pageTitle: "Dashboard",
      pageSubtitle: "Manage your data source connections and preview data.",
      availableSources: "Available Sources",
      connected: "Connected",
      pending: "Pending",
      totalScopes: "Total Scopes",
      availableBalance: "Available Balance",
      estimatedValue: "Estimated Value",
      activeConnections: "Active Connections",
      dataQualityScore: "Data Quality Score",
      pocPending: "PoC: Pending",
      claimToWallet: "Claim to Wallet",
      earningsTitle: "Data Valuation (Hybrid Model)",
      earningsSubtitle: "Initial historical sync + ongoing monthly stream yield.",
      colSource: "Source",
      colPayload: "Data Payload",
      colInitial: "Initial Sync",
      colMonthly: "Monthly Yield",
      footer: "Rates dynamically updated via Lumina Oracle",
      metrics: {
        github: "Verified Dev Profile & Code",
        linkedin: "Professional Network Graph",
        oura: "Continuous Biometric Stream",
        whoop: "Continuous Recovery Stream",
        chatgpt: "Reasoning Trace & Prompts",
        claude: "Project Context & Prompts",
        amazon: "Historical Purchases + Sync",
        icloud_notes: "Knowledge Base + Sync",
        youtube: "Psychographic Watch Profile",
        instagram: "Social Engagement Graph",
        spotify: "Audio Affinity Profile",
        strava: "Endurance & Route Log"
      }
    },
    pricing: {
      howPricingWorks: "How Pricing Works",
      step1Title: "Base Source Value",
      step1Desc: "Every dataset has a base market rate (e.g. GitHub is $15.00). This represents the highest Tier A premium price.",
      step2Title: "Quality Multipliers",
      step2Desc: "The AI Oracle scores data from 0-100. Lower quality tiers apply a discount multiplier to the base value:",
      step3Title: "Fair Revenue Split",
      step3Desc: "Total Cost = (Base Value × Multiplier) × Volume.\n\nExactly 80% of your payment goes instantly to the users' crypto wallets.",
      pts: "pts",
      processing: "Processing...",
      purchaseDataset: "Purchase Dataset",
      paymentsProcessed: "Payments are securely processed via the Lumina Smart Contract and routed directly to the users providing data.",
      needUsdcTitle: "Need USDC on Vana Network?",
      needUsdcDesc: "To pay for data, you need USDC tokens on the Vana blockchain. You can easily bridge your USDC from Ethereum, Arbitrum, or other networks using Stargate Finance.",
      bridgeUsdc: "Bridge USDC via Stargate"
    },
    docs: {
      title: "Lumina Documentation",
      welcome: "Welcome to the official developer and user documentation for Lumina. Learn how to monetize your data, query verified datasets, and integrate with our Vana-powered smart contracts.",
      platformOverview: "Platform Overview",
      platformDesc1: "Lumina is a decentralized API Marketplace and Data Liquidity Pool (DLP) built natively on the Vana Network. We bridge the gap between individual users who generate valuable data (Data Providers) and AI companies/researchers (B2B Buyers) who need high-quality, verified datasets to train models.",
      platformDesc2: "By leveraging Web3 infrastructure, Lumina guarantees that users retain ownership of their data while earning fair compensation (in USDC.e) transparently routed through audited smart contracts.",
      forProviders: "For Data Providers",
      howItWorks: "How It Works",
      hw1: "Personal Server: Users securely connect their Web2 accounts (e.g., ChatGPT, Spotify, Instagram) to their own Vana Personal Server via app.vana.org/sources.",
      hw1Note: "Note: To securely connect private (non-public) data, you must authenticate and process data locally using the official Vana Desktop application.",
      hw2: "Data Connection Request: Lumina sends a request to the user's Personal Server asking for permission to access specific data scopes.",
      hw3: "Verification: Once approved, the data undergoes an automated Proof of Contribution (PoC) check by AI Oracles to ensure authenticity and uniqueness.",
      hw4: "Earn: When AI companies, research institutions, marketing agencies, or other enterprise clients purchase data matching your demographic, you automatically receive 80% of the revenue directly to your connected EVM wallet on the Vana Network.",
      archAndContracts: "Architecture and Contracts",
      arch1: "Lumina utilizes a hybrid architecture to balance performance with decentralized security.",
      arch2: "Off-chain Components: Data preview caching, user interface, category filtering, and DCR intent processing.",
      arch3: "On-chain Components: The LuminaMarketplace smart contract on Vana Mainnet handles payment routing, escrow, PoC verifications, and the 80/20 revenue split.",
      pocTitle: "Proof of Contribution (PoC)",
      pocDesc: "The PoC oracle acts as the trust layer between providers and buyers.",
      poc1: "Data Deduplication (Anti-Sybil)",
      poc1Desc: "A major threat to data marketplaces is Sybil attacks—users attempting to sell the same data multiple times by creating new crypto wallets. Lumina solves this using Provider ID Uniqueness.",
      poc1Li1: "When a user connects a dataset, our backend parses the raw JSON payload.",
      poc1Li2: "We extract the immutable system ID from the platform (e.g., youtube_channel_id or ChatGPT's root conversation_id).",
      poc1Li3: "This ID is stored as provider_account_id with a strict UNIQUE SQL Constraint.",
      poc1Li4: "If a user switches wallets or logs in via Google/Email and tries to upload the same account again, the database physically rejects the transaction (409 Conflict). One human = One dataset.",
      poc2: "Dynamic Quality Scoring (Proof of Contribution)",
      poc2Desc: "Not all data is created equal. The Lumina Oracle evaluates incoming data using the Proof of Contribution (PoC) consensus mechanism to assign a Quality Score from 0 to 100 based on three core pillars:",
      poc2Pillar1Title: "Historical Depth",
      poc2Pillar1Desc: "A 5-year-old GitHub account with 500 commits scores significantly higher than a 1-week-old account created just to farm and sell data.",
      poc2Pillar2Title: "Data Density",
      poc2Pillar2Desc: "An Oura Ring sync containing 365 days of continuous sleep architecture is worth exponentially more than a fragmented 3-day log.",
      poc2Pillar3Title: "Authenticity Risk",
      poc2Pillar3Desc: "A LinkedIn profile with 500+ connections and recommendations verifies you as human, protecting B2B buyers from bot-generated data.",
      poc3: "Dynamic Pricing Engine (The Multiplier)",
      poc3Desc: "The Quality Score acts as a direct multiplier on the base price of the dataset to calculate its Estimated Value. When B2B buyers purchase data from your category, the smart contract distributes the revenue to you based on this multiplier. This ensures data buyers get exactly the quality they pay for, and high-quality data providers receive premium payouts.",
      poc3TableCol1: "Quality Tier",
      poc3TableCol2: "PoC Score Range",
      poc3TableCol3: "Payout Multiplier",
      poc3ExTitle: "Example Calculation",
      poc3ExDesc: "If you connect a GitHub Developer Profile (Base Dataset Value: $15.00), and the Oracle assigns you a Quality Score of 90 (Tier A):\n\nEstimated Value = $15.00 × 0.90 = $13.50\nWhen a buyer purchases your data, $13.50 is instantly credited to your Available Balance via the smart contract, ready to be claimed to your wallet."
    }
  },
  ru: {
    dashboard: {
      pageTitle: "Дашборд",
      pageSubtitle: "Управляйте подключениями источников и просматривайте данные.",
      availableSources: "Доступные источники",
      connected: "Подключено",
      pending: "В ожидании",
      totalScopes: "Всего областей",
      availableBalance: "Доступный баланс",
      estimatedValue: "Оценочная ценность",
      activeConnections: "Активные подключения",
      dataQualityScore: "Оценка качества",
      pocPending: "PoC: Ожидание",
      claimToWallet: "Вывести на кошелек",
      earningsTitle: "Оценка данных (Гибридная модель)",
      earningsSubtitle: "Первичная синхронизация + ежемесячная доходность.",
      colSource: "Источник",
      colPayload: "Тип данных",
      colInitial: "Первичная выплата",
      colMonthly: "В месяц",
      footer: "Ставки динамически обновляются через Lumina Oracle",
      metrics: {
        github: "Подтвержденный профиль разработчика и код",
        linkedin: "Граф профессиональной сети",
        oura: "Непрерывный поток биометрии",
        whoop: "Поток данных восстановления",
        chatgpt: "Запросы и логика рассуждений",
        claude: "Контекст проектов и запросы",
        amazon: "История покупок + Синхронизация",
        icloud_notes: "База знаний + Синхронизация",
        youtube: "Психографический профиль зрителя",
        instagram: "Граф социального взаимодействия",
        spotify: "Профиль музыкальных предпочтений",
        strava: "Журнал тренировок и маршрутов"
      }
    },
    pricing: {
      howPricingWorks: "Как формируется цена",
      step1Title: "Базовая ценность",
      step1Desc: "Каждый датасет имеет базовую рыночную ставку (например, GitHub — $15.00). Это премиальная цена для уровня Tier A.",
      step2Title: "Множители качества",
      step2Desc: "AI Oracle оценивает данные от 0 до 100. Более низкие уровни применяют понижающий множитель к базовой стоимости:",
      step3Title: "Справедливое распределение",
      step3Desc: "Итоговая стоимость = (Базовая ценность × Множитель) × Объем.\n\nРовно 80% от вашего платежа моментально отправляется на криптокошельки пользователей.",
      pts: "очков",
      processing: "Обработка...",
      purchaseDataset: "Купить датасет",
      paymentsProcessed: "Платежи безопасно обрабатываются через смарт-контракт Lumina и направляются напрямую поставщикам данных.",
      needUsdcTitle: "Нужен USDC в сети Vana?",
      needUsdcDesc: "Для оплаты данных вам понадобятся токены USDC в блокчейне Vana. Вы можете легко перевести USDC из Ethereum, Arbitrum или других сетей с помощью Stargate Finance.",
      bridgeUsdc: "Перевести USDC через Stargate"
    },
    docs: {
      title: "Документация Lumina",
      welcome: "Добро пожаловать в официальную документацию Lumina для разработчиков и пользователей. Узнайте, как монетизировать свои данные, запрашивать верифицированные датасеты и интегрироваться с нашими смарт-контрактами в сети Vana.",
      platformOverview: "Обзор платформы",
      platformDesc1: "Lumina — это децентрализованный API Marketplace и Data Liquidity Pool (DLP), построенный на базе сети Vana. Мы устраняем разрыв между пользователями, генерирующими ценные данные (поставщиками), и ИИ-компаниями (B2B-покупателями), нуждающимися в качественных данных для обучения моделей.",
      platformDesc2: "Используя инфраструктуру Web3, Lumina гарантирует, что пользователи сохраняют право собственности на свои данные, получая справедливое вознаграждение (в USDC.e) через прозрачные смарт-контракты.",
      forProviders: "Для поставщиков данных",
      howItWorks: "Как это работает",
      hw1: "Personal Server: Пользователи безопасно подключают свои Web2-аккаунты к собственному персональному серверу Vana.",
      hw1Note: "Примечание: Для безопасного подключения приватных данных необходимо использовать официальное приложение Vana Desktop.",
      hw2: "Data Connection Request: Lumina отправляет запрос к вашему персональному серверу для получения доступа к конкретным областям данных.",
      hw3: "Verification: После одобрения данные проходят автоматическую проверку оракулом Proof of Contribution (PoC).",
      hw4: "Earn: Когда ИИ-компании покупают данные, подходящие под вашу демографию, вы автоматически получаете 80% выручки напрямую на свой EVM-кошелек.",
      archAndContracts: "Архитектура и смарт-контракты",
      arch1: "Lumina использует гибридную архитектуру для баланса между производительностью и безопасностью.",
      arch2: "Off-chain: Кэширование превью, интерфейс, фильтрация и обработка DCR-запросов.",
      arch3: "On-chain: Смарт-контракт LuminaMarketplace в сети Vana обрабатывает платежи, эскроу, валидацию PoC и распределение 80/20.",
      pocTitle: "Proof of Contribution (PoC)",
      pocDesc: "Оракул PoC выступает в качестве слоя доверия между поставщиками и покупателями.",
      poc1: "Дедупликация данных (Анти-Сибилла)",
      poc1Desc: "Главная угроза для рынков данных — атаки Сивиллы, когда пользователи пытаются продать одни и те же данные несколько раз. Lumina решает это через уникальность ID.",
      poc1Li1: "Когда пользователь подключает датасет, бэкенд анализирует сырой JSON.",
      poc1Li2: "Мы извлекаем неизменяемый системный ID из платформы.",
      poc1Li3: "Этот ID сохраняется как provider_account_id со строгим ограничением UNIQUE в SQL.",
      poc1Li4: "Если пользователь сменит кошелек и попытается загрузить тот же аккаунт, база физически отклонит транзакцию. Один человек = Один датасет.",
      poc2: "Динамическая оценка качества (PoC)",
      poc2Desc: "Не все данные одинаковы. Оракул Lumina оценивает данные от 0 до 100 на основе трех ключевых параметров:",
      poc2Pillar1Title: "Историческая глубина",
      poc2Pillar1Desc: "5-летний аккаунт GitHub оценивается значительно выше, чем аккаунт, созданный неделю назад.",
      poc2Pillar2Title: "Плотность данных",
      poc2Pillar2Desc: "Синхронизация Oura Ring с 365 днями данных сна стоит экспоненциально больше, чем обрывочные данные за 3 дня.",
      poc2Pillar3Title: "Риск аутентичности",
      poc2Pillar3Desc: "Профиль LinkedIn с 500+ контактами подтверждает, что вы человек.",
      poc3: "Механизм динамического ценообразования (Множитель)",
      poc3Desc: "Оценка качества действует как прямой множитель к базовой цене датасета для расчета его ожидаемой ценности.",
      poc3TableCol1: "Уровень качества",
      poc3TableCol2: "Очки PoC",
      poc3TableCol3: "Множитель выплаты",
      poc3ExTitle: "Пример расчета",
      poc3ExDesc: "Если вы подключаете GitHub (Базовая ценность: $15.00) и Оракул назначает оценку 90 (Tier A):\n\nОжидаемая ценность = $15.00 × 0.90 = $13.50\nКогда покупатель приобретает ваши данные, $13.50 моментально зачисляется на ваш доступный баланс."
    }
  },
  es: {
    dashboard: {
      pageTitle: "Panel", pageSubtitle: "Administra las conexiones de tus fuentes de datos y previsualiza.",
      availableSources: "Fuentes Disponibles", connected: "Conectado", pending: "Pendiente", totalScopes: "Alcances Totales",
      availableBalance: "Saldo Disponible", estimatedValue: "Valor Estimado", activeConnections: "Conexiones Activas",
      dataQualityScore: "Puntuación de Calidad", pocPending: "PoC: Pendiente", claimToWallet: "Reclamar a Billetera",
      earningsTitle: "Valoración de Datos (Modelo Híbrido)", earningsSubtitle: "Sincronización inicial + rendimiento mensual.",
      colSource: "Fuente", colPayload: "Datos", colInitial: "Sinc. Inicial", colMonthly: "Rend. Mensual",
      footer: "Las tasas se actualizan dinámicamente a través de Lumina Oracle",
      metrics: {
        github: "Perfil de Dev Verificado y Código", linkedin: "Gráfico de Red Profesional", oura: "Flujo Biométrico Continuo",
        whoop: "Flujo de Recuperación Continuo", chatgpt: "Rastros de Razonamiento", claude: "Contexto y Prompts",
        amazon: "Historial de Compras", icloud_notes: "Base de Conocimientos", youtube: "Perfil Psicográfico de Visualización",
        instagram: "Gráfico de Compromiso Social", spotify: "Perfil de Afinidad de Audio", strava: "Registro de Rutas y Resistencia"
      }
    },
    pricing: {
      howPricingWorks: "Cómo Funciona", step1Title: "Valor Base", step1Desc: "Cada conjunto de datos tiene una tasa de mercado base.",
      step2Title: "Multiplicadores de Calidad", step2Desc: "El Oráculo AI puntúa los datos de 0 a 100. Los niveles aplican un multiplicador:",
      step3Title: "Reparto Justo", step3Desc: "Costo Total = (Base × Multiplicador) × Volumen.\n\nEl 80% va a los usuarios.",
      pts: "pts", processing: "Procesando...", purchaseDataset: "Comprar Dataset",
      paymentsProcessed: "Los pagos se procesan de forma segura a través del Contrato Inteligente de Lumina.",
      needUsdcTitle: "¿Necesitas USDC en la Red Vana?", needUsdcDesc: "Para pagar, necesitas USDC. Puedes enviarlo fácilmente usando Stargate.", bridgeUsdc: "Enviar USDC vía Stargate"
    },
    docs: {
      title: "Documentación de Lumina", welcome: "Bienvenido a la documentación oficial. Aprende a monetizar tus datos.",
      platformOverview: "Resumen de la Plataforma", platformDesc1: "Lumina es un Mercado de API descentralizado en la Red Vana.",
      platformDesc2: "Lumina garantiza que los usuarios retengan la propiedad de sus datos y ganen compensación en USDC.",
      forProviders: "Para Proveedores de Datos", howItWorks: "Cómo Funciona", hw1: "Servidor Personal: Conecta de forma segura tus cuentas Web2.",
      hw1Note: "Nota: Para datos privados, usa Vana Desktop.", hw2: "Solicitud de Conexión: Lumina solicita permiso para acceder a tus datos.",
      hw3: "Verificación: Se realiza un chequeo Proof of Contribution (PoC).", hw4: "Ganar: Recibes el 80% de los ingresos directamente.",
      archAndContracts: "Arquitectura y Contratos", arch1: "Lumina utiliza una arquitectura híbrida.", arch2: "Componentes Off-chain: Interfaz y caché.",
      arch3: "Componentes On-chain: Contrato LuminaMarketplace maneja pagos y PoC.", pocTitle: "Prueba de Contribución (PoC)",
      pocDesc: "El oráculo actúa como capa de confianza.", poc1: "Deduplicación", poc1Desc: "Lumina previene ataques Sybil mediante ID único.",
      poc1Li1: "Analizamos el JSON.", poc1Li2: "Extraemos el ID del sistema.", poc1Li3: "Se guarda con restricción UNIQUE.",
      poc1Li4: "Si se intenta subir la misma cuenta, se rechaza.", poc2: "Puntuación de Calidad", poc2Desc: "Se evalúa usando PoC:",
      poc2Pillar1Title: "Profundidad Histórica", poc2Pillar1Desc: "Cuentas antiguas valen más.", poc2Pillar2Title: "Densidad de Datos",
      poc2Pillar2Desc: "Más datos continuos valem más.", poc2Pillar3Title: "Riesgo de Autenticidad", poc2Pillar3Desc: "Perfiles reales valen más.",
      poc3: "Precios Dinámicos", poc3Desc: "La puntuación multiplica el precio base.", poc3TableCol1: "Nivel", poc3TableCol2: "Puntos PoC",
      poc3TableCol3: "Multiplicador", poc3ExTitle: "Ejemplo", poc3ExDesc: "Si conectas GitHub ($15.00) con puntuación 90 (Tier A):\nValor = $15.00 × 0.90 = $13.50."
    }
  },
  pt: {
    dashboard: {
      pageTitle: "Painel", pageSubtitle: "Gerencie suas fontes de dados e visualize.",
      availableSources: "Fontes Disponíveis", connected: "Conectado", pending: "Pendente", totalScopes: "Escopos Totais",
      availableBalance: "Saldo Disponível", estimatedValue: "Valor Estimado", activeConnections: "Conexões Ativas",
      dataQualityScore: "Pontuação de Qualidade", pocPending: "PoC: Pendente", claimToWallet: "Resgatar para Carteira",
      earningsTitle: "Avaliação de Dados (Modelo Híbrido)", earningsSubtitle: "Sincronização inicial + rendimento mensal.",
      colSource: "Fonte", colPayload: "Dados", colInitial: "Sinc. Inicial", colMonthly: "Rend. Mensual",
      footer: "As taxas são atualizadas dinamicamente via Lumina Oracle",
      metrics: {
        github: "Perfil de Dev Verificado", linkedin: "Gráfico de Rede Profissional", oura: "Fluxo Biométrico Contínuo",
        whoop: "Fluxo de Recuperação Contínuo", chatgpt: "Rastros de Raciocínio", claude: "Contexto e Prompts",
        amazon: "Histórico de Compras", icloud_notes: "Base de Conhecimentos", youtube: "Perfil Psicográfico de Visualização",
        instagram: "Gráfico de Engajamento Social", spotify: "Perfil de Afinidade de Áudio", strava: "Registro de Rotas e Resistência"
      }
    },
    pricing: {
      howPricingWorks: "Como Funciona", step1Title: "Valor Base", step1Desc: "Cada conjunto de dados tem uma taxa de mercado base.",
      step2Title: "Multiplicadores de Qualidade", step2Desc: "O Oráculo pontua os dados de 0 a 100. Os níveis aplicam um multiplicador:",
      step3Title: "Divisão Justa", step3Desc: "Custo Total = (Base × Multiplicador) × Volume.\n\n80% vai para os usuários.",
      pts: "pts", processing: "Processando...", purchaseDataset: "Comprar Dataset",
      paymentsProcessed: "Os pagamentos são processados com segurança através do Smart Contract Lumina.",
      needUsdcTitle: "Precisa de USDC na Rede Vana?", needUsdcDesc: "Para pagar, você precisa de USDC. Pode transferir facilmente via Stargate.", bridgeUsdc: "Transferir USDC via Stargate"
    },
    docs: {
      title: "Documentação Lumina", welcome: "Bem-vindo à documentação oficial. Aprenda a monetizar seus dados.",
      platformOverview: "Visão Geral da Plataforma", platformDesc1: "Lumina é um Marketplace de API descentralizado na Rede Vana.",
      platformDesc2: "Lumina garante que os usuários mantenham a propriedade de seus dados e ganhem USDC.",
      forProviders: "Para Provedores de Dados", howItWorks: "Como Funciona", hw1: "Servidor Pessoal: Conecte com segurança suas contas Web2.",
      hw1Note: "Nota: Para dados privados, use o Vana Desktop.", hw2: "Solicitação de Conexão: Lumina solicita permissão para acessar dados.",
      hw3: "Verificação: Um teste Proof of Contribution (PoC) é realizado.", hw4: "Ganhar: Você recebe 80% da receita diretamente.",
      archAndContracts: "Arquitetura e Contratos", arch1: "Lumina utiliza uma arquitetura híbrida.", arch2: "Componentes Off-chain: Interface e cache.",
      arch3: "Componentes On-chain: Smart contract LuminaMarketplace gerencia pagamentos e PoC.", pocTitle: "Prova de Contribuição (PoC)",
      pocDesc: "O oráculo atua como camada de confiança.", poc1: "Deduplicação", poc1Desc: "Lumina previne ataques Sybil via ID único.",
      poc1Li1: "Analisamos o JSON.", poc1Li2: "Extraímos o ID do sistema.", poc1Li3: "É salvo com restrição UNIQUE.",
      poc1Li4: "Se tentar subir a mesma conta, é rejeitado.", poc2: "Pontuação de Qualidade", poc2Desc: "É avaliado usando PoC:",
      poc2Pillar1Title: "Profundidade Histórica", poc2Pillar1Desc: "Contas antigas valem mais.", poc2Pillar2Title: "Densidade de Dados",
      poc2Pillar2Desc: "Mais dados contínuos valem mais.", poc2Pillar3Title: "Risco de Autenticidade", poc2Pillar3Desc: "Perfis reais valem mais.",
      poc3: "Preços Dinâmicos", poc3Desc: "A pontuação multiplica o preço base.", poc3TableCol1: "Nível", poc3TableCol2: "Pontos PoC",
      poc3TableCol3: "Multiplicador", poc3ExTitle: "Exemplo", poc3ExDesc: "Se conectar GitHub ($15.00) com pontuação 90 (Tier A):\nValor = $15.00 × 0.90 = $13.50."
    }
  },
  de: {
    dashboard: {
      pageTitle: "Dashboard", pageSubtitle: "Verwalten Sie Ihre Datenquellen und Vorschauen.",
      availableSources: "Verfügbare Quellen", connected: "Verbunden", pending: "Ausstehend", totalScopes: "Gesamte Bereiche",
      availableBalance: "Verfügbares Guthaben", estimatedValue: "Geschätzter Wert", activeConnections: "Aktive Verbindungen",
      dataQualityScore: "Qualitätsscore", pocPending: "PoC: Ausstehend", claimToWallet: "Auszahlen",
      earningsTitle: "Datenbewertung (Hybridmodell)", earningsSubtitle: "Anfängliche Synchronisation + monatliche Rendite.",
      colSource: "Quelle", colPayload: "Daten", colInitial: "Initiale Sync", colMonthly: "Monatliche Rendite",
      footer: "Die Raten werden dynamisch über das Lumina Oracle aktualisiert",
      metrics: {
        github: "Verifiziertes Dev-Profil", linkedin: "Berufsnetzwerk", oura: "Kontinuierlicher Biometrie-Stream",
        whoop: "Kontinuierlicher Erholungs-Stream", chatgpt: "Reasoning & Prompts", claude: "Projektkontext & Prompts",
        amazon: "Einkaufshistorie", icloud_notes: "Wissensbasis", youtube: "Zuschauer-Profil",
        instagram: "Social Engagement Graph", spotify: "Musikprofil", strava: "Routen- & Ausdauer-Log"
      }
    },
    pricing: {
      howPricingWorks: "Wie die Preisgestaltung funktioniert", step1Title: "Basiswert", step1Desc: "Jeder Datensatz hat einen Basispreis.",
      step2Title: "Qualitätsmultiplikator", step2Desc: "Das AI-Oracle bewertet Daten von 0-100. Qualitätsstufen wenden einen Multiplikator an:",
      step3Title: "Faire Umsatzteilung", step3Desc: "Gesamtkosten = (Basiswert × Multiplikator) × Volumen.\n\n80 % gehen an die Nutzer.",
      pts: "Pkte", processing: "Verarbeitung...", purchaseDataset: "Datensatz kaufen",
      paymentsProcessed: "Zahlungen werden sicher über den Lumina Smart Contract abgewickelt.",
      needUsdcTitle: "Benötigen Sie USDC im Vana-Netzwerk?", needUsdcDesc: "Sie benötigen USDC, um zu bezahlen. Überweisen Sie einfach via Stargate.", bridgeUsdc: "USDC über Stargate überweisen"
    },
    docs: {
      title: "Lumina Dokumentation", welcome: "Willkommen zur offiziellen Dokumentation. Erfahren Sie, wie Sie Daten monetarisieren.",
      platformOverview: "Plattformübersicht", platformDesc1: "Lumina ist ein dezentraler API-Marktplatz auf dem Vana-Netzwerk.",
      platformDesc2: "Lumina garantiert, dass Nutzer die Kontrolle über ihre Daten behalten und USDC verdienen.",
      forProviders: "Für Datenanbieter", howItWorks: "Wie es funktioniert", hw1: "Persönlicher Server: Verbinden Sie Ihre Web2-Konten.",
      hw1Note: "Hinweis: Verwenden Sie Vana Desktop für private Daten.", hw2: "Verbindungsanfrage: Lumina bittet um Erlaubnis.",
      hw3: "Verifizierung: Proof of Contribution (PoC) wird geprüft.", hw4: "Verdienen: Sie erhalten 80 % der Einnahmen.",
      archAndContracts: "Architektur & Verträge", arch1: "Lumina nutzt eine hybride Architektur.", arch2: "Off-chain: UI und Caching.",
      arch3: "On-chain: LuminaMarketplace Smart Contract.", pocTitle: "Proof of Contribution (PoC)",
      pocDesc: "Das Orakel ist die Vertrauensschicht.", poc1: "Deduplizierung", poc1Desc: "Verhindert Sybil-Angriffe durch eindeutige IDs.",
      poc1Li1: "Wir parsen die JSON-Daten.", poc1Li2: "Wir extrahieren die System-ID.", poc1Li3: "Gespeichert mit UNIQUE-Einschränkung.",
      poc1Li4: "Doppelte Konten werden abgelehnt.", poc2: "Qualitätsbewertung", poc2Desc: "Bewertung von 0 bis 100:",
      poc2Pillar1Title: "Historische Tiefe", poc2Pillar1Desc: "Ältere Konten sind mehr wert.", poc2Pillar2Title: "Datendichte",
      poc2Pillar2Desc: "Mehr kontinuierliche Daten sind mehr wert.", poc2Pillar3Title: "Authentizität", poc2Pillar3Desc: "Echte Profile punkten höher.",
      poc3: "Dynamische Preisgestaltung", poc3Desc: "Der Score multipliziert den Basispreis.", poc3TableCol1: "Qualitätsstufe", poc3TableCol2: "PoC-Punkte",
      poc3TableCol3: "Multiplikator", poc3ExTitle: "Beispiel", poc3ExDesc: "GitHub ($15.00) mit Score 90 (Tier A):\nWert = $15.00 × 0.90 = $13.50."
    }
  },
  zh: {
    dashboard: {
      pageTitle: "仪表板", pageSubtitle: "管理您的数据源连接和预览数据。",
      availableSources: "可用来源", connected: "已连接", pending: "待处理", totalScopes: "总范围",
      availableBalance: "可用余额", estimatedValue: "估值", activeConnections: "活跃连接",
      dataQualityScore: "质量得分", pocPending: "PoC: 待处理", claimToWallet: "提取到钱包",
      earningsTitle: "数据估值（混合模式）", earningsSubtitle: "初始同步 + 每月持续收益。",
      colSource: "来源", colPayload: "数据类型", colInitial: "初始同步", colMonthly: "每月收益",
      footer: "费率通过 Lumina Oracle 动态更新",
      metrics: {
        github: "已验证的开发者档案和代码", linkedin: "职业关系网图", oura: "连续生物识别流",
        whoop: "连续恢复流", chatgpt: "推理痕迹和提示词", claude: "项目上下文和提示词",
        amazon: "历史购买和同步", icloud_notes: "知识库和同步", youtube: "心理学观看特征",
        instagram: "社交互动图", spotify: "音频偏好特征", strava: "耐力和路线日志"
      }
    },
    pricing: {
      howPricingWorks: "定价规则", step1Title: "基础价值", step1Desc: "每个数据集都有基础市场价。",
      step2Title: "质量乘数", step2Desc: "AI Oracle 对数据进行 0-100 评分，应用相应的乘数：",
      step3Title: "公平收益分配", step3Desc: "总成本 = (基础价值 × 乘数) × 数量。\n\n80% 的资金直接进入用户钱包。",
      pts: "分", processing: "处理中...", purchaseDataset: "购买数据集",
      paymentsProcessed: "付款通过 Lumina 智能合约安全处理。",
      needUsdcTitle: "需要在 Vana 网络上使用 USDC？", needUsdcDesc: "购买数据需要 USDC，您可以通过 Stargate 轻松跨链提取。", bridgeUsdc: "通过 Stargate 跨链 USDC"
    },
    docs: {
      title: "Lumina 文档", welcome: "欢迎阅读官方文档。了解如何将您的数据变现。",
      platformOverview: "平台概览", platformDesc1: "Lumina 是建立在 Vana 网络上的去中心化 API 市场。",
      platformDesc2: "Lumina 保证用户保留数据所有权，并赚取 USDC。",
      forProviders: "面向数据提供者", howItWorks: "运作方式", hw1: "个人服务器：安全连接您的 Web2 帐户。",
      hw1Note: "注：对于私人数据，请使用 Vana Desktop。", hw2: "连接请求：Lumina 请求访问权限。",
      hw3: "验证：执行贡献证明 (PoC) 检查。", hw4: "赚取：您将获得 80% 的收入。",
      archAndContracts: "架构与合约", arch1: "Lumina 采用混合架构。", arch2: "链下：用户界面和缓存。",
      arch3: "链上：LuminaMarketplace 智能合约。", pocTitle: "贡献证明 (PoC)",
      pocDesc: "Oracle 充当信任层。", poc1: "数据去重", poc1Desc: "通过唯一 ID 防止女巫攻击。",
      poc1Li1: "解析 JSON。", poc1Li2: "提取系统 ID。", poc1Li3: "以 UNIQUE 约束保存。",
      poc1Li4: "拒绝重复帐户。", poc2: "质量评分", poc2Desc: "使用 PoC 评分：",
      poc2Pillar1Title: "历史深度", poc2Pillar1Desc: "老帐户价值更高。", poc2Pillar2Title: "数据密度",
      poc2Pillar2Desc: "连续数据价值更高。", poc2Pillar3Title: "真实性风险", poc2Pillar3Desc: "真实个人资料价值更高。",
      poc3: "动态定价", poc3Desc: "评分乘以基础价格。", poc3TableCol1: "质量层级", poc3TableCol2: "PoC 分数",
      poc3TableCol3: "乘数", poc3ExTitle: "示例", poc3ExDesc: "如果 GitHub ($15.00) 得分为 90 (Tier A)：\n价值 = $15.00 × 0.90 = $13.50。"
    }
  },
  ko: {
    dashboard: {
      pageTitle: "대시보드", pageSubtitle: "데이터 소스 연결을 관리하고 데이터를 미리 보세요.",
      availableSources: "사용 가능 소스", connected: "연결됨", pending: "대기 중", totalScopes: "전체 범위",
      availableBalance: "사용 가능 잔액", estimatedValue: "예상 가치", activeConnections: "활성 연결",
      dataQualityScore: "품질 점수", pocPending: "PoC: 대기 중", claimToWallet: "지갑으로 수령",
      earningsTitle: "데이터 가치 평가(하이브리드 모델)", earningsSubtitle: "초기 동기화 + 지속적인 월별 수익.",
      colSource: "소스", colPayload: "데이터 페이로드", colInitial: "초기 동기화", colMonthly: "월별 수익",
      footer: "Lumina Oracle을 통해 요율이 동적으로 업데이트됩니다.",
      metrics: {
        github: "검증된 개발자 프로필 및 코드", linkedin: "전문 네트워크 그래프", oura: "연속 생체 데이터",
        whoop: "연속 회복 데이터", chatgpt: "추론 및 프롬프트", claude: "프로젝트 컨텍스트 및 프롬프트",
        amazon: "구매 내역 및 동기화", icloud_notes: "지식 베이스 및 동기화", youtube: "시청자 심리 프로필",
        instagram: "소셜 참여 그래프", spotify: "오디오 선호도 프로필", strava: "운동 및 경로 기록"
      }
    },
    pricing: {
      howPricingWorks: "가격 책정 방식", step1Title: "기본 가치", step1Desc: "각 데이터 세트에는 기본 시장 가격이 있습니다.",
      step2Title: "품질 승수", step2Desc: "AI Oracle이 0-100점으로 평가하여 품질 등급에 따라 승수를 적용합니다.",
      step3Title: "공정한 수익 분배", step3Desc: "총 비용 = (기본 가치 × 승수) × 수량.\n\n결제 금액의 80%가 사용자 지갑으로 이동합니다.",
      pts: "점", processing: "처리 중...", purchaseDataset: "데이터 세트 구매",
      paymentsProcessed: "결제는 Lumina 스마트 컨트랙트를 통해 안전하게 처리됩니다.",
      needUsdcTitle: "Vana 네트워크에 USDC가 필요하신가요?", needUsdcDesc: "데이터를 구매하려면 USDC가 필요합니다. Stargate를 통해 쉽게 브릿지할 수 있습니다.", bridgeUsdc: "Stargate를 통해 USDC 브릿지"
    },
    docs: {
      title: "Lumina 문서", welcome: "공식 문서에 오신 것을 환영합니다. 데이터 수익화 방법을 알아보세요.",
      platformOverview: "플랫폼 개요", platformDesc1: "Lumina는 Vana 네트워크 기반의 탈중앙화 API 마켓플레이스입니다.",
      platformDesc2: "사용자가 데이터 소유권을 유지하고 USDC를 벌 수 있도록 보장합니다.",
      forProviders: "데이터 제공자용", howItWorks: "작동 방식", hw1: "개인 서버: Web2 계정을 안전하게 연결합니다.",
      hw1Note: "참고: 비공개 데이터의 경우 Vana Desktop을 사용하세요.", hw2: "연결 요청: Lumina가 액세스 권한을 요청합니다.",
      hw3: "검증: 기여 증명(PoC) 검사가 수행됩니다.", hw4: "수익 창출: 수익의 80%를 직접 받습니다.",
      archAndContracts: "아키텍처 및 컨트랙트", arch1: "하이브리드 아키텍처를 사용합니다.", arch2: "오프체인: UI 및 캐싱.",
      arch3: "온체인: LuminaMarketplace 스마트 컨트랙트.", pocTitle: "기여 증명(PoC)",
      pocDesc: "오라클이 신뢰 계층 역할을 합니다.", poc1: "데이터 중복 제거", poc1Desc: "고유 ID를 통해 Sybil 공격을 방지합니다.",
      poc1Li1: "JSON을 구문 분석합니다.", poc1Li2: "시스템 ID를 추출합니다.", poc1Li3: "UNIQUE 제약 조건으로 저장됩니다.",
      poc1Li4: "중복 계정은 거부됩니다.", poc2: "품질 평가", poc2Desc: "PoC를 사용하여 평가됩니다.",
      poc2Pillar1Title: "역사적 깊이", poc2Pillar1Desc: "오래된 계정이 더 가치가 있습니다.", poc2Pillar2Title: "데이터 밀도",
      poc2Pillar2Desc: "연속적인 데이터가 더 가치가 있습니다.", poc2Pillar3Title: "진위 위험", poc2Pillar3Desc: "실제 프로필이 더 가치가 있습니다.",
      poc3: "동적 가격 책정", poc3Desc: "점수는 기본 가격에 곱해집니다.", poc3TableCol1: "품질 등급", poc3TableCol2: "PoC 점수",
      poc3TableCol3: "승수", poc3ExTitle: "예시", poc3ExDesc: "GitHub($15.00)가 90점(Tier A)인 경우:\n가치 = $15.00 × 0.90 = $13.50."
    }
  }
};

const fileContent = `export type PagesDict = typeof PAGES_DICT.en;

export const PAGES_DICT = ${JSON.stringify(pagesDict, null, 2)};
`;

fs.writeFileSync('src/lib/i18n/pages-dict.ts', fileContent, 'utf8');
console.log('pages-dict.ts generated!');
