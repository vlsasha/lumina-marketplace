
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
        


        {/* Title */}
        <div className="text-center w-full mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-5xl sm:text-7xl lg:text-[90px] xl:text-[110px] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 pb-2 leading-[1.1]">
            Turn your personal data <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vana-primary via-[#b9ff42] to-[#7fdb00]">into a valuable asset</span>
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
          <Link
            href="/docs"
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl border border-[#333] bg-[#111]/50 backdrop-blur-sm hover:border-vana-primary/50 text-white font-semibold text-base transition-all hover:bg-[#1a1a1a]"
          >
            Read Documentation
          </Link>
        </div>


      </div>
    </section>
  );
}
