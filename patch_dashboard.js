const fs = require('fs');

let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

if (!code.includes('PAGES_DICT')) {
    code = code.replace(
        "import { useLanguage } from '@/lib/i18n/LanguageContext';",
        "import { useLanguage } from '@/lib/i18n/LanguageContext';\nimport { PAGES_DICT } from '@/lib/i18n/pages-dict';"
    );
}

if (!code.includes('const pDict = ')) {
    code = code.replace(
        "const { t } = useLanguage();",
        "const { locale } = useLanguage();\n  const pDict = PAGES_DICT[locale as keyof typeof PAGES_DICT]?.dashboard || PAGES_DICT.en.dashboard;"
    );
}

// Translate Dashboard UI Elements
code = code.replace(/>Dashboard<\/h2>/, ">{pDict.pageTitle}</h2>");
code = code.replace(/>Manage your data source connections and preview data\.<\/p>/, ">{pDict.pageSubtitle}</p>");

code = code.replace(/>Available Sources<\/p>/g, ">{pDict.availableSources}</p>");
code = code.replace(/>Connected<\/p>/g, ">{pDict.connected}</p>");
code = code.replace(/>Pending<\/p>/g, ">{pDict.pending}</p>");
code = code.replace(/>Total Scopes<\/p>/g, ">{pDict.totalScopes}</p>");

code = code.replace(/>AVAILABLE BALANCE<\/span>/g, ">{pDict.availableBalance}</span>");
code = code.replace(/>ESTIMATED VALUE<\/span>/g, ">{pDict.estimatedValue}</span>");
code = code.replace(/>ACTIVE CONNECTIONS<\/span>/g, ">{pDict.activeConnections}</span>");
code = code.replace(/>DATA QUALITY SCORE<\/span>/g, ">{pDict.dataQualityScore}</span>");

code = code.replace(/>PoC: Pending<\/span>/g, ">{pDict.pocPending}</span>");
code = code.replace(/>Claim to Wallet<\/button>/g, ">{pDict.claimToWallet}</button>");
code = code.replace(/>Data Sources<\/h3>/g, ">{t.sources.pageTitle || 'Data Sources'}</h3>"); 
// wait, Data Sources in dashboard is a title for the list, we can just use `t.sources.pageTitle` 
// but wait, dashboard didn't have `const { t } = useLanguage()` anymore if I replaced it!
// Let me fix that.

code = code.replace(
    "const { locale } = useLanguage();\n  const pDict = PAGES_DICT[locale as keyof typeof PAGES_DICT]?.dashboard || PAGES_DICT.en.dashboard;",
    "const { t, locale } = useLanguage();\n  const pDict = PAGES_DICT[locale as keyof typeof PAGES_DICT]?.dashboard || PAGES_DICT.en.dashboard;"
);

// We need to also patch Data Sources title in dashboard
code = code.replace(/<h3 className="text-lg font-bold text-white">Data Sources<\/h3>/, "<h3 className=\"text-lg font-bold text-white\">{t.sources?.pageTitle || 'Data Sources'}</h3>");

fs.writeFileSync('src/app/dashboard/page.tsx', code, 'utf8');
console.log('Dashboard patched!');
