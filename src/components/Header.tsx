'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomConnectButton } from './CustomConnectButton';
import { useAccount, useSwitchChain } from 'wagmi';
import { signOut, signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { locales, Locale } from '@/lib/i18n/dictionaries';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, locale, setLocale } = useLanguage();
  const { status: sessionStatus } = useSession();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

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
                  
                  {sessionStatus === 'authenticated' && (
                    <button 
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        signOut();
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
                {sessionStatus !== 'authenticated' && (
                  <button 
                    onClick={() => signIn('google')}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-xl active:scale-[0.98] transition-all"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {t.common.signInGoogle}
                  </button>
                )}
                <div className="w-full flex justify-center [&>div]:w-full [&_button]:w-full">
                  <CustomConnectButton />
                </div>
                {sessionStatus === 'authenticated' && (
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-center px-4 py-3 text-sm text-red-400 active:bg-red-500/10 rounded-xl transition-all"
                  >
                    {t.common.signOut}
                  </button>
                )}
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
