const fs = require('fs');

let providersCode = fs.readFileSync('src/app/providers.tsx', 'utf8');

if (!providersCode.includes('CartProvider')) {
  providersCode = providersCode.replace(
    "import { LanguageProvider } from '@/lib/i18n/LanguageContext';",
    "import { LanguageProvider } from '@/lib/i18n/LanguageContext';\nimport { CartProvider } from '@/lib/context/CartContext';"
  );
  
  providersCode = providersCode.replace(
    "<LanguageProvider>",
    "<LanguageProvider>\n      <CartProvider>"
  );

  providersCode = providersCode.replace(
    "</LanguageProvider>",
    "      </CartProvider>\n    </LanguageProvider>"
  );
  
  fs.writeFileSync('src/app/providers.tsx', providersCode);
}
