'use client';

import { useState, useEffect } from 'react';
import { DATA_SOURCES } from '@/lib/data-sources';
import { useAccount } from 'wagmi';
import { SourceCard } from './SourceCard';

export function SourcesGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const { address } = useAccount();
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vana_connections');
    if (saved) {
      setConnections(JSON.parse(saved));
    }
    
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
    const conn = connections.find(c => c.sourceId === source.id);
    if (conn && (conn.status === 'completed' || conn.status === 'approved')) {
      return { ...source, status: 'connected' as const };
    }
    return source;
  });

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(availableSources.map(s => s.category)))];

  // Filter sources based on active category
  const filteredSources = activeCategory === 'All' 
    ? availableSources 
    : availableSources.filter(s => s.category === activeCategory);

  return (
    <section id="sources" className="pt-6 pb-16 sm:pt-8 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Data Sources
          </h2>
          <p className="text-vana-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
            Browse available data sources. Connect your accounts securely via Vana&apos;s decentralized protocol.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
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
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 animate-fade-in">
          {filteredSources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
        
        {filteredSources.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No data sources available in this category.
          </div>
        )}
      </div>
    </section>
  );
}
