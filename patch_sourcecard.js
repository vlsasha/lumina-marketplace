const fs = require('fs');

let code = fs.readFileSync('src/components/SourceCard.tsx', 'utf8');

// 1. Add imports
if (!code.includes('SOURCES_DICT')) {
    code = code.replace(
        "import { useLanguage } from '@/lib/i18n/LanguageContext';",
        "import { useLanguage } from '@/lib/i18n/LanguageContext';\nimport { SOURCES_DICT } from '@/lib/i18n/sources-dict';"
    );
}

// 2. Add sDict
if (!code.includes('sDict =')) {
    code = code.replace(
        "const { t } = useLanguage();",
        "const { t, language } = useLanguage();\n  const sDict = SOURCES_DICT[language as keyof typeof SOURCES_DICT] || SOURCES_DICT.en;"
    );
}

// 3. Update UI text using sDict
// source.category -> translated
code = code.replace(
    /<span className="text-\[11px\] uppercase tracking-wider font-semibold text-gray-500">\{source\.category\}<\/span>/,
    `<span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">{sDict.categories[source.category as keyof typeof sDict.categories] || source.category}</span>`
);

// source.description -> translated
code = code.replace(
    /<p className="text-sm text-gray-400 leading-relaxed">\{source\.description\}<\/p>/,
    `<p className="text-sm text-gray-400 leading-relaxed">{sDict.cards[source.id as keyof typeof sDict.cards]?.description || source.description}</p>`
);

// scopes -> translated
code = code.replace(
    /<span key=\{s\.id\} className="text-\[9px\] uppercase tracking-wider px-1\.5 py-0\.5 rounded bg-\[#111\] text-gray-400 border border-\[#222\]">\s*\{s\.name\}\s*<\/span>/,
    `<span key={s.id} className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#111] text-gray-400 border border-[#222]">\n                {sDict.cards[source.id as keyof typeof sDict.cards]?.scopes?.[s.id as keyof typeof sDict.cards[keyof typeof sDict.cards]['scopes']] || s.name}\n              </span>`
);

// "Waiting for Vana..." -> translated
code = code.replace(
    /Waiting for Vana\.\.\./,
    `{sDict.howTo.waitingVana}`
);

// "Connect Data" -> translated
code = code.replace(
    /'Connect Data'/,
    `sDict.howTo.btnConnect`
);

fs.writeFileSync('src/components/SourceCard.tsx', code, 'utf8');
console.log('SourceCard.tsx patched!');
