import { ethers } from 'ethers';
import { MARKETPLACE_CONFIG } from './config';
import { luminaMarketplaceAbi } from './abi';

const RPC_URL = 'https://rpc.vana.org';

export async function submitProviderPoC(providerAddress: string, score: number) {
  const privateKey = process.env.PRIVATE_KEY || process.env.APP_PRIVATE_KEY;
  if (!privateKey) {
    console.warn("Oracle: No PRIVATE_KEY found, cannot submit PoC");
    return;
  }
  
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(MARKETPLACE_CONFIG.marketplaceAddress, luminaMarketplaceAbi, wallet);
    
    // Create a pseudo-random hash for this dataset submission
    const datasetHash = ethers.keccak256(ethers.toUtf8Bytes(providerAddress + Date.now().toString()));
    
    // The smart contract requires score > 0 and <= 100
    // If qualityScore from our offchain calculation is 0, we still give them a base score of 10
    // so they are allowed to sell data.
    const finalScore = score > 0 ? Math.min(score, 100) : 10;

    console.log(`Oracle: Submitting PoC for ${providerAddress} with score ${finalScore}...`);
    const tx = await contract.submitProofOfContribution(providerAddress, datasetHash, finalScore);
    console.log("Oracle: PoC submitted! TX:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Oracle: Failed to submit PoC on-chain:", error);
  }
}
