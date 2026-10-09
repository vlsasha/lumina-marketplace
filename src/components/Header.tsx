'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomConnectButton } from './CustomConnectButton';
import { useAccount, useSwitchChain, useDisconnect } from 'wagmi';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { locales, Locale } from '@/lib/i18n/dictionaries';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, locale, setLocale } = useLanguage();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();

  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => {
    // If connected to wrong network, force switch to Vana (1480)
    if (isConnected && chain?.id !== 1480 && switchChain) {
      switchChain({ chainId: 1480 });
    }
  }, [isConnected, chain?.id, switchChain]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=VANAUSDT');
        const data = await res.json();
        if (data.price) {
          setPrice(parseFloat(data.price).toFixed(3));
        }
      } catch (err) {
        // Silently ignore if fails
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-vana-border safe-top">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Image src="/logo.jpg" alt="Lumina Logo" width={32} height={32} className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-vana-text font-semibold text-lg leading-tight tracking-tight">
                Lumina
              </span>
              <span className="text-[10px] text-vana-text-muted uppercase tracking-[0.2em] leading-none hidden sm:block">
                API Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">{t.nav.home}</NavLink>
            <NavLink href="/sources">{t.nav.sources}</NavLink>
            <NavLink href="/dashboard">{t.nav.dashboard}</NavLink>
            <NavLink href="/pricing">{t.nav.pricing}</NavLink>
            
            <NavLink href="/docs">{t.nav.docs}</NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* VANA Price */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FCD535]/10 border border-[#FCD535]/20 text-xs text-vana-text-secondary transition-colors hover:bg-[#FCD535]/20">
              <span className="text-[#FCD535] font-semibold">VANA</span>
              <span className="text-white font-mono font-medium">
                {price ? `$${price}` : '...'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FCD535] animate-pulse" />
            </div>

            {/* Network Badge */}
            <a 
              href="https://chainlist.org/chain/1480" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-vana-card border border-vana-border text-xs hover:border-vana-primary/50 transition-colors group"
            >
              <span className="w-2 h-2 rounded-full bg-vana-green status-pulse" />
              <span className="text-vana-text-secondary group-hover:text-vana-text transition-colors">Vana Mainnet</span>
            </a>

            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-vana-card border border-vana-border hover:border-vana-primary/50 transition-colors"
                title="Change Language"
              >
                <span className="text-sm font-bold uppercase">{locale}</span>
              </button>
              
              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute right-0 top-14 w-48 bg-[#111] border border-[#222] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
                    <div className="p-2 border-b border-[#222]">
                      <p className="text-xs text-gray-500 font-semibold px-2 uppercase">Change Language</p>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-1">
                      {locales.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { setLocale(l.code); setIsLangMenuOpen(false); }}
                          className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${locale === l.code ? 'bg-vana-primary/10 text-vana-primary' : 'text-gray-300 hover:bg-[#222]'}`}
                        >
                          
                          <span className="font-medium text-sm w-full text-left">{l.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="hidden sm:block">
              <CustomConnectButton />
            </div>

            <div className="relative hidden sm:block">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-vana-card border border-vana-border hover:border-vana-primary transition-colors hover:shadow-lg hover:shadow-vana-primary/20 group"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-vana-text-secondary group-hover:text-vana-primary transition-colors">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-[#333] rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
                  <Link 
                    href="/account" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#222] transition-colors"
                  >
                    {t.nav.personalCabinet}
                  </Link>
                  
                  {isConnected && (
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          if (isConnected) disconnect();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#222] transition-colors"
                      >
                        {t.common.signOut}
                      </button>
                    )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-vana-card transition-colors"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-vana-border animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</MobileNavLink>
              <MobileNavLink href="/sources" onClick={() => setIsMenuOpen(false)}>{t.nav.sources}</MobileNavLink>
            <MobileNavLink href="/dashboard" onClick={() => setIsMenuOpen(false)}>{t.nav.dashboard}</MobileNavLink>
            <MobileNavLink href="/pricing" onClick={() => setIsMenuOpen(false)}>{t.nav.pricing}</MobileNavLink>
            
            <MobileNavLink href="/docs" onClick={() => setIsMenuOpen(false)}>{t.nav.docs}</MobileNavLink>
            
              <div className="pt-3 border-t border-vana-border">
                <p className="text-xs text-gray-500 font-semibold px-3 uppercase mb-2">Change Language</p>
                <div className="grid grid-cols-2 gap-2 px-3">
                  {locales.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLocale(l.code)}
                      className={`flex items-center justify-center gap-2 px-2 py-2 rounded-lg border ${locale === l.code ? 'border-vana-primary bg-vana-primary/10 text-vana-primary' : 'border-[#333] bg-[#111] text-gray-400'}`}
                    >
                      <span className="text-xs font-medium uppercase">{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-vana-border">
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-vana-text-secondary">
                <span className="w-2 h-2 rounded-full bg-vana-green status-pulse" />
                {t.nav.vanaMainnet} • Chain 1480
              </div>
              <div className="mt-4 flex flex-col gap-3">
                
                <div className="w-full flex justify-center [&>div]:w-full [&_button]:w-full">
                  <CustomConnectButton />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-lg text-sm text-vana-text-secondary hover:text-vana-text hover:bg-white/5 transition-all"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-3 rounded-lg text-sm text-vana-text-secondary hover:text-vana-text hover:bg-white/5 transition-all touch-highlight"
    >
      {children}
    </Link>
  );
}
