const fs = require('fs');
let c = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

const targetSection = c.substring(c.indexOf('<section id="sources"'), c.length);

const newSection = `
  return (
    <section id="sources" className="pt-6 pb-16 sm:pt-8 sm:pb-20">
      <div className="w-full 2xl:px-12 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Data Sources
          </h2>
          <p className="text-vana-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
            Browse available data sources. Connect your accounts securely via Vana's decentralized protocol.
          </p>
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
                  className={\`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 \${
                    activeCategory === category
                      ? 'bg-vana-primary text-black shadow-[0_0_15px_rgba(205,255,100,0.3)] scale-105'
                      : 'bg-[#111] text-gray-400 border border-[#333] hover:border-vana-primary/50 hover:text-white'
                  }\`}
                >
                  {category}
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
                No data sources available in this category.
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
                  <h3 className="text-white font-bold text-lg">How to Connect</h3>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">Secure Vana Protocol</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] text-gray-400 text-xs font-bold flex items-center justify-center group-hover:border-vana-primary group-hover:text-vana-primary transition-colors">1</div>
                    <div className="w-px h-full bg-[#222] my-1 group-hover:bg-vana-primary/30 transition-colors" />
                  </div>
                  <div className="pb-4">
                    <h4 className="text-sm font-semibold text-white mb-1">Install Vana Desktop</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Most data sources require the official <a href="https://vana.org/desktop" target="_blank" rel="noreferrer" className="text-vana-primary hover:underline">Vana Desktop application</a> to securely run local algorithms without exposing your data.</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] text-gray-400 text-xs font-bold flex items-center justify-center group-hover:border-vana-primary group-hover:text-vana-primary transition-colors">2</div>
                    <div className="w-px h-full bg-[#222] my-1 group-hover:bg-vana-primary/30 transition-colors" />
                  </div>
                  <div className="pb-4">
                    <h4 className="text-sm font-semibold text-white mb-1">Pre-Login to Accounts</h4>
                    <p className="text-xs text-gray-400 leading-relaxed"><span className="text-amber-400/90 font-medium">Crucial step:</span> Before clicking connect, ensure you are logged into the respective social network or service in your default browser. This ensures Vana can accurately sync the exact data scopes listed on the card.</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] text-gray-400 text-xs font-bold flex items-center justify-center group-hover:border-vana-primary group-hover:text-vana-primary transition-colors">3</div>
                    <div className="w-px h-full bg-[#222] my-1 group-hover:bg-vana-primary/30 transition-colors" />
                  </div>
                  <div className="pb-4">
                    <h4 className="text-sm font-semibold text-white mb-1">Approve Connection</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Click "Connect Data" on any card here to launch the Vana Data Connection Request (DCR) flow.</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-vana-primary/10 border border-vana-primary/30 text-vana-primary text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(205,255,100,0.2)]">4</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Earn & Monetize</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Once validated by the Proof of Contribution (PoC) oracle, your data generates dynamic USDC yields based on your Quality Tier.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-[#222] flex items-center justify-between relative z-10">
                <span className="text-xs text-gray-500 font-medium">Security</span>
                <span className="text-[10px] bg-vana-green/10 text-vana-green border border-vana-green/20 px-2 py-0.5 rounded flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-vana-green" />End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
`;

c = c.replace(targetSection, newSection);

fs.writeFileSync('src/components/SourcesGrid.tsx', c);
