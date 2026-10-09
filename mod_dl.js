const fs = require('fs');
let code = fs.readFileSync('src/app/api/download/route.ts', 'utf8');

const regex = /\/\/ 2\. Verify purchase[\s\S]*?WHERE u\.source_id = \$\{baseSourceId\}\n    \`;/m;

const replacement = `// 2. Verify purchase and collect purchased wallets
    const purchases = await sql\`
      SELECT provider_wallets FROM purchases 
      WHERE buyer_id = \${buyerId} AND dataset_id = \${datasetId}
    \`;

    if (purchases.length === 0) {
      return NextResponse.json({ error: 'You have not purchased this dataset.' }, { status: 403 });
    }

    let allowedWallets = [];
    purchases.forEach(p => {
      if (p.provider_wallets && Array.isArray(p.provider_wallets)) {
        allowedWallets.push(...p.provider_wallets);
      }
    });

    // 3. Fetch data ONLY for purchased wallets
    // If allowedWallets is empty (legacy data), we fallback to pulling all data for that source (backward compatibility).
    let records;
    if (allowedWallets.length > 0) {
      records = await sql\`
        SELECT d.data 
        FROM downloaded_data d
        JOIN user_connections u ON d.connection_id = u.connection_id
        WHERE u.source_id = \${baseSourceId} AND u.wallet_address = ANY(\${allowedWallets})
      \`;
    } else {
      records = await sql\`
        SELECT d.data 
        FROM downloaded_data d
        JOIN user_connections u ON d.connection_id = u.connection_id
        WHERE u.source_id = \${baseSourceId}
      \`;
    }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/app/api/download/route.ts', code);
console.log('Fixed download API');
