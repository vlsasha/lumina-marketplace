'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { CustomConnectButton } from '@/components/CustomConnectButton';
import { Footer } from '@/components/Footer';
import { useAccount } from 'wagmi';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

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

  // Handle mock Google/Wallet login
  const handleDirectLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    signIn('google', { callbackUrl: '/account' });
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-[85vh] flex flex-col">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
          
          {!isLoggedIn ? (
            /* Login Screen */
            <div className="max-w-md mx-auto mt-12 bg-[#111111] border border-[#222222] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-vana-primary opacity-5 blur-[100px] pointer-events-none" />
              
              <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-black border border-[#333] mx-auto flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-vana-primary">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Welcome to Lumina</h1>
                <p className="text-gray-400 text-sm">Sign in to manage your data or access purchased datasets.</p>
              </div>

              <div className="space-y-4 relative z-10">
                <button 
                  onClick={handleDirectLogin}
                  className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-3"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
                  Sign in with Google
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#333]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#111] text-gray-500">OR</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <CustomConnectButton />
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard / Workspace */
            <div className="mt-8">
              {/* Role Toggle */}
              <div className="flex justify-center mb-12">
                <div className="bg-black border border-[#333] rounded-full p-1.5 flex flex-col md:flex-row items-center gap-4 md:gap-0">
                  <div className="flex items-center">
                    <button 
                      onClick={() => setRole('provider')}
                      className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                        role === 'provider' ? 'bg-vana-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      I am a Provider
                    </button>
                    <button 
                      onClick={() => setRole('buyer')}
                      className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                        role === 'buyer' ? 'bg-[#222] text-white shadow-lg border border-[#333]' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                      I am a Buyer
                    </button>
                  </div>
                  
                  
                </div>
              </div>

              {role === 'provider' ? <ProviderWorkspace /> : <BuyerWorkspace userId={sessionObj?.data?.user?.email || address || ''} />}

            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function ProviderWorkspace() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Provider Workspace</h2>
          <p className="text-gray-400 text-sm">Manage your data sources and track your earnings.</p>
        </div>
        <a href="/dashboard" className="px-5 py-2.5 bg-vana-primary hover:bg-opacity-90 text-white font-semibold rounded-xl transition-all text-black">
          Connect More Data
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-2">Total Earnings</div>
          <div className="text-3xl font-bold text-white">$0.00 <span className="text-sm font-normal text-gray-500">USDC</span></div>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-2">Data Sold (Times)</div>
          <div className="text-3xl font-bold text-white">0</div>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-2">Active Sources</div>
          <div className="text-3xl font-bold text-white">0</div>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#222]">
          <h3 className="font-semibold text-white">Recent Sales</h3>
        </div>
        <div className="p-8 text-center text-gray-500">
          No sales yet. Connect data sources to start earning.
        </div>
      </div>
    </div>
  );
}

function BuyerWorkspace({ userId }: { userId: string }) {
  const [apiKey, setApiKey] = useState<string>('Loading...');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/account/key?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.key) setApiKey(data.key);
        else setApiKey('No key generated yet');
      });
      
    fetch(`/api/account/purchases?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setPurchases(data.purchases || []);
        setIsLoadingPurchases(false);
      });
  }, [userId]);

  const rotateKey = async () => {
    if (!userId) return;
    setIsRotating(true);
    try {
      const res = await fetch('/api/account/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.apiKey) {
        setApiKey(data.apiKey);
        setIsRevealed(true);
      }
    } finally {
      setIsRotating(false);
    }
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Buyer Workspace</h2>
          <p className="text-gray-400 text-sm">Access your purchased datasets and manage API keys.</p>
        </div>
        <a href="/pricing" className="px-5 py-2.5 bg-vana-card border border-vana-border hover:border-white text-white font-semibold rounded-xl transition-all">
          Purchase New Dataset
        </a>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Active API Key</h3>
          <div className="flex items-center gap-3">
            <code className="text-vana-primary font-mono bg-vana-primary/10 px-3 py-1.5 rounded-lg border border-vana-primary/20">
              {apiKey}
            </code>
            {apiKey !== 'Loading...' && apiKey !== 'No key generated yet' && !isRevealed && (
              <span className="text-xs text-gray-500">
                (Hidden for security. Rotate to get a new full key)
              </span>
            )}
          </div>
        </div>
        <button onClick={rotateKey} disabled={isRotating} className="px-4 py-2 bg-black border border-[#333] hover:border-vana-primary text-white text-sm rounded-xl transition-all disabled:opacity-50">
            {isRotating ? 'Rotating...' : (apiKey === 'No key generated yet' ? 'Generate Key' : 'Rotate Key')}
          </button>
      </div>

      <div className="bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#222]">
          <h3 className="font-semibold text-white">My Datasets (Purchased)</h3>
        </div>
        
        <div className="divide-y divide-[#222]">
          {isLoadingPurchases ? (
            <div className="p-8 text-center text-gray-500">Loading datasets...</div>
          ) : purchases.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">You haven't purchased any datasets yet.</div>
              <a href="/pricing" className="text-vana-primary hover:underline">Explore the Marketplace</a>
            </div>
          ) : (
            purchases.map(p => (
              <div key={p.id} className="p-6 hover:bg-[#1a1a1a] transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-white font-semibold text-lg">{p.dataset_id} Dataset</h4>
                    <p className="text-sm text-gray-400 mt-1">Purchased: {new Date(p.purchased_at).toLocaleDateString()}</p>
                    {p.transaction_hash && (
                      <a href={`https://vanascan.io/tx/${p.transaction_hash}`} target="_blank" className="text-xs text-vana-primary hover:underline mt-1 block">
                        View Tx on VanaScan
                      </a>
                    )}
                  </div>
                  <div className="shrink-0 flex gap-2">
                    <button className="px-3 py-1.5 bg-black border border-[#333] hover:border-white rounded-lg text-xs font-mono text-white transition-all flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      JSONL
                    </button>
                    <button className="px-3 py-1.5 bg-black border border-[#333] hover:border-white rounded-lg text-xs font-mono text-white transition-all flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      CSV
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-vana-green/10 text-vana-green border border-vana-green/20">Ready for Download</span>
                  {p.size_bytes && <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">Size: {(p.size_bytes / 1024 / 1024).toFixed(1)} MB</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
