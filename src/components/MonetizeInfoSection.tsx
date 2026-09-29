import { DATA_SOURCES } from '@/lib/data-sources';

export function MonetizeInfoSection() {
  const groups = [
    {
      title: 'Health & Biometrics',
      description: 'Your physical activity, sleep cycles, and daily recovery metrics are highly sought after by HealthTech startups and researchers.',
      sources: ['oura', 'whoop', 'strava'],
      glow: 'from-[#FC4C02] to-[#000000]'
    },
    {
      title: 'Professional & Code',
      description: 'B2B contact networks and coding repositories are premium assets for AI recruitment models and developer copilots.',
      sources: ['linkedin', 'github'],
      glow: 'from-[#0A66C2] to-[#ffffff]'
    },
    {
      title: 'AI Prompts & Commerce',
      description: 'E-commerce purchase graphs and your deep analytical AI prompts are invaluable for RLHF and consumer prediction engines.',
      sources: ['chatgpt', 'claude', 'amazon'],
      glow: 'from-[#10A37F] to-[#FF9900]'
    },
    {
      title: 'Content & Social',
      description: 'Content creators and consumers can monetize their published videos, streaming taste, and social engagement graphs.',
      sources: ['youtube', 'spotify', 'instagram', 'icloud_notes'],
      glow: 'from-[#FF0000] to-[#E4405F]'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      {/* Decorative gradient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vana-primary opacity-5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Turn Your Digital Footprint Into an Asset
          </h2>
          <p className="text-lg text-gray-400">
            Every app you use generates highly valuable data. Lumina lets you securely package and rent this data to verified buyers while keeping full control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
