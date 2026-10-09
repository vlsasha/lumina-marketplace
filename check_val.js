const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.vana.org';
const privateKey = '0xd174cb37bdc3ac83750f2ef898ffcf854f9f94c60e851b4a3ab7f3c481de1199';
const MARKETPLACE_ADDRESS = '0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32';

const abi = [
  "function isValidator(address) view returns (bool)",
  "function owner() view returns (address)"
];

async function check() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(MARKETPLACE_ADDRESS, abi, provider);
  
  const isVal = await contract.isValidator(wallet.address);
  const owner = await contract.owner();
  
  console.log("Is Validator:", isVal);
  console.log("Is Owner:", owner.toLowerCase() === wallet.address.toLowerCase());
  console.log("Owner Address:", owner);
  console.log("Wallet Address:", wallet.address);
}

check();
