const fs = require('fs');

function injectDict() {
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
      }
    }
  };

  let file = fs.readFileSync('src/lib/i18n/dictionaries.ts', 'utf8');

  const localesList = ['en', 'ru', 'es', 'pt', 'de', 'zh', 'ko'];
  localesList.forEach(loc => {
    const injection = "\\n    stats: " + JSON.stringify(missingTranslations[loc].stats, null, 6) + ",\\n    monetize: " + JSON.stringify(missingTranslations[loc].monetize, null, 6) + ",\\n    howItWorks: " + JSON.stringify(missingTranslations[loc].howItWorks, null, 6) + ",\\n    docs: " + JSON.stringify(missingTranslations[loc].docs, null, 6) + ",\\n";
    // We use a safe regex that matches exactly `loc: {` after some spaces (so it doesn't match `locales: {`!)
    const safeRegex = new RegExp("(^|\\n)(\\s+)" + loc + ": \\{\\s*");
    file = file.replace(safeRegex, "$1$2" + loc + ": {" + injection);
  });

  fs.writeFileSync('src/lib/i18n/dictionaries.ts', file);
  console.log('Injected missing dictionary sections (SAFE)');
}

injectDict();
