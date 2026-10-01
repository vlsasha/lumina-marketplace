'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DATA_SOURCES, EARNINGS_RATES } from '@/lib/data-sources';
import { EarningsTable } from '@/components/EarningsTable';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { MARKETPLACE_CONFIG } from '@/lib/config';
import { luminaMarketplaceAbi } from '@/lib/abi';

type ConnectionStatus = 'idle' | 'pending' | 'approved' | 'completed' | 'denied' | 'error';

interface ConnectedSource {
  sourceId: string;
  connectionId: string;
  status: ConnectionStatus;
  connectedAt: string | null;
  scopesApproved: string[];
  qualityScore?: number;
}

const getTierStyle = (score: number) => {
  if (score >= 80) return 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
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

export default function DashboardPage() {
  const { address } = useAccount();

  const { data: balanceData } = useReadContract({
    address: MARKETPLACE_CONFIG.marketplaceAddress as `0x${string}`,
    abi: luminaMarketplaceAbi,
    functionName: 'providerBalances',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: pocScoreData } = useReadContract({
    address: MARKETPLACE_CONFIG.marketplaceAddress as `0x${string}`,
    abi: luminaMarketplaceAbi,
    functionName: 'providerPoCScores',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const [connections, setConnections] = useState<ConnectedSource[]>([]);
  // Calculate projected earnings based on data quality scores
  const totalQualityScore = connections.reduce((acc, c) => acc + (c.qualityScore || 0), 0);
  
  // Calculate earnings based on specific sources and their quality score multiplier (Score / 100)
  const totalEarnings = connections.reduce((acc, conn) => {
    if (conn.status !== 'approved' && conn.status !== 'completed') return acc;
    const rate = EARNINGS_RATES.find(r => r.id === conn.sourceId)?.price || 0;
    const multiplier = (conn.qualityScore || 0) / 100;
    return acc + (rate * multiplier);
  }, 0);

  const totalYield = connections.reduce((acc, conn) => {
    if (conn.status !== 'approved' && conn.status !== 'completed') return acc;
    // @ts-ignore - TS might not know about monthlyYield yet if not fully recompiled
    const rate = EARNINGS_RATES.find(r => r.id === conn.sourceId)?.monthlyYield || 0;
    const multiplier = (conn.qualityScore || 0) / 100;
    return acc + (rate * multiplier);
  }, 0);
  
  const displayBalance = totalEarnings.toFixed(2);
  const displayYield = totalYield.toFixed(2);
  const displayPoC = pocScoreData ? Number(pocScoreData) : totalQualityScore;
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 8000);
    };
  const [loading, setLoading] = useState<string | null>(null);
  const [dataPreview, setDataPreview] = useState<Record<string, unknown> | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState<string | null>(null);
  
  const { writeContract, isPending } = useWriteContract();
  
  const handleClaim = () => {
    writeContract(
      {
        address: MARKETPLACE_CONFIG.marketplaceAddress as `0x${string}`,
        abi: luminaMarketplaceAbi,
        functionName: 'claimEarnings',
      },
      {
        onSuccess: () => alert('Earnings claimed successfully!'),
        onError: (err) => {
          console.error(err);
          alert('Failed to claim earnings. Make sure you have a balance.');
        }
      }
    );
  };

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('Lumina_connections');
    if (saved) {
      try {
        setConnections(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved connections');
      }
    }
  }, []);

    // Sync with DB if wallet is connected
  useEffect(() => {
    if (address) {
      fetch(`/api/connections?wallet=${address}&t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          if (data.connections && data.connections.length > 0) {
            setConnections(prev => {
              const merged = [...data.connections];
              prev.forEach(p => {
                if (!merged.find(m => m.sourceId === p.sourceId)) {
                  merged.push(p);
                }
              });
              localStorage.setItem('Lumina_connections', JSON.stringify(merged));
              return merged;
            });
          }
        })
        .catch(console.error);
    }
  }, [address]);

  // Save to localStorage whenever connections change
  useEffect(() => {
    localStorage.setItem('Lumina_connections', JSON.stringify(connections));
  }, [connections]);

  const handleConnect = async (sourceId: string) => {
    setLoading(sourceId);
    try {
      const res = await fetch('/api/vana/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: sourceId }),
      });
      const data = await res.json();

      if (data.connectionId) {
        setConnections((prev) => [
          ...prev.filter((c) => c.sourceId !== sourceId),
          {
            sourceId,
            connectionId: data.connectionId,
            status: 'pending',
            connectedAt: null,
            scopesApproved: [],
          },
        ]);
        // Open Vana in a new tab
        const popup = window.open(data.approvalUrl || data.connectUrl, '_blank', 'noopener,noreferrer');

        // Poll for completion automatically
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/vana/status?source=${sourceId}&connectionId=${data.connectionId}`);
            const statusData = await statusRes.json();
            
            if (statusData.status === 'approved' || statusData.status === 'completed') {
              clearInterval(pollInterval);
              
              // Trigger data read which will acknowledge and allow Vana to redirect/close
              await fetch(`/api/vana/data?source=${sourceId}&connectionId=${data.connectionId}`);
              
              // Update UI state
              setConnections((prev) =>
                prev.map((c) =>
                  c.sourceId === sourceId
                    ? { ...c, status: 'approved', connectedAt: new Date().toISOString(), scopesApproved: statusData.scopes || [] }
                    : c
                )
              );

              // Fetch data preview automatically
              const dataRes = await fetch(`/api/vana/data?source=${sourceId}&connectionId=${data.connectionId}`);
              const previewData = await dataRes.json();
              setDataPreview(previewData);
              if (!previewData.error) {
                localStorage.setItem(`vana_data_${data.connectionId}`, JSON.stringify(previewData));
                }
                
                // Sync to our DB
                if (address) {
                  const postRes = await fetch('/api/connections', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      wallet: address,
                      connection: {
                        sourceId,
                        connectionId: data.connectionId,
                        status: previewData.error ? 'approved' : 'completed',
                        scopesApproved: statusData.scopes || []
                      }
                      })
                    });
                    
                    if (!postRes.ok) {
                      const errData = await postRes.json();
                      showToast(errData.error || 'Failed to sync database', 'error');
                      setConnections(prev => {
                        const filtered = prev.filter(c => c.sourceId !== sourceId);
                        localStorage.setItem('Lumina_connections', JSON.stringify(filtered));
                        return filtered;
                      });
                      clearInterval(pollInterval);
                      setLoading(null);
                      return;
                    } else {
                      showToast('Account connected and verified!', 'success');
                    }
                    
                    // Immediately re-fetch from DB to get the calculated qualityScore
                  const refreshRes = await fetch(`/api/connections?wallet=${address}&t=${Date.now()}`);
                  const refreshData = await refreshRes.json();
                  if (refreshData.connections && refreshData.connections.length > 0) {
                    setConnections(prev => {
                      const merged = [...refreshData.connections];
                      prev.forEach(p => {
                        if (!merged.find(m => m.sourceId === p.sourceId)) merged.push(p);
                      });
                      return merged;
                    });
                  }
                }

              // Try to close the popup if browser allows it
              if (popup && !popup.closed) popup.close();
            } else if (statusData.status === 'rejected' || (popup && popup.closed)) {
              clearInterval(pollInterval);
            }
          } catch (e) {
            console.error('Polling error', e);
          }
        }, 2000);
      }
    } catch {
      console.error('Failed to create request');
    } finally {
      setLoading(null);
    }
  };

  const handleCheckStatus = async (sourceId: string) => {
    const connection = connections.find((c) => c.sourceId === sourceId);
    if (!connection) return;

    setLoading(sourceId);
    try {
      const res = await fetch(
        `/api/vana/status?source=${sourceId}&connectionId=${connection.connectionId}`
      );
      const data = await res.json();

      setConnections((prev) =>
        prev.map((c) =>
          c.sourceId === sourceId
            ? {
                ...c,
                status: data.status,
                connectedAt: data.status === 'approved' ? new Date().toISOString() : null,
                scopesApproved: data.scopes || [],
              }
            : c
        )
      );
    } catch {
      console.error('Failed to check status');
    } finally {
      setLoading(null);
    }
  };

  const handleReadData = async (sourceId: string) => {
    const connection = connections.find((c) => c.sourceId === sourceId);
    if (!connection) return;

    setLoading(sourceId);
    try {
      const res = await fetch(
        `/api/vana/data?source=${sourceId}&connectionId=${connection.connectionId}`
      );
      const data = await res.json();
      setDataPreview(data);
        
        // Self-heal: Sync this connection to DB to calculate qualityScore if missing
        if (address && connection.qualityScore == null) {
          const postRes = await fetch('/api/connections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wallet: address,
              connection: {
                sourceId,
                connectionId: connection.connectionId,
                status: data.error ? 'approved' : 'completed',
                scopesApproved: connection.scopesApproved || []
              }
              })
            });
            
            if (!postRes.ok) {
              const errData = await postRes.json();
              showToast(errData.error || 'Failed to sync database', 'error');
              setConnections(prev => {
                const filtered = prev.filter(c => c.sourceId !== sourceId);
                localStorage.setItem('Lumina_connections', JSON.stringify(filtered));
                return filtered;
              });
              setLoading(null);
              return;
            }
            
            // Re-fetch from DB
          const refreshRes = await fetch(`/api/connections?wallet=${address}&t=${Date.now()}`);
          const refreshData = await refreshRes.json();
          if (refreshData.connections && refreshData.connections.length > 0) {
            setConnections(prev => {
              const merged = [...refreshData.connections];
              prev.forEach(p => {
                if (!merged.find(m => m.sourceId === p.sourceId)) merged.push(p);
              });
              localStorage.setItem('Lumina_connections', JSON.stringify(merged));
              return merged;
            });
          }
        }
    } catch {
      console.error('Failed to read data');
    } finally {
      setLoading(null);
    }
  };

  const getConnection = (sourceId: string) =>
    connections.find((c) => c.sourceId === sourceId);

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-vana-text mb-2">Dashboard</h1>
            <p className="text-vana-text-secondary">
              Manage your data source connections and preview data.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard label="Available Sources" value={DATA_SOURCES.length.toString()} />
            <StatCard label="Connected" value={connections.filter((c) => (c.status === 'approved' || c.status === 'completed')).length.toString()} />
            <StatCard label="Pending" value={connections.filter((c) => c.status === 'pending').length.toString()} />
            <StatCard label="Total Scopes" value={DATA_SOURCES.reduce((acc, s) => acc + s.scopes.length, 0).toString()} />
          </div>

          {/* Earnings & PoC Panel */}
          <div className="mb-10 bg-gradient-to-br from-vana-primary/10 to-transparent border border-vana-primary/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                <div>
                  <h2 className="text-sm font-semibold text-vana-text-secondary uppercase tracking-wider mb-1">Initial Sync Earnings</h2>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-vana-text">{displayBalance}</span>
                    <span className="text-xl text-vana-text-secondary mb-1">USDC</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-8 top-2 bottom-2 w-px bg-vana-border hidden sm:block"></div>
                  <h2 className="text-sm font-semibold text-vana-green uppercase tracking-wider mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-vana-green animate-pulse"></span>
                    Monthly Passive Yield
                  </h2>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-white">+{displayYield}</span>
                    <span className="text-xl text-vana-text-secondary mb-1">USDC / mo</span>
                  </div>
                </div>
                </div>
              <div className="shrink-0 flex flex-col items-start md:items-end gap-4">
              {/* Proof of Contribution Badge */}
              <div className="flex flex-col items-start md:items-end">
                <span className="text-xs font-semibold uppercase tracking-wider text-vana-green/80 mb-1">Data Quality Score</span>
                <div className="flex items-center gap-2 bg-vana-green/10 border border-vana-green/30 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-vana-green status-pulse" />
                  <span className="text-vana-green font-mono font-bold">PoC: {displayPoC > 0 ? `${displayPoC}% (Validated)` : 'Pending'}</span>
                </div>
              </div>

              <button 
                onClick={handleClaim}
                disabled={isPending}
                className="px-8 py-3 bg-vana-green hover:bg-opacity-90 text-black font-bold rounded-xl transition-all shadow-lg shadow-vana-green/20 hover:shadow-vana-green/40 hover:-translate-y-0.5 disabled:opacity-50 w-full md:w-auto"
              >
                {isPending ? 'Claiming...' : 'Claim to Wallet'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sources list */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-lg font-semibold text-vana-text mb-4">Data Sources</h2>
              {
                [...DATA_SOURCES].sort((a, b) => {
                  const connA = getConnection(a.source);
                  const connB = getConnection(b.source);
                  const aConnected = connA?.status === 'approved' || connA?.status === 'completed';
                  const bConnected = connB?.status === 'approved' || connB?.status === 'completed';
                  if (aConnected && !bConnected) return -1;
                  if (!aConnected && bConnected) return 1;
                  if (aConnected && bConnected) {
                     return (connB?.qualityScore || 0) - (connA?.qualityScore || 0);
                  }
                  return 0;
                }).map((source) => {
                const conn = getConnection(source.source);
                const isLoading = loading === source.source;

                return (
                  <div
                    key={source.id}
                    id={`source-${source.id}`}
                    className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors scroll-mt-24"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                          {source.icon.startsWith('http') ? (
                            <img src={source.icon} alt={source.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-2xl">{source.icon}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                              <h3 className="font-medium text-vana-text">{source.name}</h3>
                              {conn?.qualityScore != null && (<>
                                <span className={`shrink-0 ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 backdrop-blur-sm transition-all ${getTierStyle(conn.qualityScore)}`} title="Data Quality Score">
                                  <span className="text-[10px]">&#128142;</span>
                                  <span className="tracking-wide">TIER {getTierLabel(conn.qualityScore)}</span>
                                  <span className="opacity-60 font-medium text-[9px] ml-0.5">({conn.qualityScore})</span>
                                  </span>
                                  <span className="ml-2 text-[11px] font-semibold text-vana-green/90 bg-vana-green/10 px-2 py-0.5 rounded-md border border-vana-green/20">
                                    +${((EARNINGS_RATES.find(r => r.id === conn.sourceId)?.price || 0) * (conn.qualityScore / 100)).toFixed(2)} USDC</span></>)}
                            </div>
                            <p className="text-xs text-vana-text-muted">
                            {(conn?.status === 'approved' || conn?.status === 'completed') ? (conn.scopesApproved?.length || 0) : source.scopes.length} scope{((conn?.status === 'approved' || conn?.status === 'completed') ? (conn.scopesApproved?.length || 0) : source.scopes.length) !== 1 ? 's' : ''}
                            {source.requiresDesktop && ' · Desktop required'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {(conn?.status === 'approved' || conn?.status === 'completed') && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPrivacyModalOpen(source.name)}
                              className="px-3 py-1.5 text-xs rounded-lg border border-vana-primary/30 text-vana-primary hover:bg-vana-primary/10 font-medium transition-colors flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                              Privacy
                            </button>
                            <span className="flex items-center gap-1 text-xs text-vana-green px-2 py-1 rounded-lg bg-vana-green/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-vana-green" />
                                Connected
                              </span>
                          </div>
                        )}
                        {conn?.status === 'pending' && (
                          <span className="flex items-center gap-1 text-xs text-vana-amber px-2 py-1 rounded-lg bg-vana-amber/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-vana-amber animate-pulse" />
                            Pending
                          </span>
                        )}

                        {(!conn || ['denied', 'error', 'rejected'].includes(conn?.status || '')) && (
                          <button
                            onClick={() => handleConnect(source.source)}
                            disabled={isLoading}
                            className="px-4 py-2 text-xs rounded-lg bg-vana-primary hover:bg-vana-primary/90 text-white font-medium transition-colors disabled:opacity-50"
                          >
                            {isLoading ? 'Creating...' : 'Connect'}
                          </button>
                        )}
                        {conn?.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCheckStatus(source.source)}
                              disabled={isLoading}
                              className="px-4 py-2 text-xs rounded-lg border border-vana-border hover:border-vana-border-hover text-vana-text-secondary font-medium transition-colors disabled:opacity-50"
                            >
                              {isLoading ? 'Checking...' : 'Check Status'}
                            </button>
                            <button
                              onClick={() => setConnections(prev => prev.filter(c => c.connectionId !== conn.connectionId))}
                              className="px-3 py-2 text-xs rounded-lg border border-vana-border hover:bg-vana-red/10 text-vana-text-muted hover:text-vana-red transition-colors"
                              title="Remove connection"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                        {(conn?.status === 'approved' || conn?.status === 'completed') && (
                          <div className="flex gap-2">
                            
                            <button
                              onClick={() => handleReadData(source.source)}
                            disabled={isLoading}
                            className="px-4 py-2 text-xs rounded-lg bg-vana-green/10 hover:bg-vana-green/20 text-vana-green font-medium transition-colors disabled:opacity-50"
                          >
                            {isLoading ? 'Reading...' : 'Read Data'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {conn?.scopesApproved && conn.scopesApproved.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-vana-border">
                        <span className="text-[10px] uppercase tracking-wider text-vana-text-muted block mb-1.5">
                          Approved Scopes
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {conn.scopesApproved.map((scope) => (
                            <code key={scope} className="text-[11px] px-2 py-0.5 rounded bg-vana-green/5 text-vana-green border border-vana-green/10">
                              {scope}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Data Preview */}
            <div className="space-y-4">
              <EarningsTable />
              
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-vana-text">Data Preview</h2>
                    {dataPreview && (
                      <button 
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(dataPreview, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `vana_data_${dataPreview?.source || 'export'}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-vana-primary text-vana-primary hover:bg-vana-primary/10 transition-colors cursor-pointer"
                      >
                        Download JSON
                      </button>
                    )}
                  </div>
              <div className="p-5 rounded-xl border border-vana-border bg-vana-card min-h-[300px]">
                {dataPreview ? (
                  <pre className="text-xs text-vana-text overflow-auto max-h-[600px]">
                    <code>{JSON.stringify(dataPreview, null, 2)}</code>
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-sm text-vana-text-muted text-center">
                      Connect a source and click &quot;Read Data&quot; to preview the response here.
                    </p>
                  </div>
                )}
              </div>
              </div>

              
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-24 right-4 p-4 rounded-xl shadow-2xl z-50 animate-fade-in border text-sm font-bold flex items-center gap-3 ${
          toast.type === 'error' ? 'bg-[#2a0e0e] border-[#ff4444] text-[#ff6666]' : 'bg-[#0e2a14] border-[#44ff66] text-[#66ff88]'
        }`}>
          <span className="text-xl">{toast.type === 'error' ? '🚫' : '✅'}</span>
          {toast.message}
        </div>
      )}

      {/* Privacy Sandbox Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#222]">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-vana-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Data Privacy Sandbox
                </h3>
                <p className="text-sm text-gray-400 mt-1">Preview how your {privacyModalOpen} data is anonymized before sale.</p>
              </div>
              <button 
                onClick={() => setPrivacyModalOpen(null)}
                className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-[#222] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center p-3 bg-black border border-[#222] rounded-lg">
                  <span className="text-gray-500">First Name</span>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-900/50 rounded text-xs">Redacted [Hidden]</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black border border-[#222] rounded-lg">
                  <span className="text-gray-500">Last Name</span>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-900/50 rounded text-xs">Redacted [Hidden]</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black border border-[#222] rounded-lg">
                  <span className="text-gray-500">Email Address</span>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-900/50 rounded text-xs">Hash: 8f4a...2c91</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#1a1a1a] border border-vana-primary/30 rounded-lg">
                  <span className="text-gray-300">Age Range</span>
                  <span className="text-white">30-40</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#1a1a1a] border border-vana-primary/30 rounded-lg">
                  <span className="text-gray-300">Region</span>
                  <span className="text-white">North America</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#1a1a1a] border border-vana-primary/30 rounded-lg">
                  <span className="text-gray-300">Behavioral Data</span>
                  <span className="text-white">Preserved (Anonymized)</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-6 leading-relaxed">
                * Lumina uses strict zero-knowledge redaction. Personally Identifiable Information (PII) never leaves your Personal Server in plaintext. B2B Buyers only receive the aggregated demographic and behavioral patterns.
              </p>
            </div>
            
            <div className="p-4 border-t border-[#222] bg-black/50 text-right">
              <button 
                onClick={() => setPrivacyModalOpen(null)}
                className="px-6 py-2 bg-vana-primary text-black font-bold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Looks Good
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border border-vana-border bg-vana-card">
      <p className="text-2xl font-bold text-vana-text">{value}</p>
      <p className="text-xs text-vana-text-muted mt-1">{label}</p>
    </div>
  );
}








