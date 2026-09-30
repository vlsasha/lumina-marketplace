const sdk = require('@opendatalabs/vana-sdk');
console.log(Object.keys(sdk).filter(k => k.toLowerCase().includes('connect') || k.toLowerCase().includes('request') || k.toLowerCase().includes('vana')));
