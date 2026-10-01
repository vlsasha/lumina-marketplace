const fs = require('fs');
let c = fs.readFileSync('src/app/docs/page.tsx', 'utf8');

const regex = /\{\/\* PROOF OF CONTRIBUTION \*\/\}[\s\S]*?<\/section>/;

const replaceDocs = `{/* DATA QUALITY & ANTI-SYBIL */}
            <section id="poc" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">Data Quality & Anti-Sybil (PoC)</h2>
              <p className="text-vana-text-secondary mb-6 leading-relaxed">
                To prevent fraud and maintain the highest quality of training data for AI models, Lumina implements a rigorous Proof of Contribution (PoC) protocol built directly into our indexing engine.
              </p>
              
              <div className="space-y-8">
                {/* Deduplication */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="bg-vana-primary/20 text-vana-primary px-2 py-0.5 rounded text-sm">1</span>
                    Data Deduplication (Anti-Sybil)
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    A major threat to data marketplaces is Sybil attacks—users attempting to sell the same data multiple times by creating new crypto wallets. Lumina solves this using <strong>Provider ID Uniqueness</strong>.
                  </p>
                  <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                    <ul className="list-disc pl-4 space-y-2 text-sm text-gray-400">
                      <li>When a user connects a dataset, our backend parses the raw JSON payload.</li>
                      <li>We extract the immutable system ID from the platform (e.g., <code>youtube_channel_id</code> or ChatGPT's root <code>conversation_id</code>).</li>
                      <li>This ID is stored as <code>provider_account_id</code> with a strict <strong>UNIQUE SQL Constraint</strong>.</li>
                      <li>If a user switches wallets or logs in via Google/Email and tries to upload the same account again, the database physically rejects the transaction (409 Conflict). One human = One dataset.</li>
                    </ul>
                  </div>
                </div>

                {/* Quality Scoring */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="bg-vana-primary/20 text-vana-primary px-2 py-0.5 rounded text-sm">2</span>
                    Dynamic Quality Scoring (Trust Tiers)
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Not all data is created equal. A YouTube account from 2006 with 10,000 watched videos is infinitely more valuable to AI researchers than a bot account created yesterday.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                      <h4 className="font-bold text-white mb-2 text-sm">Algorithm Example (YouTube)</h4>
                      <ul className="space-y-1 text-xs text-gray-400">
                        <li className="flex justify-between"><span>Account created before 2016:</span> <span className="text-vana-green">+40 pts</span></li>
                        <li className="flex justify-between"><span>Account created before 2021:</span> <span className="text-vana-green">+20 pts</span></li>
                        <li className="flex justify-between"><span>History &gt; 20 items:</span> <span className="text-vana-green">+20 pts</span></li>
                        <li className="flex justify-between"><span>Subscriptions &gt; 10 items:</span> <span className="text-vana-green">+40 pts</span></li>
                      </ul>
                    </div>
                    <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                      <h4 className="font-bold text-white mb-2 text-sm">Algorithm Example (ChatGPT)</h4>
                      <ul className="space-y-1 text-xs text-gray-400">
                        <li className="flex justify-between"><span>Conversations &gt; 100:</span> <span className="text-vana-green">+50 pts</span></li>
                        <li className="flex justify-between"><span>Conversations &gt; 50:</span> <span className="text-vana-green">+30 pts</span></li>
                        <li className="flex justify-between"><span>Total Messages &gt; 1000:</span> <span className="text-vana-green">+50 pts</span></li>
                        <li className="flex justify-between"><span>Total Messages &gt; 300:</span> <span className="text-vana-green">+30 pts</span></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Dynamic Pricing */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="bg-vana-primary/20 text-vana-primary px-2 py-0.5 rounded text-sm">3</span>
                    Dynamic Pricing Engine
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    The Data Query Builder integrates these scores to offer dynamic, tier-based pricing. This ensures data buyers get exactly the quality they pay for, and high-quality data providers receive premium payouts.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#333] text-gray-400">
                          <th className="py-3 font-medium">Quality Tier</th>
                          <th className="py-3 font-medium">Score Range</th>
                          <th className="py-3 font-medium">Est. Price / Profile</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        <tr className="border-b border-[#222]">
                          <td className="py-3"><span className="text-amber-400 font-bold">💎 Tier S (Premium)</span></td>
                          <td className="py-3 font-mono">80 - 100</td>
                          <td className="py-3 font-mono text-vana-primary">$5.00</td>
                        </tr>
                        <tr className="border-b border-[#222]">
                          <td className="py-3"><span className="text-gray-200 font-bold">Tier A (High Quality)</span></td>
                          <td className="py-3 font-mono">60 - 79</td>
                          <td className="py-3 font-mono text-vana-primary">$2.00</td>
                        </tr>
                        <tr className="border-b border-[#222]">
                          <td className="py-3"><span className="text-gray-400 font-bold">Tier B (Standard)</span></td>
                          <td className="py-3 font-mono">40 - 59</td>
                          <td className="py-3 font-mono text-vana-primary">$0.50</td>
                        </tr>
                        <tr>
                          <td className="py-3"><span className="text-gray-500 font-bold">Tier C (Low / Any)</span></td>
                          <td className="py-3 font-mono">0 - 39</td>
                          <td className="py-3 font-mono text-vana-primary">$0.10</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>`;

c = c.replace(regex, replaceDocs);
fs.writeFileSync('src/app/docs/page.tsx', c);
