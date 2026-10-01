const fs = require('fs');

let ds = fs.readFileSync('src/lib/data-sources.ts', 'utf8');

const oldRates = `export const EARNINGS_RATES = [
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
];`;

const newRates = `export const EARNINGS_RATES = [
  { id: 'github', metric: 'Verified Dev Profile & Code', price: 15.00, monthlyYield: 5.00 },
  { id: 'linkedin', metric: 'Professional Network Graph', price: 10.00, monthlyYield: 2.00 },
  { id: 'oura', metric: 'Continuous Biometric Stream', price: 5.00, monthlyYield: 10.00 },
  { id: 'whoop', metric: 'Continuous Recovery Stream', price: 5.00, monthlyYield: 10.00 },
  { id: 'chatgpt', metric: 'Reasoning Trace & Prompts', price: 4.00, monthlyYield: 2.00 },
  { id: 'claude', metric: 'Project Context & Prompts', price: 4.00, monthlyYield: 2.00 },
  { id: 'amazon', metric: 'Historical Purchases + Sync', price: 3.50, monthlyYield: 1.00 },
  { id: 'icloud_notes', metric: 'Knowledge Base + Sync', price: 3.00, monthlyYield: 1.00 },
  { id: 'youtube', metric: 'Psychographic Watch Profile', price: 1.50, monthlyYield: 0.50 },
  { id: 'instagram', metric: 'Social Engagement Graph', price: 1.50, monthlyYield: 0.50 },
  { id: 'spotify', metric: 'Audio Affinity Profile', price: 1.50, monthlyYield: 0.50 },
  { id: 'strava', metric: 'Endurance & Route Log', price: 2.00, monthlyYield: 1.00 }
];`;

// Replace exact match if possible, otherwise use a regex
if (ds.includes(oldRates)) {
  ds = ds.replace(oldRates, newRates);
} else {
  // Regex fallback
  ds = ds.replace(/export const EARNINGS_RATES = \[[\s\S]*?\];/, newRates);
}

fs.writeFileSync('src/lib/data-sources.ts', ds);
