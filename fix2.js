const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const target1 = `{conn?.status === 'pending' && (
                            <div className="flex gap-2">`;
const replacement1 = `{['pending', 'denied', 'error', 'rejected'].includes(conn?.status || '') && (
                            <div className="flex gap-2">`;

content = content.replace(target1, replacement1);

const target2 = `{conn?.status === 'pending' && (
                            <span className="flex items-center gap-1 text-xs text-vana-amber px-2 py-1 rounded-lg bg-vana-amber/10">
                              <span className="w-1.5 h-1.5 rounded-full bg-vana-amber animate-pulse" />
                              Pending
                            </span>
                          )}`;
const replacement2 = `{conn?.status === 'pending' && (
                            <span className="flex items-center gap-1 text-xs text-vana-amber px-2 py-1 rounded-lg bg-vana-amber/10">
                              <span className="w-1.5 h-1.5 rounded-full bg-vana-amber animate-pulse" />
                              Pending
                            </span>
                          )}
                          {['denied', 'error', 'rejected'].includes(conn?.status || '') && (
                            <span className="flex items-center gap-1 text-xs text-vana-red px-2 py-1 rounded-lg bg-vana-red/10">
                              <span className="w-1.5 h-1.5 rounded-full bg-vana-red" />
                              {conn?.status.toUpperCase()}
                            </span>
                          )}`;

content = content.replace(target2, replacement2);

fs.writeFileSync('src/app/dashboard/page.tsx', content);
