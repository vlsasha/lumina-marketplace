'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import { mainnet } from 'wagmi/chains';
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  trustWallet,
  coinbaseWallet,
  ledgerWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';

const vana = {
  id: 1480,
  name: 'Vana',
  iconUrl: 'https://avatars.githubusercontent.com/u/123112561?v=4',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Vana', symbol: 'VANA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.vana.org'] },
    public: { http: ['https://rpc.vana.org'] },
  },
  blockExplorers: {
    default: { name: 'VanaScan', url: 'https://vanascan.io' },
  },
} as const;

const config = getDefaultConfig({
  appName: 'Lumina',
  projectId: 'd19afc9e0d9b4b0e8c89dc339c9f6920', // Public demo project ID
  chains: [vana, mainnet],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
        trustWallet,
        coinbaseWallet,
        ledgerWallet,
        injectedWallet,
      ],
    },
  ],
  ssr: true,
});

const queryClient = new QueryClient();

const CustomAvatar = ({ address, ensImage, size }: any) => {
  return ensImage ? (
    <img src={ensImage} width={size} height={size} style={{ borderRadius: 999 }} alt="Avatar" />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: 'linear-gradient(45deg, #CDFF64, #9DFF00)',
        boxShadow: '0 0 10px rgba(205,255,100,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        style={{ width: size * 0.55, height: size * 0.55, color: '#000' }}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale="en-US"
          initialChain={vana}
          modalSize="compact"
          avatar={CustomAvatar}
          theme={darkTheme({
            accentColor: '#CDFF64', // Vana Green
            accentColorForeground: '#000000',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
