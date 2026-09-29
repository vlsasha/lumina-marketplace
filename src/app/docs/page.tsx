'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useState } from 'react';

const DOCS_SECTIONS = [
  { id: 'overview', title: 'Platform Overview' },
  { id: 'providers', title: 'For Data Providers' },
  { id: 'buyers', title: 'For B2B Buyers' },
  { id: 'architecture', title: 'Architecture & Contracts' },
  { id: 'poc', title: 'Proof of Contribution (PoC)' },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-vana-dark text-white flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 flex gap-12">
        
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0 fixed h-[calc(100vh-120px)] overflow-y-auto pr-6 border-r border-vana-border">
          <h2 className="text-xs font-bold text-vana-text-muted uppercase tracking-wider mb-4">Documentation</h2>
          <nav className="space-y-1">
            {DOCS_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id 
                    ? 'bg-vana-primary/10 text-vana-primary font-medium' 
                    : 'text-vana-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-72 pb-32">
          
          <div className="prose prose-invert prose-vana max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Lumina Documentation</h1>
            <p className="text-xl text-vana-text-secondary mb-12 leading-relaxed">
              Welcome to the official developer and user documentation for Lumina. 
              Learn how to monetize your data, query verified datasets, and integrate with our Vana-powered smart contracts.
            </p>

            {/* OVERVIEW */}
            <section id="overview" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">Platform Overview</h2>
              <p className="text-vana-text-secondary mb-4 leading-relaxed">
                Lumina is a decentralized API Marketplace and Data Liquidity Pool (DLP) built natively on the <strong>Vana Network</strong>. 
                We bridge the gap between individual users who generate valuable data (Data Providers) and AI companies/researchers (B2B Buyers) who need high-quality, verified datasets to train models.
              </p>
              <p className="text-vana-text-secondary mb-4 leading-relaxed">
                By leveraging Web3 infrastructure, Lumina guarantees that users retain ownership of their data while earning fair compensation (in USDC.e) transparently routed through audited smart contracts.
              </p>
            </section>

            {/* PROVIDERS */}
            <section id="providers" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">For Data Providers</h2>
              <h3 className="text-lg font-semibold mb-3 mt-6">How it Works</h3>
              <ul className="list-disc pl-5 space-y-2 text-vana-text-secondary mb-6">
                <li><strong>Personal Server:</strong> Users securely connect their Web2 accounts (e.g., ChatGPT, Spotify, Instagram) to their own <strong>Vana Personal Server</strong> via <a href="https://app.vana.org/sources" target="_blank" rel="noopener noreferrer" className="text-vana-primary hover:underline">app.vana.org/sources</a>.</li>
                <li><strong>Data Connection Request:</strong> Lumina sends a request to the user's Personal Server asking for permission to access specific data scopes.</li>
                <li><strong>Verification:</strong> Once approved, the data undergoes an automated <em>Proof of Contribution (PoC)</em> check by AI Oracles to ensure authenticity and uniqueness.</li>
                <li><strong>Earn:</strong> When an AI company purchases data matching your demographic, you automatically receive 80% of the revenue directly to your connected EVM wallet on the Vana Network.</li>
              </ul>
              
              <div className="bg-vana-card border border-vana-border rounded-xl p-5 mb-6">
                <h4 className="font-semibold text-vana-green mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Instant Claiming
                </h4>
                <p className="text-sm text-vana-text-secondary">
                  Earnings are credited to your on-chain balance inside <code>LuminaMarketplace.sol</code>. You can click <strong>Claim to Wallet</strong> in your Dashboard at any time to withdraw your USDC.e.
                </p>
              </div>
            </section>

            {/* BUYERS */}
            <section id="buyers" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">For B2B Buyers</h2>
              <p className="text-vana-text-secondary mb-4 leading-relaxed">
                AI researchers and enterprise clients can utilize our <strong>Data Query Builder</strong> to source precision-targeted datasets.
              </p>
              
              <h3 className="text-lg font-semibold mb-3">Dataset Formats & Delivery</h3>
              <p className="text-vana-text-secondary mb-4">
                Once a transaction is confirmed on the Vana blockchain, buyers are granted immediate access to the requested dataset. Data can be exported in standard formats optimized for machine learning:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#111] border border-[#333] p-4 rounded-lg text-center">
                  <span className="font-mono text-vana-primary font-bold">.JSONL</span>
                  <p className="text-xs text-gray-400 mt-2">Ideal for LLM fine-tuning</p>
                </div>
                <div className="bg-[#111] border border-[#333] p-4 rounded-lg text-center">
                  <span className="font-mono text-vana-primary font-bold">.PARQUET</span>
                  <p className="text-xs text-gray-400 mt-2">For heavy analytical workloads</p>
                </div>
                <div className="bg-[#111] border border-[#333] p-4 rounded-lg text-center">
                  <span className="font-mono text-vana-primary font-bold">REST API</span>
                  <p className="text-xs text-gray-400 mt-2">Continuous data streaming</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3 mt-8">REST API Mechanics</h3>
              <p className="text-vana-text-secondary mb-4 leading-relaxed">
                Lumina features a hybrid Web3 ↔ Web2 bridge. Enterprise developers building AI training pipelines do not need to sign Web3 transactions in their server backends.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-vana-text-secondary mb-6">
                <li><strong>On-chain Authorization:</strong> Purchase dataset limits via the smart contract using your Web3 wallet.</li>
                <li><strong>API Key Generation:</strong> Connect your authorized wallet to the Lumina Portal to generate a standard Bearer API Key (e.g., <code>db_live_7x89...</code>).</li>
                <li><strong>Off-chain Streaming:</strong> Use the API Key in your Python or Node.js backend to securely stream the decrypted datasets. If your key is compromised, you can easily <em>Rotate Key</em> in your dashboard without losing your on-chain purchase rights.</li>
              </ul>

              <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden mb-6">
                <div className="bg-black/50 px-4 py-2 border-b border-[#333] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                  <span className="ml-2 text-xs font-mono text-gray-400">cURL / Python Example</span>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-gray-300">
<code className="text-vana-green">import</code> requests<br/><br/>
API_KEY = <span className="text-yellow-300">"db_live_7x89gkqj1p2m4m2p"</span><br/>
ENDPOINT = <span className="text-yellow-300">"https://api.Lumina.vana/v1/data/query"</span><br/><br/>
headers = &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">"Authorization"</span>: <span className="text-yellow-300">f"Bearer &#123;API_KEY&#125;"</span>,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">"Content-Type"</span>: <span className="text-yellow-300">"application/json"</span><br/>
&#125;<br/><br/>
payload = &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">"source"</span>: <span className="text-yellow-300">"instagram"</span>,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">"limit"</span>: <span className="text-yellow-300">10000</span><br/>
&#125;<br/><br/>
response = requests.post(ENDPOINT, headers=headers, json=payload)<br/>
dataset = response.json()<br/>
<code className="text-vana-green">print</code>(f<span className="text-yellow-300">"Successfully loaded &#123;len(dataset)&#125; profiles."</span>)
                  </pre>
                </div>
              </div>
            </section>

            {/* ARCHITECTURE */}
            <section id="architecture" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">Architecture & Contracts</h2>
              <p className="text-vana-text-secondary mb-4">
                Lumina relies on a robust on-chain/off-chain architecture to ensure trustless operations.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-vana-primary bg-vana-card">
                  <h4 className="font-mono font-bold text-white mb-1">LuminaMarketplace.sol</h4>
                  <p className="text-sm text-vana-text-secondary">
                    The core escrow and settlement contract deployed on Vana Mainnet. It handles <code>buyData()</code> execution, automatic 80/20 revenue splitting, and the <code>claimEarnings()</code> withdrawal mechanic.
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-vana-green bg-vana-card">
                  <h4 className="font-mono font-bold text-white mb-1">USDC.e (Token)</h4>
                  <p className="text-sm text-vana-text-secondary">
                    All transactions are denominated and settled in USDC.e to prevent price volatility for both buyers and providers.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3 mt-8">Security & Threat Prevention (SecOps)</h3>
              <p className="text-vana-text-secondary mb-4 leading-relaxed">
                Lumina implements military-grade Web3 security standards to protect user funds and dataset integrity without requiring manual human oversight.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#111] border border-[#222] p-4 rounded-xl">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-vana-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Automated Circuit Breaker
                  </h4>
                  <p className="text-xs text-gray-400">
                    Integrated with Forta/Tenderly, our monitoring bots track mempool transactions 24/7. If an anomaly is detected, the bot automatically triggers the <code>pause()</code> modifier, freezing all smart contract funds instantly.
                  </p>
                </div>
                <div className="bg-[#111] border border-[#222] p-4 rounded-xl">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-vana-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Reentrancy Guards
                  </h4>
                  <p className="text-xs text-gray-400">
                    All financial functions (<code>buyData</code>, <code>claimEarnings</code>) are protected by OpenZeppelin-standard Mutex locks to prevent recursive flash-loan draining attacks.
                  </p>
                </div>
                <div className="bg-[#111] border border-[#222] p-4 rounded-xl sm:col-span-2">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Gnosis Safe Multi-Sig
                  </h4>
                  <p className="text-xs text-gray-400">
                    The smart contract ownership is governed by a 3/5 Multi-Signature wallet. No single founder or developer can unilaterally alter protocol fees or unpause the contract without team consensus, eliminating the "single point of failure".
                  </p>
                </div>
              </div>
            </section>

            {/* PROOF OF CONTRIBUTION */}
            <section id="poc" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">Proof of Contribution (PoC)</h2>
              <p className="text-vana-text-secondary mb-4 leading-relaxed">
                To prevent fraud and maintain the highest quality of training data for AI models, Lumina implements a rigorous Proof of Contribution protocol.
              </p>
              <ol className="list-decimal pl-5 space-y-3 text-vana-text-secondary">
                <li><strong>Cryptographic Proofs:</strong> We verify the origin of data exports using signatures from the source platforms (where applicable).</li>
                <li><strong>AI Oracle Scoring:</strong> An off-chain validator node scans the dataset for volume, completeness, and entropy.</li>
                <li><strong>On-chain State:</strong> The validator calls <code>submitProofOfContribution(provider, datasetHash, score)</code> on the smart contract.</li>
                <li><strong>Marketplace Availability:</strong> Only data with a positive PoC score is indexed and made available to buyers in the Data Query Builder.</li>
              </ol>
            </section>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
