const fs = require('fs');
let code = fs.readFileSync('src/app/api/download/route.ts', 'utf8');

const regex = /if \(records\.length === 0\) \{[\s\S]*?\}\s*else if/g;
code = code.replace(regex, `if (records.length === 0) {
      return NextResponse.json({ error: 'No data available for this dataset yet.' }, { status: 404 });
    }

    if`);

fs.writeFileSync('src/app/api/download/route.ts', code);
console.log('Removed mock');
