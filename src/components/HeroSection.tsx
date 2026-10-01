'use client';

import Link from 'next/link';

export function HeroSection() {


  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-vana-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-vana-primary-light/3 rounded-full blur-[80px]" />
      </div>

      <div className="relative w-full 2xl:px-12 mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="text-center max-w-4xl mx-auto">

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-slide-up">
            <span className="gradient-text">API Marketplace</span>
            <br />
            <span className="text-vana-text">for{' '}</span>
            <span className="gradient-text-primary">Vana Data</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-vana-text-secondary max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Connect, access, and monetize user-owned data from 10+ sources through one unified API.
            Built on{' '}
            <a href="https://vana.org" target="_blank" rel="noopener noreferrer" className="text-vana-primary hover:text-vana-primary-light transition-colors underline decoration-vana-primary/30">
              Vana&apos;s
            </a>
            {' '}decentralized data protocol.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/sources"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-vana-primary hover:bg-vana-primary/90 text-white font-semibold text-base transition-all hover:shadow-xl hover:shadow-vana-primary/30 text-center"
            >
              Explore Sources
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
