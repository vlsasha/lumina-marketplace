const fs = require('fs');

let ds = fs.readFileSync('src/lib/data-sources.ts', 'utf8');

const ratesCode = `
export const EARNINGS_RATES = [
  { id: 'github', metric: 'Verified Developer Export', price: 25.00 },
  { id: 'linkedin', metric: 'Professional CV Graph', price: 15.00 },
  { id: 'oura', metric: 'Biometrics & Sleep Log', price: 12.00 },
  { id: 'whoop', metric: 'Recovery & Strain Log', price: 12.00 },
  { id: 'chatgpt', metric: 'AI Reasoning Trace', price: 5.00 },
  { id: 'claude', metric: 'AI Project Context', price: 5.00 },
  { id: 'youtube', metric: 'Watch History Profile', price: 3.50 },
  { id: 'icloud_notes', metric: 'Personal Knowledge Base', price: 3.00 },
  { id: 'instagram', metric: 'Social Engagement Graph', price: 2.50 },
  { id: 'strava', metric: 'Endurance & Route Log', price: 2.00 },
  { id: 'spotify', metric: 'Audio Affinity Profile', price: 1.50 },
  { id: 'amazon', metric: 'Basic Prime Demographic', price: 0.50 }
];
`;

fs.writeFileSync('src/lib/data-sources.ts', ds + ratesCode);
