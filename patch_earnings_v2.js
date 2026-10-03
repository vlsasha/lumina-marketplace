const fs = require('fs');

let code = fs.readFileSync('src/components/EarningsTable.tsx', 'utf8');

code = code.replace(
    /\{rate\.metric\}/, 
    "{pDict.metrics[rate.id as keyof typeof pDict.metrics] || rate.metric}"
);

fs.writeFileSync('src/components/EarningsTable.tsx', code, 'utf8');
console.log('EarningsTable patched!');
