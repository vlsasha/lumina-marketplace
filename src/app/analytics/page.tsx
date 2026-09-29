'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-vana-dark text-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
        
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-vana-text mb-4">Network Analytics</h1>
          <p className="text-vana-text-secondary text-lg max-w-2xl">
            Real-time transparency dashboard for Lumina on the Vana Network.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91 2.95.73 4.18 1.96 4.18 3.92-.01 1.83-1.38 2.83-3.12 3.15z"/></svg>
            </div>
            <h3 className="text-sm font-semibold text-vana-text-muted uppercase tracking-wider mb-2">Total USDC Paid Out</h3>
            <div className="text-4xl font-bold text-vana-green">$142,850</div>
            <p className="text-xs text-vana-green mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              +12.5% this month
            </p>
          </div>

          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-sm font-semibold text-vana-text-muted uppercase tracking-wider mb-2">Active Data Providers</h3>
            <div className="text-4xl font-bold text-white">8,405</div>
            <p className="text-xs text-vana-text-secondary mt-2">Verified users submitting data</p>
          </div>

          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-sm font-semibold text-vana-text-muted uppercase tracking-wider mb-2">Datasets Purchased</h3>
            <div className="text-4xl font-bold text-white">412</div>
            <p className="text-xs text-vana-text-secondary mt-2">By 45 enterprise B2B buyers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Sources Chart */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Top Revenue Sources</h3>
            <div className="space-y-6">
              {[
                { name: 'ChatGPT', rev: '$45K', pct: 85, color: 'bg-green-500' },
                { name: 'Instagram', rev: '$32K', pct: 60, color: 'bg-pink-500' },
                { name: 'LinkedIn', rev: '$28K', pct: 50, color: 'bg-blue-500' },
                { name: 'GitHub', rev: '$19K', pct: 35, color: 'bg-gray-400' },
                { name: 'Oura Ring', rev: '$9K', pct: 15, color: 'bg-purple-500' },
              ].map((src, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-white">{src.name}</span>
                    <span className="text-vana-text-muted">{src.rev}</span>
                  </div>
                  <div className="w-full bg-[#222] rounded-full h-2">
                    <div className={`${src.color} h-2 rounded-full`} style={{ width: `${src.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PoC Metrics */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Proof of Contribution (PoC)</h3>
              <p className="text-sm text-vana-text-muted mb-6">
                Real-time validation metrics from Vana AI Oracles.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black border border-[#333] p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-vana-green">94.2%</div>
                  <div className="text-xs text-gray-400 mt-1">Authenticity Rate</div>
                </div>
                <div className="bg-black border border-[#333] p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-red-500">5.8%</div>
                  <div className="text-xs text-gray-400 mt-1">Rejection Rate (Fraud)</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-vana-primary/10 border border-vana-primary/20 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-vana-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm text-vana-primary leading-relaxed">
                  Lumina utilizes Zero-Knowledge proofs and session token validation to ensure 100% of the data sold is authentic and generated by real humans.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
