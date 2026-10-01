const fs = require('fs');

let page = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// 1. Calculate totalYield
const oldLogic = `  const totalEarnings = connections.reduce((acc, conn) => {
    if (conn.status !== 'approved' && conn.status !== 'completed') return acc;
    const rate = EARNINGS_RATES.find(r => r.id === conn.sourceId)?.price || 0;
    const multiplier = (conn.qualityScore || 0) / 100;
    return acc + (rate * multiplier);
  }, 0);
  
  const displayBalance = totalEarnings.toFixed(2);`;

const newLogic = `  const totalEarnings = connections.reduce((acc, conn) => {
    if (conn.status !== 'approved' && conn.status !== 'completed') return acc;
    const rate = EARNINGS_RATES.find(r => r.id === conn.sourceId)?.price || 0;
    const multiplier = (conn.qualityScore || 0) / 100;
    return acc + (rate * multiplier);
  }, 0);

  const totalYield = connections.reduce((acc, conn) => {
    if (conn.status !== 'approved' && conn.status !== 'completed') return acc;
    // @ts-ignore - TS might not know about monthlyYield yet if not fully recompiled
    const rate = EARNINGS_RATES.find(r => r.id === conn.sourceId)?.monthlyYield || 0;
    const multiplier = (conn.qualityScore || 0) / 100;
    return acc + (rate * multiplier);
  }, 0);
  
  const displayBalance = totalEarnings.toFixed(2);
  const displayYield = totalYield.toFixed(2);`;

page = page.replace(oldLogic, newLogic);

// 2. Add UI for Yield
const oldUI = `              <div>
                <h2 className="text-sm font-semibold text-vana-text-secondary uppercase tracking-wider mb-1">Your Accumulated Earnings</h2>
                <div className="flex items-end gap-2">
                  <span className="text-4xl sm:text-5xl font-bold text-vana-text">{displayBalance}</span>
                  <span className="text-xl text-vana-text-secondary mb-1">USDC.e</span>
                </div>
                
              </div>`;

const newUI = `              <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                <div>
                  <h2 className="text-sm font-semibold text-vana-text-secondary uppercase tracking-wider mb-1">Initial Sync Earnings</h2>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-vana-text">{displayBalance}</span>
                    <span className="text-xl text-vana-text-secondary mb-1">USDC</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-px bg-vana-border hidden sm:block"></div>
                  <h2 className="text-sm font-semibold text-vana-green uppercase tracking-wider mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-vana-green animate-pulse"></span>
                    Monthly Passive Yield
                  </h2>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-white">+{displayYield}</span>
                    <span className="text-xl text-vana-text-secondary mb-1">USDC / mo</span>
                  </div>
                </div>
              </div>`;

page = page.replace(oldUI, newUI);

fs.writeFileSync('src/app/dashboard/page.tsx', page);
