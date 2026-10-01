const fs = require('fs');
let c = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

c = c.replace(
  `        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-vana-primary/20 bg-vana-primary/5 backdrop-blur-md mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vana-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-vana-primary"></span>
          </span>
          <span className="text-xs font-semibold text-vana-primary tracking-wide uppercase">Vana Network Mainnet Live</span>
        </div>`,
  ``
);

c = c.replace(
  `        {/* Fake Code/API Window visual */}
        <div className="mt-20 w-full max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="rounded-2xl border border-[#333] bg-[#0a0a0c] shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-vana-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Window Header */}
            <div className="px-4 py-3 border-b border-[#222] flex items-center justify-between bg-[#111]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">POST /api/vana/data</div>
              <div className="w-10"></div>
            </div>
            
            {/* Code */}
            <pre className="p-6 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed"><code>
<span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> fetch(<span className="text-green-400">'https://api.lumina.market/v1/query'</span>, {"{"}
  method: <span className="text-green-400">'POST'</span>,
  headers: {"{"} <span className="text-green-400">'Authorization'</span>: <span className="text-green-400">'Bearer vana_sk_...'</span> {"}"},
  body: JSON.<span className="text-blue-400">stringify</span>({"{"}
    source: <span className="text-green-400">'youtube'</span>,
    quality_tier_min: <span className="text-green-400">'A'</span>,
    scopes: [<span className="text-green-400">'watch_history'</span>, <span className="text-green-400">'subscriptions'</span>]
  {"}"})
{"}"});

<span className="text-gray-500">// Returns Proof of Contribution verified data</span>
<span className="text-purple-400">const</span> dataset = <span className="text-purple-400">await</span> response.<span className="text-blue-400">json</span>();
</code></pre>
          </div>
        </div>`,
  ``
);

fs.writeFileSync('src/components/HeroSection.tsx', c);
