const fs = require('fs');
let code = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

code = code.replace("alert('Dataset purchased successfully!');", "");
// Also remove the payment failed alert just in case it annoys them too, they can check metamask
code = code.replace("alert('Payment failed.');", "console.error('Payment failed UI alert removed');");

fs.writeFileSync('src/components/DataQueryBuilder.tsx', code);
console.log('Removed annoying alerts');
