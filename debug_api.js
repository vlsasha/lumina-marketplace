const fs = require('fs');
let code = fs.readFileSync('src/app/api/account/purchases/route.ts', 'utf8');

code = code.replace(
  "return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });",
  "return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });"
);

fs.writeFileSync('src/app/api/account/purchases/route.ts', code);

let code2 = fs.readFileSync('src/app/api/account/key/route.ts', 'utf8');
code2 = code2.replace(
  "return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });",
  "return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });"
);
fs.writeFileSync('src/app/api/account/key/route.ts', code2);

console.log('Modified APIs to return detailed errors');
