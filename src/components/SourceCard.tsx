'use client';

import { useState } from 'react';
import type { DataSource } from '@/lib/data-sources';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useSession, signIn } from 'next-auth/react';

interface SourceCardProps {
  source: DataSource & { status?: string, qualityScore?: number };
  onConnect?: (sourceId: string) => void;
}


const getTierStyle = (score: number) => {
  if (score >= 80) return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
  if (score >= 60) return 'bg-purple-500/15 text-purple-400 border-purple-500/40';
  if (score >= 40) return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
  return 'bg-gray-500/15 text-gray-400 border-gray-500/40';
};
const getTierLabel = (score: number) => {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
};

export function SourceCard({ source, onConnect }: SourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { address } = useAccount();
  const { status: sessionStatus } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { openConnectModal } = useConnectModal();

  const statusConfig = {
    available: { label: 'Available', color: 'text-vana-green', bg: 'bg-vana-green/10', border: 'border-vana-green/20' },
    connected: { label: '✓ Connected', color: 'text-vana-green', bg: 'bg-vana-green/10', border: 'border-vana-green/20' },
    public_only: { label: 'Public Only', color: 'text-vana-amber', bg: 'bg-vana-amber/10', border: 'border-vana-amber/20' },
    desktop_required: { label: 'Desktop Required', color: 'text-vana-amber', bg: 'bg-vana-amber/10', border: 'border-vana-amber/20' },
  };

  const status = statusConfig[source.status];

  const handleConnect = async () => {
    if (!address && sessionStatus !== 'authenticated') {
      setShowAuthModal(true);
      return;
    }

    setIsConnecting(true);
    try {
      const res = await fetch('/api/vana/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: source.id }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        alert(`Vana Error: ${data.error || 'Unknown error'}`);
        setIsConnecting(false);
        return;
      }

      if (data.approvalUrl) {
        // Open Vana in a popup window
        const width = 600;
        const height = 800;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(data.approvalUrl, '_blank');

        // Poll for completion
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/vana/status?source=${source.id}&connectionId=${data.connectionId}`);
            const statusData = await statusRes.json();
            
            if (statusData.status === 'approved' || statusData.status === 'completed') {
              clearInterval(pollInterval);
              
              // Trigger data read which will acknowledge and close the Vana popup
              await fetch(`/api/vana/data?source=${source.id}&connectionId=${data.connectionId}`);
              
              if (popup && !popup.closed) popup.close();
              setIsConnecting(false);
              onConnect?.(source.id);
              
              // Save to local storage
              const saved = localStorage.getItem('vana_connections');
              const connections = saved ? JSON.parse(saved) : [];
              const newConn = {
                sourceId: source.id,
                connectionId: data.connectionId,
                status: 'completed',
                scopesApproved: source.scopes.map(s => s.id)
              };
              connections.push(newConn);
              localStorage.setItem('vana_connections', JSON.stringify(connections));
              
              if (address) {
                await fetch('/api/connections', {
                  method: 'POST',
                  body: JSON.stringify({ wallet: address, connection: newConn })
                });
                await fetch('/api/providers', {
                  method: 'POST',
                  body: JSON.stringify({ wallet_address: address })
                });
              }
              
              // Redirect to dashboard to see results
              window.location.href = '/dashboard#source-' + source.id;
            } else if (statusData.status === 'rejected' || (popup && popup.closed)) {
              clearInterval(pollInterval);
              setIsConnecting(false);
            }
          } catch (e) {
            console.error('Polling error', e);
          }
        }, 2000);
      } else {
        setIsConnecting(false);
      }
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnecting(false);
    }
  };

  return (
    <div className="group relative rounded-2xl bg-[#0a0a0c] border border-[#222] hover:border-vana-primary/50 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(205,255,100,0.15)] flex flex-col h-full">
      <div className="absolute inset-0 bg-gradient-to-b from-vana-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-30 group-hover:opacity-100 transition-opacity duration-500" style={{ background: source.color }} />

      <div className="p-6 flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 p-2 overflow-hidden shadow-inner border border-[#333] group-hover:border-[#555]" style={{ background: `${source.color}15` }}>
              {source.icon.startsWith('http') ? (
                <img src={source.icon} alt={source.name} className="w-full h-full object-contain filter drop-shadow-md" />
              ) : (
                <span className="text-2xl">{source.icon}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                <h3 className="text-white font-bold text-[17px] leading-tight tracking-tight group-hover:text-vana-primary transition-colors duration-300">{source.name}</h3>
                {source.qualityScore != null && (
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 backdrop-blur-sm transition-all ${getTierStyle(source.qualityScore)}`}>
                    <span className="text-[9px]">&#128142;</span>
                    <span className="tracking-wide">TIER {getTierLabel(source.qualityScore)}</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">{source.category}</span>
            </div>
          </div>
          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${status.bg} ${status.color} border ${status.border} shadow-sm`}>
            {status.label}
          </span>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed">{source.description}</p>
        
        {source.scopes && source.scopes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 mb-1 flex-grow items-start content-start">
            {source.scopes.map(s => (
              <span key={s.id} className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#111] text-gray-400 border border-[#222]">
                {s.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          {source.status === 'connected' ? (
            <a href={`/dashboard#source-${source.id}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-vana-green/10 text-vana-green text-sm font-medium transition-all hover:bg-vana-green/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5l10 -10"/></svg>
              Go to Dashboard
            </a>
          ) : source.requiresDesktop ? (
            <a href="https://app.vana.org/sources" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-vana-border hover:border-vana-border-hover text-sm text-vana-text-secondary hover:text-vana-text transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              Use Desktop
            </a>
          ) : (
            <button onClick={handleConnect} disabled={isConnecting} className="flex-1 py-2.5 px-4 rounded-xl bg-vana-primary hover:bg-vana-primary/90 disabled:bg-vana-primary/50 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-vana-primary/20 disabled:cursor-not-allowed">
              {isConnecting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Waiting for Vana...
                </span>
              ) : (
                'Connect Data'
              )}
            </button>
          )}

          
        </div>
      
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowAuthModal(false)}>
          <div className="bg-[#111] border border-[#222] rounded-3xl p-8 max-w-sm w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-black border border-[#222] flex items-center justify-center mb-6 shadow-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[#4F46E5]">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Lumina</h2>
              <p className="text-sm text-gray-400 mb-8 px-2">
                Sign in to manage your data or access purchased datasets.
              </p>

              <button 
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3.5 px-4 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>

              <div className="w-full flex items-center gap-4 my-6 opacity-40">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">OR</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>

              <button 
                onClick={() => {
                  setShowAuthModal(false);
                  if (openConnectModal) openConnectModal();
                }}
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}



