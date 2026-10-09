const { ethers } = require('ethers');
const RPC_URL = 'https://rpc.vana.org';
const MARKETPLACE_ADDRESS = '0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32';
const abi = [
  "event EarningsClaimed(address indexed provider, uint256 amount)"
];
async function run() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(MARKETPLACE_ADDRESS, abi, provider);
  const logs = await contract.queryFilter('EarningsClaimed', 0, 'latest');
  console.log('Claim events:', logs.length);
  logs.forEach(l => {
    console.log(l.args[0], ethers.formatUnits(l.args[1], 6));
  });
}
run();
