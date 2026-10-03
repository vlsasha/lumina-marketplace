const fs = require('fs');

let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Title/Subtitle
code = code.replace(/<p className="text-vana-text-secondary">\s*Manage your data source connections and preview data\.\s*<\/p>/, '<p className="text-vana-text-secondary">\n              {pDict.pageSubtitle}\n            </p>');

// Stat cards
code = code.replace(/label="Available Sources"/, 'label={pDict.availableSources}');
code = code.replace(/label="Connected"/, 'label={pDict.connected}');
code = code.replace(/label="Pending"/, 'label={pDict.pending}');
code = code.replace(/label="Total Scopes"/, 'label={pDict.totalScopes}');

// Balances headers
code = code.replace(/>Available Balance<\/h2>/, '>{pDict.availableBalance}</h2>');
code = code.replace(/>Estimated Value<\/h2>/, '>{pDict.estimatedValue}</h2>');
code = code.replace(/>Active Connections<\/h2>/, '>{pDict.activeConnections}</h2>');
code = code.replace(/>Data Quality Score<\/h2>/, '>{pDict.dataQualityScore}</h2>');

// PoC Pending
code = code.replace(/>PoC: Pending<\/span>/, '>{pDict.pocPending}</span>');

// Claim to wallet
code = code.replace(/>Claim to Wallet<\/button>/, '>{pDict.claimToWallet}</button>');

fs.writeFileSync('src/app/dashboard/page.tsx', code, 'utf8');
console.log('Dashboard patched!');
