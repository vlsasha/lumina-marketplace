'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';





import { DATA_SOURCES, getTotalScopes } from '@/lib/data-sources';

export function StatsSection() {
  const { t } = useLanguage();
  const stats = [
    {
      value: 'Unified API',
      label: 'RESTful endpoints for all Web2 sources',
      detail: 'Access YouTube, LinkedIn, Instagram, and 10+ others through a single standardized schema.',
      icon: <svg className="w-8 h-8 text-vana-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    },
    {
      value: 'Proof of Contribution',
      label: 'LLM-validated authenticity scoring',
      detail: 'Every data point is scored by Vana network validators for quality and authenticity before sale.',
      icon: <svg className="w-8 h-8 text-vana-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
    },
    {
      value: 'Zero-Knowledge',
      label: 'Cryptographic Privacy',
      detail: 'Personally identifiable information (PII) is automatically redacted. Buyers only see encrypted aggregates.',
      icon: <svg className="w-8 h-8 text-vana-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    },
    {
      value: 'User Owned',
      label: 'Decentralized Architecture',
      detail: 'Data never leaves your local machine. Vana Desktop serves data directly from your device.',
      icon: <svg className="w-8 h-8 text-vana-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
    },
  ];

  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Background glow for stats */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vana-primary/10 blur-[120px] pointer-events-none rounded-[100%]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{t.stats.title1}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t.stats.title2}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-left p-8 rounded-3xl border border-[#222] bg-[#0a0a0c]/80 backdrop-blur-sm hover:border-vana-primary/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full hover:shadow-[0_8px_30px_rgb(205,255,100,0.04)] hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 p-24 bg-vana-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-vana-primary/10 transition-colors duration-500" />
              
              <div className="mb-6 w-14 h-14 rounded-2xl bg-[#151515] border border-[#2a2a2a] flex items-center justify-center group-hover:border-vana-primary/50 group-hover:bg-vana-primary/10 transition-all duration-500 relative z-10">
                {stat.icon}
              </div>
              
              <div className="text-xl font-bold text-white mb-2 relative z-10 group-hover:text-vana-primary transition-colors duration-300 tracking-tight">
                {stat.value}
              </div>
              
              <div className="text-sm font-semibold text-gray-300 mb-3 relative z-10">
                {stat.label}
              </div>
              
              <div className="text-sm text-gray-500 leading-relaxed relative z-10 flex-grow">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
