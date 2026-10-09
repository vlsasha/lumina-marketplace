const fs = require('fs');
let code = fs.readFileSync('src/app/api/account/purchases/route.ts', 'utf8');
code = code.replace(
  "const format = 'JSONL, CSV'; // Default formats available",
  `const format = 'JSONL, CSV'; // Default formats available\n    \n    // Prevent duplicates\n    const existing = await sql\`SELECT id FROM purchases WHERE buyer_id = \${buyerId} AND dataset_id = \${datasetId}\`;\n    if (existing && existing.length > 0) {\n      return NextResponse.json({ error: 'You have already purchased this dataset.' }, { status: 409 });\n    }`
);
fs.writeFileSync('src/app/api/account/purchases/route.ts', code);
console.log('Backend protected');
