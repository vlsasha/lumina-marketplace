export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Connect & Sync',
      description: 'Users connect their wallets and securely sync their personal data from popular platforms like Instagram, Spotify, or LinkedIn.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Companies Browse Data',
      description: 'Firms, AI researchers, and brands browse the marketplace and request access to valuable user-owned datasets.',
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
      title: 'Users Get Paid',
      description: 'Users choose which requests to approve and receive instant monetary rewards in crypto for their data.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Data is Delivered',
      description: 'Buyers receive verified, high-quality data to train models and build products, completing the cycle.',
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
    <section id="how-it-works" className="py-16 sm:py-24 border-t border-vana-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-vana-text">
            How It Works
          </h2>
          <p className="mt-3 text-vana-text-secondary max-w-xl mx-auto">
            A transparent marketplace where users get paid for their data and companies get the insights they need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
