const fs = require('fs');

let code = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

if (!code.includes('PAGES_DICT')) {
    code = code.replace(
        "import { useLanguage } from '@/lib/i18n/LanguageContext';",
        "import { useLanguage } from '@/lib/i18n/LanguageContext';\nimport { PAGES_DICT } from '@/lib/i18n/pages-dict';"
    );
}

if (!code.includes('const pDict =')) {
    code = code.replace(
        "export function DataQueryBuilder() {",
        "export function DataQueryBuilder() {\n  const { locale } = useLanguage();\n  const pDict = PAGES_DICT[locale as keyof typeof PAGES_DICT]?.pricing || PAGES_DICT.en.pricing;"
    );
}

// Sidebar texts
code = code.replace(/>How Pricing Works<\/h3>/, ">{pDict.howPricingWorks}</h3>");
code = code.replace(/>Base Source Value<\/h4>/, ">{pDict.step1Title}</h4>");
code = code.replace(/>Every dataset has a base market rate \(e\.g\. GitHub is \$15\.00\)\. This represents the highest Tier A premium price\.<\/p>/, ">{pDict.step1Desc}</p>");
code = code.replace(/>Quality Multipliers<\/h4>/, ">{pDict.step2Title}</h4>");
code = code.replace(/>The AI Oracle scores data from 0-100\. Lower quality tiers apply a discount multiplier to the base value:<\/p>/, ">{pDict.step2Desc}</p>");
code = code.replace(/>Fair Revenue Split<\/h4>/, ">{pDict.step3Title}</h4>");
code = code.replace(/<p className="text-xs text-gray-400 leading-relaxed">Total Cost = \(Base Value × Multiplier\) × Volume\.<br\/><br\/>Exactly <strong className="text-white">80%<\/strong> of your payment goes instantly to the users' crypto wallets\.<\/p>/, "<p className=\"text-xs text-gray-400 leading-relaxed whitespace-pre-wrap\">{pDict.step3Desc}</p>");

// Inside Order Summary
code = code.replace(/>Processing\.\.\.<\/span>/g, ">{pDict.processing}</span>"); // wait, it's just "Processing..."
code = code.replace(/Processing\.\.\./, "{pDict.processing}");
code = code.replace(/Purchase Dataset/, "{pDict.purchaseDataset}");
code = code.replace(/>\s*Payments are securely processed via the Lumina Smart Contract and routed directly to the users providing data\.\s*<\/p>/, ">{pDict.paymentsProcessed}</p>");

code = code.replace(/>pts\)/g, ">{pDict.pts})");

fs.writeFileSync('src/components/DataQueryBuilder.tsx', code, 'utf8');
console.log('DataQueryBuilder patched!');
