const fs = require('fs');

let code = fs.readFileSync('src/app/docs/page.tsx', 'utf8');

if (!code.includes('PAGES_DICT')) {
    code = code.replace(
        "import { useLanguage } from '@/lib/i18n/LanguageContext';",
        "import { useLanguage } from '@/lib/i18n/LanguageContext';\nimport { PAGES_DICT } from '@/lib/i18n/pages-dict';"
    );
}

if (!code.includes('const pDict =')) {
    code = code.replace(
        "export default function DocsPage() {",
        "export default function DocsPage() {\n  const { locale } = useLanguage();\n  const pDict = PAGES_DICT[locale as keyof typeof PAGES_DICT]?.docs || PAGES_DICT.en.docs;"
    );
}

// Replacements for docs content
code = code.replace(/>Lumina Documentation<\/h1>/, ">{pDict.title}</h1>");
code = code.replace(/>Welcome to the official developer and user documentation for Lumina\. Learn how to monetize your data, query verified datasets, and integrate with our Vana-powered smart contracts\.<\/p>/, ">{pDict.welcome}</p>");

code = code.replace(/>Platform Overview<\/h2>/, ">{pDict.platformOverview}</h2>");
code = code.replace(/>Lumina is a decentralized API Marketplace and Data Liquidity Pool \(DLP\) built natively on the <strong>Vana Network<\/strong>\. We bridge the gap between individual users who generate valuable data \(Data Providers\) and AI companies\/researchers \(B2B Buyers\) who need high-quality, verified datasets to train models\.<\/p>/, ">{pDict.platformDesc1}</p>");
code = code.replace(/>By leveraging Web3 infrastructure, Lumina guarantees that users retain ownership of their data while earning fair compensation \(in USDC\.e\) transparently routed through audited smart contracts\.<\/p>/, ">{pDict.platformDesc2}</p>");

code = code.replace(/>For Data Providers<\/h2>/, ">{pDict.forProviders}</h2>");
code = code.replace(/>How It Works<\/h3>/, ">{pDict.howItWorks}</h3>");

code = code.replace(/<strong>Personal Server:<\/strong> Users securely connect their Web2 accounts \(e\.g\., ChatGPT, Spotify, Instagram\) to their own <strong>Vana Personal Server<\/strong> via <a href="\/sources" className="text-vana-primary hover:underline">app\.vana\.org\/sources<\/a>\./, "<strong>Personal Server:</strong> {pDict.hw1}");
code = code.replace(/<em>Note: To securely connect private \(non-public\) data, you must authenticate and process data locally using the official <a href="https:\/\/app\.vana\.org\/download" target="_blank" rel="noreferrer" className="text-vana-primary hover:underline">Vana Desktop application<\/a>\.<\/em>/, "<em>{pDict.hw1Note}</em>");

