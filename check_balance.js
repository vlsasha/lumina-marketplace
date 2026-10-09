const { ethers } = require('ethers');

const RPC_URL = 'https://rpc.vana.org';
const privateKey = '0xd174cb37bdc3ac83750f2ef898ffcf854f9f94c60e851b4a3ab7f3c481de1199';

async function check() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  const balance = await provider.getBalance(wallet.address);
  console.log("Wallet address:", wallet.address);
  console.log("VANA Balance:", ethers.formatEther(balance));
}

check();
