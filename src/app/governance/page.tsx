'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAccount } from 'wagmi';

export default function GovernancePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-vana-dark text-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-[1440px] w-full mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-vana-text mb-4">Data DAO Governance</h1>
            <p className="text-vana-text-secondary text-lg max-w-2xl">
              Propose and vote on which new data sources DataBridge should integrate next. Shape the future of the marketplace.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <span className="text-sm font-semibold text-vana-text-muted">Voting Power:</span>
            {isConnected ? (
              <span className="px-4 py-2 bg-vana-primary/10 border border-vana-primary/30 rounded-lg text-vana-primary font-mono font-bold">
                1,450 vDB (Active)
              </span>
            ) : (
              <span className="px-4 py-2 bg-black border border-[#333] rounded-lg text-gray-500 font-mono">
                Connect Wallet
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Proposals */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-vana-green status-pulse" />
              Active Proposals
            </h2>
            
            {/* Proposal 1 */}
            <div className="bg-[#111] border border-vana-primary/30 rounded-2xl p-6 relative overflow-hidden transition-all hover:border-vana-primary">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-vana-primary text-black text-xs font-bold rounded">DIP-14</span>
                    <span className="text-xs text-vana-text-muted">Ends in 3 days</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Add Netflix Watch History as a Data Source</h3>
                  <p className="text-sm text-vana-text-secondary">
                    Entertainment companies are requesting viewing habits data. Should we integrate Netflix export parsing into the DataBridge SDK?
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-vana-green font-bold">YES (78%)</span>
                    <span className="text-gray-400">145,200 Votes</span>
                  </div>
                  <div className="w-full bg-[#222] rounded-full h-2">
                    <div className="bg-vana-green h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-red-500 font-bold">NO (22%)</span>
                    <span className="text-gray-400">40,900 Votes</span>
                  </div>
                  <div className="w-full bg-[#222] rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  disabled={!isConnected}
                  className="flex-1 py-2.5 bg-black border border-vana-green text-vana-green font-bold rounded-lg hover:bg-vana-green hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Vote YES
                </button>
                <button 
                  disabled={!isConnected}
                  className="flex-1 py-2.5 bg-black border border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Vote NO
                </button>
              </div>
            </div>

            {/* Proposal 2 */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6 transition-all hover:border-[#444]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#333] text-gray-300 text-xs font-bold rounded">DIP-13</span>
                    <span className="text-xs text-vana-text-muted">Ends in 12 hours</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Increase Protocol Fee to 25%?</h3>
                  <p className="text-sm text-vana-text-secondary">
                    Proposal to increase the Treasury fee from 20% to 25% to fund new marketing campaigns. Providers would receive 75% instead of 80%.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300 font-bold">YES (12%)</span>
                  </div>
                  <div className="w-full bg-[#222] rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-vana-green font-bold">NO (88%)</span>
                  </div>
                  <div className="w-full bg-[#222] rounded-full h-2">
                    <div className="bg-vana-green h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">How Voting Works</h3>
              <ul className="space-y-3 text-sm text-vana-text-secondary">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-vana-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Connect your wallet to check your voting power.
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-vana-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Voting power is based on your accumulated Proof of Contribution (PoC) score.
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-vana-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Proposals with a majority YES vote are implemented automatically by the DAO.
                </li>
              </ul>
              <button className="w-full mt-6 py-2 bg-[#222] hover:bg-[#333] text-white text-sm font-semibold rounded-lg transition-colors">
                Create Proposal
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
