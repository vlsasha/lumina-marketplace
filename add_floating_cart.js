const fs = require('fs');

let code = fs.readFileSync('src/app/layout.tsx', 'utf8');

if (!code.includes('FloatingCart')) {
  code = code.replace(
    "import './globals.css';",
    "import './globals.css';\nimport { FloatingCart } from '@/components/FloatingCart';"
  );
  
  code = code.replace(
    "{children}\n        </Providers>",
    "{children}\n          <FloatingCart />\n        </Providers>"
  );
  
  fs.writeFileSync('src/app/layout.tsx', code);
}
