const fs = require('fs');

const missingTranslations = {
  en: {
    stats: {
      title1: 'Built for the future of data ownership',
      title2: 'Lumina provides the enterprise-grade infrastructure needed to securely connect, validate, and route private user data directly to researchers and brands.',
      f1_title: 'Unified API',
      f1_desc: 'Access YouTube, LinkedIn, Instagram, and 10+ others through a single standardized schema.',
      f2_title: 'Proof of Contribution',
      f2_desc: 'Every data point is scored by Vana network validators for quality and authenticity before sale.',
      f3_title: 'Zero-Knowledge',
      f3_desc: 'Personally identifiable information (PII) is automatically redacted. Buyers only see encrypted aggregates.',
      f4_title: 'User Owned',
      f4_desc: 'Data never leaves your local machine. Vana Desktop serves data directly from your device.'
    },
    monetize: {
      title: 'Turn Your Digital Footprint Into an Asset',
      subtitle: 'Every app you use generates highly valuable data. Lumina lets you securely package and rent this data to verified buyers while keeping full control.',
      groups: {
        health: 'Health & Biometrics',
        healthDesc: 'Your physical activity, sleep cycles, and daily recovery metrics are highly sought after by HealthTech startups and researchers.',
        prof: 'Professional & Code',
        profDesc: 'B2B contact networks and coding repositories are premium assets for AI recruitment models and developer copilots.',
        social: 'Social & Attention',
        socialDesc: 'Your engagement habits and visual content train next-gen recommendation algorithms and social sentiment models.',
        commerce: 'Commerce & Finance',
        commerceDesc: 'Purchasing history and financial transactions help build predictive consumer spending models.'
      }
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'A transparent, decentralized data economy powered by Vana.',
      step1Title: 'Connect & Sync',
      step1Desc: 'Users connect their wallets and securely sync their personal data from popular platforms like Instagram, Spotify, or LinkedIn.',
      step2Title: 'Companies Browse Data',
      step2Desc: 'Verified B2B buyers search the marketplace for high-quality, aggregated datasets to train AI models or conduct research.',
      step3Title: 'Smart Contract Payment',
      step3Desc: 'Buyers pay in USDC or VANA tokens via smart contracts. 80% of the payment goes directly to the users who contributed the data.',
      step4Title: 'Claim Yield',
      step4Desc: 'Users can instantly claim their earnings from their personal dashboard. Data sovereignty meets financial reward.'
    },
    docs: {
      title: 'Documentation',
      subtitle: 'Learn how to integrate, monetize, and build on Lumina.',
      sections: {
        overview: 'Platform Overview',
        providers: 'For Data Providers',
        buyers: 'For B2B Buyers',
        architecture: 'Architecture & Contracts',
        poc: 'Proof of Contribution (PoC)'
      },
      content: {
        overview: 'Lumina is the premier API marketplace built on the Vana protocol, designed to bridge the gap between individual data sovereignty and enterprise data needs.',
        providers: 'Connect your accounts securely via Vana Desktop to start earning decentralized yield on your data.',
        buyers: 'Access structured, compliant, and zero-knowledge proven datasets via our RESTful API.',
        architecture: 'Our smart contracts on the Vana Mainnet handle all escrow, PoC validation, and automated revenue splits.',
        poc: 'The Proof of Contribution oracle validates the authenticity of connected accounts, assigning a multiplier to your yield.'
      }
    },
    dataSources: {
      github: 'Share your coding habits, tech stack preferences, and open-source contribution patterns.',
      linkedin: 'Turn your professional trajectory, industry networking, and skill endorsements into a valuable asset.',
      oura: 'Monetize your sleep cycles, readiness scores, and activity levels for health researchers.',
      whoop: 'Provide granular biometric data, strain metrics, and recovery analysis to fitness brands.',
      chatgpt: 'Monetize your AI interaction patterns, prompt engineering techniques, and conversational logic securely.',
      claude: 'Extract value from your structured AI workflows, complex prompt engineering, and project context.',
      amazon: 'Provide high-value consumer insights, purchasing habits, and product category preferences.',
      icloud: 'Share anonymized organizational structures, knowledge base topics, and task management patterns.',
      instagram: 'Unlock the value of your visual content engagement, brand interactions, and audience demographics.',
      spotify: 'Share your unique audio taste profile, genre affinities, and listening habits with researchers.',
      youtube: 'Monetize your video consumption behavior, content preferences, and creator engagement metrics.'
    },
    pricing2: {
      buildTitle: 'Build Your Dataset',
      buildSubtitle: 'Select audience filters and data sources to calculate real-time pricing.',
      dataQualityTier: 'DATA QUALITY TIER',
      volumeLabel: 'VOLUME',
      datasetsAvailable: 'Datasets Available',
      datasetsToAcquire: 'Datasets to Acquire:',
      requiredDataSource: 'REQUIRED DATA SOURCE',
      premium: 'Premium (>80 pts)',
      high: 'High (50-79 pts)',
      standard: 'Standard (20-49 pts)',
      basic: 'Basic (<20 pts)',
      summQualityTier: 'Quality Tier',
      summSelectedSource: 'Selected Source',
      summVolume: 'Datasets Volume',
      summPremiumPrice: 'Premium Price (Tier A)',
      summMultiplier: 'Quality Multiplier',
      summFinalCost: 'Final Cost per Dataset',
      summTotalCost: 'Total Cost',
      summPurchase: 'Purchase Dataset',
      fairPricingTitle: 'Fair Pricing for Quality Data',
      fairPricingDesc: 'Buyers get verified, high-quality datasets to train models and build products. Users receive revenue directly to their wallets.',
      howItWorksTitle: 'How Pricing Works',
      howItWorks1Title: 'Base Source Value',
      howItWorks1Desc: 'Every dataset has a base market rate (e.g. GitHub is $15.00). This represents the highest tier A premium price.',
      howItWorks2Title: 'Quality Multipliers',
      howItWorks2Desc: 'The AI Oracle scores data from 0-100. Lower quality tiers apply a discount multiplier to the base value.',
      howItWorks3Title: 'Fair Revenue Split',
      howItWorks3Desc: 'Total Cost = (Base Value × Multiplier) × Volume.',
      howItWorks3Desc2: 'Users receive 80% of the total cost. The protocol retains a 20% network fee.',
      orderSummary: 'Order Summary'
    }
  },
  ru: {
    stats: {
      title1: 'Создано для будущего владения данными',
      title2: 'Lumina предоставляет инфраструктуру корпоративного уровня для безопасного подключения, проверки и маршрутизации ваших личных данных напрямую исследователям и брендами.',
      f1_title: 'Единый API',
      f1_desc: 'Получите доступ к YouTube, LinkedIn, Instagram и еще 10+ источникам через единую стандартизированную схему.',
      f2_title: 'Доказательство вклада (PoC)',
      f2_desc: 'Каждая единица данных оценивается валидаторами сети Vana на качество и подлинность перед продажей.',
      f3_title: 'Zero-Knowledge',
      f3_desc: 'Личная информация (PII) автоматически удаляется. Покупатели видят только зашифрованные агрегированные данные.',
      f4_title: 'Принадлежит пользователю',
      f4_desc: 'Данные никогда не покидают ваш ПК. Vana Desktop раздает данные напрямую с вашего устройства.'
    },
    monetize: {
      title: 'Превратите ваш цифровой след в актив',
      subtitle: 'Каждое приложение генерирует ценные данные. Lumina позволяет безопасно упаковать и сдавать в аренду эти данные проверенным покупателям, сохраняя полный контроль.',
      groups: {
        health: 'Здоровье и Биометрия',
        healthDesc: 'Ваша физическая активность и циклы сна крайне востребованы стартапами HealthTech и исследователями.',
        prof: 'Профессия и Код',
        profDesc: 'B2B-контакты и репозитории кода — премиум активы для ИИ-рекрутинга и помощников разработчиков.',
        social: 'Соцсети и Внимание',
        socialDesc: 'Ваши привычки взаимодействия и визуальный контент обучают алгоритмы рекомендаций нового поколения.',
        commerce: 'Коммерция и Финансы',
        commerceDesc: 'История покупок помогает создавать предиктивные модели потребительских расходов.'
      }
    },
    howItWorks: {
      title: 'Как это работает',
      subtitle: 'Прозрачная, децентрализованная экономика данных на базе Vana.',
      step1Title: 'Подключение и Синхронизация',
      step1Desc: 'Пользователи подключают кошельки и безопасно синхронизируют данные с платформ вроде Instagram или Spotify.',
      step2Title: 'Компании ищут данные',
      step2Desc: 'Проверенные B2B покупатели ищут на маркетплейсе качественные агрегированные датасеты для обучения ИИ.',
      step3Title: 'Оплата по смарт-контракту',
      step3Desc: 'Покупатели платят в USDC или VANA. 80% оплаты идет напрямую пользователям, предоставившим данные.',
      step4Title: 'Сбор дохода',
      step4Desc: 'Пользователи мгновенно забирают заработок с личного дашборда. Суверенитет данных встречается с финансовой наградой.'
    },
    docs: {
      title: 'Документация',
      subtitle: 'Узнайте, как интегрировать, монетизировать и создавать продукты на Lumina.',
      sections: {
        overview: 'Обзор платформы',
        providers: 'Для поставщиков данных',
        buyers: 'Для B2B покупателей',
        architecture: 'Архитектура и контракты',
        poc: 'Proof of Contribution (PoC)'
      },
      content: {
        overview: 'Lumina — это премиальный API маркетплейс на протоколе Vana, созданный для объединения суверенитета данных и корпоративных нужд.',
        providers: 'Безопасно подключите свои аккаунты через Vana Desktop, чтобы начать зарабатывать децентрализованный доход.',
        buyers: 'Получите доступ к структурированным, анонимизированным датасетам через наш RESTful API.',
        architecture: 'Наши смарт-контракты в Vana Mainnet управляют депонированием, валидацией PoC и автоматическим разделением доходов.',
        poc: 'Оракул Proof of Contribution подтверждает подлинность аккаунтов, назначая множитель вашему доходу.'
      }
    },
    dataSources: {
      github: 'Делитесь привычками программирования, стеком технологий и вкладом в open-source.',
      linkedin: 'Превратите ваш профессиональный путь, связи и навыки в ценный актив.',
      oura: 'Монетизируйте ваши циклы сна, уровень готовности и активность для исследователей здоровья.',
      whoop: 'Предоставьте детальные биометрические данные, метрики нагрузки и анализ восстановления фитнес-брендам.',
      chatgpt: 'Безопасно монетизируйте паттерны взаимодействия с ИИ, техники промпт-инжиниринга и логику бесед.',
      claude: 'Извлекайте выгоду из ваших структурированных ИИ-воркфлоу, промптов и контекста проектов.',
      amazon: 'Предоставьте ценные инсайты о потребителях, покупательских привычках и предпочтениях товаров.',
      icloud: 'Делитесь анонимизированными структурами организации, темами баз знаний и паттернами задач.',
      instagram: 'Раскройте ценность вашего взаимодействия с визуальным контентом, брендами и аудиторией.',
      spotify: 'Делитесь своим уникальным профилем аудиальных вкусов, любовью к жанрам и привычками прослушивания.',
      youtube: 'Монетизируйте ваше поведение потребления видео, предпочтения контента и метрики вовлеченности.'
    },
    pricing2: {
      buildTitle: 'Соберите свой датасет',
      buildSubtitle: 'Выберите фильтры аудитории и источники данных для расчета цены в реальном времени.',
      dataQualityTier: 'УРОВЕНЬ КАЧЕСТВА ДАННЫХ',
      volumeLabel: 'ОБЪЕМ',
      datasetsAvailable: 'Доступно датасетов',
      datasetsToAcquire: 'Датасетов для покупки:',
      requiredDataSource: 'НЕОБХОДИМЫЙ ИСТОЧНИК',
      premium: 'Премиум (>80 баллов)',
      high: 'Высокий (50-79 баллов)',
      standard: 'Стандарт (20-49 баллов)',
      basic: 'Базовый (<20 баллов)',
      summQualityTier: 'Уровень качества',
      summSelectedSource: 'Выбранный источник',
      summVolume: 'Объем датасетов',
      summPremiumPrice: 'Премиум цена (Tier A)',
      summMultiplier: 'Множитель качества',
      summFinalCost: 'Итоговая стоимость за датасет',
      summTotalCost: 'Общая стоимость',
      summPurchase: 'Купить датасет',
      fairPricingTitle: 'Справедливые цены за качественные данные',
      fairPricingDesc: 'Покупатели получают проверенные датасеты для обучения моделей. Пользователи получают доход напрямую на свои кошельки.',
      howItWorksTitle: 'Как работают цены',
      howItWorks1Title: 'Базовая стоимость источника',
      howItWorks1Desc: 'Каждый датасет имеет базовую рыночную ставку (например, GitHub — $15.00). Это максимальная цена для уровня Tier A.',
      howItWorks2Title: 'Множители качества',
      howItWorks2Desc: 'ИИ-Оракул оценивает данные от 0 до 100. Для более низких уровней применяется скидочный множитель.',
      howItWorks3Title: 'Справедливое разделение дохода',
      howItWorks3Desc: 'Общая стоимость = (Базовая цена × Множитель) × Объем.',
      howItWorks3Desc2: 'Пользователи получают 80% от стоимости. Протокол удерживает 20% комиссии.',
      orderSummary: 'Сводка заказа'
    }
  },
  es: {
    stats: {
      title1: 'Construido para el futuro de los datos',
      title2: 'Lumina proporciona infraestructura empresarial para conectar, validar y enrutar datos de forma segura.',
      f1_title: 'API Unificada',
      f1_desc: 'Accede a YouTube, LinkedIn, Instagram y 10+ fuentes mediante un esquema estándar.',
      f2_title: 'Proof of Contribution',
      f2_desc: 'Cada punto de dato es puntuado por validadores de la red Vana antes de la venta.',
      f3_title: 'Zero-Knowledge',
      f3_desc: 'La información personal (PII) es redactada automáticamente. Los compradores solo ven agregados cifrados.',
      f4_title: 'Propiedad del Usuario',
      f4_desc: 'Los datos nunca salen de tu PC. Vana Desktop los sirve directamente desde tu dispositivo.'
    },
    monetize: {
      title: 'Convierte tu Huella Digital en un Activo',
      subtitle: 'Cada app genera datos valiosos. Empaqueta y alquila estos datos a compradores verificados manteniendo el control.',
      groups: {
        health: 'Salud y Biometría',
        healthDesc: 'Tu actividad y sueño son muy buscados por startups de HealthTech.',
        prof: 'Profesional y Código',
        profDesc: 'Redes B2B y repositorios son activos premium para modelos de IA.',
        social: 'Social y Atención',
        socialDesc: 'Tus hábitos entrenan algoritmos de recomendación de próxima generación.',
        commerce: 'Comercio y Finanzas',
        commerceDesc: 'El historial de compras ayuda a construir modelos de gasto del consumidor.'
      }
    },
    howItWorks: {
      title: 'Cómo Funciona',
      subtitle: 'Economía de datos transparente impulsada por Vana.',
      step1Title: 'Conectar y Sincronizar',
      step1Desc: 'Los usuarios conectan sus cuentas de forma segura desde Instagram, Spotify, etc.',
      step2Title: 'Las Empresas Buscan',
      step2Desc: 'Compradores B2B buscan datasets agregados de alta calidad para entrenar IA.',
      step3Title: 'Pago por Contrato Inteligente',
      step3Desc: 'El 80% del pago en USDC/VANA va directamente a los usuarios.',
      step4Title: 'Reclamar Rendimiento',
      step4Desc: 'Reclama tus ganancias instantáneamente desde el panel personal.'
    },
    docs: {
      title: 'Documentación',
      subtitle: 'Aprende a integrar y construir en Lumina.',
      sections: {
        overview: 'Visión General',
        providers: 'Para Proveedores',
        buyers: 'Para Compradores',
        architecture: 'Arquitectura',
        poc: 'Proof of Contribution (PoC)'
      },
      content: {
        overview: 'Lumina es el mercado API premium construido en Vana.',
        providers: 'Conecta tus cuentas vía Vana Desktop para ganar rendimiento.',
        buyers: 'Accede a datasets estructurados y probados vía API.',
        architecture: 'Contratos inteligentes en Vana Mainnet manejan todo el flujo.',
        poc: 'El oráculo PoC valida la autenticidad y asigna un multiplicador.'
      }
    },
    dataSources: {
      github: 'Comparte tus hábitos de codificación y contribuciones open-source.',
      linkedin: 'Convierte tu trayectoria profesional y red de contactos en un activo valioso.',
      oura: 'Monetiza tus ciclos de sueño y niveles de actividad para investigadores de salud.',
      whoop: 'Proporciona datos biométricos y análisis de recuperación a marcas de fitness.',
      chatgpt: 'Monetiza de forma segura tus interacciones con IA y técnicas de ingeniería de prompts.',
      claude: 'Extrae valor de tus flujos de trabajo de IA estructurados y contexto de proyectos.',
      amazon: 'Proporciona información valiosa sobre hábitos de compra y preferencias de productos.',
      icloud: 'Comparte estructuras organizativas anonimizadas y patrones de gestión de tareas.',
      instagram: 'Desbloquea el valor de tu interacción con contenido visual y marcas.',
      spotify: 'Comparte tu perfil único de gustos musicales y hábitos de escucha.',
      youtube: 'Monetiza tu comportamiento de consumo de video y preferencias de contenido.'
    },
    pricing2: {
      buildTitle: 'Construye tu Dataset',
      buildSubtitle: 'Selecciona filtros de audiencia y fuentes para calcular el precio.',
      dataQualityTier: 'NIVEL DE CALIDAD DE DATOS',
      volumeLabel: 'VOLUMEN',
      datasetsAvailable: 'Datasets Disponibles',
      datasetsToAcquire: 'Datasets a Adquirir:',
      requiredDataSource: 'FUENTE DE DATOS REQUERIDA',
      premium: 'Premium (>80 pts)',
      high: 'Alto (50-79 pts)',
      standard: 'Estándar (20-49 pts)',
      basic: 'Básico (<20 pts)',
      summQualityTier: 'Nivel de Calidad',
      summSelectedSource: 'Fuente Seleccionada',
      summVolume: 'Volumen de Datasets',
      summPremiumPrice: 'Precio Premium (Tier A)',
      summMultiplier: 'Multiplicador de Calidad',
      summFinalCost: 'Custo Final por Dataset',
      summTotalCost: 'Costo Total',
      summPurchase: 'Comprar Dataset',
      fairPricingTitle: 'Precios Justos por Datos de Calidad',
      fairPricingDesc: 'Compradores obtienen datasets verificados. Usuarios reciben ingresos directo en su billetera.',
      howItWorksTitle: 'Cómo Funcionan los Precios',
      howItWorks1Title: 'Valor Base de Fuente',
      howItWorks1Desc: 'Cada dataset tiene una tasa de mercado base (ej. GitHub $15.00).',
      howItWorks2Title: 'Multiplicadores de Calidad',
      howItWorks2Desc: 'El oráculo puntúa de 0 a 100. Niveles bajos aplican un descuento.',
      howItWorks3Title: 'Reparto Justo de Ingresos',
      howItWorks3Desc: 'Costo Total = (Valor Base × Multiplicador) × Volumen.',
      howItWorks3Desc2: 'Los usuarios reciben el 80%. La red retiene un 20%.',
      orderSummary: 'Resumen del Pedido'
    }
  },
  pt: {
    stats: {
      title1: 'Construído para o futuro dos dados',
      title2: 'A Lumina fornece infraestrutura para conectar, validar e rotear dados de forma segura.',
      f1_title: 'API Unificada',
      f1_desc: 'Acesse YouTube, LinkedIn, Instagram e 10+ fontes por meio de um esquema padrão.',
      f2_title: 'Proof of Contribution',
      f2_desc: 'Cada ponto de dados é pontuado por validadores da rede Vana.',
      f3_title: 'Zero-Knowledge',
      f3_desc: 'Informações pessoais (PII) são removidas automaticamente.',
      f4_title: 'Propriedade do Usuário',
      f4_desc: 'Os dados nunca saem do seu PC. O Vana Desktop os serve do seu dispositivo.'
    },
    monetize: {
      title: 'Transforme sua Pegada Digital em Ativo',
      subtitle: 'Cada app gera dados valiosos. Alugue seus dados para compradores verificados mantendo o controle.',
      groups: {
        health: 'Saúde e Biometria',
        healthDesc: 'Sua atividade e sono são procurados por startups de HealthTech.',
        prof: 'Profissional e Código',
        profDesc: 'Redes B2B e repositórios são ativos premium para IA.',
        social: 'Social e Atenção',
        socialDesc: 'Seus hábitos treinam os algoritmos da próxima geração.',
        commerce: 'Comércio e Finanças',
        commerceDesc: 'O histórico de compras ajuda a construir modelos preditivos.'
      }
    },
    howItWorks: {
      title: 'Como Funciona',
      subtitle: 'Economia de dados transparente impulsionada pela Vana.',
      step1Title: 'Conectar e Sincronizar',
      step1Desc: 'Os usuários conectam contas do Instagram, Spotify, etc.',
      step2Title: 'Empresas Buscam Dados',
      step2Desc: 'Compradores B2B buscam datasets agregados para treinar IA.',
      step3Title: 'Pagamento via Contrato Inteligente',
      step3Desc: '80% do pagamento vai diretamente para os usuários.',
      step4Title: 'Reivindicar Rendimento',
      step4Desc: 'Reivindique ganhos instantaneamente no painel pessoal.'
    },
    docs: {
      title: 'Documentação',
      subtitle: 'Aprenda como integrar e construir na Lumina.',
      sections: {
        overview: 'Visão Geral',
        providers: 'Para Provedores',
        buyers: 'Para Compradores',
        architecture: 'Arquitetura',
        poc: 'Proof of Contribution (PoC)'
      },
      content: {
        overview: 'Lumina é o principal mercado de API construído na Vana.',
        providers: 'Conecte contas via Vana Desktop para ganhar rendimento.',
        buyers: 'Acesse datasets estruturados via API.',
        architecture: 'Contratos na Vana Mainnet gerenciam pagamentos.',
        poc: 'O oráculo PoC valida a autenticidade das contas.'
      }
    },
    dataSources: {
      github: 'Compartilhe seus hábitos de codificação e contribuições open-source.',
      linkedin: 'Transforme sua trajetória profissional e rede de contatos em um ativo valioso.',
      oura: 'Monetize seus ciclos de sono e níveis de atividade para pesquisadores de saúde.',
      whoop: 'Forneça dados biométricos e análises de recuperação para marcas de fitness.',
      chatgpt: 'Monetize com segurança suas interações com IA e engenharia de prompts.',
      claude: 'Extraia valor de seus fluxos de trabalho de IA e contexto de projetos.',
      amazon: 'Forneça insights valiosos sobre hábitos de compra e preferências de produtos.',
      icloud: 'Compartilhe estruturas organizacionais anonimizadas e padrões de gestão.',
      instagram: 'Desbloqueie o valor do seu engajamento com conteúdo visual e marcas.',
      spotify: 'Compartilhe seu perfil único de gostos musicais e hábitos de audição.',
      youtube: 'Monetize seu comportamento de consumo de vídeo e preferências de conteúdo.'
    },
    pricing2: {
      buildTitle: 'Construa seu Dataset',
      buildSubtitle: 'Selecione filtros e fontes para calcular o preço em tempo real.',
      dataQualityTier: 'NÍVEL DE QUALIDADE',
      volumeLabel: 'VOLUME',
      datasetsAvailable: 'Datasets Disponíveis',
      datasetsToAcquire: 'Datasets a Adquirir:',
      requiredDataSource: 'FONTE DE DADOS OBRIGATÓRIA',
      premium: 'Premium (>80 pts)',
      high: 'Alto (50-79 pts)',
      standard: 'Padrão (20-49 pts)',
      basic: 'Básico (<20 pts)',
      summQualityTier: 'Nível de Qualidade',
      summSelectedSource: 'Fonte Selecionada',
      summVolume: 'Volume de Datasets',
      summPremiumPrice: 'Preço Premium (Tier A)',
      summMultiplier: 'Multiplicador de Qualidade',
      summFinalCost: 'Custo Final por Dataset',
      summTotalCost: 'Custo Total',
      summPurchase: 'Comprar Dataset',
      fairPricingTitle: 'Preços Justos por Dados de Qualidade',
      fairPricingDesc: 'Compradores obtêm datasets verificados. Usuários recebem receita diretamente.',
      howItWorksTitle: 'Como os Preços Funcionam',
      howItWorks1Title: 'Valor Base',
      howItWorks1Desc: 'Cada dataset tem uma taxa de mercado base (ex. GitHub $15.00).',
      howItWorks2Title: 'Multiplicadores de Qualidade',
      howItWorks2Desc: 'O Oráculo pontua de 0 a 100. Níveis baixos aplicam um desconto.',
      howItWorks3Title: 'Divisão Justa',
      howItWorks3Desc: 'Custo Total = (Valor Base × Multiplicador) × Volume.',
      howItWorks3Desc2: 'Usuários recebem 80%. A rede retém 20%.',
      orderSummary: 'Resumo do Pedido'
    }
  },
  de: {
    stats: {
      title1: 'Gebaut für die Zukunft des Datenbesitzes',
      title2: 'Lumina bietet Unternehmensinfrastruktur zur sicheren Weiterleitung privater Daten.',
      f1_title: 'Einheitliche API',
      f1_desc: 'Greifen Sie auf YouTube, LinkedIn und mehr über ein standardisiertes Schema zu.',
      f2_title: 'Proof of Contribution',
      f2_desc: 'Jeder Datenpunkt wird vor dem Verkauf von Vana-Validatoren bewertet.',
      f3_title: 'Zero-Knowledge',
      f3_desc: 'Personenbezogene Daten (PII) werden automatisch entfernt.',
      f4_title: 'Im Besitz des Nutzers',
      f4_desc: 'Daten verlassen niemals Ihren PC. Vana Desktop bedient Käufer direkt.'
    },
    monetize: {
      title: 'Machen Sie Ihren digitalen Fußabdruck zu einem Gut',
      subtitle: 'Jede App generiert wertvolle Daten. Vermieten Sie diese sicher an verifizierte Käufer.',
      groups: {
        health: 'Gesundheit & Biometrie',
        healthDesc: 'Körperliche Aktivität und Schlaf sind bei HealthTechs sehr gefragt.',
        prof: 'Beruf & Code',
        profDesc: 'B2B-Netzwerke sind Premium-Assets für KI-Recruiting.',
        social: 'Social Media',
        socialDesc: 'Ihre Interaktionen trainieren Algorithmen der nächsten Generation.',
        commerce: 'Handel & Finanzen',
        commerceDesc: 'Kaufhistorien helfen beim Aufbau prädiktiver Modelle.'
      }
    },
    howItWorks: {
      title: 'Wie es funktioniert',
      subtitle: 'Eine transparente, dezentrale Datenökonomie.',
      step1Title: 'Verbinden & Synchronisieren',
      step1Desc: 'Nutzer verbinden sicher Daten von Instagram, Spotify usw.',
      step2Title: 'Unternehmen durchsuchen Daten',
      step2Desc: 'Verifizierte Käufer suchen nach hochwertigen Datensätzen.',
      step3Title: 'Smart Contract Zahlung',
      step3Desc: '80 % der Zahlung gehen direkt an die Nutzer.',
      step4Title: 'Erträge einfordern',
      step4Desc: 'Erträge können sofort im Dashboard abgehoben werden.'
    },
    docs: {
      title: 'Dokumentation',
      subtitle: 'Lernen Sie, wie Sie Lumina integrieren.',
      sections: {
        overview: 'Plattformübersicht',
        providers: 'Für Datenanbieter',
        buyers: 'Für Käufer',
        architecture: 'Architektur',
        poc: 'Proof of Contribution (PoC)'
      },
      content: {
        overview: 'Lumina ist der führende API-Marktplatz auf Vana.',
        providers: 'Verbinden Sie Ihre Konten via Vana Desktop.',
        buyers: 'Greifen Sie auf strukturierte Datensätze zu.',
        architecture: 'Smart Contracts verwalten alle Zahlungen.',
        poc: 'Das PoC-Orakel validiert die Authentizität.'
      }
    },
    dataSources: {
      github: 'Teilen Sie Ihre Programmiergewohnheiten und Open-Source-Beiträge.',
      linkedin: 'Machen Sie Ihren beruflichen Werdegang und Ihr Netzwerk zu einem wertvollen Gut.',
      oura: 'Monetarisieren Sie Ihre Schlafzyklen und Aktivitätsniveaus für Gesundheitsforscher.',
      whoop: 'Bieten Sie Fitnessmarken biometrische Daten und Erholungsanalysen.',
      chatgpt: 'Monetarisieren Sie sicher Ihre KI-Interaktionen und Prompt-Engineering-Techniken.',
      claude: 'Ziehen Sie Wert aus Ihren strukturierten KI-Workflows und Projektkontexten.',
      amazon: 'Bieten Sie wertvolle Einblicke in Kaufgewohnheiten und Produktpräferenzen.',
      icloud: 'Teilen Sie anonymisierte Organisationsstrukturen und Aufgabenmanagement-Muster.',
      instagram: 'Erschließen Sie den Wert Ihrer Interaktionen mit visuellen Inhalten und Marken.',
      spotify: 'Teilen Sie Ihr einzigartiges Audiogeschmacksprofil und Ihre Hörgewohnheiten.',
      youtube: 'Monetarisieren Sie Ihr Videokonsumverhalten und Ihre Inhaltspräferenzen.'
    },
    pricing2: {
      buildTitle: 'Erstellen Sie Ihren Datensatz',
      buildSubtitle: 'Wählen Sie Filter und Quellen aus, um den Preis zu berechnen.',
      dataQualityTier: 'DATENQUALITÄTSSTUFE',
      volumeLabel: 'VOLUMEN',
      datasetsAvailable: 'Verfügbare Datensätze',
      datasetsToAcquire: 'Zu erwerbende Datensätze:',
      requiredDataSource: 'ERFORDERLICHE DATENQUELLE',
      premium: 'Premium (>80 Pkt)',
      high: 'Hoch (50-79 Pkt)',
      standard: 'Standard (20-49 Pkt)',
      basic: 'Basis (<20 Pkt)',
      summQualityTier: 'Qualitätsstufe',
      summSelectedSource: 'Ausgewählte Quelle',
      summVolume: 'Datensatzvolumen',
      summPremiumPrice: 'Premium-Preis (Tier A)',
      summMultiplier: 'Qualitätsmultiplikator',
      summFinalCost: 'Endkosten pro Datensatz',
      summTotalCost: 'Gesamtkosten',
      summPurchase: 'Datensatz kaufen',
      fairPricingTitle: 'Faire Preise für Qualitätsdaten',
      fairPricingDesc: 'Käufer erhalten verifizierte Daten. Nutzer erhalten direkt Einnahmen.',
      howItWorksTitle: 'Wie die Preisgestaltung funktioniert',
      howItWorks1Title: 'Basisquellenwert',
      howItWorks1Desc: 'Jeder Datensatz hat einen Basis-Marktwert (z. B. GitHub 15,00 $).',
      howItWorks2Title: 'Qualitätsmultiplikatoren',
      howItWorks2Desc: 'Das KI-Orakel bewertet von 0-100. Niedrigere Stufen erhalten Rabatt.',
      howItWorks3Title: 'Faire Aufteilung',
      howItWorks3Desc: 'Gesamtkosten = (Basiswert × Multiplikator) × Volumen.',
      howItWorks3Desc2: 'Nutzer erhalten 80 %. Das Protokoll behält 20 %.',
      orderSummary: 'Bestellübersicht'
    }
  },
  zh: {
    stats: {
      title1: '为数据所有权的未来而建',
      title2: 'Lumina 提供企业级基础设施，安全连接、验证并传输私人用户数据。',
      f1_title: '统一 API',
      f1_desc: '通过单一标准化架构访问 YouTube、LinkedIn、Instagram 等。',
      f2_title: '贡献证明 (PoC)',
      f2_desc: '每个数据点在出售前均由 Vana 网络验证者进行质量评分。',
      f3_title: '零知识证明',
      f3_desc: '自动脱敏个人信息 (PII)。买家只能看到加密的聚合数据。',
      f4_title: '用户所有',
      f4_desc: '数据永远不会离开您的电脑。Vana Desktop 直接从您的设备提供数据。'
    },
    monetize: {
      title: '将您的数字足迹转化为资产',
      subtitle: '您使用的每个应用都会生成高价值数据。Lumina 让您在保持控制权的同时将数据出租给买家。',
      groups: {
        health: '健康与生物识别',
        healthDesc: '您的身体活动和睡眠周期深受健康科技初创公司追捧。',
        prof: '职场与代码',
        profDesc: 'B2B 社交网络和代码库是 AI 招聘模型的高级资产。',
        social: '社交与关注度',
        socialDesc: '您的互动习惯训练了下一代推荐算法。',
        commerce: '商业与金融',
        commerceDesc: '购买历史帮助建立预测性消费模型。'
      }
    },
    howItWorks: {
      title: '运作方式',
      subtitle: '由 Vana 驱动的透明、去中心化数据经济。',
      step1Title: '连接与同步',
      step1Desc: '用户安全地从 Instagram、Spotify 等平台同步个人数据。',
      step2Title: '企业浏览数据',
      step2Desc: '经过验证的 B2B 买家在市场上搜索高质量数据集来训练 AI。',
      step3Title: '智能合约支付',
      step3Desc: '买家付款的 80% 直接归提供数据的用户所有。',
      step4Title: '领取收益',
      step4Desc: '用户可以在个人控制台中立即领取收益。'
    },
    docs: {
      title: '开发文档',
      subtitle: '了解如何集成、货币化并在 Lumina 上进行开发。',
      sections: {
        overview: '平台概览',
        providers: '数据提供者指南',
        buyers: 'B2B 买家指南',
        architecture: '架构与合约',
        poc: '贡献证明 (PoC)'
      },
      content: {
        overview: 'Lumina 是建立在 Vana 协议上的高级 API 市场。',
        providers: '通过 Vana Desktop 安全连接账户以开始赚取收益。',
        buyers: '通过我们的 RESTful API 访问结构化数据集。',
        architecture: '我们的智能合约处理所有托管、验证和自动收入分配。',
        poc: '贡献证明预言机验证账户真实性并为您分配收益乘数。'
      }
    },
    dataSources: {
      github: '分享您的编码习惯、技术栈偏好和开源贡献模式。',
      linkedin: '将您的职业轨迹、行业人脉和技能认可转化为宝贵资产。',
      oura: '为健康研究人员将您的睡眠周期、准备度得分和活动水平货币化。',
      whoop: '向健身品牌提供细化的生物识别数据、压力指标和恢复分析。',
      chatgpt: '安全地将您的 AI 交互模式、提示词工程技术和对话逻辑货币化。',
      claude: '从您结构化的 AI 工作流、复杂的提示词工程和项目背景中提取价值。',
      amazon: '提供高价值的消费者洞察、购买习惯和产品类别偏好。',
      icloud: '分享匿名化的组织结构、知识库主题和任务管理模式。',
      instagram: '解锁您的视觉内容参与度、品牌互动和受众特征的价值。',
      spotify: '与研究人员分享您独特的音频口味档案、流派偏好和收听习惯。',
      youtube: '将您的视频消费行为、内容偏好和创作者参与度指标货币化。'
    },
    pricing2: {
      buildTitle: '构建您的数据集',
      buildSubtitle: '选择受众过滤器和数据源以计算实时价格。',
      dataQualityTier: '数据质量等级',
      volumeLabel: '数据量',
      datasetsAvailable: '可用数据集',
      datasetsToAcquire: '购买数量：',
      requiredDataSource: '必需的数据源',
      premium: '高级 (>80 分)',
      high: '高 (50-79 分)',
      standard: '标准 (20-49 分)',
      basic: '基础 (<20 分)',
      summQualityTier: '质量等级',
      summSelectedSource: '已选来源',
      summVolume: '数据集数量',
      summPremiumPrice: '高级价格 (Tier A)',
      summMultiplier: '质量乘数',
      summFinalCost: '单个最终价格',
      summTotalCost: '总金额',
      summPurchase: '购买数据集',
      fairPricingTitle: '高质量数据的公平定价',
      fairPricingDesc: '买家获得经过验证的高质量数据集。用户直接在钱包中获得收入。',
      howItWorksTitle: '定价原理',
      howItWorks1Title: '基础数据价值',
      howItWorks1Desc: '每个数据集都有基础市场价（例如 GitHub 为 $15.00）。这是 Tier A 的最高价。',
      howItWorks2Title: '质量乘数',
      howItWorks2Desc: 'AI 预言机对数据进行 0-100 评分。较低的质量等级适用折扣乘数。',
      howItWorks3Title: '公平收入分成',
      howItWorks3Desc: '总费用 = (基础价格 × 乘数) × 数量。',
      howItWorks3Desc2: '用户获得总费用的 80%。协议保留 20% 的网络费。',
      orderSummary: '订单摘要'
    }
  },
  ko: {
    stats: {
      title1: '데이터 소유권의 미래를 위해 구축됨',
      title2: 'Lumina는 개인 사용자 데이터를 연구자와 브랜드에 안전하게 연결하고 검증하는 엔터프라이즈급 인프라를 제공합니다.',
      f1_title: '통합 API',
      f1_desc: '단일 표준화된 스키마를 통해 YouTube, LinkedIn, Instagram 등에 액세스하세요.',
      f2_title: '기여 증명 (PoC)',
      f2_desc: '모든 데이터는 판매 전에 Vana 검증자에 의해 품질이 평가됩니다.',
      f3_title: '영지식 증명 (ZK)',
      f3_desc: '개인식별정보(PII)는 자동으로 삭제됩니다. 구매자는 암호화된 집계만 볼 수 있습니다.',
      f4_title: '사용자 소유',
      f4_desc: '데이터는 PC를 떠나지 않습니다. Vana Desktop이 디바이스에서 직접 데이터를 제공합니다.'
    },
    monetize: {
      title: '디지털 발자국을 자산으로 전환하세요',
      subtitle: '당신이 사용하는 모든 앱은 가치 있는 데이터를 생성합니다. Lumina를 통해 이 데이터를 검증된 구매자에게 안전하게 대여하세요.',
      groups: {
        health: '건강 및 생체 인식',
        healthDesc: '신체 활동과 수면 주기는 HealthTech 스타트업이 많이 찾습니다.',
        prof: '전문직 및 코드',
        profDesc: 'B2B 네트워크 및 코딩 저장소는 AI 리크루팅을 위한 프리미엄 자산입니다.',
        social: '소셜 및 관심도',
        socialDesc: '당신의 참여 습관이 차세대 추천 알고리즘을 훈련시킵니다.',
        commerce: '상거래 및 금융',
        commerceDesc: '구매 내역은 소비 예측 모델 구축에 도움이 됩니다.'
      }
    },
    howItWorks: {
      title: '작동 방식',
      subtitle: 'Vana가 구동하는 투명한 탈중앙화 데이터 경제.',
      step1Title: '연결 및 동기화',
      step1Desc: '사용자는 Instagram, Spotify 등에서 개인 데이터를 안전하게 동기화합니다.',
      step2Title: '기업의 데이터 검색',
      step2Desc: '검증된 구매자가 AI 훈련을 위한 고품질 데이터셋을 시장에서 검색합니다.',
      step3Title: '스마트 컨트랙트 결제',
      step3Desc: '구매자 결제 금액의 80%가 데이터를 제공한 사용자에게 직접 지급됩니다.',
      step4Title: '수익 청구',
      step4Desc: '사용자는 개인 대시보드에서 즉시 수익을 청구할 수 있습니다.'
    },
    docs: {
      title: '문서',
      subtitle: 'Lumina에서 통합하고 수익을 창출하는 방법을 알아보세요.',
      sections: {
        overview: '플랫폼 개요',
        providers: '데이터 제공자용',
        buyers: 'B2B 구매자용',
        architecture: '아키텍처 및 컨트랙트',
        poc: '기여 증명 (PoC)'
      },
      content: {
        overview: 'Lumina는 Vana 프로토콜에 구축된 최고의 API 마켓플레이스입니다.',
        providers: 'Vana Desktop을 통해 계정을 안전하게 연결하여 수익을 얻으세요.',
        buyers: 'RESTful API를 통해 구조화된 데이터셋에 액세스하세요.',
        architecture: '메인넷 스마트 컨트랙트가 에스크로, PoC 검증 및 수익 분배를 처리합니다.',
        poc: 'PoC 오라클이 계정 진위성을 검증하고 수익 배수를 할당합니다.'
      }
    },
    dataSources: {
      github: '코딩 습관, 기술 스택 선호도 및 오픈 소스 기여 패턴을 공유하세요.',
      linkedin: '전문적인 궤적, 업계 네트워킹 및 기술 보증을 가치 있는 자산으로 전환하세요.',
      oura: '건강 연구자를 위해 수면 주기, 준비도 점수 및 활동 수준을 수익화하세요.',
      whoop: '피트니스 브랜드에 세분화된 생체 데이터, 스트레스 지표 및 회복 분석을 제공하세요.',
      chatgpt: 'AI 상호 작용 패턴, 프롬프트 엔지니어링 기술 및 대화 논리를 안전하게 수익화하세요.',
      claude: '구조화된 AI 워크플로, 복잡한 프롬프트 엔지니어링 및 프로젝트 컨텍스트에서 가치를 추출하세요.',
      amazon: '고부가가치 소비자 인사이트, 구매 습관 및 제품 범주 선호도를 제공하세요.',
      icloud: '익명화된 조직 구조, 지식 기반 주제 및 작업 관리 패턴을 공유하세요.',
      instagram: '시각적 콘텐츠 참여, 브랜드 상호 작용 및 잠재 고객 인구 통계의 가치를 잠금 해제하세요.',
      spotify: '연구자들과 고유한 오디오 취향 프로필, 장르 친화도 및 청취 습관을 공유하세요.',
      youtube: '비디오 소비 행동, 콘텐츠 선호도 및 크리에이터 참여 지표를 수익화하세요.'
    },
    pricing2: {
      buildTitle: '데이터셋 빌드',
      buildSubtitle: '실시간 가격을 계산하기 위해 대상을 선택하세요.',
      dataQualityTier: '데이터 품질 등급',
      volumeLabel: '볼륨',
      datasetsAvailable: '사용 가능한 데이터셋',
      datasetsToAcquire: '구매할 데이터셋:',
      requiredDataSource: '필수 데이터 소스',
      premium: '프리미엄 (>80 점)',
      high: '높음 (50-79 점)',
      standard: '표준 (20-49 점)',
      basic: '기본 (<20 점)',
      summQualityTier: '품질 등급',
      summSelectedSource: '선택된 소스',
      summVolume: '데이터셋 볼륨',
      summPremiumPrice: '프리미엄 가격 (Tier A)',
      summMultiplier: '품질 배수',
      summFinalCost: '데이터셋당 최종 비용',
      summTotalCost: '총 비용',
      summPurchase: '데이터셋 구매',
      fairPricingTitle: '고품질 데이터에 대한 공정한 가격',
      fairPricingDesc: '구매자는 검증된 데이터를 얻고, 사용자는 지갑으로 직접 수익을 받습니다.',
      howItWorksTitle: '가격 책정 방식',
      howItWorks1Title: '기본 소스 가치',
      howItWorks1Desc: '모든 데이터셋에는 기본 시장 가격이 있습니다(예: GitHub는 $15.00).',
      howItWorks2Title: '품질 배수',
      howItWorks2Desc: 'AI 오라클은 0-100 사이의 점수를 매깁니다. 낮은 등급은 할인이 적용됩니다.',
      howItWorks3Title: '공정한 수익 분배',
      howItWorks3Desc: '총 비용 = (기본 가격 × 배수) × 볼륨.',
      howItWorks3Desc2: '사용자는 총 비용의 80%를 받습니다. 네트워크 수수료는 20%입니다.',
      orderSummary: '주문 요약'
    }
  }
};

