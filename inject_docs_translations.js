const fs = require('fs');
const { PAGES_DICT } = require('./src/lib/i18n/pages-dict.ts');

const newTranslations = {
  en: {
    hw1Prefix: "Personal Server: ",
    hw2Prefix: "Data Connection Request: ",
    hw3Prefix: "Verification: ",
    hw4Prefix: "Earn: ",
    instantClaiming: "Instant Claiming",
    instantClaimingDesc: "Earnings are credited to your on-chain balance inside LuminaMarketplace.sol. You can click Claim to Wallet in your Dashboard at any time to withdraw your USDC.e.",
    forBuyers: "For B2B Buyers",
    forBuyersDesc: "AI researchers and enterprise clients can utilize our Data Query Builder to source precision-targeted datasets.",
    datasetFormats: "Dataset Formats & Delivery",
    datasetFormatsDesc: "Once a transaction is confirmed on the Vana blockchain, buyers are granted immediate access to the requested dataset. Data can be exported in standard formats optimized for machine learning:",
    idealForLLM: "Ideal for LLM fine-tuning",
    idealForGraph: "Ideal for graph networks",
    standardApi: "Standard API payload",
    hybridBridge: "Lumina features a hybrid Web3 - Web2 bridge. Enterprise developers building AI training pipelines do not need to sign Web3 transactions in their server backends.",
    authOnChain: "On-chain Authorization: Purchase dataset limits via the smart contract using your Web3 wallet.",
    authApiKey: "API Key Generation: Connect your authorized wallet to the Lumina Portal to generate a standard Bearer API Key.",
    authOffChain: "Off-chain Streaming: Use the API Key in your Python or Node.js backend to securely stream the decrypted datasets.",
    curlExample: "cURL / Python Example",
    archIntro: "Lumina relies on a robust on-chain/off-chain architecture to ensure trustless operations.",
    viewOnVanaScan: "View on VanaScan",
    luminaMarketplaceDesc: "The core escrow and settlement contract deployed on Vana Mainnet. It handles buyData() execution, automatic 80/20 revenue splitting, and the claimEarnings() withdrawal mechanic.",
    usdcTokenDesc: "All transactions are denominated and settled in USDC.e to prevent price volatility for both buyers and providers.",
    secOpsTitle: "Security & Threat Prevention (SecOps)",
    secOpsDesc: "Lumina implements military-grade Web3 security standards to protect user funds and dataset integrity without requiring manual human oversight.",
    circuitBreaker: "Automated Circuit Breaker",
    circuitBreakerDesc: "Integrated with Forta/Tenderly, our monitoring bots track mempool transactions 24/7. If an anomaly is detected, the bot automatically triggers the pause() modifier, freezing all smart contract funds instantly.",
    reentrancyGuards: "Reentrancy Guards",
    reentrancyGuardsDesc: "All financial functions (buyData, claimEarnings) are protected by OpenZeppelin-standard Mutex locks to prevent recursive flash-loan draining attacks.",
    gnosisSafe: "Gnosis Safe Multi-Sig",
    gnosisSafeDesc: "The smart contract ownership is governed by a 3/5 Multi-Signature wallet. No single founder or developer can unilaterally alter protocol fees or unpause the contract without team consensus, eliminating the 'single point of failure'.",
    pocIntro: "To prevent fraud and maintain the highest quality of training data for AI models, Lumina implements a rigorous Proof of Contribution (PoC) protocol built directly into our indexing engine.",
    tierA: "Tier A (Premium)",
    tierB: "Tier B (High Quality)",
    tierC: "Tier C (Standard)",
    tierD: "Tier D (Low / Bot Risk)",
    base80_100: "80% - 100% of Base Price",
    base60_79: "60% - 79% of Base Price",
    base40_59: "40% - 59% of Base Price",
    base0_39: "0% - 39% of Base Price"
  },
  ru: {
    hw1Prefix: "Персональный сервер: ",
    hw2Prefix: "Запрос на подключение: ",
    hw3Prefix: "Верификация: ",
    hw4Prefix: "Заработок: ",
    instantClaiming: "Мгновенный вывод",
    instantClaimingDesc: "Доходы зачисляются на ваш ончейн баланс в смарт-контракте LuminaMarketplace.sol. Вы можете в любой момент нажать «Вывести на кошелек» в Дашборде для снятия USDC.",
    forBuyers: "Для B2B покупателей",
    forBuyersDesc: "ИИ-исследователи и корпоративные клиенты могут использовать наш Конструктор запросов для поиска узконаправленных датасетов.",
    datasetFormats: "Форматы данных и доставка",
    datasetFormatsDesc: "Как только транзакция подтверждается в блокчейне Vana, покупатели получают мгновенный доступ к запрошенному датасету. Данные могут быть экспортированы в стандартных форматах, оптимизированных для машинного обучения:",
    idealForLLM: "Идеально для дообучения LLM",
    idealForGraph: "Идеально для графовых сетей",
    standardApi: "Стандартный API ответ",
    hybridBridge: "Lumina имеет гибридный мост Web3 - Web2. Разработчикам конвейеров ИИ не нужно подписывать Web3-транзакции на своих бэкендах.",
    authOnChain: "Ончейн-авторизация: Покупайте лимиты на датасеты через смарт-контракт с помощью своего Web3-кошелька.",
    authApiKey: "Генерация API-ключа: Подключите авторизованный кошелек к порталу Lumina для генерации стандартного API-ключа Bearer.",
    authOffChain: "Офчейн-поток: Используйте API-ключ в бэкенде Python или Node.js для безопасной потоковой передачи расшифрованных данных.",
    curlExample: "Пример на cURL / Python",
    archIntro: "Lumina полагается на надежную ончейн/офчейн архитектуру для обеспечения безопасности без доверия.",
    viewOnVanaScan: "Посмотреть в VanaScan",
    luminaMarketplaceDesc: "Основной контракт эскроу и расчетов, развернутый в Mainnet сети Vana. Обрабатывает вызовы buyData(), распределение 80/20 и вывод средств.",
    usdcTokenDesc: "Все транзакции оцениваются и рассчитываются в USDC для предотвращения волатильности цен.",
    secOpsTitle: "Безопасность и предотвращение угроз (SecOps)",
    secOpsDesc: "Lumina внедряет стандарты Web3-безопасности военного уровня для защиты средств пользователей и целостности датасетов.",
    circuitBreaker: "Автоматический выключатель",
    circuitBreakerDesc: "Интегрированные боты Forta/Tenderly отслеживают мемпул 24/7. При аномалиях бот автоматически вызывает модификатор pause(), мгновенно замораживая средства смарт-контракта.",
    reentrancyGuards: "Защита от Reentrancy",
    reentrancyGuardsDesc: "Все финансовые функции защищены мьютексами стандарта OpenZeppelin для предотвращения атак с помощью флеш-займов.",
    gnosisSafe: "Gnosis Safe Multi-Sig",
    gnosisSafeDesc: "Управление смарт-контрактом осуществляется кошельком с мультиподписью 3/5. Ни один из разработчиков не может единолично изменять комиссии или снимать контракт с паузы.",
    pocIntro: "Для предотвращения мошенничества и поддержания высочайшего качества данных для ИИ, Lumina внедряет строгий протокол Proof of Contribution (PoC).",
    tierA: "Tier A (Премиум)",
    tierB: "Tier B (Высокое качество)",
    tierC: "Tier C (Стандарт)",
    tierD: "Tier D (Низкое / Риск ботов)",
    base80_100: "80% - 100% от базовой цены",
    base60_79: "60% - 79% от базовой цены",
    base40_59: "40% - 59% от базовой цены",
    base0_39: "0% - 39% от базовой цены"
  },
  es: {
    hw1Prefix: "Servidor Personal: ", hw2Prefix: "Solicitud de Conexión: ", hw3Prefix: "Verificación: ", hw4Prefix: "Ganar: ",
    instantClaiming: "Reclamo Instantáneo", instantClaimingDesc: "Las ganancias se acreditan en tu saldo on-chain en LuminaMarketplace.sol.",
    forBuyers: "Para Compradores B2B", forBuyersDesc: "Investigadores y empresas pueden utilizar nuestro Constructor de Consultas.",
    datasetFormats: "Formatos de Datos y Entrega", datasetFormatsDesc: "Los compradores tienen acceso inmediato tras la transacción:",
    idealForLLM: "Ideal para modelos LLM", idealForGraph: "Ideal para redes gráficas", standardApi: "Respuesta API estándar",
    hybridBridge: "Lumina cuenta con un puente híbrido Web3 - Web2.", authOnChain: "Autorización On-chain: Compra límites usando tu billetera.",
    authApiKey: "Generación de API Key: Conecta tu billetera para generar tu clave Bearer.", authOffChain: "Streaming Off-chain: Usa la API Key en Python/Node.js.",
    curlExample: "Ejemplo cURL / Python", archIntro: "Lumina se basa en una sólida arquitectura on-chain/off-chain.", viewOnVanaScan: "Ver en VanaScan",
    luminaMarketplaceDesc: "El contrato principal de pagos desplegado en la Mainnet de Vana.", usdcTokenDesc: "Las transacciones usan USDC.e para evitar volatilidad.",
    secOpsTitle: "Seguridad y Prevención de Amenazas (SecOps)", secOpsDesc: "Lumina implementa seguridad Web3 de grado militar.",
    circuitBreaker: "Interruptor Automático", circuitBreakerDesc: "Bots de monitoreo vigilan transacciones 24/7 y pausan el contrato ante anomalías.",
    reentrancyGuards: "Protección contra Reentradas", reentrancyGuardsDesc: "Protección mediante bloqueos Mutex estándar de OpenZeppelin.",
    gnosisSafe: "Multifirma Gnosis Safe", gnosisSafeDesc: "El contrato es administrado por una billetera multifirma 3 de 5.",
    pocIntro: "Para prevenir el fraude, Lumina implementa un protocolo Proof of Contribution (PoC).",
    tierA: "Tier A (Premium)", tierB: "Tier B (Alta Calidad)", tierC: "Tier C (Estándar)", tierD: "Tier D (Riesgo / Bots)",
    base80_100: "80% - 100% del Precio Base", base60_79: "60% - 79% del Precio Base", base40_59: "40% - 59% del Precio Base", base0_39: "0% - 39% del Precio Base"
  },
  pt: {
    hw1Prefix: "Servidor Pessoal: ", hw2Prefix: "Solicitação de Conexão: ", hw3Prefix: "Verificação: ", hw4Prefix: "Ganhar: ",
    instantClaiming: "Resgate Instantâneo", instantClaimingDesc: "Os ganhos são creditados no seu saldo on-chain no LuminaMarketplace.sol.",
    forBuyers: "Para Compradores B2B", forBuyersDesc: "Pesquisadores e empresas podem utilizar nosso Construtor de Consultas.",
    datasetFormats: "Formatos de Dados e Entrega", datasetFormatsDesc: "Compradores têm acesso imediato após a transação:",
    idealForLLM: "Ideal para modelos LLM", idealForGraph: "Ideal para redes gráficas", standardApi: "Resposta API padrão",
    hybridBridge: "Lumina possui uma ponte híbrida Web3 - Web2.", authOnChain: "Autorização On-chain: Compre limites com sua carteira.",
    authApiKey: "Geração de Chave API: Conecte sua carteira para gerar sua chave Bearer.", authOffChain: "Streaming Off-chain: Use a Chave API em Python/Node.js.",
    curlExample: "Exemplo cURL / Python", archIntro: "Lumina conta com uma arquitetura sólida on-chain/off-chain.", viewOnVanaScan: "Ver no VanaScan",
    luminaMarketplaceDesc: "O contrato principal de pagamentos implantado na Vana Mainnet.", usdcTokenDesc: "As transações usam USDC.e para evitar volatilidade.",
    secOpsTitle: "Segurança e Prevenção de Ameaças (SecOps)", secOpsDesc: "Lumina implementa segurança Web3 de nível militar.",
    circuitBreaker: "Disjuntor Automático", circuitBreakerDesc: "Bots de monitoramento vigiam transações 24/7 e pausam o contrato em anomalias.",
    reentrancyGuards: "Proteção contra Reentradas", reentrancyGuardsDesc: "Proteção via bloqueios Mutex padrão da OpenZeppelin.",
    gnosisSafe: "Multinassinatura Gnosis Safe", gnosisSafeDesc: "A propriedade do contrato é gerida por uma carteira Multi-Sig 3/5.",
    pocIntro: "Para prevenir fraudes, Lumina implementa um protocolo rigoroso de Proof of Contribution (PoC).",
    tierA: "Tier A (Premium)", tierB: "Tier B (Alta Qualidade)", tierC: "Tier C (Padrão)", tierD: "Tier D (Risco / Bots)",
    base80_100: "80% - 100% do Preço Base", base60_79: "60% - 79% do Preço Base", base40_59: "40% - 59% do Preço Base", base0_39: "0% - 39% do Preço Base"
  },
  de: {
    hw1Prefix: "Persönlicher Server: ", hw2Prefix: "Verbindungsanfrage: ", hw3Prefix: "Verifizierung: ", hw4Prefix: "Verdienen: ",
    instantClaiming: "Sofortige Auszahlung", instantClaimingDesc: "Einnahmen werden Ihrem On-Chain-Guthaben gutgeschrieben.",
    forBuyers: "Für B2B-Käufer", forBuyersDesc: "Forscher und Unternehmen können unseren Query Builder nutzen.",
    datasetFormats: "Datenformate & Bereitstellung", datasetFormatsDesc: "Käufer haben nach der Transaktion sofortigen Zugriff:",
    idealForLLM: "Ideal für LLM-Feintuning", idealForGraph: "Ideal für Graphen-Netzwerke", standardApi: "Standard-API-Antwort",
    hybridBridge: "Lumina bietet eine Web3-Web2-Brücke.", authOnChain: "On-Chain-Autorisierung: Limits über Smart Contract kaufen.",
    authApiKey: "API-Schlüssel-Generierung: Wallet verbinden, um Bearer-Token zu erhalten.", authOffChain: "Off-Chain-Streaming: API-Schlüssel im Backend verwenden.",
    curlExample: "cURL / Python Beispiel", archIntro: "Lumina verlässt sich auf eine robuste Architektur.", viewOnVanaScan: "Auf VanaScan ansehen",
    luminaMarketplaceDesc: "Der zentrale Smart Contract auf dem Vana Mainnet.", usdcTokenDesc: "Alle Transaktionen erfolgen in USDC.",
    secOpsTitle: "Sicherheit & Bedrohungsprävention", secOpsDesc: "Militärische Web3-Sicherheitsstandards schützen Ihre Mittel.",
    circuitBreaker: "Automatischer Not-Stopp", circuitBreakerDesc: "Überwachungs-Bots pausieren Verträge bei Anomalien sofort.",
    reentrancyGuards: "Reentrancy-Schutz", reentrancyGuardsDesc: "Geschützt durch OpenZeppelin Mutex-Locks.",
    gnosisSafe: "Gnosis Safe Multi-Sig", gnosisSafeDesc: "Die Vertragsverwaltung erfolgt durch ein 3/5 Multi-Sig Wallet.",
    pocIntro: "Zur Betrugsprävention setzt Lumina das Proof of Contribution (PoC) Protokoll ein.",
    tierA: "Tier A (Premium)", tierB: "Tier B (Hohe Qualität)", tierC: "Tier C (Standard)", tierD: "Tier D (Bot-Risiko)",
    base80_100: "80% - 100% des Basispreises", base60_79: "60% - 79% des Basispreises", base40_59: "40% - 59% des Basispreises", base0_39: "0% - 39% des Basispreises"
  },
  zh: {
    hw1Prefix: "个人服务器: ", hw2Prefix: "数据连接请求: ", hw3Prefix: "验证: ", hw4Prefix: "赚取: ",
    instantClaiming: "即时提取", instantClaimingDesc: "收益会直接存入 LuminaMarketplace.sol 的链上余额中。",
    forBuyers: "面向 B2B 买家", forBuyersDesc: "AI 研究人员和企业客户可以使用我们的数据查询生成器。",
    datasetFormats: "数据格式和交付", datasetFormatsDesc: "一旦交易在 Vana 链上确认，买家就可以立即访问数据集：",
    idealForLLM: "非常适合 LLM 微调", idealForGraph: "非常适合图网络", standardApi: "标准 API 格式",
    hybridBridge: "Lumina 具有混合 Web3 - Web2 桥接功能。", authOnChain: "链上授权: 使用 Web3 钱包通过智能合约购买限制。",
    authApiKey: "API 密钥生成: 连接授权钱包以生成 API 密钥。", authOffChain: "链下数据流: 在后端使用 API 密钥进行流式传输。",
    curlExample: "cURL / Python 示例", archIntro: "Lumina 依靠强大的架构来确保无信任操作。", viewOnVanaScan: "在 VanaScan 查看",
    luminaMarketplaceDesc: "部署在 Vana 主网上的核心托管和结算合约。", usdcTokenDesc: "所有交易均以 USDC.e 计价以防止价格波动。",
    secOpsTitle: "安全与威胁防御 (SecOps)", secOpsDesc: "Lumina 实施军用级 Web3 安全标准。",
    circuitBreaker: "自动熔断器", circuitBreakerDesc: "监控机器人全天候跟踪交易，异常时自动暂停合约资金。",
    reentrancyGuards: "重入保护", reentrancyGuardsDesc: "通过 OpenZeppelin 互斥锁防止闪电贷攻击。",
    gnosisSafe: "Gnosis Safe 多重签名", gnosisSafeDesc: "合约所有权由 3/5 多签钱包管理。",
    pocIntro: "为了防止欺诈，Lumina 实施了严格的贡献证明 (PoC) 协议。",
    tierA: "Tier A (优质)", tierB: "Tier B (高质量)", tierC: "Tier C (标准)", tierD: "Tier D (高风险)",
    base80_100: "基准价格的 80% - 100%", base60_79: "基准价格的 60% - 79%", base40_59: "基准价格的 40% - 59%", base0_39: "基准价格的 0% - 39%"
  },
  ko: {
    hw1Prefix: "개인 서버: ", hw2Prefix: "데이터 연결 요청: ", hw3Prefix: "검증: ", hw4Prefix: "수익: ",
    instantClaiming: "즉시 수령", instantClaimingDesc: "수익은 LuminaMarketplace.sol 내부의 온체인 잔고에 입금됩니다.",
    forBuyers: "B2B 구매자용", forBuyersDesc: "AI 연구원 및 기업 고객은 데이터 쿼리 빌더를 사용할 수 있습니다.",
    datasetFormats: "데이터 세트 형식 및 제공", datasetFormatsDesc: "Vana 블록체인에서 트랜잭션이 확인되면 구매자는 즉시 데이터에 액세스할 수 있습니다.",
    idealForLLM: "LLM 파인튜닝에 이상적", idealForGraph: "그래프 네트워크에 이상적", standardApi: "표준 API 응답",
    hybridBridge: "Lumina는 하이브리드 Web3-Web2 브릿지를 제공합니다.", authOnChain: "온체인 권한 부여: 지갑을 사용해 제한을 구매합니다.",
    authApiKey: "API 키 생성: 지갑을 연결하여 API 키를 생성합니다.", authOffChain: "오프체인 스트리밍: 백엔드에서 API 키를 사용하여 스트리밍합니다.",
    curlExample: "cURL / Python 예제", archIntro: "Lumina는 강력한 온체인/오프체인 아키텍처를 기반으로 합니다.", viewOnVanaScan: "VanaScan에서 보기",
    luminaMarketplaceDesc: "Vana Mainnet에 배포된 핵심 에스크로 및 결제 컨트랙트입니다.", usdcTokenDesc: "가격 변동성을 방지하기 위해 모든 거래는 USDC로 처리됩니다.",
    secOpsTitle: "보안 및 위협 방지 (SecOps)", secOpsDesc: "Lumina는 군사 수준의 Web3 보안 표준을 구현합니다.",
    circuitBreaker: "자동 회로 차단기", circuitBreakerDesc: "모니터링 봇이 24시간 추적하며 이상 감지 시 스마트 컨트랙트를 즉시 중지합니다.",
    reentrancyGuards: "재진입 방지", reentrancyGuardsDesc: "OpenZeppelin 표준 Mutex 잠금으로 플래시론 공격을 방지합니다.",
    gnosisSafe: "Gnosis Safe 다중 서명", gnosisSafeDesc: "컨트랙트 소유권은 3/5 다중 서명 지갑에 의해 관리됩니다.",
    pocIntro: "사기를 방지하기 위해 Lumina는 엄격한 기여 증명(PoC) 프로토콜을 구현합니다.",
    tierA: "Tier A (프리미엄)", tierB: "Tier B (고품질)", tierC: "Tier C (표준)", tierD: "Tier D (봇 위험)",
    base80_100: "기본 가격의 80% - 100%", base60_79: "기본 가격의 60% - 79%", base40_59: "기본 가격의 40% - 59%", base0_39: "기본 가격의 0% - 39%"
  }
};

