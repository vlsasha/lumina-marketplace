const fs = require('fs');
let code = fs.readFileSync('src/app/account/page.tsx', 'utf8');

const regexKey = /\.then\(data => \{\s*if \(data\.key\) setApiKey\(data\.key\);\s*else setApiKey\('No active key'\);\s*\}\)/m;
const replacementKey = `.then(data => {
            if (data.error) setApiKey('DB Error: ' + data.details);
            else if (data.key) setApiKey(data.key);
            else setApiKey('No active key');
          })`;

code = code.replace(regexKey, replacementKey);

const regexPurchases = /\.then\(data => \{\s*if \(data\.purchases\) setPurchases\(data\.purchases\);\s*setLoading\(false\);\s*\}\)/m;
const replacementPurchases = `.then(data => {
            if (data.error) { alert('DB Error loading purchases: ' + data.details); }
            if (data.purchases) setPurchases(data.purchases);
            setLoading(false);
          })`;

code = code.replace(regexPurchases, replacementPurchases);

fs.writeFileSync('src/app/account/page.tsx', code);
console.log('Modified UI to show DB errors');
