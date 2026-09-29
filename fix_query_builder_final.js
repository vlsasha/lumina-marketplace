const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname, 'src', 'components', 'DataQueryBuilder.tsx');
let lines = fs.readFileSync(filepath, 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('const handlePurchase = () => {'));
const end = lines.findIndex((l, i) => i > start && l.includes('};'));
const newContent = `  const handlePurchase = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }
    if (selectedSources.length === 0) {
      alert('Please select at least one data source to acquire.');
      return;
    }
    try {
      setIsPending(true);
      const mockProviders = Array.from({ length: 3 }, (_, i) => \0x1111111111111111111111111111111111111111${i}\ as \0x${string}\);
      const totalAmountParsed = parseUnits(totalCost.toFixed(6), MARKETPLACE_CONFIG.paymentToken.decimals);
      const amountPerProvider = parseUnits((totalCost / 3).toFixed(6), MARKETPLACE_CONFIG.paymentToken.decimals);
      const mockAmounts = Array(3).fill(amountPerProvider);
      await writeContractAsync(l
        address: MARKETPLACE_CONFIG.paymentToken.address as \ox${string}\,
        abi: erc20Abi,
        functionName: 'approve',
        args: [MARKETPLACE_CONFIG.marketplaceAddress as \0x${string}\, totalAmountParsed],
      });
      await writeContractAsync({
        address: MARKETPLACE_CONFIG.marketplaceAddress as \0x${string}\,
        abi: luminaMarketplaceAbi,
        functionName: 'buyData',
        args: [mockProviders, mockAmounts],
      });
      alert('Dataset purchased successfully!');
    } catch (err) {
      console.error(err);
      alert('Payment failed.');
    } finally {
      setIsPending(false);
    }
  };`;
lines.splice(start, end - start + 1, ...newContent.split('\n'));
fs.writeFileSync(filepath, lines.join('\n').replace(/\\/g, '`'));
console.log('Fixed handlePurchase');