code = code.replace(/<strong>Data Connection Request:<\/strong> Lumina sends a request to the user's Personal Server asking for permission to access specific data scopes\./, "<strong>Data Connection Request:</strong> {pDict.hw2}");
code = code.replace(/<strong>Verification:<\/strong> Once approved, the data undergoes an automated <em>Proof of Contribution \(PoC\)<\/em> check by AI Oracles to ensure authenticity and uniqueness\./, "<strong>Verification:</strong> {pDict.hw3}");
code = code.replace(/<strong>Earn:<\/strong> When AI companies, research institutions, marketing agencies, or other enterprise clients purchase data matching your demographic, you automatically receive <strong>80%<\/strong> of the revenue directly to your connected EVM wallet on the Vana Network\./, "<strong>Earn:</strong> {pDict.hw4}");

code = code.replace(/>Architecture and Contracts<\/h2>/, ">{pDict.archAndContracts}</h2>");
code = code.replace(/>Lumina utilizes a hybrid architecture to balance performance with decentralized security\.<\/p>/, ">{pDict.arch1}</p>");
code = code.replace(/<strong>Off-chain Components:<\/strong> Data preview caching, user interface, category filtering, and DCR intent processing\./, "<strong>Off-chain Components:</strong> {pDict.arch2}");
code = code.replace(/<strong>On-chain Components:<\/strong> The <code>LuminaMarketplace<\/code> smart contract on Vana Mainnet handles payment routing, escrow, PoC verifications, and the 80\/20 revenue split\./, "<strong>On-chain Components:</strong> {pDict.arch3}");

code = code.replace(/>Proof of Contribution \(PoC\)<\/h2>/, ">{pDict.pocTitle}</h2>");
code = code.replace(/>The PoC oracle acts as the trust layer between providers and buyers\.<\/p>/, ">{pDict.pocDesc}</p>");

code = code.replace(/>Data Deduplication \(Anti-Sybil\)<\/h3>/, ">{pDict.poc1}</h3>");
code = code.replace(/>A major threat to data marketplaces is Sybil attacks—users attempting to sell the same data multiple times by creating new crypto wallets\. Lumina solves this using <strong>Provider ID Uniqueness<\/strong>\.<\/p>/, ">{pDict.poc1Desc}</p>");

code = code.replace(/>When a user connects a dataset, our backend parses the raw JSON payload\.<\/li>/, ">{pDict.poc1Li1}</li>");
code = code.replace(/>We extract the immutable system ID from the platform \(e\.g\., <code>youtube_channel_id<\/code> or ChatGPT's root <code>conversation_id<\/code>\)\.<\/li>/, ">{pDict.poc1Li2}</li>");
code = code.replace(/>This ID is stored as <code>provider_account_id<\/code> with a strict <strong>UNIQUE SQL Constraint<\/strong>\.<\/li>/, ">{pDict.poc1Li3}</li>");
code = code.replace(/>If a user switches wallets or logs in via Google\/Email and tries to upload the same account again, the database physically rejects the transaction \(409 Conflict\)\. One human = One dataset\.<\/li>/, ">{pDict.poc1Li4}</li>");

code = code.replace(/>Dynamic Quality Scoring \(Proof of Contribution\)<\/h3>/, ">{pDict.poc2}</h3>");
code = code.replace(/>Not all data is created equal\. The Lumina Oracle evaluates incoming data using the Proof of Contribution \(PoC\) consensus mechanism to assign a Quality Score from 0 to 100 based on three core pillars:<\/p>/, ">{pDict.poc2Desc}</p>");

code = code.replace(/>Historical Depth<\/h4>/, ">{pDict.poc2Pillar1Title}</h4>");
code = code.replace(/>A 5-year-old GitHub account with 500 commits scores significantly higher than a 1-week-old account created just to farm and sell data\.<\/p>/, ">{pDict.poc2Pillar1Desc}</p>");
code = code.replace(/>Data Density<\/h4>/, ">{pDict.poc2Pillar2Title}</h4>");
code = code.replace(/>An Oura Ring sync containing 365 days of continuous sleep architecture is worth exponentially more than a fragmented 3-day log\.<\/p>/, ">{pDict.poc2Pillar2Desc}</p>");
code = code.replace(/>Authenticity Risk<\/h4>/, ">{pDict.poc2Pillar3Title}</h4>");
code = code.replace(/>A LinkedIn profile with 500\+ connections and recommendations verifies you as human, protecting B2B buyers from bot-generated data\.<\/p>/, ">{pDict.poc2Pillar3Desc}</p>");

code = code.replace(/>Dynamic Pricing Engine \(The Multiplier\)<\/h3>/, ">{pDict.poc3}</h3>");
code = code.replace(/>The Quality Score acts as a direct multiplier on the base price of the dataset to calculate its <strong>Estimated Value<\/strong>\. When B2B buyers purchase data from your category, the smart contract distributes the revenue to you based on this multiplier\. This ensures data buyers get exactly the quality they pay for, and high-quality data providers receive premium payouts\.<\/p>/, ">{pDict.poc3Desc}</p>");

code = code.replace(/>Quality Tier<\/th>/, ">{pDict.poc3TableCol1}</th>");
code = code.replace(/>PoC Score Range<\/th>/, ">{pDict.poc3TableCol2}</th>");
code = code.replace(/>Payout Multiplier<\/th>/, ">{pDict.poc3TableCol3}</th>");

code = code.replace(/>Example Calculation<\/h4>/, ">{pDict.poc3ExTitle}</h4>");
code = code.replace(/>\s*If you connect a GitHub Developer Profile \(Base Dataset Value: <span className="text-white">\$15\.00<\/span>\), and the Oracle assigns you a Quality Score of <span className="text-vana-green font-bold">90 \(Tier A\)<\/span>:<br\/>(.*?)<br\/>(.*?)Estimated Value = \$15\.00 × 0\.90 = <span className="text-vana-primary font-bold">\$13\.50<\/span><br\/>(.*?)When a buyer purchases your data, <span className="text-vana-primary font-bold">\$13\.50<\/span> is instantly credited to your <strong>Available Balance<\/strong> via the smart contract, ready to be claimed to your wallet\.\s*<\/p>/s, ">{pDict.poc3ExDesc}</p>");

fs.writeFileSync('src/app/docs/page.tsx', code, 'utf8');
console.log('Docs patched!');
