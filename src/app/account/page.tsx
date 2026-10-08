'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAccount, useReadContract } from 'wagmi';
import { useSession, signIn } from 'next-auth/react';
import { luminaMarketplaceAbi } from '@/lib/abi';
import { MARKETPLACE_CONFIG } from '@/lib/config';
import { formatUnits } from 'viem';
import Link from 'next/link';

type Role = 'provider' | 'buyer';

export default function AccountPage() {
  const { address, isConnected } = useAccount();
  const sessionObj = useSession();
  const status = sessionObj?.status;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' || isConnected) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [status, isConnected]);
  
  const [role, setRole] = useState<Role>('provider');

  return (
    <div className="min-h-screen bg-vana-dark text-white flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        {/* Toggle Role */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#111111] p-1 rounded-full border border-[#333333] flex items-center">
            <button
              onClick={() => setRole('provider')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                role === 'provider' 
                  ? 'bg-vana-primary text-black shadow-lg shadow-vana-primary/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              I am a Provider
            </button>
            <button
              onClick={() => setRole('buyer')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                role === 'buyer' 
                  ? 'bg-white text-black shadow-lg shadow-white/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              I am a Buyer
            </button>
          </div>
        </div>

        {isLoggedIn ? (
          <div className="max-w-4xl mx-auto">
            {role === 'provider' ? <ProviderWorkspace address={address} /> : <BuyerWorkspace address={address} />}
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-20 bg-[#111111] border border-[#222222] rounded-3xl">
            <div className="w-16 h-16 bg-vana-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-vana-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Connect to Access Workspace</h2>
                        <p className="text-gray-400 mb-8 px-6">
              Please connect your Vana wallet or sign in with an external provider to view your personalized dashboard.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => signIn('google', { callbackUrl: '/account' })}
                className="flex items-center justify-center gap-3 bg-white text-black font-semibold py-3.5 px-6 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ProviderWorkspace({ address }: { address?: `0x${string}` }) {
  const { data: balanceData } = useReadContract({
    address: MARKETPLACE_CONFIG.marketplaceAddress as `0x${string}`,
    abi: luminaMarketplaceAbi,
    functionName: 'providerBalances',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const displayBalance = balanceData 
    ? Number(formatUnits(balanceData as bigint, MARKETPLACE_CONFIG.paymentToken.decimals)).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Provider Workspace</h2>
          <p className="text-gray-400 text-sm">Manage your data sources and track your earnings.</p>
        </div>
        <Link href="/dashboard" className="px-5 py-2.5 bg-vana-primary hover:bg-opacity-90 text-black font-semibold rounded-xl transition-all">
          Go to Provider Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-2">Available to Claim (USDC.e)</div>
          <div className="text-3xl font-bold text-white">${displayBalance} <span className="text-sm font-normal text-gray-500">USDC</span></div>
          <p className="text-xs text-gray-500 mt-2">To claim your earnings, visit the main Provider Dashboard.</p>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-2">Detailed Analytics</div>
          <p className="text-gray-300 text-sm mb-4">View your active sources, data points, and PoC multiplier on your main dashboard.</p>
          <Link href="/dashboard" className="text-vana-primary hover:underline text-sm font-semibold">View Analytics →</Link>
        </div>
      </div>
    </div>
  );
}

function BuyerWorkspace({ address }: { address?: `0x${string}` }) {
  const [apiKey, setApiKey] = useState('Loading...');
  const [isRevealed, setIsRevealed] = useState(false);
  const [purchases, setPurchases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  const [downloadModal, setDownloadModal] = useState<any>(null);

  const handleDownload = async (format: string, datasetId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/download?datasetId=${encodeURIComponent(datasetId)}&format=${format}&buyerId=${address}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'Failed to download dataset.');
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${datasetId.toLowerCase().replace(/\s/g, '_')}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Network error downloading dataset.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch mock API key
    setTimeout(() => {
      setApiKey('db_live_' + Math.random().toString(36).substring(2, 10));
    }, 1000);

    // Fetch purchases
    if (address) {
      fetch(`/api/account/purchases?userId=${address}`)
        .then(res => res.json())
        .then(data => {
          if (data.purchases) setPurchases(data.purchases);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [address]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Buyer Workspace</h2>
          <p className="text-gray-400 text-sm">Access your purchased datasets and manage API keys.</p>
        </div>
        <Link href="/pricing" className="px-5 py-2.5 bg-vana-card border border-vana-border hover:border-white text-white font-semibold rounded-xl transition-all">
          Purchase New Dataset
        </Link>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Active API Key</h3>
          <div className="flex items-center gap-3">
            <code className="text-vana-primary font-mono bg-vana-primary/10 px-3 py-1.5 rounded-lg border border-vana-primary/20 break-all">
              {isRevealed ? apiKey : apiKey.substring(0, 12) + '••••••••••••'}
            </code>
            {!isRevealed && apiKey !== 'Loading...' && (
              <button onClick={() => setIsRevealed(true)} className="text-xs text-gray-400 hover:text-white underline">Reveal</button>
            )}
          </div>
        </div>
        <button 
          onClick={() => {
            setApiKey('Loading...');
            setIsRevealed(false);
            setTimeout(() => setApiKey('db_live_' + Math.random().toString(36).substring(2, 10)), 800);
          }}
          className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          Rotate Key
        </button>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden">
        <h3 className="text-white font-bold mb-0 p-6 border-b border-[#222]">My Datasets (Purchased)</h3>
        
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading datasets...</div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-400 mb-4">You haven't purchased any datasets yet.</p>
            <Link href="/pricing" className="text-vana-primary hover:underline">
              Explore the Marketplace
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1A1A1A] text-gray-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Dataset</th>
                  <th className="px-6 py-3 font-medium">Format</th>
                  <th className="px-6 py-3 font-medium">Date Purchased</th>
                  <th className="px-6 py-3 font-medium">Transaction</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {purchases.map((p, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{p.dataset_id}</td>
                    <td className="px-6 py-4">
                      <span className="bg-[#222] text-xs px-2 py-1 rounded text-gray-300">{p.format}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(p.purchased_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={`https://vanascan.io/tx/${p.transaction_hash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-vana-primary hover:underline font-mono text-xs"
                      >
                        {p.transaction_hash.substring(0, 8)}...{p.transaction_hash.substring(p.transaction_hash.length - 6)}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setDownloadModal(p)}
                        className="text-white bg-vana-green/20 text-vana-green hover:bg-vana-green/30 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                      >
                        Download / Connect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      
      {downloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-lg p-8 relative">
            <button 
              onClick={() => setDownloadModal(null)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Access Dataset</h3>
            <p className="text-gray-400 text-sm mb-6">Choose how you want to access your purchased "{downloadModal.dataset_id}" data.</p>
            
            <div className="space-y-4">
              <div className="p-4 border border-[#333] rounded-xl flex items-center justify-between hover:border-vana-primary transition-colors">
                <div>
                  <h4 className="text-white font-semibold mb-1">JSONL Download</h4>
                  <p className="text-xs text-gray-500">Download data in JSON Lines format.</p>
                </div>
                <button onClick={() => handleDownload('JSONL', downloadModal.dataset_id)} className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm font-semibold rounded-lg">Download</button>
              </div>

              <div className="p-4 border border-[#333] rounded-xl flex items-center justify-between hover:border-vana-primary transition-colors">
                <div>
                  <h4 className="text-white font-semibold mb-1">CSV Download</h4>
                  <p className="text-xs text-gray-500">Download data as a comma-separated values file.</p>
                </div>
                <button onClick={() => handleDownload('CSV', downloadModal.dataset_id)} className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm font-semibold rounded-lg">Download</button>
              </div>

              <div className="p-4 border border-[#333] rounded-xl hover:border-vana-primary transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold mb-1">REST API</h4>
                    <p className="text-xs text-gray-500">Connect programmatically via API.</p>
                  </div>
                </div>
                <div className="bg-black border border-[#222] rounded p-3 overflow-x-auto">
                  <code className="text-xs text-vana-primary font-mono whitespace-pre">
{'curl -X GET "https://api.lumina.vana/v1/datasets/' + downloadModal.dataset_id + '" \\n  -H "Authorization: Bearer ' + (apiKey === "Loading..." ? "YOUR_API_KEY" : apiKey) + '"'}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

