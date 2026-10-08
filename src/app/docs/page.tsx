'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { PAGES_DICT } from '@/lib/i18n/pages-dict';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useState } from 'react';

const DOCS_SECTIONS = (pDict: any, t: any) => [
  { id: 'overview', title: t.docs.sections.overview },
  { id: 'privacy', title: pDict.navPrivacy },
  { id: 'providers', title: t.docs.sections.providers },
  { id: 'buyers', title: t.docs.sections.buyers },
  { id: 'tokenomics', title: pDict.navTokenomics },
  { id: 'architecture', title: t.docs.sections.architecture },
  { id: 'poc', title: t.docs.sections.poc },
];

export default function DocsPage() {
  const { locale } = useLanguage();
  const pDict = PAGES_DICT[locale as keyof typeof PAGES_DICT]?.docs || PAGES_DICT.en.docs;
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-vana-dark text-white flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 flex gap-12">
        
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0 fixed h-[calc(100vh-120px)] overflow-y-auto pr-6 border-r border-vana-border">
          <h2 className="text-xs font-bold text-vana-text-muted uppercase tracking-wider mb-4">{t.docs.title}</h2>
          <nav className="space-y-1">
            {DOCS_SECTIONS(pDict, t).map((section) => (
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
            <h1 className="text-4xl font-bold mb-8">{pDict.title}</h1>
            <p className="text-xl text-vana-text-secondary mb-12 leading-relaxed">
              {pDict.welcome}
            </p>

            {/* OVERVIEW */}
            <section id="overview" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">{pDict.platformOverview}</h2>
              <p className="text-vana-text-secondary mb-4 leading-relaxed">
                {pDict.platformDesc1}
              </p>
              <p className="text-vana-text-secondary mb-4 leading-relaxed">
                {pDict.platformDesc2}
              </p>
            </section>

            {/* PRIVACY & CRYPTO (NEW) */}
            <section id="privacy" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">{pDict.privacyTitle}</h2>
              <p className="text-vana-text-secondary mb-6 leading-relaxed">
                {pDict.privacyDesc1}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#111] border border-[#222] p-5 rounded-xl">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-vana-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {pDict.privacyE2EE}
                  </h4>
                  <p className="text-sm text-vana-text-secondary leading-relaxed">
                    {pDict.privacyE2EEDesc}
                  </p>
                </div>
                <div className="bg-[#111] border border-[#222] p-5 rounded-xl">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-vana-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    {pDict.privacyTEE}
                  </h4>
                  <p className="text-sm text-vana-text-secondary leading-relaxed">
                    {pDict.privacyTEEDesc}
                  </p>
                </div>
              </div>
            </section>

            {/* PROVIDERS */}
            <section id="providers" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">{pDict.forProviders}</h2>
              <h3 className="text-lg font-semibold mb-3 mt-6">{pDict.howItWorks}</h3>
              <ul className="list-disc pl-5 space-y-2 text-vana-text-secondary mb-6">
                <li>
                  <strong>{pDict.hw1Prefix}</strong>
                  {pDict.hw1.replace(/^.*(?:Personal Server|Персональный сервер|Servidor Personal|Pessoal|Persönlicher Server|个人服务器|개인 서버)[:\s]+/, '')}
                  <br/>
                  <span className="text-sm mt-1 inline-block opacity-80">
                    <em>{pDict.hw1Note}</em>
                  </span>
                </li>
                <li><strong>{pDict.hw2Prefix}</strong>{pDict.hw2}</li>
                <li><strong>{pDict.hw3Prefix}</strong>{pDict.hw3}</li>
                <li><strong>{pDict.hw4Prefix}</strong>{pDict.hw4}</li>
              </ul>
              
              <div className="bg-vana-card border border-vana-border rounded-xl p-5 mb-6">
                <h4 className="font-semibold text-vana-green mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {pDict.instantClaiming}
                </h4>
                <p className="text-sm text-vana-text-secondary">
                  {pDict.instantClaimingDesc}
                </p>
              </div>
            </section>

            {/* BUYERS */}
            <section id="buyers" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">{pDict.forBuyers}</h2>
              <p className="text-vana-text-secondary mb-4 leading-relaxed">
                {pDict.forBuyersDesc}
              </p>
              
              <h3 className="text-lg font-semibold mb-3">{pDict.datasetFormats}</h3>
              <p className="text-vana-text-secondary mb-4">
                {pDict.datasetFormatsDesc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#111] border border-[#333] p-4 rounded-lg text-center">
                  <span className="font-mono text-vana-primary font-bold">.JSONL</span>
                  <p className="text-xs text-gray-400 mt-2">{pDict.idealForLLM}</p>
                </div>
                <div className="bg-[#111] border border-[#333] p-4 rounded-lg text-center">
                  <span className="font-mono text-vana-green font-bold">.CSV</span>
                  <p className="text-xs text-gray-400 mt-2">{pDict.idealForGraph}</p>
                </div>
                <div className="bg-[#111] border border-[#333] p-4 rounded-lg text-center">
                  <span className="font-mono text-purple-400 font-bold">REST API</span>
                  <p className="text-xs text-gray-400 mt-2">{pDict.standardApi}</p>
                </div>
              </div>

              <p className="text-vana-text-secondary mb-4 leading-relaxed">
                {pDict.hybridBridge}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-vana-text-secondary mb-6">
                <li>{pDict.authOnChain}</li>
                <li>{pDict.authApiKey}</li>
                <li>{pDict.authOffChain}</li>
              </ul>

              <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden mb-6">
                <div className="bg-black/50 px-4 py-2 border-b border-[#333] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                  <span className="ml-2 text-xs font-mono text-gray-400">{pDict.curlExample}</span>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-gray-300">
<code className="text-vana-green">import</code> requests<br/><br/>
API_KEY = <span className="text-yellow-300">"db_live_7x89gkqj1p2m4m2p"</span><br/>
ENDPOINT = <span className="text-yellow-300">"https://lumina-marketplace.vercel.app/api/download"</span><br/><br/>
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

            {/* TOKENOMICS & FEES (NEW) */}
            <section id="tokenomics" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">{pDict.tokenomicsTitle}</h2>
              <p className="text-vana-text-secondary mb-6 leading-relaxed">
                {pDict.feeDesc}
              </p>
              
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center p-4 bg-[#111] rounded-xl border border-vana-primary/30 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-vana-primary"></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg">{pDict.fee80}</h4>
                    <p className="text-sm text-vana-text-secondary">{pDict.fee80Desc}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-[#111] rounded-xl border border-[#333] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-500"></div>
                    <h4 className="font-bold text-white mb-1">{pDict.fee10}</h4>
                    <p className="text-xs text-vana-text-secondary">{pDict.fee10Desc}</p>
                  </div>
                  <div className="p-4 bg-[#111] rounded-xl border border-[#333] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-vana-green"></div>
                    <h4 className="font-bold text-white mb-1">{pDict.fee5Oracle}</h4>
                    <p className="text-xs text-vana-text-secondary">{pDict.fee5OracleDesc}</p>
                  </div>
                  <div className="p-4 bg-[#111] rounded-xl border border-[#333] relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                    <h4 className="font-bold text-white mb-1">{pDict.fee5Liquidity}</h4>
                    <p className="text-xs text-vana-text-secondary">{pDict.fee5LiquidityDesc}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 border-l-4 border-vana-primary bg-vana-card rounded-r-xl">
                <h4 className="font-mono font-bold text-white mb-2">{pDict.vanaVsUsdc}</h4>
                <p className="text-sm text-vana-text-secondary leading-relaxed">
                  {pDict.vanaVsUsdcDesc}
                </p>
              </div>
            </section>

            {/* ARCHITECTURE */}
            <section id="architecture" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">{pDict.archAndContracts}</h2>
              <p className="text-vana-text-secondary mb-4">
                {pDict.archIntro}
              </p>
              
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-vana-primary bg-vana-card">
                  <h4 className="font-mono font-bold text-white mb-1 flex items-center gap-2">LuminaMarketplace.sol <a href="https://vanascan.io/address/0xA89C2D92421B4a3B4d409668AeCC58B464E5fd32" target="_blank" rel="noopener noreferrer" className="text-xs font-normal text-vana-primary hover:underline bg-vana-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">{pDict.viewOnVanaScan} <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a></h4>
                  <p className="text-sm text-vana-text-secondary">
                    {pDict.luminaMarketplaceDesc}
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-vana-green bg-vana-card">
                  <h4 className="font-mono font-bold text-white mb-1">USDC.e (Token)</h4>
                  <p className="text-sm text-vana-text-secondary">
                    {pDict.usdcTokenDesc}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3 mt-8">{pDict.secOpsTitle}</h3>
              <p className="text-vana-text-secondary mb-4 leading-relaxed">
                {pDict.secOpsDesc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#111] border border-[#222] p-4 rounded-xl">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-vana-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {pDict.circuitBreaker}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {pDict.circuitBreakerDesc}
                  </p>
                </div>
                <div className="bg-[#111] border border-[#222] p-4 rounded-xl">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-vana-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    {pDict.reentrancyGuards}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {pDict.reentrancyGuardsDesc}
                  </p>
                </div>
                <div className="bg-[#111] border border-[#222] p-4 rounded-xl sm:col-span-2">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    {pDict.gnosisSafe}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {pDict.gnosisSafeDesc}
                  </p>
                </div>
              </div>
            </section>

            {/* DATA QUALITY & ANTI-SYBIL */}
            <section id="poc" className="scroll-mt-32 mb-16">
              <h2 className="text-2xl font-bold border-b border-vana-border pb-2 mb-6">{pDict.pocTitle}</h2>
              <p className="text-vana-text-secondary mb-6 leading-relaxed">
                {pDict.pocIntro}
              </p>
              
              <div className="space-y-8 mb-10">
                {/* Deduplication */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="bg-vana-primary/20 text-vana-primary px-2 py-0.5 rounded text-sm">1</span>
                    {pDict.poc1}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {pDict.poc1Desc}
                  </p>
                  <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                    <ul className="list-disc pl-4 space-y-2 text-sm text-gray-400">
                      <li>{pDict.poc1Li1}</li>
                      <li>{pDict.poc1Li2}</li>
                      <li>{pDict.poc1Li3}</li>
                      <li>{pDict.poc1Li4}</li>
                    </ul>
                  </div>
                </div>

                {/* Quality Scoring */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="bg-vana-primary/20 text-vana-primary px-2 py-0.5 rounded text-sm">2</span>
                      {pDict.poc2}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {pDict.poc2Desc}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                        <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2"><span className="text-vana-primary">✦</span> {pDict.poc2Pillar1Title}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{pDict.poc2Pillar1Desc}</p>
                      </div>
                      <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                        <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2"><span className="text-vana-primary">▤</span> {pDict.poc2Pillar2Title}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{pDict.poc2Pillar2Desc}</p>
                      </div>
                      <div className="bg-[#111] p-4 rounded-xl border border-[#222]">
                        <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2"><span className="text-vana-primary">✓</span> {pDict.poc2Pillar3Title}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{pDict.poc2Pillar3Desc}</p>
                      </div>
                    </div>
                  </div>
  
                  {/* Dynamic Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="bg-vana-primary/20 text-vana-primary px-2 py-0.5 rounded text-sm">3</span>
                      {pDict.poc3}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {pDict.poc3Desc}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#333] text-gray-400">
                            <th className="py-3 font-medium">{pDict.poc3TableCol1}</th>
                            <th className="py-3 font-medium">{pDict.poc3TableCol2}</th>
                            <th className="py-3 font-medium">{pDict.poc3TableCol3}</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-300">
                          <tr className="border-b border-[#222]">
                            <td className="py-3"><span className="text-amber-400 font-bold">💎 {pDict.tierA}</span></td>
                            <td className="py-3 font-mono">80 - 100</td>
                            <td className="py-3 font-mono text-vana-primary">{pDict.base80_100}</td>
                          </tr>
                          <tr className="border-b border-[#222]">
                            <td className="py-3"><span className="text-gray-200 font-bold">🔘 {pDict.tierB}</span></td>
                            <td className="py-3 font-mono">60 - 79</td>
                            <td className="py-3 font-mono text-vana-primary">{pDict.base60_79}</td>
                          </tr>
                          <tr className="border-b border-[#222]">
                            <td className="py-3"><span className="text-gray-400 font-bold">🔸 {pDict.tierC}</span></td>
                            <td className="py-3 font-mono">40 - 59</td>
                            <td className="py-3 font-mono text-vana-primary">{pDict.base40_59}</td>
                          </tr>
                          <tr>
                            <td className="py-3"><span className="text-gray-500 font-bold">🔻 {pDict.tierD}</span></td>
                            <td className="py-3 font-mono">0 - 39</td>
                            <td className="py-3 font-mono text-vana-primary">{pDict.base0_39}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 p-4 rounded-xl bg-vana-primary/5 border border-vana-primary/20 flex gap-3 items-start">
                      <div className="text-xl">💡</div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{pDict.poc3ExTitle}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{pDict.poc3ExDesc}</p>
                      </div>
                    </div>
                  </div>
              </div>

              {/* DISPUTE RESOLUTION (NEW) */}
              <h3 className="text-xl font-bold border-t border-vana-border pt-8 pb-4">{pDict.disputeTitle}</h3>
              <p className="text-vana-text-secondary mb-6 leading-relaxed">
                {pDict.disputeDesc}
              </p>
              <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl">
                <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {pDict.slashingTitle}
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {pDict.slashingDesc}
                </p>
              </div>

            </section>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
