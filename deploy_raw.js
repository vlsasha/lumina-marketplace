require('dotenv').config();
const fs = require('fs');
const solc = require('solc');
const { ethers } = require('ethers');

async function main() {
  console.log('Compiling contract...');
  const source = fs.readFileSync('contracts/LuminaMarketplace.sol', 'utf8');
  const input = {
    language: 'Solidity',
    sources: { 'LuminaMarketplace.sol': { content: source } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts['LuminaMarketplace.sol']['LuminaMarketplace'];
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;

  console.log('Connecting to network...');
  const provider = new ethers.JsonRpcProvider('https://rpc.vana.org');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log('Deploying from:', wallet.address);
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  
  const usdcTokenAddress = '0xF1815bd50389c46847f0Bda824eC8da914045D14';
  const treasuryAddress = '0xC1d3007A33d86Fd7390B087304AD3083FC87438C';

  const marketplace = await factory.deploy(usdcTokenAddress, treasuryAddress);
  console.log('Transaction hash:', marketplace.deploymentTransaction().hash);
  
  await marketplace.waitForDeployment();
  const address = await marketplace.getAddress();
  console.log('LuminaMarketplace deployed to:', address);
}
main().catch(console.error);
