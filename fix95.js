const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(
  `{(conn?.status === 'approved' || conn?.status === 'completed') ? (conn.scopesApproved?.length || 1) : source.scopes.length} scope{((conn?.status === 'approved' || conn?.status === 'completed') ? (conn.scopesApproved?.length || 1) : source.scopes.length) !== 1 ? 's' : ''}`,
  `{(conn?.status === 'approved' || conn?.status === 'completed') ? (conn.scopesApproved?.length || 0) : source.scopes.length} scope{((conn?.status === 'approved' || conn?.status === 'completed') ? (conn.scopesApproved?.length || 0) : source.scopes.length) !== 1 ? 's' : ''}`
);
c = c.replace(
  /\{source\.scopes\.length\} scope\{source\.scopes\.length !== 1 \? 's' : ''\}/g,
  `{(conn?.status === 'approved' || conn?.status === 'completed') ? (conn.scopesApproved?.length || 0) : source.scopes.length} scope{((conn?.status === 'approved' || conn?.status === 'completed') ? (conn.scopesApproved?.length || 0) : source.scopes.length) !== 1 ? 's' : ''}`
);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
