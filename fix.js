const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname, 'src', 'components', 'DataQueryBuilder.tsx');
let lines = fs.readFileSync(filepath, 'utf8').split('\n');

const start = lines.findIndex(l => l.includes('const handlePurchase = () => {'));
let end = lines.findIndex((l, i) => i > start && l.trim() === '};');

const b = String.fromCharCode(96);
const dol = String.fromCharCode(36);

const newLines = [
  "  const handlePurchase = async () => {",
  "    if (!isConnected) {",
  "      alert('Please connect your wallet first!');",
  "      return;",
  "    }",
  "    if (selectedSources.length === 0) {",
  "      alert('Please select at least one data source to acquire.');",
  "      return;",
  "    }",
  "    try {",
  "      setIsPending(true);",
  "      const mockProviders = Array.from({ length: 3 }, (_, i) => " + b + "0x111111111111111111111111111111111111111" + dol + "{i}" + b + " as " + b + "0x" + dol + "{string}" + b + ");",
  "      const totalAmountParsed = parseUnits(totalCost.toFixed(6), MARKETPLACE_CONFIG.paymentToken.decimals);",
  "      const amountPerProvider = parseUnits((totalCost / 3).toFixed(6), MARKETPLACE_CONFIG.paymentToken.decimals);",
  "      const mockAmounts = Array(3).fill(amountPerProvider);",
  "      await writeContractAsync({",
  "        address: MARKETPLACE_CONFIG.paymentToken.address as " + b + "0x" + dol + "{string}" + b + ",",
  "        abi: erc20Abi,",
  "        functionName: 'approve',",
  "        args: [MARKETPLACE_CONFIG.marketplaceAddress as " + b + "0x" + dol + "{string}" + b + ", totalAmountParsed],",
  "      });",
  "      await writeContractAsync({",
  "        address: MARKETPLACE_CONFIG.marketplaceAddress as " + b + "0x" + dol + "{string}" + b + ",",
  "        abi: luminaMarketplaceAbi,",
  "        functionName: 'buyData',",
  "        args: [mockProviders, mockAmounts],",
  "      });",
  "      alert('Dataset purchased successfully!');",
  "    } catch (err) {",
  "      console.error(err);",
  "      alert('Payment failed.');",
  "    } finally {",
  "      setIsPending(false);",
  "    }",
  "  };"
];

lines.splice(start, end - start + 1, ...newLines);
fs.writeFileSync(filepath, lines.join('\n'));
console.log('Fixed handlePurchase');
