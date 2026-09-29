'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWalletClient } from 'wagmi';
import { formatUnits } from 'viem';
import { MARKETPLACE_CONFIG } from '@/lib/config';



const erc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

export function CustomConnectButton() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Fetch USDC.e balance
  const { data: usdcBalance } = useReadContract({
    address: MARKETPLACE_CONFIG.paymentToken.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000, // refresh every 10s
    }
  });

  const formattedUsdc = usdcBalance !== undefined 
    ? parseFloat(formatUnits(usdcBalance, MARKETPLACE_CONFIG.paymentToken.decimals)).toFixed(2) 
    : '0.00';

  // Function to add USDC to MetaMask
  const addTokenToWallet = async () => {
    if (!walletClient) return;
    try {
      await walletClient.watchAsset({
        type: 'ERC20',
        options: {
          address: MARKETPLACE_CONFIG.paymentToken.address,
          symbol: 'USDC.e',
          decimals: MARKETPLACE_CONFIG.paymentToken.decimals,
          image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', // Fallback generic USDC logo
        },
      });
    } catch (error) {
      console.error('Error adding token to wallet', error);
    }
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className="bg-vana-primary hover:bg-vana-primary-light text-black font-bold py-2 px-5 rounded-xl transition-all shadow-[0_0_15px_rgba(205,255,100,0.3)] hover:shadow-[0_0_25px_rgba(205,255,100,0.5)] transform hover:scale-105 active:scale-95">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-lg shadow-red-500/20">
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  
                  {/* Add USDC to MetaMask Button */}
                  <button
                    onClick={addTokenToWallet}
                    className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-vana-card border border-vana-border hover:border-vana-primary hover:text-vana-primary transition-all text-vana-text-secondary"
                    title="Add USDC.e to MetaMask"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>

                  <div className="flex items-center bg-black border border-[#333] rounded-xl overflow-hidden shadow-sm">
                    {/* USDC Balance Section */}
                    <div className="hidden sm:flex items-center px-3 py-2 bg-[#111] border-r border-[#333] gap-1.5">
                      <img 
                        src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=032" 
                        alt="USDC" 
                        className="w-4 h-4 object-contain" 
                      />
                      <span className="text-white font-mono text-sm">{formattedUsdc}</span>
                      <span className="text-gray-500 text-xs ml-0.5">USDC.e</span>
                    </div>

                    {/* Account Section */}
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="flex items-center gap-2 px-3 py-2 hover:bg-vana-primary/10 transition-colors group"
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-vana-primary to-vana-primary-light shadow-[0_0_10px_rgba(205,255,100,0.4)] group-hover:shadow-[0_0_15px_rgba(205,255,100,0.6)] transition-all">
                        <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <span className="text-white font-mono text-sm group-hover:text-vana-primary transition-colors">{account.displayName}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-500 group-hover:text-vana-primary transition-colors">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
