const fs = require('fs');
let c = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

const target = `<div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Data Sources
          </h2>`;

const replacement = `<div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Data Sources
          </h2>
          {process.env.NODE_ENV === 'development' || true ? (
            <div className="bg-red-500/20 border border-red-500 text-left p-4 mb-4 text-xs font-mono text-white overflow-auto">
              DEBUG connections state: {JSON.stringify(connections)}
            </div>
          ) : null}`;

c = c.replace(target, replacement);
fs.writeFileSync('src/components/SourcesGrid.tsx', c);
