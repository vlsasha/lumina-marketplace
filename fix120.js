const fs = require('fs');

let c = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

const oldCodeBlock = `<div className="p-6 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
              <span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> fetch(<span className="text-green-400">'https://api.lumina.market/v1/query'</span>, {<br/>
              &nbsp;&nbsp;method: <span className="text-green-400">'POST'</span>,<br/>
              &nbsp;&nbsp;headers: { <span className="text-green-400">'Authorization'</span>: <span className="text-green-400">'Bearer vana_sk_...'</span> },<br/>
              &nbsp;&nbsp;body: JSON.<span className="text-blue-400">stringify</span>({<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;source: <span className="text-green-400">'youtube'</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;quality_tier_min: <span className="text-green-400">'A'</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;scopes: [<span className="text-green-400">'watch_history'</span>, <span className="text-green-400">'subscriptions'</span>]<br/>
              &nbsp;&nbsp;})<br/>
              });<br/>
              <br/>
              <span className="text-gray-500">// Returns Proof of Contribution verified data</span><br/>
              <span className="text-purple-400">const</span> dataset = <span className="text-purple-400">await</span> response.<span className="text-blue-400">json</span>();
            </div>`;

const newCodeBlock = `<pre className="p-6 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed"><code>
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
</code></pre>`;

c = c.replace(oldCodeBlock, newCodeBlock);

fs.writeFileSync('src/components/HeroSection.tsx', c);
