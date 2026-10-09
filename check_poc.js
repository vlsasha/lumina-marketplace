const { ethers } = require('ethers');
const { MARKETPLACE_CONFIG } = require('./src/lib/config');
const { luminaMarketplaceAbi } = require('./src/lib/abi');

const RPC_URL = 'https://rpc.vana.org';

async function check() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(MARKETPLACE_CONFIG.marketplaceAddress, luminaMarketplaceAbi, provider);
  
  // Try to check score for a hardcoded address or check multiple
  // I need to know the wallet addresses. Let's just grab them from DB if I can, but I can't.
  console.log("Contract Address:", MARKETPLACE_CONFIG.marketplaceAddress);
}

check();
