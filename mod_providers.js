const fs = require('fs');
let code = fs.readFileSync('src/app/api/providers/route.ts', 'utf8');

const regex = /const sourcesParam = searchParams\.get\('sources'\);\n    const tierParam = searchParams\.get\('tier'\);/;
code = code.replace(regex, `const sourcesParam = searchParams.get('sources');
    const tierParam = searchParams.get('tier');
    const buyerId = searchParams.get('buyerId');`);

const excludeLogic = `
    // Filter out already purchased wallets
    if (buyerId && sourcesParam) {
      const sources = sourcesParam.split(',').filter(Boolean);
      // Determine what dataset ID to look up (approximate, since we only know the source name and tier)
      // Actually, we can just look up ALL purchases for this buyer where the dataset name includes the source name.
      // But more simply, we can just check all provider_wallets they ever bought for ANY dataset.
      const purchases = await sql\`SELECT provider_wallets FROM purchases WHERE buyer_id = \${buyerId}\`;
      const purchasedWallets = new Set();
      purchases.forEach(p => {
        if (p.provider_wallets && Array.isArray(p.provider_wallets)) {
          p.provider_wallets.forEach(w => purchasedWallets.add(w));
        }
      });
      providers = providers.filter(w => !purchasedWallets.has(w));
      count = providers.length;
    }
    
    // Prevent fallback to treasury wallet if there are genuinely 0 remaining
    if (providers.length === 0 && count === 0) {
      // Do nothing, let it be 0!
    } else if (providers.length === 0) {
      providers.push('0xC1d3007A33d86Fd7390B087304AD3083FC87438C');
    }`;

code = code.replace(/if \(providers\.length === 0\) \{\s*providers\.push\('0xC1d3007A33d86Fd7390B087304AD3083FC87438C'\);\s*if \(count === 0\) count = 0;[^\}]*\}/, excludeLogic);

fs.writeFileSync('src/app/api/providers/route.ts', code);
console.log('Providers API modified');
