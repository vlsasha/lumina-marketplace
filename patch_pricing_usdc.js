const fs = require('fs');

let code = fs.readFileSync('src/app/pricing/page.tsx', 'utf8');

if (!code.includes('PAGES_DICT')) {
    code = code.replace(
        "import { useLanguage } from '@/lib/i18n/LanguageContext';",
        "import { useLanguage } from '@/lib/i18n/LanguageContext';\nimport { PAGES_DICT } from '@/lib/i18n/pages-dict';"
    );
}

if (!code.includes('const pDict =')) {
    code = code.replace(
        "export default function PricingPage() {",
        "export default function PricingPage() {\n  const { locale } = useLanguage();\n  const pDict = PAGES_DICT[locale as keyof typeof PAGES_DICT]?.pricing || PAGES_DICT.en.pricing;"
    );
}

code = code.replace(/>Need USDC on Vana Network\?<\/h3>/, ">{pDict.needUsdcTitle}</h3>");
code = code.replace(
    /<p className="text-sm text-vana-text-secondary mb-4">\s*To pay for data, you need USDC tokens on the Vana blockchain\. You can easily bridge your USDC from Ethereum, Arbitrum, or other networks using Stargate Finance\.\s*<\/p>/s,
    '<p className="text-sm text-vana-text-secondary mb-4">\n                  {pDict.needUsdcDesc}\n                </p>'
);
code = code.replace(/>\s*Bridge USDC via Stargate\s*<svg/, ">\n                  {pDict.bridgeUsdc}\n                  <svg");

fs.writeFileSync('src/app/pricing/page.tsx', code, 'utf8');
console.log('PricingPage patched!');
