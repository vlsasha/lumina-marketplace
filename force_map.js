const fs = require('fs');
let code = fs.readFileSync('src/app/api/download/route.ts', 'utf8');

code = code.replace(/const datasetName = datasetIdRaw\.replace\(\/ \\\\\(Tier \[A-Z\]\\\\\)\$\/, ''\);[\s\S]*?const baseSourceId = sourceMap\[datasetName\];/, 
\`const datasetName = datasetIdRaw.replace(/ \\\\(Tier [A-Z]\\\\)$/, '').toLowerCase();
    const sourceMap: Record<string, string> = {
      'chatgpt': 'chatgpt',
      'github': 'github',
      'instagram': 'instagram',
      'linkedin': 'linkedin',
      'spotify': 'spotify',
      'youtube': 'youtube',
      'amazon': 'amazon',
      'claude': 'claude',
      'icloud notes': 'icloud_notes',
      'oura ring': 'oura',
      'strava': 'strava',
      'whoop': 'whoop'
    };
    const baseSourceId = sourceMap[datasetName] || datasetName;\`);

fs.writeFileSync('src/app/api/download/route.ts', code);
console.log('Fixed source map lookup!');
