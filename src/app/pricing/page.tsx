'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { PAGES_DICT } from '@/lib/i18n/pages-dict';
import { DataQueryBuilder } from '@/components/DataQueryBuilder';
export default function PricingPage() {
  const { locale } = useLanguage();
  const pDict = PAGES_DICT[locale as keyof typeof PAGES_DICT]?.pricing || PAGES_DICT.en.pricing;
  const { t } = useLanguage();
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-vana-text mb-6">{t.pricing.fairPricingTitle}</h1>
            <p className="text-lg text-vana-text-secondary">{t.pricing.fairPricingDesc}</p>
          </div>

          {/* B2B Query Builder */}
          <div className="mt-12">
            <DataQueryBuilder />
          </div>


          <div className="mt-12 max-w-4xl mx-auto bg-vana-primary/10 border border-vana-primary/20 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-vana-primary/20 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-vana-primary">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-vana-text mb-2">{pDict.needUsdcTitle}</h3>
                <p className="text-sm text-vana-text-secondary mb-4">
                  {pDict.needUsdcDesc}
                </p>
                <a 
                  href="https://stargate.finance/?dstChain=islander&dstToken=0xF1815bd50389c46847f0Bda824eC8da914045D14" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-vana-primary hover:text-vana-primary-hover transition-colors"
                >
                  {pDict.bridgeUsdc}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
