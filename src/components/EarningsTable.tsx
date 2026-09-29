import { DATA_SOURCES } from '@/lib/data-sources';

const EARNINGS_RATES = [
  { id: 'youtube', metric: 'Published Video', price: 0.06 },
  { id: 'github', metric: 'Repository', price: 0.50 },
  { id: 'linkedin', metric: 'Profile + Conn.', price: 1.50 },
  { id: 'oura', metric: 'Day (Biometrics)', price: 0.07 },
  { id: 'whoop', metric: 'Day (Recovery)', price: 0.07 },
  { id: 'amazon', metric: 'Purchase', price: 0.12 },
  { id: 'strava', metric: 'Activity', price: 0.08 },
  { id: 'claude', metric: 'Project Dialogue', price: 0.04 },
  { id: 'chatgpt', metric: 'Conversation', price: 0.03 },
  { id: 'icloud_notes', metric: 'Note', price: 0.03 },
  { id: 'instagram', metric: 'Post / Reel', price: 0.02 },
  { id: 'spotify', metric: 'Streamed Track', price: 0.004 }
];

export function EarningsTable() {
  return (
    <div className="bg-vana-card border border-vana-border rounded-2xl p-5 shadow-lg">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-vana-text uppercase tracking-wider mb-1">
          Estimated Earnings
        </h2>
        <p className="text-xs text-vana-text-muted">
          Current market rates per verified unit of data.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-vana-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1a1a1a] text-vana-text-secondary border-b border-vana-border">
            <tr>
              <th className="py-2.5 px-3 font-medium">Source</th>
              <th className="py-2.5 px-3 font-medium">Metric</th>
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
                    ${rate.price.toFixed(3).replace(/0$/, '')}
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
