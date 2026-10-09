const fs = require('fs');
let code = fs.readFileSync('src/app/api/providers/route.ts', 'utf8');

const regex = /return NextResponse\.json\(\{\s*providers,\s*count\s*\}\);/m;
const replacement = `
    return NextResponse.json({
      providers,
      count,
      debugInfo: {
        sourcesParam,
        buyerId,
        tierParam,
        sourcesArray: sourcesParam ? sourcesParam.split(',').filter(Boolean) : [],
      }
    });
`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/app/api/providers/route.ts', code);
console.log('Added debug info correctly');
