'use client';

import { useState } from 'react';
import type { DataSource } from '@/lib/data-sources';

interface SourceCardProps {
  source: DataSource;
  onConnect?: (sourceId: string) => void;
}

export function SourceCard({ source, onConnect }: SourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const statusConfig = {
    available: { label: 'Available', color: 'text-vana-green', bg: 'bg-vana-green/10', border: 'border-vana-green/20' },
    connected: { label: '? Connected', color: 'text-vana-green', bg: 'bg-vana-green/10', border: 'border-vana-green/20' },
    public_only: { label: 'Public Only', color: 'text-vana-amber', bg: 'bg-vana-amber/10', border: 'border-vana-amber/20' },
    desktop_required: { label: 'Desktop Required', color: 'text-vana-amber', bg: 'bg-vana-amber/10', border: 'border-vana-amber/20' },
  };

  const status = statusConfig[source.status];

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const res = await fetch('/api/vana/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: source.id }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        alert(\Vana Error: \\);
        setIsConnecting(false);
        return;
      }

      if (data.approvalUrl) {
        // Open Vana in a popup window
        const width = 600;
        const height = 800;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(
          data.approvalUrl,
          'Vana Connect',
          \width=\,height=\,left=\,top=\,popup=yes\
        );

        // Poll for completion
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(\/api/vana/status?source=\&connectionId=\\);
            const statusData = await statusRes.json();
            
            if (statusData.status === 'approved' || statusData.status === 'completed') {
              clearInterval(pollInterval);
              
              // Trigger data read which will acknowledge and close the Vana popup
              await fetch(\/api/vana/data?source=\&connectionId=\\);
              
              if (popup && !popup.closed) popup.close();
              setIsConnecting(false);
              onConnect?.(source.id);
              
              // Save to local storage
              const saved = localStorage.getItem('databridge_connections');
              const connections = saved ? JSON.parse(saved) : [];
              connections.push({
                sourceId: source.id,
                connectionId: data.connectionId,
                status: 'approved',
                connectedAt: new Date().toISOString()
              });
              localStorage.setItem('databridge_connections', JSON.stringify(connections));
              
              // Redirect to dashboard to see results
              window.location.href = '/dashboard';
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
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 p-2 overflow-hidden shadow-inner border border-[#333] group-hover:border-[#555]" style={{ background: \\15\ }}>
              {source.icon.startsWith('http') ? (
                <img src={source.icon} alt={source.name} className="w-full h-full object-contain filter drop-shadow-md" />
              ) : (
                <span className="text-2xl">{source.icon}</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-bold text-lg tracking-tight truncate group-hover:text-vana-primary transition-colors duration-300">{source.name}</h3>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">{source.category}</span>
            </div>
          </div>
          <span className={\shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest \ \ border \ shadow-sm\}>
            {status.label}
          </span>
        </div>

        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed flex-grow">{source.description}</p>

        <div className="mt-4 flex items-center gap-2">
          {source.requiresDesktop ? (
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

          <button className="p-2.5 rounded-xl border border-vana-border hover:border-vana-border-hover text-vana-text-muted hover:text-vana-text transition-all" title="View API documentation">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
