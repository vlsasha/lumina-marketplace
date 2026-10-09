const fs = require('fs');
let code = fs.readFileSync('src/app/api/account/purchases/route.ts', 'utf8');

code = code.replace(
  "const { buyerId, datasetId, transactionHash, sizeBytes } = body;",
  "const { buyerId, datasetId, transactionHash, sizeBytes, providerWallets } = body;"
);

// Remove the duplicates block completely
code = code.replace(
  /\/\/ Prevent duplicates[\s\S]*?status: 409 \}\);\n    \}/,
  "// Duplicates logic removed: we allow delta purchasing!"
);

// Modify the INSERT
code = code.replace(
  "INSERT INTO purchases (buyer_id, dataset_id, transaction_hash, format, size_bytes)\n      VALUES (${buyerId}, ${datasetId}, ${transactionHash}, ${format}, ${sizeBytes})",
  "INSERT INTO purchases (buyer_id, dataset_id, transaction_hash, format, size_bytes, provider_wallets)\n      VALUES (${buyerId}, ${datasetId}, ${transactionHash}, ${format}, ${sizeBytes}, ${providerWallets ? JSON.stringify(providerWallets) : '[]'})"
);

fs.writeFileSync('src/app/api/account/purchases/route.ts', code);
console.log('Fixed POST purchases');
