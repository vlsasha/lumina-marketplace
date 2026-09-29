'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DATA_SOURCES } from '@/lib/data-sources';

function MockApprovalContent() {
  const searchParams = useSearchParams();
  const sourceId = searchParams.get('source');
  const connectionId = searchParams.get('connectionId');
  const redirectUrl = searchParams.get('redirectUrl') || '/connect/return';

  const source = DATA_SOURCES.find((s) => s.id === sourceId || s.source === sourceId);
  const sourceName = source ? source.name : 'Unknown Source';
  const scopes = source ? source.scopes : [];

  const handleApprove = () => {
    // In a real Vana flow, this is where Vana redirects back to our app
    // with the connectionId in the URL parameters.
    window.location.href = `${redirectUrl}?source=${sourceId}&connectionId=${connectionId}`;
  };

  const handleCancel = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl flex flex-col">
        {/* Header */}
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-2xl text-white mb-2 font-medium">
            <span className="text-gray-400">Vana › </span>
            Connect {sourceName}
          </h2>
          <p className="text-gray-400 text-sm">
            DataBridge — API Marketplace is requesting access to your {sourceName} data through Vana.
          </p>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden shadow-2xl">
          
          {/* Approval Required Banner */}
          <div className="bg-[#5c4021] text-[#fcd0a1] text-[10px] font-bold tracking-widest uppercase px-6 py-2.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fcd0a1]"></span>
            Approval Required
          </div>

          <div className="p-8">
            {/* App Details Section */}
            <div className="flex gap-4 mb-8">
              <div className="w-5 h-5 mt-1 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium text-base mb-1">DataBridge wants {sourceName} data</h3>
                <p className="text-gray-400 text-sm mb-5">Review what this app can read through Vana.</p>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-[#333] pb-4">
                    <span className="text-gray-400">App</span>
                    <span className="text-white font-medium">DataBridge — API Marketplace</span>
                  </div>
                  <div className="flex justify-between border-b border-[#333] pb-4">
                    <span className="text-gray-400">Source</span>
                    <span className="text-white">{sourceName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#333] pb-4">
                    <span className="text-gray-400">Destination</span>
                    <span className="text-white">Your Personal Server</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requested Data Section */}
            <div className="flex gap-4 mb-8">
              <div className="w-5 h-5 mt-1 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium text-base mb-1">Requested data</h3>
                <p className="text-gray-400 text-sm mb-5">{scopes.length} permission(s)</p>
                
                <div className="space-y-4 text-sm">
                  {scopes.map((scope, idx) => (
                    <div key={scope.id} className="flex justify-between border-b border-[#333] pb-4">
                      <span className="text-gray-400">Permission {idx + 1}</span>
                      <span className="text-white capitalize">{scope.id.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                  {scopes.length === 0 && (
                    <div className="flex justify-between border-b border-[#333] pb-4">
                      <span className="text-gray-400">Permission 1</span>
                      <span className="text-white">Read Profile</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ready Section */}
            <div className="flex gap-4 mb-8">
              <div className="w-5 h-5 mt-1 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium text-base mb-1">Your {sourceName} data is ready.</h3>
                <p className="text-gray-400 text-sm">
                  DataBridge can use the existing data after approval; no new import is needed.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-[#333]">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 bg-transparent text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleApprove}
                className="px-5 py-2.5 bg-[#e0e0e0] hover:bg-white text-black text-sm font-medium rounded transition-colors shadow-lg shadow-white/5"
              >
                Approve and continue
              </button>
            </div>

          </div>
        </div>
        
        <p className="mt-6 text-center text-xs text-gray-600">
          * This is a local mock of the Vana approval screen because no Vana API keys are configured.
        </p>
      </div>
    </div>
  );
}

export default function MockApprovalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <MockApprovalContent />
    </Suspense>
  );
}
