require('dotenv').config();
const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider('https://rpc.vana.org');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = [
    "function submitProofOfContribution(address provider, bytes32 datasetHash, uint256 score) external"
  ];
  const contract = new ethers.Contract('0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32', abi, wallet);

  const targetProvider = '0xC1d3007A33d86Fd7390B087304AD3083FC87438C'; // User's treasury wallet
  const datasetHash = ethers.id('genesis_dataset_001'); // Random hash for the first dataset

  console.log('Submitting PoC for:', targetProvider);
  const tx = await contract.submitProofOfContribution(targetProvider, datasetHash, 100);
  console.log('Tx hash:', tx.hash);
  await tx.wait();
  console.log('PoC Submitted!');
}
main().catch(console.error);
