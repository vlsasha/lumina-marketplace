const fs = require('fs');
let code = fs.readFileSync('src/app/api/providers/route.ts', 'utf8');

const regex = /return NextResponse\.json\(\{\s*providers,\s*count\s*\}\);/m;
const replacement = `
    return NextResponse.json({
      providers,
      count,
      debug: {
        sourcesParam,
        buyerId,
        tierParam,
        purchasesFound: purchases ? purchases.length : 0,
        purchasedWallets: Array.from(purchasedWallets || [])
      }
    });
`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/app/api/providers/route.ts', code);
console.log('Added debug info to providers route');
