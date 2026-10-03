const fs = require('fs');

let code = fs.readFileSync('src/lib/i18n/sources-dict.ts', 'utf8');

const replacements = {
    '"Developer": "Developer",': '"Developer": "Developer",\n      "Professional": "Professional",',
    '"Developer": "Разработка",': '"Developer": "Разработка",\n      "Professional": "Профессиональное",',
    '"Developer": "Desarrollador",': '"Developer": "Desarrollador",\n      "Professional": "Profesional",',
    '"Developer": "Desenvolvedor",': '"Developer": "Desenvolvedor",\n      "Professional": "Profissional",',
    '"Developer": "Entwickler",': '"Developer": "Entwickler",\n      "Professional": "Professionell",',
    '"Developer": "开发者",': '"Developer": "开发者",\n      "Professional": "职业",',
    '"Developer": "개발자",': '"Developer": "개발자",\n      "Professional": "전문 네트워크",'
};

for (const [key, value] of Object.entries(replacements)) {
    code = code.replace(key, value);
}

fs.writeFileSync('src/lib/i18n/sources-dict.ts', code, 'utf8');
console.log('sources-dict.ts patched with Professional!');
