const { ethers } = require('ethers');
const RPC_URL = 'https://rpc.vana.org';
const abi = ['function providerBalances(address) view returns (uint256)', 'function processedDatasets(bytes32) view returns (bool)'];
async function run() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract('0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32', abi, provider);
  
  const wallets = [
    '0xC1d3007A33d86Fd7390B087304AD3083FC87438C',
    '0x8E3f4BFB720582bF7223FDB6A1a678957b38835A'
  ];
  for(const w of wallets) {
    const bal = await contract.providerBalances(w);
    console.log(w, ':', ethers.formatUnits(bal, 6));
  }
}
run();
