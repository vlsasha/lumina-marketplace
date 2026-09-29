require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: '0.8.20',
  networks: {
    vana: {
      url: 'https://rpc.vana.org',
      chainId: 1480,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      vana: "empty" // VanaScan usually doesn't require a real API key for Blockscout
    },
    customChains: [
      {
        network: "vana",
        chainId: 1480,
        urls: {
          apiURL: "https://api.vanascan.io/api",
          browserURL: "https://vanascan.io/"
        }
      }
    ]
  },
  paths: {
    sources: './contracts',
    artifacts: './artifacts'
  }
};
