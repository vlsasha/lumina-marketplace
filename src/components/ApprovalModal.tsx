'use client';

import { DATA_SOURCES } from '@/lib/data-sources';

interface ApprovalModalProps {
  sourceId: string;
  onCancel: () => void;
  onApprove: () => void;
}

export function ApprovalModal({ sourceId, onCancel, onApprove }: ApprovalModalProps) {
  const source = DATA_SOURCES.find(s => s.source === sourceId);
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111111] border border-[#222222] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-8 pb-6 shrink-0">
          <h2 className="text-2xl text-white mb-2 font-medium">
            <span className="text-gray-400">Vana › </span>
            Connect {source.name}
          </h2>
          <p className="text-gray-400 text-sm">
            Lumina is requesting access to your {source.name} data through Vana.
          </p>
        </div>

        {/* Modal Body */}
        <div className="px-8 pb-8 overflow-y-auto">
          <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] overflow-hidden">
            
            {/* Approval Required Banner */}
            <div className="bg-[#5c4021] text-[#fcd0a1] text-[10px] font-bold tracking-widest uppercase px-4 py-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fcd0a1]"></span>
              Approval Required
            </div>

            <div className="p-6">
              {/* App Details Section */}
              <div className="flex gap-4 mb-6">
                <div className="w-5 h-5 mt-1 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-base mb-1">Lumina wants {source.name} data</h3>
                  <p className="text-gray-400 text-sm mb-5">Review what this app can read through Vana.</p>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-[#333] pb-4">
                      <span className="text-gray-400">App</span>
                      <span className="text-white">Lumina</span>
                    </div>
                    <div className="flex justify-between border-b border-[#333] pb-4">
                      <span className="text-gray-400">Source</span>
                      <span className="text-white">{source.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#333] pb-4">
                      <span className="text-gray-400">Destination</span>
                      <span className="text-white">Your Personal Server</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requested Data Section */}
              <div className="flex gap-4 mb-6">
                <div className="w-5 h-5 mt-1 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-base mb-1">Requested data</h3>
                  <p className="text-gray-400 text-sm mb-5">{source.scopes.length} permission(s)</p>
                  
                  <div className="space-y-4 text-sm">
                    {source.scopes.map((scope, idx) => (
                      <div key={scope.id} className="flex justify-between border-b border-[#333] pb-4">
                        <span className="text-gray-400">Permission {idx + 1}</span>
                        <span className="text-white capitalize">{scope.id.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ready Section */}
              <div className="flex gap-4 mb-6">
                <div className="w-5 h-5 mt-1 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-base mb-1">Your {source.name} data is ready.</h3>
                  <p className="text-gray-400 text-sm">
                    Lumina can use the existing data after approval; no new import is needed.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[#333]">
                <button 
                  onClick={onCancel}
                  className="px-4 py-2 bg-transparent text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={onApprove}
                  className="px-5 py-2 bg-[#e0e0e0] hover:bg-white text-black text-sm font-medium rounded transition-colors"
                >
                  Approve and continue
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
