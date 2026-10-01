import { DATA_SOURCES, getTotalScopes } from '@/lib/data-sources';

export function StatsSection() {
  const totalSources = DATA_SOURCES.length;
  const totalScopes = getTotalScopes();
  const stableScopes = DATA_SOURCES.reduce(
    (acc, s) => acc + s.scopes.filter((sc) => sc.maturity === 'stable').length,
    0
  );

  const stats = [
    {
      value: '1',
      label: 'Unified API',
      detail: 'RESTful endpoints for all Web2 sources',
      icon: <svg className="w-6 h-6 text-vana-primary mb-3 mx-auto sm:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    },
    {
      value: 'AI',
      label: 'Proof of Contribution',
      detail: 'LLM-validated authenticity scoring',
      icon: <svg className="w-6 h-6 text-vana-primary mb-3 mx-auto sm:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
    },
    {
      value: 'ZK',
      label: 'Zero-Knowledge Privacy',
      detail: 'PII redacted before B2B sales',
      icon: <svg className="w-6 h-6 text-vana-primary mb-3 mx-auto sm:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    },
    {
      value: '100%',
      label: 'User Owned',
      detail: 'Data stays on Personal Servers',
      icon: <svg className="w-6 h-6 text-vana-primary mb-3 mx-auto sm:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-vana-border">
      <div className="w-full 2xl:px-12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center sm:text-left p-6 rounded-2xl border border-vana-border bg-vana-card/50 hover:bg-vana-card transition-colors group"
            >
              {stat.icon}
              <div className="text-3xl sm:text-4xl font-bold text-vana-text mb-1 group-hover:text-vana-primary transition-colors">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-vana-text-secondary mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-vana-text-muted">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
