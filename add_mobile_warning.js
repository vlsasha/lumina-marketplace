const fs = require('fs');
let code = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

const replacement = `
        <div className="block xl:hidden mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center mx-auto max-w-2xl">
          <p className="text-sm text-yellow-500 font-medium flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            {locale === 'ru' ? 'Внимание: Подключение данных требует установки Vana Desktop, которое доступно только на ПК.' : 'Note: Connecting data requires the Vana Desktop app, which is only available on PC/Mac.'}
          </p>
        </div>
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-10 items-start">
`;

code = code.replace('<div className="flex flex-col xl:flex-row gap-8 lg:gap-10 items-start">', replacement);
fs.writeFileSync('src/components/SourcesGrid.tsx', code);
