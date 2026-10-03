const fs = require('fs');

const sourcesDict = {
  en: {
    pageTitle: "Data Sources",
    pageSubtitle: "Browse available data sources. Connect your accounts securely via Vana's decentralized protocol.",
    noSources: "No data sources available in this category.",
    all: "All",
    categories: {
      "Entertainment": "Entertainment",
      "Developer": "Developer", "Professional": "Professional",
      "Social Media": "Social Media",
      "E-commerce": "E-commerce",
      "AI & Productivity": "AI & Productivity",
      "Productivity": "Productivity",
      "Health & Fitness": "Health & Fitness"
    },
    howTo: {
      sidebarTitle: "Secure Vana Protocol",
      step1Title: "Install Vana Desktop",
      step1Desc: "Most data sources require the official Vana Desktop application to securely run local algorithms without exposing your data.",
      step2Title: "Pre-Login to Accounts",
      step2Desc: "Crucial step: Before clicking connect, ensure you are logged into the respective social network or service in your default browser. This ensures Vana can accurately sync the exact data scopes listed on the card.",
      step3Desc: "Click 'Connect Data' on any card here to launch the Vana Data Connection Request (DCR) flow.",
      step4Desc: "Once validated by the Proof of Contribution (PoC) oracle, your data generates dynamic USDC yields based on your Quality Tier.",
      security: "Security",
      e2e: "End-to-end encrypted",
      waitingVana: "Waiting for Vana...",
      btnConnect: "Connect Data"
    },
    cards: {
      github: {
        description: "Share your coding habits, tech stack preferences, and open-source contribution patterns.",
        scopes: {
          "github.profile": "Profile",
          "github.repositories": "Repositories",
          "github.contributions": "Contributions",
          "github.sponsorships": "Sponsorships",
          "github.issues": "Issues"
        }
      },
      linkedin: {
        description: "Turn your professional trajectory, industry networking, and skill endorsements into a valuable asset.",
        scopes: {
          "linkedin.profile": "Profile",
          "linkedin.connections": "Connections",
          "linkedin.education": "Education",
          "linkedin.experience": "Experience",
          "linkedin.languages": "Languages",
          "linkedin.skills": "Skills"
        }
      },
      instagram: {
        description: "Unlock the value of your visual content engagement, brand interactions, and audience demographics.",
        scopes: {
          "instagram.profile": "Profile",
          "instagram.posts": "Posts",
          "instagram.following": "Following",
          "instagram.audience": "Audience Insight"
        }
      },
      spotify: {
        description: "Share your unique audio taste profile, genre affinities, and listening habits with researchers.",
        scopes: {
          "spotify.profile": "Profile",
          "spotify.playlists": "Playlists",
          "spotify.savedTracks": "Saved Tracks"
        }
      },
      youtube: {
        description: "Monetize your video consumption behavior, content preferences, and creator engagement metrics.",
        scopes: {
          "youtube.history": "Watch History",
          "youtube.likes": "Likes",
          "youtube.playlists": "Playlists",
          "youtube.profile": "Profile",
          "youtube.subscriptions": "Subscriptions",
          "youtube.watchLater": "Watch Later"
        }
      },
      amazon: {
        description: "Provide high-value consumer insights, purchasing habits, and product category preferences.",
        scopes: {
          "amazon.profile": "Profile"
        }
      },
      claude: {
        description: "Extract value from your structured AI workflows, complex prompt engineering, and project context.",
        scopes: {
          "claude.conversations": "Conversations",
          "claude.projects": "Projects"
        }
      },
      icloud_notes: {
        description: "Monetize your organizational habits, thought structuring, and personal productivity workflows.",
        scopes: {
          "icloud.folders": "Folders",
          "icloud.notes": "Notes"
        }
      },
      oura: {
        description: "Contribute high-fidelity biometric signals, sleep architecture, and physiological recovery trends.",
        scopes: {
          "oura.sleep": "Sleep"
        }
      },
      strava: {
        description: "Share your athletic endurance metrics, geospatial training routes, and physical performance data.",
        scopes: {
          "read_activities": "Activities"
        }
      },
      whoop: {
        description: "Monetize your continuous physiological monitoring, cardiovascular strain, and metabolic activity.",
        scopes: {
          "read_recovery": "Recovery"
        }
      },
      chatgpt: {
        description: "Monetize your AI interaction patterns, prompt engineering techniques, and conversational logic securely.",
        scopes: {
          "chatgpt.conversations": "Conversations"
        }
      }
    }
  },
  ru: {
    pageTitle: "Источники данных",
    pageSubtitle: "Просматривайте доступные источники. Безопасно подключайте аккаунты через децентрализованный протокол Vana.",
    noSources: "В этой категории нет доступных источников.",
    all: "Все",
    categories: {
      "Entertainment": "Развлечения",
      "Developer": "Разработка",
      "Social Media": "Соцсети",
      "E-commerce": "Электронная коммерция",
      "AI & Productivity": "ИИ и Продуктивность",
      "Productivity": "Продуктивность",
      "Health & Fitness": "Здоровье и фитнес"
    },
    howTo: {
      sidebarTitle: "ЗАЩИЩЕННЫЙ ПРОТОКОЛ VANA",
      step1Title: "Установите Vana Desktop",
      step1Desc: "Для большинства источников требуется официальное приложение Vana Desktop для безопасного запуска локальных алгоритмов без раскрытия ваших данных.",
      step2Title: "Войдите в аккаунты",
      step2Desc: "Важный шаг: перед подключением убедитесь, что вы авторизованы в нужной соцсети или сервисе в браузере по умолчанию. Это гарантирует правильную синхронизацию всех областей данных.",
      step3Desc: "Нажмите «Подключить данные» на любой карточке, чтобы запустить процесс запроса на подключение (DCR).",
      step4Desc: "После проверки оракулом Доказательства вклада (PoC), ваши данные начнут приносить динамический доход в USDC в зависимости от уровня качества.",
      security: "Безопасность",
      e2e: "Сквозное шифрование",
      waitingVana: "Ожидание Vana...",
      btnConnect: "Подключить данные"
    },
    cards: {
      github: {
        description: "Поделитесь привычками программирования, стеком технологий и вкладом в open-source.",
        scopes: {
          "github.profile": "Профиль", "github.repositories": "Репозитории", "github.contributions": "Вклады", "github.sponsorships": "Спонсорство", "github.issues": "Проблемы"
        }
      },
      linkedin: {
        description: "Превратите профессиональный путь, связи и подтвержденные навыки в ценный актив.",
        scopes: {
          "linkedin.profile": "Профиль", "linkedin.connections": "Связи", "linkedin.education": "Образование", "linkedin.experience": "Опыт", "linkedin.languages": "Языки", "linkedin.skills": "Навыки"
        }
      },
      instagram: {
        description: "Раскройте ценность вашего визуального контента, взаимодействий с брендами и аудитории.",
        scopes: {
          "instagram.profile": "Профиль", "instagram.posts": "Посты", "instagram.following": "Подписки", "instagram.audience": "Аудитория"
        }
      },
      spotify: {
        description: "Поделитесь уникальным аудио-профилем, жанровыми предпочтениями и привычками прослушивания.",
        scopes: {
          "spotify.profile": "Профиль", "spotify.playlists": "Плейлисты", "spotify.savedTracks": "Сохраненные треки"
        }
      },
      youtube: {
        description: "Монетизируйте привычки просмотра видео, предпочтения контента и вовлеченность.",
        scopes: {
          "youtube.history": "История просмотров", "youtube.likes": "Понравившиеся", "youtube.playlists": "Плейлисты", "youtube.profile": "Профиль", "youtube.subscriptions": "Подписки", "youtube.watchLater": "Смотреть позже"
        }
      },
      amazon: {
        description: "Предоставьте ценную информацию о потребительских привычках и предпочтениях товаров.",
        scopes: {
          "amazon.profile": "Профиль"
        }
      },
      claude: {
        description: "Извлекайте выгоду из структурированных ИИ-воркфлоу и комплексного промпт-инжиниринга.",
        scopes: {
          "claude.conversations": "Диалоги", "claude.projects": "Проекты"
        }
      },
      icloud_notes: {
        description: "Монетизируйте свои привычки организации, структурирование мыслей и продуктивность.",
        scopes: {
          "icloud.folders": "Папки", "icloud.notes": "Заметки"
        }
      },
      oura: {
        description: "Поделитесь высокоточными биометрическими сигналами и циклами восстановления.",
        scopes: {
          "oura.sleep": "Сон"
        }
      },
      strava: {
        description: "Предоставьте показатели спортивной выносливости и данные о тренировках.",
        scopes: {
          "read_activities": "Активности"
        }
      },
      whoop: {
        description: "Монетизируйте непрерывный мониторинг физиологии и метаболической активности.",
        scopes: {
          "read_recovery": "Восстановление"
        }
      },
      chatgpt: {
        description: "Монетизируйте свои модели взаимодействия с ИИ и методы промпт-инжиниринга.",
        scopes: {
          "chatgpt.conversations": "Диалоги"
        }
      }
    }
  },
  // We'll fill in basic Spanish, Portuguese, German, Chinese, and Korean for these static parts as well.
  es: {
    pageTitle: "Fuentes de Datos",
    pageSubtitle: "Explora fuentes de datos disponibles. Conecta tus cuentas de forma segura a través del protocolo Vana.",
    noSources: "No hay fuentes de datos disponibles en esta categoría.",
    all: "Todos",
    categories: {
      "Entertainment": "Entretenimiento",
      "Developer": "Desarrollador", "Professional": "Profesional",
      "Social Media": "Redes Sociales",
      "E-commerce": "E-commerce",
      "AI & Productivity": "IA y Productividad",
      "Productivity": "Productividad",
      "Health & Fitness": "Salud y Fitness"
    },
    howTo: {
      sidebarTitle: "PROTOCOLO VANA SEGURO",
      step1Title: "Instalar Vana Desktop",
      step1Desc: "La mayoría de fuentes requieren la aplicación oficial Vana Desktop para ejecutar algoritmos locales sin exponer tus datos.",
      step2Title: "Iniciar Sesión",
      step2Desc: "Paso crucial: antes de conectar, asegúrate de haber iniciado sesión en la red social respectiva en tu navegador predeterminado.",
      step3Desc: "Haz clic en 'Conectar Datos' para lanzar el flujo de Solicitud de Conexión de Datos (DCR).",
      step4Desc: "Una vez validado por el oráculo de Prueba de Contribución (PoC), tus datos generan USDC dinámicos según tu Nivel de Calidad.",
      security: "Seguridad",
      e2e: "Cifrado de extremo a extremo",
      waitingVana: "Esperando a Vana...",
      btnConnect: "Conectar Datos"
    },
    cards: {
      github: { description: "Comparte tus hábitos de programación y repositorios de código.", scopes: { "github.profile": "Perfil", "github.repositories": "Repositorios", "github.contributions": "Contribuciones", "github.sponsorships": "Patrocinios", "github.issues": "Problemas" } },
      linkedin: { description: "Convierte tu trayectoria profesional y red de contactos en un activo.", scopes: { "linkedin.profile": "Perfil", "linkedin.connections": "Conexiones", "linkedin.education": "Educación", "linkedin.experience": "Experiencia", "linkedin.languages": "Idiomas", "linkedin.skills": "Habilidades" } },
      instagram: { description: "Desbloquea el valor de tu contenido visual e interacciones con marcas.", scopes: { "instagram.profile": "Perfil", "instagram.posts": "Posts", "instagram.following": "Siguiendo", "instagram.audience": "Audiencia" } },
      spotify: { description: "Comparte tu perfil de gustos de audio y hábitos de escucha.", scopes: { "spotify.profile": "Perfil", "spotify.playlists": "Playlists", "spotify.savedTracks": "Canciones Guardadas" } },
      youtube: { description: "Monetiza tu historial de videos y preferencias de contenido.", scopes: { "youtube.history": "Historial", "youtube.likes": "Me Gusta", "youtube.playlists": "Playlists", "youtube.profile": "Perfil", "youtube.subscriptions": "Suscripciones", "youtube.watchLater": "Ver Más Tarde" } },
      amazon: { description: "Proporciona información sobre hábitos de compra y preferencias de consumo.", scopes: { "amazon.profile": "Perfil" } },
      claude: { description: "Extrae valor de tus flujos de trabajo con IA estructurados.", scopes: { "claude.conversations": "Conversaciones", "claude.projects": "Proyectos" } },
      icloud_notes: { description: "Monetiza tus hábitos de organización y estructuración de pensamientos.", scopes: { "icloud.folders": "Carpetas", "icloud.notes": "Notas" } },
      oura: { description: "Contribuye con señales biométricas y métricas de sueño.", scopes: { "oura.sleep": "Sueño" } },
      strava: { description: "Comparte tus métricas atléticas y rutas de entrenamiento.", scopes: { "read_activities": "Actividades" } },
      whoop: { description: "Monetiza tu monitorización fisiológica y esfuerzo cardiovascular.", scopes: { "read_recovery": "Recuperación" } },
      chatgpt: { description: "Monetiza tus interacciones de IA y técnicas de ingeniería de prompts.", scopes: { "chatgpt.conversations": "Conversaciones" } }
    }
  },
  pt: {
    pageTitle: "Fontes de Dados",
    pageSubtitle: "Explore fontes de dados. Conecte suas contas de forma segura através do protocolo Vana.",
    noSources: "Nenhuma fonte de dados disponível nesta categoria.",
    all: "Todos",
    categories: {
      "Entertainment": "Entretenimento", "Developer": "Desenvolvedor", "Professional": "Profissional", "Social Media": "Redes Sociais", "E-commerce": "E-commerce", "AI & Productivity": "IA e Produtividade", "Productivity": "Produtividade", "Health & Fitness": "Saúde e Fitness"
    },
    howTo: {
      sidebarTitle: "PROTOCOLO VANA SEGURO",
      step1Title: "Instalar Vana Desktop",
      step1Desc: "A maioria das fontes exige o aplicativo Vana Desktop para rodar algoritmos locais sem expor os dados.",
      step2Title: "Fazer Login",
      step2Desc: "Passo crucial: antes de conectar, certifique-se de estar logado na rede social em seu navegador.",
      step3Desc: "Clique em 'Conectar Dados' para iniciar o fluxo de Requisição de Conexão de Dados (DCR).",
      step4Desc: "Após validado pelo oráculo de Prova de Contribuição (PoC), seus dados geram USDC com base no Nível de Qualidade.",
      security: "Segurança",
      e2e: "Criptografia de ponta a ponta",
      waitingVana: "Aguardando Vana...",
      btnConnect: "Conectar Dados"
    },
    cards: {
      github: { description: "Compartilhe seus hábitos de programação e repositórios.", scopes: { "github.profile": "Perfil", "github.repositories": "Repositórios", "github.contributions": "Contribuições", "github.sponsorships": "Patrocínios", "github.issues": "Problemas" } },
      linkedin: { description: "Transforme sua rede de contatos e habilidades em um ativo.", scopes: { "linkedin.profile": "Perfil", "linkedin.connections": "Conexões", "linkedin.education": "Educação", "linkedin.experience": "Experiência", "linkedin.languages": "Idiomas", "linkedin.skills": "Habilidades" } },
      instagram: { description: "Desbloqueie o valor do seu conteúdo visual e interações.", scopes: { "instagram.profile": "Perfil", "instagram.posts": "Posts", "instagram.following": "Seguindo", "instagram.audience": "Audiência" } },
      spotify: { description: "Compartilhe seu perfil de gosto musical e hábitos de escuta.", scopes: { "spotify.profile": "Perfil", "spotify.playlists": "Playlists", "spotify.savedTracks": "Músicas Curtidas" } },
      youtube: { description: "Monetize seu histórico de vídeos e preferências.", scopes: { "youtube.history": "Histórico", "youtube.likes": "Curtidas", "youtube.playlists": "Playlists", "youtube.profile": "Perfil", "youtube.subscriptions": "Inscrições", "youtube.watchLater": "Assistir Mais Tarde" } },
      amazon: { description: "Forneça dados sobre hábitos de compra e consumo.", scopes: { "amazon.profile": "Perfil" } },
      claude: { description: "Extraia valor de seus fluxos de IA e engenharia de prompts.", scopes: { "claude.conversations": "Conversas", "claude.projects": "Projetos" } },
      icloud_notes: { description: "Monetize seus hábitos de organização e notas pessoais.", scopes: { "icloud.folders": "Pastas", "icloud.notes": "Notas" } },
      oura: { description: "Contribua com sinais biométricos e métricas de sono.", scopes: { "oura.sleep": "Sono" } },
      strava: { description: "Compartilhe suas métricas atléticas e rotas de treino.", scopes: { "read_activities": "Atividades" } },
      whoop: { description: "Monetize seu monitoramento fisiológico contínuo.", scopes: { "read_recovery": "Recuperação" } },
      chatgpt: { description: "Monetize suas interações de IA e engenharia de prompts.", scopes: { "chatgpt.conversations": "Conversas" } }
    }
  },
  de: {
    pageTitle: "Datenquellen",
    pageSubtitle: "Durchsuchen Sie verfügbare Quellen. Verbinden Sie Konten sicher über das Vana-Protokoll.",
    noSources: "Keine Datenquellen in dieser Kategorie.",
    all: "Alle",
    categories: {
      "Entertainment": "Unterhaltung", "Developer": "Entwickler", "Professional": "Professionell", "Social Media": "Social Media", "E-commerce": "E-Commerce", "AI & Productivity": "KI & Produktivität", "Productivity": "Produktivität", "Health & Fitness": "Gesundheit & Fitness"
    },
    howTo: {
      sidebarTitle: "SICHERES VANA-PROTOKOLL",
      step1Title: "Vana Desktop installieren",
      step1Desc: "Die meisten Quellen erfordern Vana Desktop, um lokale Algorithmen sicher auszuführen.",
      step2Title: "Zuvor einloggen",
      step2Desc: "Wichtig: Loggen Sie sich vor dem Verbinden im Standardbrowser in das entsprechende Konto ein.",
      step3Desc: "Klicken Sie auf 'Daten verbinden', um den DCR-Prozess zu starten.",
      step4Desc: "Nach der Validierung (PoC) generieren Ihre Daten USDC basierend auf Ihrer Qualitätsstufe.",
      security: "Sicherheit",
      e2e: "End-to-End-verschlüsselt",
      waitingVana: "Warten auf Vana...",
      btnConnect: "Daten verbinden"
    },
    cards: {
      github: { description: "Teilen Sie Ihre Programmiergewohnheiten und Code-Repositories.", scopes: { "github.profile": "Profil", "github.repositories": "Repositories", "github.contributions": "Beiträge", "github.sponsorships": "Sponsorings", "github.issues": "Probleme" } },
      linkedin: { description: "Verwandeln Sie Ihr berufliches Netzwerk in einen Vermögenswert.", scopes: { "linkedin.profile": "Profil", "linkedin.connections": "Kontakte", "linkedin.education": "Bildung", "linkedin.experience": "Erfahrung", "linkedin.languages": "Sprachen", "linkedin.skills": "Fähigkeiten" } },
      instagram: { description: "Nutzen Sie den Wert Ihrer visuellen Inhalte und Markeninteraktionen.", scopes: { "instagram.profile": "Profil", "instagram.posts": "Beiträge", "instagram.following": "Folgend", "instagram.audience": "Zielgruppe" } },
      spotify: { description: "Teilen Sie Ihr musikalisches Profil und Ihre Hörgewohnheiten.", scopes: { "spotify.profile": "Profil", "spotify.playlists": "Playlists", "spotify.savedTracks": "Gespeicherte Tracks" } },
      youtube: { description: "Monetarisieren Sie Ihre Sehgewohnheiten und Inhaltspräferenzen.", scopes: { "youtube.history": "Verlauf", "youtube.likes": "Gefällt mir", "youtube.playlists": "Playlists", "youtube.profile": "Profil", "youtube.subscriptions": "Abos", "youtube.watchLater": "Später ansehen" } },
      amazon: { description: "Bieten Sie Einblicke in Kaufgewohnheiten und Konsum.", scopes: { "amazon.profile": "Profil" } },
      claude: { description: "Ziehen Sie Wert aus Ihren KI-Workflows und Prompts.", scopes: { "claude.conversations": "Unterhaltungen", "claude.projects": "Projekte" } },
      icloud_notes: { description: "Monetarisieren Sie Ihre Organisationsgewohnheiten und Notizen.", scopes: { "icloud.folders": "Ordner", "icloud.notes": "Notizen" } },
      oura: { description: "Steuern Sie biometrische Signale und Schlafmetriken bei.", scopes: { "oura.sleep": "Schlaf" } },
      strava: { description: "Teilen Sie Ihre sportlichen Leistungsdaten und Routen.", scopes: { "read_activities": "Aktivitäten" } },
      whoop: { description: "Monetarisieren Sie Ihre kontinuierliche physiologische Überwachung.", scopes: { "read_recovery": "Erholung" } },
      chatgpt: { description: "Monetarisieren Sie Ihre KI-Interaktionen und Prompt-Techniken.", scopes: { "chatgpt.conversations": "Unterhaltungen" } }
    }
  },
  zh: {
    pageTitle: "数据源",
    pageSubtitle: "浏览可用的数据源。通过 Vana 去中心化协议安全连接您的账户。",
    noSources: "该类别下没有可用的数据源。",
    all: "全部",
    categories: {
      "Entertainment": "娱乐", "Developer": "开发者", "Social Media": "社交媒体", "E-commerce": "电子商务", "AI & Productivity": "人工智能与生产力", "Productivity": "生产力", "Health & Fitness": "健康与健身"
    },
    howTo: {
      sidebarTitle: "安全的 VANA 协议",
      step1Title: "安装 Vana Desktop",
      step1Desc: "大多数数据源需要官方的 Vana Desktop 应用程序，以在不暴露数据的情况下安全运行本地算法。",
      step2Title: "预先登录账户",
      step2Desc: "关键步骤：在点击连接之前，请确保您已在默认浏览器中登录了相应的社交网络或服务。",
      step3Desc: "点击这里的 '连接数据' 以启动 Vana 数据连接请求 (DCR) 流程。",
      step4Desc: "通过贡献证明 (PoC) 预言机验证后，您的数据将根据质量层级生成动态 USDC 收益。",
      security: "安全",
      e2e: "端到端加密",
      waitingVana: "等待 Vana...",
      btnConnect: "连接数据"
    },
    cards: {
      github: { description: "分享您的编程习惯、技术栈偏好和开源贡献。", scopes: { "github.profile": "个人资料", "github.repositories": "代码库", "github.contributions": "贡献", "github.sponsorships": "赞助", "github.issues": "问题" } },
      linkedin: { description: "将您的职业轨迹、人脉和技能认证转化为宝贵资产。", scopes: { "linkedin.profile": "个人资料", "linkedin.connections": "人脉", "linkedin.education": "教育", "linkedin.experience": "经验", "linkedin.languages": "语言", "linkedin.skills": "技能" } },
      instagram: { description: "解锁视觉内容互动、品牌互动和受众特征的价值。", scopes: { "instagram.profile": "个人资料", "instagram.posts": "帖子", "instagram.following": "关注", "instagram.audience": "受众特征" } },
      spotify: { description: "分享您独特的音乐品味、流派偏好和收听习惯。", scopes: { "spotify.profile": "个人资料", "spotify.playlists": "播放列表", "spotify.savedTracks": "已保存的曲目" } },
      youtube: { description: "将您的视频观看习惯、内容偏好变现。", scopes: { "youtube.history": "观看历史", "youtube.likes": "喜欢", "youtube.playlists": "播放列表", "youtube.profile": "个人资料", "youtube.subscriptions": "订阅", "youtube.watchLater": "稍后观看" } },
      amazon: { description: "提供高价值的消费者洞察、购买习惯和产品偏好。", scopes: { "amazon.profile": "个人资料" } },
      claude: { description: "从您的结构化 AI 工作流和提示工程中提取价值。", scopes: { "claude.conversations": "对话", "claude.projects": "项目" } },
      icloud_notes: { description: "将您的组织习惯和个人生产力工作流变现。", scopes: { "icloud.folders": "文件夹", "icloud.notes": "备忘录" } },
      oura: { description: "贡献高保真生物特征信号和睡眠质量数据。", scopes: { "oura.sleep": "睡眠" } },
      strava: { description: "分享您的运动耐力指标、地理路线和体能表现数据。", scopes: { "read_activities": "活动" } },
      whoop: { description: "将您的连续生理监测、心血管负荷变现。", scopes: { "read_recovery": "恢复" } },
      chatgpt: { description: "安全地将您的 AI 交互模式和提示工程技巧变现。", scopes: { "chatgpt.conversations": "对话" } }
    }
  },
  ko: {
    pageTitle: "데이터 소스",
    pageSubtitle: "사용 가능한 데이터 소스를 탐색하세요. Vana의 탈중앙화 프로토콜을 통해 안전하게 연결하세요.",
    noSources: "이 카테고리에는 데이터 소스가 없습니다.",
    all: "전체",
    categories: {
      "Entertainment": "엔터테인먼트", "Developer": "개발자", "Social Media": "소셜 미디어", "E-commerce": "전자상거래", "AI & Productivity": "AI 및 생산성", "Productivity": "생산성", "Health & Fitness": "건강 및 피트니스"
    },
    howTo: {
      sidebarTitle: "안전한 VANA 프로토콜",
      step1Title: "Vana Desktop 설치",
      step1Desc: "대부분의 데이터 소스는 데이터를 노출하지 않고 로컬 알고리즘을 실행하기 위해 공식 Vana Desktop 앱이 필요합니다.",
      step2Title: "계정 사전 로그인",
      step2Desc: "중요 단계: 연결하기 전에 기본 브라우저에서 해당 소셜 네트워크나 서비스에 로그인되어 있는지 확인하세요.",
      step3Desc: "'데이터 연결'을 클릭하여 Vana 데이터 연결 요청(DCR)을 시작하세요.",
      step4Desc: "기여 증명(PoC) 오라클에 의해 검증되면 품질 등급에 따라 동적 USDC 수익을 창출합니다.",
      security: "보안",
      e2e: "종단간 암호화",
      waitingVana: "Vana 대기 중...",
      btnConnect: "데이터 연결"
    },
    cards: {
      github: { description: "코딩 습관, 기술 스택 및 오픈 소스 기여를 공유하세요.", scopes: { "github.profile": "프로필", "github.repositories": "저장소", "github.contributions": "기여", "github.sponsorships": "스폰서십", "github.issues": "이슈" } },
      linkedin: { description: "경력, 인맥, 기술 인증을 귀중한 자산으로 전환하세요.", scopes: { "linkedin.profile": "프로필", "linkedin.connections": "인맥", "linkedin.education": "학력", "linkedin.experience": "경력", "linkedin.languages": "언어", "linkedin.skills": "기술" } },
      instagram: { description: "시각적 콘텐츠 참여, 브랜드 상호 작용 및 청중 인구 통계의 가치를 잠금 해제하세요.", scopes: { "instagram.profile": "프로필", "instagram.posts": "게시물", "instagram.following": "팔로잉", "instagram.audience": "청중 정보" } },
      spotify: { description: "독특한 오디오 취향 프로필 및 청취 습관을 연구자와 공유하세요.", scopes: { "spotify.profile": "프로필", "spotify.playlists": "플레이리스트", "spotify.savedTracks": "저장된 곡" } },
      youtube: { description: "비디오 소비 행동, 콘텐츠 선호도 및 참여 지표를 수익화하세요.", scopes: { "youtube.history": "시청 기록", "youtube.likes": "좋아요", "youtube.playlists": "플레이리스트", "youtube.profile": "프로필", "youtube.subscriptions": "구독", "youtube.watchLater": "나중에 볼 동영상" } },
      amazon: { description: "가치 있는 소비자 통찰력, 구매 습관 및 제품 선호도를 제공하세요.", scopes: { "amazon.profile": "프로필" } },
      claude: { description: "구조화된 AI 워크플로 및 복잡한 프롬프트 엔지니어링에서 가치를 추출하세요.", scopes: { "claude.conversations": "대화", "claude.projects": "프로젝트" } },
      icloud_notes: { description: "정리 습관, 사고 구조화 및 생산성 워크플로를 수익화하세요.", scopes: { "icloud.folders": "폴더", "icloud.notes": "메모" } },
      oura: { description: "고정밀 생체 신호, 수면 구조 및 생리적 회복 추세를 제공하세요.", scopes: { "oura.sleep": "수면" } },
      strava: { description: "운동 지구력 지표, 훈련 경로 및 신체 성과 데이터를 공유하세요.", scopes: { "read_activities": "활동" } },
      whoop: { description: "지속적인 생리적 모니터링 및 심혈관 긴장을 수익화하세요.", scopes: { "read_recovery": "회복" } },
      chatgpt: { description: "AI 상호 작용 패턴 및 프롬프트 엔지니어링 기술을 안전하게 수익화하세요.", scopes: { "chatgpt.conversations": "대화" } }
    }
  }
};

const fileContent = `export type SourcesDict = typeof SOURCES_DICT.en;

export const SOURCES_DICT = ${JSON.stringify(sourcesDict, null, 2)};
`;

fs.writeFileSync('src/lib/i18n/sources-dict.ts', fileContent, 'utf8');
console.log('sources-dict.ts generated!');

