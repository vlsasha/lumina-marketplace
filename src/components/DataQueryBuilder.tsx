'use client';

import { useState, useEffect } from 'react';
import { DATA_SOURCES, EARNINGS_RATES } from '@/lib/data-sources';
import { useAccount, useWriteContract } from 'wagmi';
import { MARKETPLACE_CONFIG } from '@/lib/config';
import { luminaMarketplaceAbi } from '@/lib/abi';
import { parseUnits } from 'viem';

const erc20Abi = [{type: 'function', name: 'approve', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }], stateMutability: 'nonpayable'}] as const;

export function DataQueryBuilder() {
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);
  
  const [validProviders, setValidProviders] = useState<`0x${string}`[]>([]);
  const [totalUsersAvailable, setTotalUsersAvailable] = useState(0);
  const [sourceCounts, setSourceCounts] = useState<Record<string, number>>({});


  
  const [volume, setVolume] = useState<number>(1);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState('Any');
  const [region, setRegion] = useState('Global');

  useEffect(() => {
    const query = selectedSources.length > 0 ? `?sources=${selectedSources.join(',')}` : '';
    fetch(`/api/providers${query}`)
      .then(res => res.json())
      .then(data => {
        setValidProviders(data.providers);
        setTotalUsersAvailable(data.count); 
      })
      .catch(console.error);
  }, [selectedSources]);

  // Fetch individual source counts
  useEffect(() => {
    fetch('/api/inventory/sources')
      .then(res => res.json())
      .then(data => setSourceCounts(data.counts || {}))
      .catch(console.error);
  }, []);

  

  const handleSourceToggle = (id: string) => {
    setSelectedSources(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const costPerUser = selectedSources.reduce((sum, id) => {
    const rate = EARNINGS_RATES.find(r => r.id === id);
    return sum + (rate ? rate.price : 0);
  }, 0);
  const totalCost = costPerUser * volume;

  // Real inventory from database
  const availableInventory = totalUsersAvailable;

  // Ensure volume doesn't exceed inventory
  useEffect(() => {
    if (volume > availableInventory) {
      setVolume(Math.max(1, availableInventory));
    }
  }, [availableInventory, volume]);

  const handlePurchase = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }
    if (selectedSources.length === 0) {
      alert('Please select at least one data source to acquire.');
      return;
    }
    try {
      setIsPending(true);
      
      // Fetch valid providers from our new backend API
      const query = selectedSources.length > 0 ? `?sources=${selectedSources.join(',')}` : '';
      const response = await fetch(`/api/providers${query}`);
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
            {/* Audience Filters */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Target Audience</h3>
              
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Age Range</label>
                <select 
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full bg-black border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vana-primary transition-colors appearance-none"
                >
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="30-40">30-40</option>
                  <option value="35-44">35-44</option>
                  <option value="45+">45+</option>
                  <option value="Any">Any Age</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Region</label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-black border border-[#333] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vana-primary transition-colors appearance-none"
                >
                  <option value="Global">Global</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                </select>
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
                  <span className="text-xs text-gray-500">Number of Users to Acquire</span>
                  <span className="text-2xl font-bold text-white">{volume.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max={Math.max(1, availableInventory)} 
                  step="1"
                  value={volume} 
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-vana-primary"
                />
                <div className="flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
                  <span>1</span>
                  <span>{availableInventory.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sources Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Required Data Sources</h3>
              <span className="text-xs text-gray-500">{selectedSources.length} selected</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DATA_SOURCES.map(source => {
                const rate = EARNINGS_RATES.find(r => r.id === source.id);
                const price = rate ? rate.price : 0;
                const isSelected = selectedSources.includes(source.id);
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
                        <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded text-[9px] font-mono text-gray-500">
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
          <div className="bg-black border border-[#333] rounded-3xl p-8 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-6 border-b border-[#222] pb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Target Audience</span>
                <span className="text-white font-medium">{ageRange} yrs • {region}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Selected Sources</span>
                <span className="text-white font-medium">{selectedSources.length} sources</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Users Volume</span>
                <span className="text-white font-medium">{volume.toLocaleString()} users</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-[#222] pt-4">
                <span className="text-gray-400">Cost per User</span>
                <span className="text-white font-mono">${costPerUser.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-8 bg-vana-primary/5 rounded-xl p-4 border border-vana-primary/10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-vana-primary">Total Cost</span>
                <div className="text-right">
                  <div className="text-3xl font-black text-white leading-none mb-1">${totalCost.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 font-mono">USDC.e</div>
                </div>
              </div>
            </div>

            <button 
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