for (const lang of Object.keys(newTranslations)) {
  if (PAGES_DICT[lang] && PAGES_DICT[lang].docs) {
    // Strip existing prefixes from hw2, hw3, hw4
    if (PAGES_DICT[lang].docs.hw2) PAGES_DICT[lang].docs.hw2 = PAGES_DICT[lang].docs.hw2.replace(/^(Data Connection Request|Запрос на подключение|Solicitud de Conexión|Solicitação de Conexão|Verbindungsanfrage|连接请求|데이터 연결 요청)[:\s]+/, '');
    if (PAGES_DICT[lang].docs.hw3) PAGES_DICT[lang].docs.hw3 = PAGES_DICT[lang].docs.hw3.replace(/^(Verification|Верификация|Verificación|Verificação|Verifizierung|验证|검증)[:\s]+/, '');
    if (PAGES_DICT[lang].docs.hw4) PAGES_DICT[lang].docs.hw4 = PAGES_DICT[lang].docs.hw4.replace(/^(Earn|Заработок|Ganar|Ganhar|Verdienen|赚取|수익 창출)[:\s]+/, '');

    PAGES_DICT[lang].docs = {
      ...PAGES_DICT[lang].docs,
      ...newTranslations[lang]
    };
  }
}

const fileContent = `export type PagesDict = typeof PAGES_DICT.en;

export const PAGES_DICT = ${JSON.stringify(PAGES_DICT, null, 2)};
`;

fs.writeFileSync('./src/lib/i18n/pages-dict.ts', fileContent, 'utf8');
console.log('Successfully injected new translations into pages-dict.ts');
