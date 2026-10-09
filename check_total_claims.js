const { ethers } = require('ethers');
const RPC_URL = 'https://rpc.vana.org';
const abi = ['event EarningsClaimed(address indexed provider, uint256 amount)'];
async function run() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract('0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32', abi, provider);
  const current = await provider.getBlockNumber();
  
  let w1 = 0n;
  let w2 = 0n;
  
  const chunks = 5;
  for(let i=0; i<chunks; i++) {
    const to = current - (i * 9000);
    const from = Math.max(0, to - 9000);
    const logs = await provider.getLogs({
      address: contract.target,
      topics: [contract.interface.getEvent('EarningsClaimed').topicHash],
      fromBlock: from,
      toBlock: to
    }).catch(e => []);
    
    logs.forEach(l => {
      const parsed = contract.interface.parseLog(l);
      if (parsed.args[0] === '0xC1d3007A33d86Fd7390B087304AD3083FC87438C') w1 += parsed.args[1];
      if (parsed.args[0] === '0x8E3f4BFB720582bF7223FDB6A1a678957b38835A') w2 += parsed.args[1];
    });
  }
  
  console.log('Wallet 1 claimed:', ethers.formatUnits(w1, 6));
  console.log('Wallet 2 claimed:', ethers.formatUnits(w2, 6));
}
run();
