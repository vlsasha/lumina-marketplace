
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMUUxRTFFIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9zdmc+')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-40" />
        
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-vana-primary/10 rounded-[100%] blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 left-1/4 w-[500px] h-[300px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full 2xl:px-12 mx-auto px-4 sm:px-6 lg:px-8 z-10 py-20 flex flex-col items-center">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-vana-primary/20 bg-vana-primary/5 backdrop-blur-md mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vana-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-vana-primary"></span>
          </span>
          <span className="text-xs font-semibold text-vana-primary tracking-wide uppercase">Vana Network Mainnet Live</span>
        </div>

        {/* Title */}
        <div className="text-center max-w-5xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 pb-2">
            The liquidity layer for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vana-primary via-[#b9ff42] to-[#7fdb00]">user-owned AI data</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up font-medium" style={{ animationDelay: '0.2s' }}>
          Connect, validate, and monetize data from Web2 platforms through a unified decentralized API. Built natively on the Vana protocol.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up w-full sm:w-auto" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/sources"
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-vana-primary text-black font-bold text-base transition-all hover:bg-[#b9ff42] hover:shadow-[0_0_40px_rgba(205,255,100,0.3)] hover:-translate-y-0.5"
          >
            Explore Data Sources
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="https://docs.vana.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl border border-[#333] bg-[#111]/50 backdrop-blur-sm hover:border-vana-primary/50 text-white font-semibold text-base transition-all hover:bg-[#1a1a1a]"
          >
            Read Documentation
          </a>
        </div>

        {/* Fake Code/API Window visual */}
        <div className="mt-20 w-full max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="rounded-2xl border border-[#333] bg-[#0a0a0c] shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-vana-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Window Header */}
            <div className="px-4 py-3 border-b border-[#222] flex items-center justify-between bg-[#111]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">POST /api/vana/data</div>
              <div className="w-10"></div>
            </div>
            
            {/* Code */}
            <pre className="p-6 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed"><code>
<span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> fetch(<span className="text-green-400">'https://api.lumina.market/v1/query'</span>, {"{"}
  method: <span className="text-green-400">'POST'</span>,
  headers: {"{"} <span className="text-green-400">'Authorization'</span>: <span className="text-green-400">'Bearer vana_sk_...'</span> {"}"},
  body: JSON.<span className="text-blue-400">stringify</span>({"{"}
    source: <span className="text-green-400">'youtube'</span>,
    quality_tier_min: <span className="text-green-400">'A'</span>,
    scopes: [<span className="text-green-400">'watch_history'</span>, <span className="text-green-400">'subscriptions'</span>]
  {"}"})
{"}"});

<span className="text-gray-500">// Returns Proof of Contribution verified data</span>
<span className="text-purple-400">const</span> dataset = <span className="text-purple-400">await</span> response.<span className="text-blue-400">json</span>();
</code></pre>
          </div>
        </div>
      </div>
    </section>
  );
}
