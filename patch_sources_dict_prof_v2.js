const fs = require('fs');

const file = 'src/lib/i18n/sources-dict.ts';
let code = fs.readFileSync(file, 'utf8');

// The file has a structure:
// export const SOURCES_DICT = {
//   en: { ..., categories: { ... } },
//   ru: { ..., categories: { ... } }, ...

const profMap = {
    'en': 'Professional',
    'ru': 'Профессиональное',
    'es': 'Profesional',
    'pt': 'Profissional',
    'de': 'Professionell',
    'zh': '职业',
    'ko': '전문 네트워크'
};

// We will use a regex to find each language block and inject "Professional": "..." if missing.
for (const lang of Object.keys(profMap)) {
    const langPattern = new RegExp(`"${lang}":\\s*\\{[\\s\\S]*?"categories":\\s*\\{([\\s\\S]*?)\\}`, 'g');
    
    code = code.replace(langPattern, (match, categoriesContent) => {
        if (!categoriesContent.includes('"Professional"')) {
            // append to the end of categories block
            const replacement = `"${lang}": {\n` + match.slice(match.indexOf('{') + 1).replace(categoriesContent, categoriesContent + `,\n        "Professional": "${profMap[lang]}"\n      `);
            return replacement;
        }
        return match;
    });
}

fs.writeFileSync(file, code, 'utf8');
console.log('sources-dict.ts updated with Professional for all langs!');
