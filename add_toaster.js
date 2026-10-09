const fs = require('fs');

let providersCode = fs.readFileSync('src/app/providers.tsx', 'utf8');

if (!providersCode.includes('Toaster')) {
  providersCode = providersCode.replace(
    "import { QueryClient, QueryClientProvider } from '@tanstack/react-query';",
    "import { QueryClient, QueryClientProvider } from '@tanstack/react-query';\nimport { Toaster } from 'react-hot-toast';"
  );
  
  providersCode = providersCode.replace(
    "{children}\n        </RainbowKitProvider>",
    "{children}\n          <Toaster position=\"bottom-right\" toastOptions={{ style: { background: '#1F2937', color: '#fff', border: '1px solid #374151' } }} />\n        </RainbowKitProvider>"
  );
  
  fs.writeFileSync('src/app/providers.tsx', providersCode);
}
