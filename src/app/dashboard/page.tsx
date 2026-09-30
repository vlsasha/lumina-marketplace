'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DATA_SOURCES } from '@/lib/data-sources';
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

  const displayBalance = balanceData ? Number(formatUnits(balanceData as bigint, MARKETPLACE_CONFIG.paymentToken.decimals)).toFixed(2) : "0.00";
  const displayPoC = pocScoreData ? Number(pocScoreData) : 0;
  const [connections, setConnections] = useState<ConnectedSource[]>([]);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
            <div>
              <h2 className="text-sm font-semibold text-vana-text-secondary uppercase tracking-wider mb-1">Your Accumulated Earnings</h2>
              <div className="flex items-end gap-2">
                <span className="text-4xl sm:text-5xl font-bold text-vana-text">{displayBalance}</span>
                <span className="text-xl text-vana-text-secondary mb-1">USDC.e</span>
              </div>
              <p className="text-sm text-vana-text-muted mt-2 max-w-lg">
                Your datasets passed the Proof of Contribution check with high authenticity. Buyers accessed your data 53 times this month.
              </p>
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
              {DATA_SOURCES.map((source) => {
                const conn = getConnection(source.source);
                const isLoading = loading === source.source;

                return (
                  <div
                    key={source.id}
                    className="p-5 rounded-xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors"
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
                              {conn?.qualityScore != null && (
                                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-[#111] text-amber-400 border border-[#333]" title="Data Quality Score">
                                  &#128142; Tier {conn.qualityScore >= 80 ? 'S' : conn.qualityScore >= 60 ? 'A' : conn.qualityScore >= 40 ? 'B' : 'C'} ({conn.qualityScore}/100)
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-vana-text-muted">
                            {source.scopes.length} scope{source.scopes.length !== 1 ? 's' : ''}
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

              {/* Connection log */}
              {connections.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-vana-text">Activity Log</h3>
                  <div className="space-y-2">
                    {connections.map((conn) => {
                      const source = DATA_SOURCES.find((s) => s.source === conn.sourceId);
                      return (
                        <div key={conn.connectionId} className="p-3 rounded-lg border border-vana-border bg-vana-card text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{source?.icon}</span>
                            <span className="text-vana-text font-medium">{source?.name}</span>
                          </div>
                          <code className="text-vana-text-muted block truncate">{conn.connectionId}</code>
                          <span className={`text-[10px] font-medium ${
                            conn.status === 'approved' ? 'text-vana-green' :
                            conn.status === 'pending' ? 'text-vana-amber' :
                            conn.status === 'denied' ? 'text-vana-red' :
                            'text-vana-text-muted'
                          }`}>
                            {conn.status.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

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








