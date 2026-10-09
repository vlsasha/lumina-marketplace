const fs = require('fs');
let code = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// 1. Add buyerId to the URL search params inside both useEffect and handlePurchase
code = code.replace(
  "if (selectedTier !== 'Any') queryParams.append('tier', selectedTier);",
  "if (selectedTier !== 'Any') queryParams.append('tier', selectedTier);\n      if (address) queryParams.append('buyerId', address);"
);
// Replace it again for the handlePurchase block
code = code.replace(
  "if (selectedTier !== 'Any') queryParams.append('tier', selectedTier);",
  "if (selectedTier !== 'Any') queryParams.append('tier', selectedTier);\n        if (address) queryParams.append('buyerId', address);"
);

// 2. Modify the POST request to include providerWallets
code = code.replace(
  "transactionHash: hash1, sizeBytes: validProviders.length * 1024 * 5 }) });",
  "transactionHash: hash1, sizeBytes: validProviders.length * 1024 * 5, providerWallets: validProviders }) });"
);

// 3. Re-enable the button if validProviders.length > 0!
// Wait! Previously I added `isAlreadyPurchased`. 
// If the user already bought Tier D, `isAlreadyPurchased` is true. But what if there are 200 NEW providers?
// If `validProviders.length > 0`, they should be able to buy it!
// Let's just remove the `isAlreadyPurchased` logic since the backend will now return ONLY unpurchased providers!
code = code.replace(
  "const isAlreadyPurchased = purchasedDatasets.includes(currentDatasetId) || purchasedDatasets.includes(selectedSource + ' (Tier ' + selectedTier + ')');",
  "const isAlreadyPurchased = false; // Delta purchasing enabled!"
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', code);
console.log('Fixed DataQueryBuilder');
