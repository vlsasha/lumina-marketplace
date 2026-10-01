import { DATA_SOURCES } from '@/lib/data-sources';

const EARNINGS_RATES = [
  { id: 'github', metric: 'Verified Developer Export', price: 25.00 },
  { id: 'linkedin', metric: 'Professional CV Graph', price: 15.00 },
  { id: 'oura', metric: 'Biometrics & Sleep Log', price: 12.00 },
  { id: 'whoop', metric: 'Recovery & Strain Log', price: 12.00 },
  { id: 'chatgpt', metric: 'AI Reasoning Trace', price: 5.00 },
  { id: 'claude', metric: 'AI Project Context', price: 5.00 },
  { id: 'youtube', metric: 'Watch History Profile', price: 3.50 },
  { id: 'icloud_notes', metric: 'Personal Knowledge Base', price: 3.00 },
  { id: 'instagram', metric: 'Social Engagement Graph', price: 2.50 },
  { id: 'strava', metric: 'Endurance & Route Log', price: 2.00 },
  { id: 'spotify', metric: 'Audio Affinity Profile', price: 1.50 },
  { id: 'amazon', metric: 'Basic Prime Demographic', price: 0.50 }
];

export function EarningsTable() {
  return (
    <div className="bg-vana-card border border-vana-border rounded-2xl p-5 shadow-lg">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-vana-text uppercase tracking-wider mb-1">
          Estimated Earnings
        </h2>
        <p className="text-xs text-vana-text-muted">
          Current market rates per verified profile export.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-vana-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1a1a1a] text-vana-text-secondary border-b border-vana-border">
            <tr>
              <th className="py-2.5 px-3 font-medium">Source</th>
              <th className="py-2.5 px-3 font-medium">Metric (Export Type)</th>
              <th className="py-2.5 px-3 font-medium text-right">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vana-border bg-black/20">
            {EARNINGS_RATES.map((rate) => {
              const source = DATA_SOURCES.find(s => s.id === rate.id);
              if (!source) return null;

              return (
                <tr key={rate.id} className="hover:bg-vana-primary/5 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-white flex items-center justify-center shrink-0">
                        <img src={source.icon} alt={source.name} className="w-3 h-3 object-contain" />
                      </div>
                      <span className="text-vana-text font-medium">{source.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-vana-text-secondary">
                    {rate.metric}
                  </td>
                  <td className="py-2.5 px-3 text-vana-text font-mono text-right">
                    ${rate.price.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-[10px] text-vana-text-muted text-center flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-vana-green animate-pulse" />
        Rates dynamically updated via Lumina Oracle
      </div>
    </div>
  );
}
