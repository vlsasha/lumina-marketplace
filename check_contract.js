const { createPublicClient, http } = require('viem');

const vana = {
  id: 1480,
  name: 'Vana',
  network: 'vana',
  nativeCurrency: { name: 'Vana', symbol: 'VANA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.vana.org'] },
    public: { http: ['https://rpc.vana.org'] },
  },
};

const client = createPublicClient({
  chain: vana,
  transport: http()
});

const abi = [
  {
    "inputs": [{ "internalType": "address", "name": "provider", "type": "address" }],
    "name": "providerPoCScores",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

async function main() {
  const address = '0xC1d3007A33d86Fd7390B087304AD3083FC87438C';
  const marketplace = '0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32';
  try {
    const score = await client.readContract({
      address: marketplace,
      abi: abi,
      functionName: 'providerPoCScores',
      args: [address]
    });
    console.log('PoC Score for', address, 'is:', score);
  } catch(e) {
    console.log('Failed to read contract', e);
  }
}
main();
