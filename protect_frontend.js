const fs = require('fs');
let code = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// Insert useState
code = code.replace(
  "const [selectedSource, setSelectedSource] = useState<string | null>(null);",
  "const [selectedSource, setSelectedSource] = useState<string | null>(null);\n  const [purchasedDatasets, setPurchasedDatasets] = useState<string[]>([]);"
);

// Insert useEffect
code = code.replace(
  "useEffect(() => {\n    const queryParams = new URLSearchParams();",
  `useEffect(() => {\n    if (address) {\n      fetch(\`/api/account/purchases?userId=\${address}\`)\n        .then(res => res.json())\n        .then(data => {\n          if (data.purchases) {\n            setPurchasedDatasets(data.purchases.map((p: any) => p.dataset_id));\n          }\n        })\n        .catch(console.error);\n    }\n  }, [address]);\n\n  useEffect(() => {\n    const queryParams = new URLSearchParams();`
);

// Insert derived state
code = code.replace(
  "const basePrice = selectedSource ?",
  "const currentDatasetId = selectedSource ? (DATA_SOURCES.find(s => s.id === selectedSource)?.name || selectedSource) + ' (Tier ' + selectedTier + ')' : '';\n  const isAlreadyPurchased = purchasedDatasets.includes(currentDatasetId) || purchasedDatasets.includes(selectedSource + ' (Tier ' + selectedTier + ')');\n\n  const basePrice = selectedSource ?"
);

// Modify button
code = code.replace(
  "<button\n              onClick={handlePurchase}\n              disabled={isPending || isConfirming || !selectedSource}\n              className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all shadow-lg ${!selectedSource || isPending || isConfirming ? 'bg-gray-700 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25'}`}\n            >\n              {isPending || isConfirming ? t.pricing.processing : t.pricing.acquireData}\n            </button>",
  `<button\n              onClick={handlePurchase}\n              disabled={isPending || isConfirming || !selectedSource || isAlreadyPurchased}\n              className={\`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all shadow-lg \${!selectedSource || isPending || isConfirming || isAlreadyPurchased ? 'bg-gray-700 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25'}\`}\n            >\n              {isAlreadyPurchased ? 'Already Purchased' : (isPending || isConfirming ? t.pricing.processing : t.pricing.acquireData)}\n            </button>`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', code);
console.log('Frontend protected');
