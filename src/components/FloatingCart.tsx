'use client';

import { useState } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { luminaMarketplaceAbi } from '@/lib/abi';
import { MARKETPLACE_CONFIG } from '@/lib/config';
import toast from 'react-hot-toast';

export function FloatingCart() {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  if (items.length === 0) return null;

  const handleCheckout = async () => {
    if (!address) {
      toast.error('Please connect your wallet to checkout');
      return;
    }

    try {
      setIsCheckingOut(true);
      
      // Combine all providers and amounts from cart items
      const allProviders: `0x${string}`[] = [];
      const allAmounts: bigint[] = [];
      
      items.forEach(item => {
        allProviders.push(...item.providers);
        allAmounts.push(...item.amounts);
      });

      if (allProviders.length > 100) {
        toast.error('Too many providers in cart (max 100). Please remove some items.');
        setIsCheckingOut(false);
        return;
      }

      toast.loading('Please confirm the batch transaction in MetaMask...', { id: 'checkout' });

      const txHash = await writeContractAsync({
        address: MARKETPLACE_CONFIG.marketplaceAddress as `0x${string}`,
        abi: luminaMarketplaceAbi,
        functionName: 'buyData',
        args: [allProviders, allAmounts],
      });

      // INSTANT POST - Optimistic UI for ALL cart items
      for (const item of items) {
        await fetch('/api/account/purchases', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ 
            buyerId: address, 
            datasetId: item.sourceName + ' (Tier ' + item.tier + ')', 
            transactionHash: txHash, 
            sizeBytes: item.providers.length * 1024 * 5, 
            providerWallets: item.providers,
            status: 'pending'
          }) 
        });
      }
      
      toast.success('Batch transaction sent! Datasets will appear in your Workspace.', { id: 'checkout' });
      clearCart();
      setIsOpen(false);

      if (publicClient) {
        // Wait for receipt silently to trigger completed status if they stay on page
        await publicClient.waitForTransactionReceipt({ hash: txHash });
        for (const item of items) {
          await fetch('/api/account/purchases', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
              buyerId: address, 
              datasetId: item.sourceName + ' (Tier ' + item.tier + ')', 
              transactionHash: txHash, 
              sizeBytes: item.providers.length * 1024 * 5, 
              providerWallets: item.providers,
              status: 'completed'
            }) 
          });
        }
      }

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Transaction failed', { id: 'checkout' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-vana-primary hover:bg-[#b9ff42] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(205,255,100,0.3)] hover:scale-105 transition-all"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#111]">
          {items.length}
        </span>
      </button>

      {/* Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)}>
          <div className="bg-[#111] border-l border-[#222] w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-left" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#151515]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Shopping Cart
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-black border border-[#222] rounded-xl p-4 flex justify-between items-center group">
                  <div>
                    <h3 className="font-bold text-white">{item.sourceName}</h3>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                      <span className="bg-[#222] px-2 py-0.5 rounded">Tier {item.tier}</span>
                      <span>{item.providers.length} providers</span>
                    </div>
                    <div className="text-sm font-semibold text-vana-primary mt-2">{item.price} VANA</div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-50 hover:opacity-100 hover:bg-red-500 hover:text-white transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-[#222] bg-[#151515]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400">Total Price:</span>
                <span className="text-2xl font-bold text-white">{totalPrice.toFixed(4)} VANA</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-vana-primary hover:bg-[#b9ff42] text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(205,255,100,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Processing Batch...
                  </>
                ) : (
                  'Checkout All Items'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
