'use client';

import { useState, useEffect } from 'react';
import { DATA_SOURCES } from '@/lib/data-sources';
import { SOURCES_DICT } from '@/lib/i18n/sources-dict';
import { useAccount } from 'wagmi';
import { useSession } from 'next-auth/react';
import { SourceCard } from './SourceCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function SourcesGrid() {
  const { locale } = useLanguage();
  const sDict = SOURCES_DICT[locale as keyof typeof SOURCES_DICT] || SOURCES_DICT.en;
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const getCategoryTranslation = (cat: string) => {
    switch (cat) {
      case 'All': return t.sources.categories.all;
      case 'Social Media': return t.sources.categories.socialMedia;
      case 'Professional': return t.sources.categories.professional;
      case 'Entertainment': return t.sources.categories.entertainment;
      case 'E-Commerce': return t.sources.categories.ecommerce;
      case 'Productivity': return t.sources.categories.productivity;
      case 'Health & Fitness': return t.sources.categories.healthFitness;
      default: return cat;
    }
  };

  
  const { address, isConnected } = useAccount();
  const sessionObj = useSession();
  const isAuthenticated = isConnected || sessionObj?.status === 'authenticated';
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    
    
    if (address) {
      fetch(`/api/connections?wallet=${address}`)
        .then(res => res.json())
        .then(data => {
          if (data.connections && data.connections.length > 0) {
            setConnections(prev => {
              const merged = [...data.connections];
              prev.forEach(p => {
                if (!merged.find(m => m.sourceId === p.sourceId)) {
                  merged.push(p);
                }
              });
              return merged;
            });
          }
        })
        .catch(console.error);
    }
  }, [address]);

  const availableSources = DATA_SOURCES.map(source => {
    if (!isAuthenticated) return { ...source, qualityScore: 0 };
    const conn = connections.find(c => c.sourceId === source.source || c.sourceId === source.id);
    if (conn && (conn.status === 'completed' || conn.status === 'approved')) {
      return { ...source, status: 'connected' as const, qualityScore: conn.qualityScore };
    }
    return { ...source, qualityScore: conn?.qualityScore };
  });

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(availableSources.map(s => s.category)))];
  const getCategoryName = (c: string) => c === 'All' ? sDict.all : sDict.categories[c as keyof typeof sDict.categories] || c;

  // Filter sources based on active category
  const filteredSources = activeCategory === 'All' 
    ? availableSources 
    : availableSources.filter(s => s.category === activeCategory);

  const sortedFilteredSources = [...filteredSources].sort((a, b) => {
    if (a.status === 'connected' && b.status !== 'connected') return -1;
    if (a.status !== 'connected' && b.status === 'connected') return 1;
    if (a.status === 'connected' && b.status === 'connected') {
       return (b.qualityScore || 0) - (a.qualityScore || 0);
    }
    return 0;
  });

  return (
    <section id="sources" className="pt-6 pb-16 sm:pt-8 sm:pb-20">
      <div className="w-full 2xl:px-12 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{sDict.pageTitle}</h2>
          <p className="text-vana-text-secondary max-w-2xl mx-auto text-sm sm:text-base">{sDict.pageSubtitle}</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 lg:gap-10 items-start">
          
          {/* Main Left Content */}
          <div className="flex-1 w-full min-w-0">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center xl:justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-vana-primary text-black shadow-[0_0_15px_rgba(205,255,100,0.3)] scale-105'
                      : 'bg-[#111] text-gray-400 border border-[#333] hover:border-vana-primary/50 hover:text-white'
                  }`}
                >
                  {getCategoryName(category)}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 animate-fade-in">
              {sortedFilteredSources.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
            
            {filteredSources.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                {sDict.noSources}
              </div>
            )}
          </div>

          {/* Right Sidebar Instructions */}
          <div className="w-full xl:w-[360px] 2xl:w-[420px] shrink-0 xl:sticky xl:top-28 mt-8 xl:mt-0">
            <div className="rounded-2xl bg-gradient-to-br from-[#121216] to-[#0a0a0c] border border-[#2a2a35] p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-vana-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-vana-primary/10 border border-vana-primary/20 flex items-center justify-center text-vana-primary shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{t.sources.howTo.title}</h3>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">{sDict.howTo.sidebarTitle}</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] text-gray-400 text-xs font-bold flex items-center justify-center group-hover:border-vana-primary group-hover:text-vana-primary transition-colors">1</div>
                    <div className="w-px h-full bg-[#222] my-1 group-hover:bg-vana-primary/30 transition-colors" />
                  </div>
                  <div className="pb-4">
                    <h4 className="text-sm font-semibold text-white mb-1">{sDict.howTo.step1Title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{sDict.howTo.step1Desc}</p>
                    <a href="https://app.vana.org/download" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-lg bg-vana-primary/10 border border-vana-primary/20 text-xs font-semibold text-vana-primary hover:bg-vana-primary hover:text-black transition-all">
                      Download Vana Desktop
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] text-gray-400 text-xs font-bold flex items-center justify-center group-hover:border-vana-primary group-hover:text-vana-primary transition-colors">2</div>
                    <div className="w-px h-full bg-[#222] my-1 group-hover:bg-vana-primary/30 transition-colors" />
                  </div>
                  <div className="pb-4">
                    <h4 className="text-sm font-semibold text-white mb-1">{sDict.howTo.step2Title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{sDict.howTo.step2Desc}</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] text-gray-400 text-xs font-bold flex items-center justify-center group-hover:border-vana-primary group-hover:text-vana-primary transition-colors">3</div>
                    <div className="w-px h-full bg-[#222] my-1 group-hover:bg-vana-primary/30 transition-colors" />
                  </div>
                  <div className="pb-4">
                    <h4 className="text-sm font-semibold text-white mb-1">{t.sources.howTo.step3Title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{sDict.howTo.step3Desc}</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-vana-primary/10 border border-vana-primary/30 text-vana-primary text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(205,255,100,0.2)]">4</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{t.sources.howTo.step4Title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{sDict.howTo.step4Desc}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-[#222] flex items-center justify-between relative z-10">
                <span className="text-xs text-gray-500 font-medium">{sDict.howTo.security}</span>
                <span className="text-[10px] bg-vana-green/10 text-vana-green border border-vana-green/20 px-2 py-0.5 rounded flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-vana-green" />{sDict.howTo.e2e}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}



