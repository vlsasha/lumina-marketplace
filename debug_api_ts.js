const fs = require('fs');
let code = fs.readFileSync('src/app/api/account/purchases/route.ts', 'utf8');

code = code.replace(
  "details: error.message",
  "details: (error as any).message"
);
code = code.replace(
  "details: error.message",
  "details: (error as any).message"
);

fs.writeFileSync('src/app/api/account/purchases/route.ts', code);

let code2 = fs.readFileSync('src/app/api/account/key/route.ts', 'utf8');
code2 = code2.replace(
  "details: error.message",
  "details: (error as any).message"
);
code2 = code2.replace(
  "details: error.message",
  "details: (error as any).message"
);
fs.writeFileSync('src/app/api/account/key/route.ts', code2);

console.log('Fixed typescript error in API debug routes');
