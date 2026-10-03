'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';




import { DATA_SOURCES } from '@/lib/data-sources';

export function MonetizeInfoSection() {
  const { t } = useLanguage();
  const groups = [
    {
      title: t.monetize.groups.health,
      description: t.monetize.groups.healthDesc,
      sources: ['oura', 'whoop', 'strava'],
      glow: 'from-[#FC4C02] to-[#000000]'
    },
    {
      title: t.monetize.groups.prof,
      description: t.monetize.groups.profDesc,
      sources: ['linkedin', 'github'],
      glow: 'from-[#0A66C2] to-[#ffffff]'
    },
    {
      title: t.monetize.groups.commerce,
      description: t.monetize.groups.commerceDesc,
      sources: ['chatgpt', 'claude', 'amazon'],
      glow: 'from-[#10A37F] to-[#FF9900]'
    },
    {
      title: t.monetize.groups.social,
      description: t.monetize.groups.socialDesc,
      sources: ['youtube', 'spotify', 'instagram', 'icloud_notes'],
      glow: 'from-[#FF0000] to-[#E4405F]'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      {/* Decorative gradient background */}
      <div className="absolute top-1/3 right-1/3 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-vana-primary/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t.monetize.title}
          </h2>
          <p className="text-lg text-gray-400">
            {t.monetize.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {groups.map((group, idx) => (
            <div 
              key={idx}
              className="relative p-8 rounded-3xl bg-[#111111] border border-[#222222] hover:border-vana-primary/50 transition-all group overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${group.glow} opacity-0 group-hover:opacity-10 blur-[64px] transition-opacity duration-500 rounded-full`} />
              
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{group.title}</h3>
              <p className="text-sm text-gray-400 mb-8 h-12 relative z-10">{group.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {group.sources.map(sourceId => {
                  const source = DATA_SOURCES.find(s => s.id === sourceId);
                  if (!source) return null;
                  return (
                    <div key={source.id} className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-white/5">
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white/10 rounded-lg p-1">
                        <img src={source.icon} alt={source.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-200 truncate">{source.name}</div>
                        <div className="text-xs text-gray-500 truncate">{source.category}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

