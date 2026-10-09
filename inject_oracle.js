const fs = require('fs');

let code = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

if (!code.includes('import { submitProviderPoC }')) {
  code = 'import { submitProviderPoC } from "@/lib/oracle";\n' + code;
}

code = code.replace(
  'return NextResponse.json({ success: true });',
  'submitProviderPoC(wallet, qualityScore).catch(console.error);\n    return NextResponse.json({ success: true });'
);

fs.writeFileSync('src/app/api/connections/route.ts', code);
console.log('Injected oracle call');