let file = fs.readFileSync('src/lib/i18n/dictionaries.ts', 'utf8');
const localesList = ['en', 'ru', 'es', 'pt', 'de', 'zh', 'ko'];

localesList.forEach(loc => {
  // Inject new objects as actual JS strings to avoid duplicates and JSON quotes issues
  const statsStr = Object.keys(missingTranslations[loc].stats).map(k => `      ${k}: '${missingTranslations[loc].stats[k].replace(/'/g, "\\'")}'`).join(",\n");
  const monetizeStr = Object.keys(missingTranslations[loc].monetize).map(k => {
    if (k === 'groups') {
      const g = missingTranslations[loc].monetize.groups;
      return `      groups: {\n` + Object.keys(g).map(gk => `        ${gk}: '${g[gk].replace(/'/g, "\\'")}'`).join(",\n") + `\n      }`;
    }
    return `      ${k}: '${missingTranslations[loc].monetize[k].replace(/'/g, "\\'")}'`;
  }).join(",\n");
  const howItWorksStr = Object.keys(missingTranslations[loc].howItWorks).map(k => `      ${k}: '${missingTranslations[loc].howItWorks[k].replace(/'/g, "\\'")}'`).join(",\n");
  const docsStr = Object.keys(missingTranslations[loc].docs).map(k => {
    if (typeof missingTranslations[loc].docs[k] === 'object') {
      const g = missingTranslations[loc].docs[k];
      return `      ${k}: {\n` + Object.keys(g).map(gk => `        ${gk}: '${g[gk].replace(/'/g, "\\'")}'`).join(",\n") + `\n      }`;
    }
    return `      ${k}: '${missingTranslations[loc].docs[k].replace(/'/g, "\\'")}'`;
  }).join(",\n");
  const dataSourcesStr = Object.keys(missingTranslations[loc].dataSources).map(k => `      ${k}: '${missingTranslations[loc].dataSources[k].replace(/'/g, "\\'")}'`).join(",\n");

  const strToInject = 
    `\n    stats: {\n${statsStr}\n    },` +
    `\n    monetize: {\n${monetizeStr}\n    },` +
    `\n    howItWorks: {\n${howItWorksStr}\n    },` +
    `\n    docs: {\n${docsStr}\n    },` +
    `\n    dataSources: {\n${dataSourcesStr}\n    },\n`;

  let safeRegex = new RegExp("(^|\\n)(\\s+)" + loc + ": \\{\\s*");
  file = file.replace(safeRegex, "$1$2" + loc + ": {" + strToInject);

  // Inject pricing2 into pricing: {
  const p2 = missingTranslations[loc].pricing2;
  const pricingInject = Object.keys(p2).map(k => `${k}: '${p2[k].replace(/'/g, "\\'")}'`).join(",\n        ") + ",\n        ";
  
  let blockStart = file.indexOf(loc + ": {");
  let pricingIdx = file.indexOf("pricing: {", blockStart);
  
  file = file.substring(0, pricingIdx + "pricing: {".length) + "\n        " + pricingInject + file.substring(pricingIdx + "pricing: {".length);
});

fs.writeFileSync('src/lib/i18n/dictionaries.ts', file);
console.log('Injected cleanly');
