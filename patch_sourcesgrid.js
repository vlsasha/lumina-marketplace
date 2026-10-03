const fs = require('fs');

let code = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

// 1. Add import for SOURCES_DICT and LanguageContext if not present
if (!code.includes('SOURCES_DICT')) {
    code = code.replace(
        "import { DATA_SOURCES, getSourcesByCategory } from '@/lib/data-sources';",
        "import { DATA_SOURCES, getSourcesByCategory } from '@/lib/data-sources';\nimport { useLanguage } from '@/lib/i18n/LanguageContext';\nimport { SOURCES_DICT } from '@/lib/i18n/sources-dict';"
    );
}

// 2. Add hook usage
if (!code.includes('const { language }')) {
    code = code.replace(
        "export function SourcesGrid() {",
        "export function SourcesGrid() {\n  const { language } = useLanguage();\n  const sDict = SOURCES_DICT[language as keyof typeof SOURCES_DICT] || SOURCES_DICT.en;"
    );
}

// 3. Translate hardcoded UI elements
code = code.replace(
    /const categories = \['All', \.\.\.Array\.from\(new Set\(DATA_SOURCES\.map\(s => s\.category\)\)\)\];/,
    "const categories = ['All', ...Array.from(new Set(DATA_SOURCES.map(s => s.category)))];\n  const getCategoryName = (c: string) => c === 'All' ? sDict.all : sDict.categories[c as keyof typeof sDict.categories] || c;"
);

code = code.replace(
    /<button\s+key=\{category\}\s+onClick=\{\(\) => setActiveCategory\(category\)\}\s+className=\{\`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 \$\{[\s\S]*?\}\`\}\s*>\s*\{category\}\s*<\/button>/,
    `<button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={\`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 \${
                    activeCategory === category
                      ? 'bg-vana-primary text-black shadow-[0_0_15px_rgba(205,255,100,0.3)] scale-105'
                      : 'bg-[#111] text-gray-400 border border-[#333] hover:border-vana-primary/50 hover:text-white'
                  }\`}
                >
                  {getCategoryName(category)}
                </button>`
);

code = code.replace(
    /<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">\s*Data Sources\s*<\/h2>/,
    `<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{sDict.pageTitle}</h2>`
);
code = code.replace(
    /<p className="text-vana-text-secondary max-w-2xl mx-auto text-sm sm:text-base">\s*Browse available data sources\. Connect your accounts securely via Vana's decentralized protocol\.\s*<\/p>/,
    `<p className="text-vana-text-secondary max-w-2xl mx-auto text-sm sm:text-base">{sDict.pageSubtitle}</p>`
);
code = code.replace(
    /No data sources available in this category\./,
    `{sDict.noSources}`
);

// Right sidebar
code = code.replace(
    /<p className="text-\[11px\] text-gray-400 uppercase tracking-widest font-semibold">Secure Vana Protocol<\/p>/,
    `<p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">{sDict.howTo.sidebarTitle}</p>`
);
code = code.replace(
    /<h4 className="text-sm font-semibold text-white mb-1">Install Vana Desktop<\/h4>/,
    `<h4 className="text-sm font-semibold text-white mb-1">{sDict.howTo.step1Title}</h4>`
);
code = code.replace(
    /Most data sources require the official <a href="https:\/\/app\.vana\.org\/download" target="_blank" rel="noreferrer" className="text-vana-primary hover:underline">Vana Desktop application<\/a> to securely run local algorithms without exposing your data\./,
    `{sDict.howTo.step1Desc}`
);
code = code.replace(
    /<h4 className="text-sm font-semibold text-white mb-1">Pre-Login to Accounts<\/h4>/,
    `<h4 className="text-sm font-semibold text-white mb-1">{sDict.howTo.step2Title}</h4>`
);
code = code.replace(
    /<span className="text-amber-400\/90 font-medium">Crucial step:<\/span> Before clicking connect, ensure you are logged into the respective social network or service in your default browser\. This ensures Vana can accurately sync the exact data scopes listed on the card\./,
    `{sDict.howTo.step2Desc}`
);

// We need to replace step 3 and 4 descriptions too, which were previously left as english
code = code.replace(
    /<p className="text-xs text-gray-400 leading-relaxed">Click "Connect Data" on any card here to launch the Vana Data Connection Request \(DCR\) flow\.<\/p>/,
    `<p className="text-xs text-gray-400 leading-relaxed">{sDict.howTo.step3Desc}</p>`
);
code = code.replace(
    /<p className="text-xs text-gray-400 leading-relaxed">Once validated by the Proof of Contribution \(PoC\) oracle, your data generates dynamic USDC yields based on your Quality Tier\.<\/p>/,
    `<p className="text-xs text-gray-400 leading-relaxed">{sDict.howTo.step4Desc}</p>`
);

code = code.replace(
    /<span className="text-xs text-gray-500 font-medium">Security<\/span>/,
    `<span className="text-xs text-gray-500 font-medium">{sDict.howTo.security}</span>`
);
code = code.replace(
    /End-to-end encrypted/,
    `{sDict.howTo.e2e}`
);

fs.writeFileSync('src/components/SourcesGrid.tsx', code, 'utf8');
console.log('SourcesGrid.tsx patched!');
