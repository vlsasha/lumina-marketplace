const fs = require('fs');
let code = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

const target = `<p className="text-xs text-gray-400 leading-relaxed">{sDict.howTo.step1Desc}</p>`;
const replacement = `<p className="text-xs text-gray-400 leading-relaxed">{sDict.howTo.step1Desc}</p>
                    <a href="https://github.com/vana-com/data-connect/releases/latest" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-lg bg-vana-primary/10 border border-vana-primary/20 text-xs font-semibold text-vana-primary hover:bg-vana-primary hover:text-black transition-all">
                      Download Vana Desktop
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </a>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/SourcesGrid.tsx', code);
    console.log("Successfully added download link.");
} else {
    console.log("Target string not found in SourcesGrid.tsx.");
}
