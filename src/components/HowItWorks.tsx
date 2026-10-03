'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';




export function HowItWorks() {
  const { t } = useLanguage();
  const steps = [
    {
      number: '01',
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
        </svg>
      ),
    },
    {
      number: '02',
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M12 18v-6" />
          <path d="M9 15l3 3 3-3" />
        </svg>
      ),
    },
    {
      number: '03',
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      ),
    },
    {
      number: '04',
      title: t.howItWorks.step4Title,
      description: t.howItWorks.step4Desc,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 relative overflow-hidden bg-transparent">
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-vana-text">
            {t.howItWorks.title}
          </h2>
          <p className="mt-3 text-vana-text-secondary max-w-xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative p-6 rounded-2xl border border-vana-border bg-vana-card hover:bg-vana-card-hover transition-colors group"
            >
              {/* Connector line on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-vana-border" />
              )}

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-vana-primary">{step.number}</span>
                <div className="w-10 h-10 rounded-xl bg-vana-primary/10 flex items-center justify-center text-vana-primary group-hover:bg-vana-primary/20 transition-colors">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-base font-semibold text-vana-text mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-vana-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

