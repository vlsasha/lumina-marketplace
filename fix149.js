const fs = require('fs');

let page = fs.readFileSync('src/app/docs/page.tsx', 'utf8');

const regex = /<div>\s*<h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">\s*<span className="bg-vana-primary\/20 text-vana-primary px-2 py-0\.5 rounded text-sm">2<\/span>\s*Dynamic Quality Scoring \(Trust Tiers\)[\s\S]*?<\/table>\s*<\/div>\s*<\/div>/;

const replacement = `<div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="bg-vana-primary/20 text-vana-primary px-2 py-0.5 rounded text-sm">2</span>
                      Dynamic Quality Scoring (Proof of Contribution)
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Not all data is created equal. The Lumina Oracle evaluates incoming data using the Proof of Contribution (PoC) consensus mechanism to assign a Quality Score from 0 to 100 based on three core pillars:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                        <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2"><span className="text-vana-primary">⏱</span> Historical Depth</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">A 5-year-old GitHub account with 500 commits scores significantly higher than a 1-week-old account created just to farm and sell data.</p>
                      </div>
                      <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                        <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2"><span className="text-vana-primary">📊</span> Data Density</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">An Oura Ring sync containing 365 days of continuous sleep architecture is worth exponentially more than a fragmented 3-day log.</p>
                      </div>
                      <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                        <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2"><span className="text-vana-primary">🛡️</span> Authenticity Risk</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">A LinkedIn profile with 500+ connections and recommendations verifies you as human, protecting B2B buyers from bot-generated data.</p>
                      </div>
                    </div>
                  </div>
  
                  {/* Dynamic Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="bg-vana-primary/20 text-vana-primary px-2 py-0.5 rounded text-sm">3</span>
                      Dynamic Pricing Engine (The Multiplier)
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      The Quality Score acts as a direct multiplier on the base price of the dataset (for both the Initial Sync and the Monthly Yield). This ensures data buyers get exactly the quality they pay for, and high-quality data providers receive premium payouts.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#333] text-gray-400">
                            <th className="py-3 font-medium">Quality Tier</th>
                            <th className="py-3 font-medium">PoC Score Range</th>
                            <th className="py-3 font-medium">Payout Multiplier</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-300">
                          <tr className="border-b border-[#222]">
                            <td className="py-3"><span className="text-amber-400 font-bold">💎 Tier A (Premium)</span></td>
                            <td className="py-3 font-mono">80 - 100</td>
                            <td className="py-3 font-mono text-vana-primary">80% - 100% of Base Price</td>
                          </tr>
                          <tr className="border-b border-[#222]">
                            <td className="py-3"><span className="text-gray-200 font-bold">🥇 Tier B (High Quality)</span></td>
                            <td className="py-3 font-mono">60 - 79</td>
                            <td className="py-3 font-mono text-vana-primary">60% - 79% of Base Price</td>
                          </tr>
                          <tr className="border-b border-[#222]">
                            <td className="py-3"><span className="text-gray-400 font-bold">🥈 Tier C (Standard)</span></td>
                            <td className="py-3 font-mono">40 - 59</td>
                            <td className="py-3 font-mono text-vana-primary">40% - 59% of Base Price</td>
                          </tr>
                          <tr>
                            <td className="py-3"><span className="text-gray-500 font-bold">🥉 Tier D (Low / Bot Risk)</span></td>
                            <td className="py-3 font-mono">0 - 39</td>
                            <td className="py-3 font-mono text-vana-primary">0% - 39% of Base Price</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 p-4 rounded-xl bg-vana-primary/5 border border-vana-primary/20 flex gap-3 items-start">
                      <div className="text-xl">💡</div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Example Calculation</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          If you connect a GitHub Developer Profile (Base Price: <span className="text-white">$15.00</span> Initial + <span className="text-white">$5.00/mo</span>), and the Oracle assigns you a Quality Score of <span className="text-vana-green font-bold">90 (Tier A)</span>:<br/><br/>
                          Initial Sync Earning = $15.00 × 0.90 = <span className="text-vana-primary font-bold">$13.50</span><br/>
                          Monthly Passive Yield = $5.00 × 0.90 = <span className="text-vana-primary font-bold">$4.50 / mo</span>
                        </p>
                      </div>
                    </div>
                  </div>`;

if (regex.test(page)) {
  page = page.replace(regex, replacement);
  fs.writeFileSync('src/app/docs/page.tsx', page);
  console.log('Successfully replaced text.');
} else {
  console.log('Regex did not match!');
}
