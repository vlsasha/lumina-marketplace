import { DATA_SOURCES, EARNINGS_RATES } from '@/lib/data-sources';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { PAGES_DICT } from '@/lib/i18n/pages-dict';
import { SOURCES_DICT } from '@/lib/i18n/sources-dict';

export function EarningsTable() {
  const { locale } = useLanguage();
  const pDict = PAGES_DICT[locale as keyof typeof PAGES_DICT]?.dashboard || PAGES_DICT.en.dashboard;
  const sDict = SOURCES_DICT[locale as keyof typeof SOURCES_DICT] || SOURCES_DICT.en;
  return (
    <div className="bg-vana-card border border-vana-border rounded-2xl p-5 shadow-lg">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-vana-text uppercase tracking-wider mb-1">
            Data Valuation
          </h2>
          <p className="text-xs text-vana-text-muted">
            Base market rate for historical data sync.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-vana-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#1a1a1a] text-vana-text-secondary border-b border-vana-border">
              <tr>
                <th className="py-2.5 px-3 font-medium">{pDict.colSource}</th>
                <th className="py-2.5 px-3 font-medium">{pDict.colPayload}</th>
                <th className="py-2.5 px-3 font-medium text-right">{pDict.colInitial}</th>
                
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
                      {pDict.metrics[rate.id as keyof typeof pDict.metrics] || rate.metric}
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
      </div>
      <div className="mt-3 text-[10px] text-vana-text-muted text-center flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-vana-green animate-pulse" />
        Rates dynamically updated via Lumina Oracle
      </div>
    </div>
  );
}
