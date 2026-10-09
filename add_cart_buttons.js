const fs = require('fs');

let code = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

if (!code.includes('useCart')) {
  // 1. Import useCart
  code = code.replace(
    "import { formatUnits, parseAbiItem } from 'viem';",
    "import { formatUnits, parseAbiItem } from 'viem';\nimport { useCart } from '@/lib/context/CartContext';"
  );

  // 2. Add hook
  code = code.replace(
    "const publicClient = usePublicClient();",
    "const publicClient = usePublicClient();\n  const { addToCart } = useCart();"
  );

  // 3. Add handleAddToCart function
  const handleAddToCart = `  const handleAddToCart = () => {
    if (!address) {
      toast.error('Please connect your wallet first!');
      return;
    }
    if (!selectedSource) {
      toast.error('Please select a data source to acquire.');
      return;
    }
    const sourceObj = Object.values(categories).flat().find(s => s.id === selectedSource);
    
    addToCart({
      sourceId: selectedSource,
      sourceName: sourceObj?.name || selectedSource,
      tier: selectedTier,
      providers: validProviders,
      amounts: amountsArray,
      price: validProviders.length * pricePerProvider
    });
  };`;

  code = code.replace(
    "const handleBuyData = async () => {",
    handleAddToCart + "\n\n  const handleBuyData = async () => {"
  );

  // 4. Update UI to include Add to Cart button
  const oldButtons = `<button
            onClick={handleBuyData}
            disabled={isBuying || isFetchingProviders || validProviders.length === 0}
            className="w-full bg-vana-primary hover:bg-[#b9ff42] text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(205,255,100,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isBuying ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : isFetchingProviders ? (
               'Fetching Providers...'
            ) : validProviders.length === 0 ? (
               'No Data Available'
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {t.home.query.btnBuy}
              </>
            )}
          </button>`;

  const newButtons = `<div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isBuying || isFetchingProviders || validProviders.length === 0}
              className="flex-1 border-2 border-vana-primary text-vana-primary hover:bg-vana-primary/10 font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add to Cart
            </button>
            <button
              onClick={handleBuyData}
              disabled={isBuying || isFetchingProviders || validProviders.length === 0}
              className="flex-1 bg-vana-primary hover:bg-[#b9ff42] text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(205,255,100,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isBuying ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : isFetchingProviders ? (
                 'Fetching Providers...'
              ) : validProviders.length === 0 ? (
                 'No Data Available'
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {t.home.query.btnBuy}
                </>
              )}
            </button>
          </div>`;

  code = code.replace(oldButtons, newButtons);
  fs.writeFileSync('src/components/DataQueryBuilder.tsx', code);
}
