const { createPublicClient, http, parseAbiItem } = require('viem');
const { mainnet } = require('viem/chains');

const vana = {
  id: 1480,
  name: 'Vana Mainnet',
  network: 'vana',
  nativeCurrency: { decimals: 18, name: 'VANA', symbol: 'VANA' },
  rpcUrls: { default: { http: ['https://rpc.vana.org'] } }
};

const client = createPublicClient({
  chain: vana,
  transport: http()
});

async function run() {
  try {
    const logs = await client.getLogs({
      address: '0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32',
      event: parseAbiItem('event EarningsClaimed(address indexed provider, uint256 amount)'),
      fromBlock: 'earliest',
      toBlock: 'latest'
    });
    console.log('Logs count:', logs.length);
    console.dir(logs, {depth: null});
  } catch(e) {
    console.error('Error fetching logs:', e.message);
  }
}
run();
