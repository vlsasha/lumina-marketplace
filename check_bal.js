const { ethers } = require('ethers');
const RPC_URL = 'https://rpc.vana.org';
const MARKETPLACE_ADDRESS = '0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32';
const abi = ['function providerBalances(address) view returns (uint256)'];
async function run() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(MARKETPLACE_ADDRESS, abi, provider);
  const bal = await contract.providerBalances('0x8E3f4BFB720582bF7223FDB6A1a678957b38835A');
  console.log('Balance 0x8E...:', ethers.formatUnits(bal, 6)); // assuming 6 decimals for USDC.e
}
run();
