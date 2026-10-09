const fs = require('fs');

let code = fs.readFileSync('src/app/account/page.tsx', 'utf8');

const skeletonHtml = `
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse bg-[#111] border border-[#222] rounded-xl p-6">
                <div className="h-4 bg-[#333] rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-[#222] rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-[#222] rounded w-1/3 mb-6"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-[#222] rounded w-24"></div>
                  <div className="h-8 bg-[#222] rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
`;

code = code.replace(
  '<div className="p-12 text-center text-gray-500">Loading datasets...</div>',
  skeletonHtml
);

fs.writeFileSync('src/app/account/page.tsx', code);
