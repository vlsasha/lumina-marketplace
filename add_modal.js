const fs = require('fs');
let code = fs.readFileSync('src/app/account/page.tsx', 'utf8');

const modalState = `  const [loading, setLoading] = useState(true);
  const [downloadModal, setDownloadModal] = useState<any>(null);

  const handleDownload = (format: string, datasetId: string) => {
    const content = format === 'CSV' 
      ? 'id,username,followers\\n1,mock_user,1500' 
      : '{"id":1,"username":"mock_user","followers":1500}';
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${datasetId.toLowerCase().replace(/\\s/g, '_')}.\${format.toLowerCase()}\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };`;

code = code.replace('const [loading, setLoading] = useState(true);', modalState);

const buttonJSX = `<td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setDownloadModal(p)}
                        className="text-white bg-vana-green/20 text-vana-green hover:bg-vana-green/30 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                      >
                        Download / Connect
                      </button>
                    </td>`;

code = code.replace(/<td className="px-6 py-4 text-right">[\s\S]*?<\/td>/g, buttonJSX);

const modalJSX = `
      {downloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-lg p-8 relative">
            <button 
              onClick={() => setDownloadModal(null)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Access Dataset</h3>
            <p className="text-gray-400 text-sm mb-6">Choose how you want to access your purchased "{downloadModal.dataset_id}" data.</p>
            
            <div className="space-y-4">
              <div className="p-4 border border-[#333] rounded-xl flex items-center justify-between hover:border-vana-primary transition-colors">
                <div>
                  <h4 className="text-white font-semibold mb-1">JSONL Download</h4>
                  <p className="text-xs text-gray-500">Download data in JSON Lines format.</p>
                </div>
                <button onClick={() => handleDownload('JSONL', downloadModal.dataset_id)} className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm font-semibold rounded-lg">Download</button>
              </div>

              <div className="p-4 border border-[#333] rounded-xl flex items-center justify-between hover:border-vana-primary transition-colors">
                <div>
                  <h4 className="text-white font-semibold mb-1">CSV Download</h4>
                  <p className="text-xs text-gray-500">Download data as a comma-separated values file.</p>
                </div>
                <button onClick={() => handleDownload('CSV', downloadModal.dataset_id)} className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm font-semibold rounded-lg">Download</button>
              </div>

              <div className="p-4 border border-[#333] rounded-xl hover:border-vana-primary transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold mb-1">REST API</h4>
                    <p className="text-xs text-gray-500">Connect programmatically via API.</p>
                  </div>
                </div>
                <div className="bg-black border border-[#222] rounded p-3 overflow-x-auto">
                  <code className="text-xs text-vana-primary font-mono whitespace-pre">
{'curl -X GET "https://api.lumina.vana/v1/datasets/' + downloadModal.id + '" \\\\n  -H "Authorization: Bearer ' + (apiKey === 'Loading...' ? 'YOUR_API_KEY' : apiKey) + '"}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

code = code.replace(/<\/div>\s*<\/div>\s*\);\s*}\s*$/, modalJSX);

fs.writeFileSync('src/app/account/page.tsx', code);
console.log('Added modal');
