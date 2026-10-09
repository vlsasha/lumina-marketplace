const { createPublicClient, http, parseAbiItem } = require('viem');

const vana = {
  id: 1480,
  name: 'Vana',
  network: 'vana',
  nativeCurrency: { name: 'Vana', symbol: 'VANA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.vana.org'] },
  },
};

const client = createPublicClient({
  chain: vana,
  transport: http()
});

async function main() {
  const marketplace = '0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32';
  const user = '0xC1d3007A33d86Fd7390B087304AD3083FC87438C';

  try {
    const currentBlock = await client.getBlockNumber();
    const fromBlock = currentBlock - 9000n;

    const logs = await client.getLogs({
      address: marketplace,
      event: parseAbiItem('event DataPurchased(address indexed buyer, uint256 totalAmount, uint256 totalDataProviders)'),
      args: {
        buyer: user
      },
      fromBlock: fromBlock,
      toBlock: 'latest'
    });
    
    console.log('--- DataPurchased Events ---');
    logs.forEach(l => {
      console.log(`TxHash: ${l.transactionHash}`);
      console.log(`Amount: ${l.args.totalAmount} (Raw)`);
    });

    const claimLogs = await client.getLogs({
      address: marketplace,
      event: parseAbiItem('event EarningsClaimed(address indexed provider, uint256 amount)'),
      args: {
        provider: user
      },
      fromBlock: fromBlock,
      toBlock: 'latest'
    });

    console.log('\n--- EarningsClaimed Events ---');
    claimLogs.forEach(l => {
      console.log(`TxHash: ${l.transactionHash}`);
      console.log(`Amount: ${l.args.amount} (Raw)`);
    });

  } catch(e) {
    console.log('Error', e);
  }
}
main();
