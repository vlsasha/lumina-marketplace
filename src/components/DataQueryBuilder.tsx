'use client';

import { useState, useEffect } from 'react';
import { DATA_SOURCES, EARNINGS_RATES } from '@/lib/data-sources';
import { useAccount, useWriteContract } from 'wagmi';
import { useSession } from 'next-auth/react';
import { MARKETPLACE_CONFIG } from '@/lib/config';
import { luminaMarketplaceAbi } from '@/lib/abi';
import { parseUnits } from 'viem';

const erc20Abi = [{type: 'function', name: 'approve', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }], stateMutability: 'nonpayable'}] as const;

export function DataQueryBuilder() {
  const { address, isConnected } = useAccount();
  const sessionObj = useSession();
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);
  
  const [validProviders, setValidProviders] = useState<`0x${string}`[]>([]);
  const [totalUsersAvailable, setTotalUsersAvailable] = useState(0);
  const [sourceCounts, setSourceCounts] = useState<Record<string, number>>({});


  
  const [volume, setVolume] = useState<number>(0);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState('Any');

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (selectedSource) queryParams.append('sources', selectedSource);
    if (selectedTier !== 'Any') queryParams.append('tier', selectedTier);
    
    fetch(`/api/providers?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        setValidProviders(data.providers);
        setTotalUsersAvailable(data.count); 
      })
      .catch(console.error);
  }, [selectedSource, selectedTier]);

  // Fetch individual source counts
  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (selectedTier !== 'Any') queryParams.append('tier', selectedTier);
    
    fetch(`/api/inventory/sources?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => setSourceCounts(data.counts || {}))
      .catch(console.error);
  }, [selectedTier]);

  

  const handleSourceToggle = (id: string) => {
    setSelectedSource(prev => prev === id ? null : id);
  };

  const basePrice = selectedSource ? (EARNINGS_RATES.find(r => r.id === selectedSource)?.price || 0) : 0;
  
  const getTierMultiplier = (tier: string) => {
    if (tier === 'A') return 1.0; // Premium (100% of max price)
    if (tier === 'B') return 0.5; // High (50% of max price)
    if (tier === 'C') return 0.2; // Standard (20% of max price)
    if (tier === 'D') return 0.05; // Basic (5% of max price)
    return 0.5; // Any (Blended average)
  };
  
  const tierMultiplier = getTierMultiplier(selectedTier);
  const costPerDataset = basePrice * tierMultiplier;
  const totalCost = costPerDataset * volume;

  // Real inventory from database
  const availableInventory = totalUsersAvailable;

  // Ensure volume doesn't exceed inventory
  useEffect(() => {
    if (volume > availableInventory) {
      setVolume(Math.max(0, availableInventory));
    }
  }, [availableInventory, volume]);

  const handlePurchase = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }
    if (!selectedSource) {
      alert('Please select a data source to acquire.');
      return;
    }
    try {
      setIsPending(true);
      
      // Fetch valid providers from our new backend API
      const queryParams = new URLSearchParams();
      if (selectedSource) queryParams.append('sources', selectedSource);
      if (selectedTier !== 'Any') queryParams.append('tier', selectedTier);
      const response = await fetch(`/api/providers?${queryParams.toString()}`);
      const data = await response.json();
      const validProviders = data.providers as `0x${string}`[];

      const totalAmountParsed = parseUnits(totalCost.toFixed(6), MARKETPLACE_CONFIG.paymentToken.decimals);
      const amountPerProvider = parseUnits((totalCost / validProviders.length).toFixed(6), MARKETPLACE_CONFIG.paymentToken.decimals);
      const amountsArray = Array(validProviders.length).fill(amountPerProvider);
      await writeContractAsync({
        address: MARKETPLACE_CONFIG.paymentToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [MARKETPLACE_CONFIG.marketplaceAddress as `0x${string}`, totalAmountParsed],
      });
      await writeContractAsync({
        address: MARKETPLACE_CONFIG.marketplaceAddress as `0x${string}`,
        abi: luminaMarketplaceAbi,
        functionName: 'buyData',
        args: [validProviders, amountsArray],
      });
      alert('Dataset purchased successfully!');
    } catch (err) {
      console.error(err);
      alert('Payment failed.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden max-w-6xl mx-auto">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vana-primary opacity-5 blur-[128px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Left Col: Query Builder */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Build Your Dataset</h2>
            <p className="text-gray-400 text-sm">Select audience filters and data sources to calculate real-time pricing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Quality Tier Filter */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Data Quality Tier</h3>
              
              <div className="space-y-2">
                {[
                  { id: 'Any', name: 'All Data', desc: 'No filters', icon: '🌐', activeClass: 'border-vana-primary bg-vana-primary/10 text-white' },
                  { id: 'A', name: 'Tier A', desc: 'Premium (>80 pts)', icon: '💎', activeClass: 'border-yellow-400 bg-yellow-400/10 text-yellow-400' },
                  { id: 'B', name: 'Tier B', desc: 'High (50-79 pts)', icon: '✨', activeClass: 'border-purple-400 bg-purple-400/10 text-purple-400' },
                  { id: 'C', name: 'Tier C', desc: 'Standard (20-49 pts)', icon: '⚡', activeClass: 'border-blue-400 bg-blue-400/10 text-blue-400' },
                  { id: 'D', name: 'Tier D', desc: 'Basic (<20 pts)', icon: '🔰', activeClass: 'border-gray-400 bg-gray-500/10 text-gray-200' }
                ].map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      selectedTier === tier.id 
                        ? tier.activeClass
                        : 'border-[#333] bg-black/50 text-gray-400 hover:border-[#555] hover:bg-black'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{tier.icon}</span>
                      <div>
                        <div className={`text-sm font-bold ${selectedTier === tier.id ? '' : 'text-gray-300'}`}>{tier.name}</div>
                        <div className="text-xs opacity-70 font-mono">{tier.desc}</div>
                      </div>
                    </div>
                    {selectedTier === tier.id && (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Volume</h3>
                <div className="flex items-center gap-2 bg-vana-primary/10 border border-vana-primary/20 px-2 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-vana-primary status-pulse" />
                  <span className="text-xs text-vana-primary font-mono font-bold">{availableInventory.toLocaleString()} Datasets Available</span>
                </div>
              </div>
              
              <div className="bg-black border border-[#333] rounded-xl p-5">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs text-gray-500">Datasets to Acquire</span>
                  <input
                    type="number"
                    min="0"
                    max={Math.max(0, availableInventory)}
                    value={volume}
                    onChange={(e) => {
                      let val = parseInt(e.target.value) || 0;
                      if (val > availableInventory) val = availableInventory;
                      if (val < 0) val = 0;
                      setVolume(val);
                    }}
                    className="w-28 bg-black/50 border border-[#333] hover:border-[#555] rounded-xl px-3 py-1.5 text-right text-xl font-bold text-white focus:outline-none focus:border-vana-primary transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] appearance-none"
                  />
                </div>
                <input 
                  key={`slider-${availableInventory}`}
                  type="range" 
                  min="0" 
                  max={Math.max(0, availableInventory)} 
                  step="1"
                  value={volume} 
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-vana-primary"
                  disabled={availableInventory === 0}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono font-medium">
                  <span>0</span>
                  <span>{availableInventory.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sources Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Required Data Source</h3>
              <span className="text-xs text-gray-500">{selectedSource ? '1 selected' : '0 selected'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DATA_SOURCES.map(source => {
                const rate = EARNINGS_RATES.find(r => r.id === source.id);
                const price = rate ? rate.price : 0;
                const isSelected = selectedSource === source.id;
                return (
                  <button
                    key={source.id}
                    onClick={() => handleSourceToggle(source.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      isSelected 
                        ? 'bg-vana-primary/10 border-vana-primary/50 shadow-sm shadow-vana-primary/20' 
                        : 'bg-black/50 border-[#222] hover:border-[#444]'
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-white flex items-center justify-center p-1 shrink-0">
                      <img src={source.icon} alt={source.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <div className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                          {source.name}
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-white">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" fillRule="evenodd" /></svg>
                          {sourceCounts[source.id] || 0}
                        </div>
                      </div>
                      <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-vana-primary' : 'text-gray-500'}`}>
                        +${price.toFixed(2)}
                      </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full border shrink-0 flex items-center justify-center ${
                      isSelected ? 'border-vana-primary bg-vana-primary' : 'border-gray-700'
                    }`}>
                      {isSelected && <svg viewBox="0 0 14 14" fill="none" className="w-2 h-2 text-black"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Checkout */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="bg-black border border-[#333] rounded-3xl p-8 sticky top-24 shadow-2xl">
              <div className="flex items-center gap-4 mb-8 border-b border-[#222] pb-6">
                <div className="w-10 h-10 rounded-xl bg-vana-primary/10 flex items-center justify-center text-vana-primary border border-vana-primary/20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Order Summary</h3>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Transparent Pricing</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] text-gray-400 text-xs font-bold flex items-center justify-center group-hover:border-vana-primary group-hover:text-vana-primary transition-colors">1</div>
                    <div className="w-px h-full bg-[#222] my-1 group-hover:bg-vana-primary/30 transition-colors" />
                  </div>
                  <div className="pb-2 w-full">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-semibold text-white">Base Price</h4>
                      <span className="text-white font-mono font-bold">${basePrice.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">Standard value for {selectedSource ? DATA_SOURCES.find(s=>s.id===selectedSource)?.name : 'selected data'} (Premium Tier).</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] text-gray-400 text-xs font-bold flex items-center justify-center group-hover:border-vana-primary group-hover:text-vana-primary transition-colors">2</div>
                    <div className="w-px h-full bg-[#222] my-1 group-hover:bg-vana-primary/30 transition-colors" />
                  </div>
                  <div className="pb-2 w-full">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-semibold text-white">Quality Multiplier</h4>
                      <span className={`font-mono font-bold ${tierMultiplier === 1.0 ? 'text-vana-green' : 'text-vana-primary'}`}>
                        x{tierMultiplier.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">Adjusted based on <span className="text-white">{selectedTier === 'Any' ? 'All Data' : 'Tier ' + selectedTier}</span> selection. Cost per dataset becomes <strong className="text-gray-300 font-mono">${costPerDataset.toFixed(2)}</strong>.</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] text-gray-400 text-xs font-bold flex items-center justify-center group-hover:border-vana-primary group-hover:text-vana-primary transition-colors">3</div>
                  </div>
                  <div className="pb-0 w-full">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-semibold text-white">Datasets Volume</h4>
                      <span className="text-white font-mono font-bold">x {volume.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">Total requested unique profiles.</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8 bg-vana-primary/5 rounded-xl p-5 border border-vana-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-vana-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <span className="text-sm font-bold text-vana-primary uppercase tracking-wider block mb-1">Total Cost</span>
                    <span className="text-[11px] text-vana-primary/70">80% goes directly to users</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-white leading-none mb-1">${totalCost.toFixed(2)}</div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">USDC.e</div>
                  </div>
                </div>
              </div><button 
              onClick={handlePurchase}
              disabled={isPending || totalCost === 0}
              className="w-full py-4 px-4 bg-vana-primary hover:bg-opacity-90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-vana-primary/25 hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Purchase Dataset
                </>
              )}
            </button>
            
            <div className="mt-6 flex items-start gap-3">
              <svg className="w-5 h-5 text-vana-green shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-gray-500 leading-relaxed">
                Payments are securely processed via the Lumina Smart Contract and routed directly to the users providing data.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
