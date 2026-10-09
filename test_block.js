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
  const block = await client.getBlockNumber();
  console.log('Current block:', block);
}
run();
