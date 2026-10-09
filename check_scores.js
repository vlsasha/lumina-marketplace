const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.vana.org';
const MARKETPLACE_ADDRESS = '0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32';

const abi = [
  "function providerPoCScores(address) view returns (uint256)"
];

async function check(address) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(MARKETPLACE_ADDRESS, abi, provider);
  
  const score = await contract.providerPoCScores(address);
  console.log("PoC Score for", address, ":", score.toString());
}

// Check the wallets currently in the database by hitting our debug API
async function run() {
  const res = await fetch('https://lumina-vana.vercel.app/api/vana/debug-wallets');
  const json = await res.json();
  console.log("Wallets from DB:", json.wallets);
  if (json.wallets) {
    for (const w of json.wallets) {
      await check(w.wallet_address);
    }
  }
}
run();
