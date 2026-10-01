const fs = require('fs');

let page = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const regex = /<div>\s*<h2 className="text-sm font-semibold text-vana-text-secondary uppercase tracking-wider mb-1">Your Accumulated Earnings<\/h2>[\s\S]*?<\/div>/;

const newUI = `<div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                <div>
                  <h2 className="text-sm font-semibold text-vana-text-secondary uppercase tracking-wider mb-1">Initial Sync Earnings</h2>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-vana-text">{displayBalance}</span>
                    <span className="text-xl text-vana-text-secondary mb-1">USDC</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-8 top-2 bottom-2 w-px bg-vana-border hidden sm:block"></div>
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

page = page.replace(regex, newUI);

fs.writeFileSync('src/app/dashboard/page.tsx', page);
