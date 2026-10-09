'use client';
import toast from 'react-hot-toast';


import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CustomConnectButton } from '@/components/CustomConnectButton';
import { useAccount, useReadContract, usePublicClient } from 'wagmi';
import { luminaMarketplaceAbi } from '@/lib/abi';
import { MARKETPLACE_CONFIG } from '@/lib/config';
import { formatUnits, parseAbiItem } from 'viem';
import Link from 'next/link';

type Role = 'provider' | 'buyer';

export default function AccountPage() {
  const { address, isConnected } = useAccount();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Lazy cron: verify any pending purchases in the background
    fetch('/api/cron/verify-purchases').catch(()=>console.log('cron skip'));

    if (isConnected) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isConnected]);
  
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
              Please connect your Web3 wallet to view your personalized dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-full sm:w-auto [&>div]:w-full [&_button]:w-full [&_button]:py-3.5 [&_button]:px-6">
                <CustomConnectButton />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ProviderWorkspace({ address }: { address?: `0x${string}` }) {
  const publicClient = usePublicClient();
  const [totalClaimed, setTotalClaimed] = useState("0.00");
  const [claimsLoaded, setClaimsLoaded] = useState(false);

  useEffect(() => {
    if (!address || !publicClient) return;
    
    const fetchClaims = async () => {
      try {
        const currentBlock = await publicClient.getBlockNumber();
        const startBlock = BigInt(10395200); // Contract deploy block
        const chunk = BigInt(9900);
        const promises = [];
        
        for (let fromB = startBlock; fromB <= currentBlock; fromB += chunk) {
            let toB = fromB + chunk;
            if (toB > currentBlock) toB = currentBlock;
            
            promises.push(
                publicClient.getLogs({
                  address: MARKETPLACE_CONFIG.marketplaceAddress as `0x${string}`,
                  event: parseAbiItem('event EarningsClaimed(address indexed provider, uint256 amount)'),
                  args: { provider: address },
                  fromBlock: fromB,
                  toBlock: toB
                }).catch(e => {
                    console.warn("Chunk error (skipping)", e);
                    return [];
                })
            );
        }
        
        const chunksLogs = await Promise.all(promises);
        let sum = BigInt(0);
        
        for (const logs of chunksLogs) {
          for (const log of logs) {
            if (log.args && log.args.amount) {
              sum += log.args.amount;
            }
          }
        }
        
        setTotalClaimed(Number(formatUnits(sum, MARKETPLACE_CONFIG.paymentToken.decimals)).toFixed(2));
      } catch (err) {
        console.error("Failed to fetch claims:", err);
      } finally {
        setClaimsLoaded(true);
      }
    };
    
    fetchClaims();
  }, [address, publicClient]);

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
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">Available to Claim</div>
              <div className="text-3xl font-bold text-white">${displayBalance} <span className="text-sm font-normal text-gray-500">USDC</span></div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm mb-1">Total Claimed</div>
              <div className="text-xl font-bold text-gray-300">${claimsLoaded ? totalClaimed : "..."} <span className="text-sm font-normal text-gray-500">USDC</span></div>
            </div>
          </div>
          <div className="w-full bg-[#222] h-1.5 rounded-full mb-4 overflow-hidden">
            <div className="bg-vana-primary h-full rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-xs text-gray-500">To claim your earnings and view history, visit the main Provider Dashboard.</p>
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
        toast.error(errorData.error || 'Failed to download dataset.');
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
      toast.error('Network error downloading dataset.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch real API key
    if (address) {
      fetch(`/api/account/key?userId=${address}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) setApiKey('DB Error: ' + data.details);
            else if (data.key) setApiKey(data.key);
            else setApiKey('No active key');
          })
        .catch(() => setApiKey('Error loading key'));
    }

    // Fetch purchases
    if (address) {
      fetch(`/api/account/purchases?userId=${address}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) { toast.error('DB Error loading purchases: ' + data.details); }
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
            <div className="flex items-center gap-2">
                <code className="text-vana-primary font-mono bg-vana-primary/10 px-3 py-1.5 rounded-lg border border-vana-primary/20 break-all">
                  {apiKey}
                </code>
                {apiKey !== 'Loading...' && apiKey !== 'No active key' && !apiKey.startsWith('DB Error') && (
                  apiKey.endsWith('...') ? (
                    <span className="text-xs text-orange-400 ml-2 bg-orange-400/10 px-2 py-1 rounded">
                      Legacy key (Please click Rotate Key to get a full copyable key)
                    </span>
                  ) : (
                    <button onClick={() => {
                      navigator.clipboard.writeText(apiKey);
                      const btn = document.getElementById('copy-btn');
                      if (btn) { btn.innerText = 'Copied!'; setTimeout(() => btn.innerText = 'Copy', 2000); }
                    }} id="copy-btn" className="px-3 py-1.5 bg-vana-primary/20 text-vana-primary font-semibold rounded-lg hover:bg-vana-primary/30 transition-colors ml-2">
                      Copy
                    </button>
                  )
                )}
              </div>
          </div>
        </div>
        <button 
          onClick={async () => {
            setApiKey('Loading...');
            setIsRevealed(false);
            if (!address) return;
            try {
              const res = await fetch('/api/account/key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: address })
              });
              const data = await res.json();
              if (data.apiKey) setApiKey(data.apiKey);
            } catch (err) {
              console.error(err);
              setApiKey('Error generating key');
            }
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
{'curl -X GET "https://lumina-vana.vercel.app/api/download?datasetId=' + encodeURIComponent(downloadModal.dataset_id) + '&format=jsonl" \n  -H "Authorization: Bearer ' + (apiKey === "Loading..." || apiKey.endsWith("...") ? "YOUR_API_KEY_HERE" : apiKey) + '"'}
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



