const fs = require('fs');
let c = fs.readFileSync('src/components/SourceCard.tsx', 'utf8');

const target = `{source.requiresDesktop ? (
            <a href="https://app.vana.org/sources" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-vana-border hover:border-vana-border-hover text-sm text-vana-text-secondary hover:text-vana-text transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              Use Desktop
            </a>
          ) : (`;

const replacement = `{source.status === 'connected' ? (
            <a href="/dashboard" className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-vana-green/10 text-vana-green text-sm font-medium transition-all hover:bg-vana-green/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5l10 -10"/></svg>
              Go to Dashboard
            </a>
          ) : source.requiresDesktop ? (
            <a href="https://app.vana.org/sources" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-vana-border hover:border-vana-border-hover text-sm text-vana-text-secondary hover:text-vana-text transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              Use Desktop
            </a>
          ) : (`;

c = c.replace(target, replacement);
fs.writeFileSync('src/components/SourceCard.tsx', c);
