const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.vana.org';
const privateKey = '0xd174cb37bdc3ac83750f2ef898ffcf854f9f94c60e851b4a3ab7f3c481de1199';
const MARKETPLACE_ADDRESS = '0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32';

const abi = [
  "function submitProofOfContribution(address provider, bytes32 datasetHash, uint256 score) external"
];

async function run() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(MARKETPLACE_ADDRESS, abi, wallet);
  
  const targetWallet = '0x8E3f4BFB720582bF7223FDB6A1a678957b38835A';
  const datasetHash = ethers.keccak256(ethers.toUtf8Bytes(targetWallet + Date.now().toString()));
  
  console.log("Submitting tx...");
  try {
    const tx = await contract.submitProofOfContribution(targetWallet, datasetHash, 10);
    console.log("Tx hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Tx mined!", receipt.status);
  } catch (err) {
    console.error("Tx failed:", err);
  }
}
run();
