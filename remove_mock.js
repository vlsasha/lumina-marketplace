const fs = require('fs');
let code = fs.readFileSync('src/app/api/download/route.ts', 'utf8');

const mockBlock = `    if (records.length === 0) {
      // For developer testing, generate realistic mock payload if DB is empty
      for (let i = 1; i <= 50; i++) {
        records.push({ data: { id: i, username: baseSourceId.toLowerCase() + '_user_' + i, followers: Math.floor(Math.random() * 10000), engagement_rate: (Math.random() * 5).toFixed(2) + '%', last_active: new Date(Date.now() - Math.random() * 10000000000).toISOString() } });
      }
    }`;

const realBlock = `    if (records.length === 0) {
      return NextResponse.json({ error: 'No data available for this dataset yet.' }, { status: 404 });
    }`;

code = code.replace(mockBlock, realBlock);
fs.writeFileSync('src/app/api/download/route.ts', code);
console.log('Removed mock generation');
