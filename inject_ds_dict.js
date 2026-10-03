const fs = require('fs');

const dsTranslations = {
  en: {
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
  ru: {
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
  es: {
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
  pt: {
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
  de: {
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
  zh: {
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
  ko: {
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
  }
};

let file = fs.readFileSync('src/lib/i18n/dictionaries.ts', 'utf8');

const locales = ['en', 'ru', 'es', 'pt', 'de', 'zh', 'ko'];
locales.forEach(loc => {
  const injection = "\\n    dataSources: " + JSON.stringify(dsTranslations[loc], null, 6) + ",\\n";
  const regex = new RegExp("(\\\\b" + loc + ": \\{\\s*)");
  file = file.replace(regex, "$1" + injection);
});

fs.writeFileSync('src/lib/i18n/dictionaries.ts', file);
console.log('Injected data sources dictionary');
