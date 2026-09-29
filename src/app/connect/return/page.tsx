'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';

function ReturnContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { address } = useAccount();

  const connectionId = searchParams.get('connectionId') || searchParams.get('requestId') || searchParams.get('id') || (typeof window !== 'undefined' ? localStorage.getItem('vana_pending_' + searchParams.get('source')) : null);
  const source = searchParams.get('source');

  useEffect(() => {
    if (!connectionId || !source) {
      setStatus('error');
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `/api/vana/status?source=${source}&connectionId=${connectionId}`
        );
        const data = await res.json();
        if (data.status === 'approved') {
          setStatus('success');
          
          // Register provider in Database if wallet is connected
          if (address) {
            await fetch('/api/providers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ wallet_address: address }),
            });
          }

          // Update localStorage so Dashboard knows it's approved
          try {
            const saved = localStorage.getItem('Lumina_connections');
            if (saved) {
              const connections = JSON.parse(saved);
              const updated = connections.map((c: any) => 
                c.connectionId === connectionId 
                  ? { ...c, status: 'approved', connectedAt: new Date().toISOString(), scopesApproved: data.scopes || [] }
                  : c
              );
              // If not found in localStorage (maybe started from different page), add it
              if (!connections.find((c: any) => c.connectionId === connectionId)) {
                updated.push({
                  sourceId: source,
                  connectionId,
                  status: 'approved',
                  connectedAt: new Date().toISOString(),
                  scopesApproved: data.scopes || [],
                });
              }
              localStorage.setItem('Lumina_connections', JSON.stringify(updated));
            } else {
              localStorage.setItem('Lumina_connections', JSON.stringify([{
                sourceId: source,
                connectionId,
                status: 'approved',
                connectedAt: new Date().toISOString(),
                scopesApproved: data.scopes || [],
              }]));
            }
          } catch (e) {
            console.error('Failed to update localStorage', e);
          }
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    checkStatus();
  }, [connectionId, source]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-vana-dark">
      <div className="max-w-md w-full mx-4 p-8 rounded-2xl border border-vana-border bg-vana-card text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-vana-primary border-t-transparent animate-spin" />
            <h1 className="text-xl font-bold text-vana-text mb-2">Verifying Connection</h1>
            <p className="text-sm text-vana-text-secondary">
              Checking your data connection approval status...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-vana-green/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-vana-green">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-vana-text mb-2">Connection Approved!</h1>
            <p className="text-sm text-vana-text-secondary mb-6">
              Your data connection for <strong className="text-vana-text">{source}</strong> has been approved.
              You can now access the data through the API.
            </p>
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="block w-full py-3 rounded-xl bg-vana-primary hover:bg-vana-primary/90 text-white font-semibold transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-vana-red/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-vana-red">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-vana-text mb-2">Connection Issue</h1>
            <p className="text-sm text-vana-text-secondary mb-6">
              {!connectionId || !source
                ? 'Missing connection details. Please try connecting again from the dashboard.'
                : 'The connection request was not approved or an error occurred.'}
            </p>
            <Link
              href="/dashboard"
              className="block w-full py-3 rounded-xl bg-vana-primary hover:bg-vana-primary/90 text-white font-semibold transition-colors"
            >
              Back to Dashboard
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function ConnectReturnPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-vana-dark">
        <div className="w-16 h-16 rounded-full border-2 border-vana-primary border-t-transparent animate-spin" />
      </main>
    }>
      <ReturnContent />
    </Suspense>
  );
}


