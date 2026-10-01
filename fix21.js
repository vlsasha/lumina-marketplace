const fs = require('fs');

// 1. Update API route
let api = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

const targetApi = `          const subs = json?.data?.results?.['youtube.subscriptions']?.data?.data?.subscriptions;
          if (subs && subs.length >= 10) qualityScore += 40;
        }`;

const replaceApi = `          const subs = json?.data?.results?.['youtube.subscriptions']?.data?.data?.subscriptions;
          if (subs && subs.length >= 10) qualityScore += 40;
        } else if (connection.sourceId === 'chatgpt') {
          const convos = json?.conversations;
          if (Array.isArray(convos)) {
            // Assign unique ID based on first conversation UUID as proxy
            if (convos.length > 0 && convos[0].id) {
              providerAccountId = 'chatgpt_' + convos[0].id;
            }
            
            // Calculate quality score based on volume
            if (convos.length > 100) qualityScore += 50;
            else if (convos.length > 50) qualityScore += 30;
            else if (convos.length > 10) qualityScore += 10;
            
            // Calculate based on message density
            let totalMsgs = 0;
            convos.forEach((c: any) => { totalMsgs += (c.message_count || 0); });
            if (totalMsgs > 1000) qualityScore += 50;
            else if (totalMsgs > 300) qualityScore += 30;
            else if (totalMsgs > 50) qualityScore += 10;
          }
        }`;

api = api.replace(targetApi, replaceApi);
fs.writeFileSync('src/app/api/connections/route.ts', api);

// 2. Update DataQueryBuilder
let builder = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

const targetState = `  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [dataAge, setDataAge] = useState<number>(30); // in days`;
const replaceState = `  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [dataAge, setDataAge] = useState<number>(30); // in days
  const [qualityTier, setQualityTier] = useState<string>('Any');`;
builder = builder.replace(targetState, replaceState);

const targetDerived = `  // Derived state (mock calculations)
  const baseInventory = 12540;
  const sourceMultiplier = selectedSources.length > 0 ? (selectedSources.length * 0.15) : 1;
  const ageMultiplier = dataAge < 30 ? 0.4 : dataAge < 90 ? 0.7 : 1;
  
  const rawInventory = baseInventory * sourceMultiplier * ageMultiplier;
  const availableProfiles = Math.max(1, Math.floor(rawInventory));
  
  const costPerProfile = 1.5;
  const estimatedCost = availableProfiles * costPerProfile;`;
const replaceDerived = `  // Derived state
  const tierConfig: Record<string, { price: number, rarity: number }> = {
    'Any': { price: 0.10, rarity: 1.0 },
    'Tier B (Top 50%)': { price: 0.50, rarity: 0.5 },
    'Tier A (Top 20%)': { price: 2.00, rarity: 0.2 },
    'Tier S (Premium 5%)': { price: 5.00, rarity: 0.05 },
  };

  const selectedTier = tierConfig[qualityTier] || tierConfig['Any'];
  
  const baseInventory = 15420;
  const sourceMultiplier = selectedSources.length > 0 ? (selectedSources.length * 0.15) : 1;
  const ageMultiplier = dataAge < 30 ? 0.4 : dataAge < 90 ? 0.7 : 1;
  
  const rawInventory = baseInventory * sourceMultiplier * ageMultiplier * selectedTier.rarity;
  const availableProfiles = Math.max(1, Math.floor(rawInventory));
  
  const costPerProfile = selectedTier.price;
  const estimatedCost = availableProfiles * costPerProfile;`;
builder = builder.replace(targetDerived, replaceDerived);

const targetUI = `          {/* Date Range Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-vana-text">Max Data Age</label>
              <span className="text-xs font-mono bg-[#1a1a1a] px-2 py-1 rounded text-vana-primary border border-[#333]">
                {dataAge} Days
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="365" 
              value={dataAge}
              onChange={(e) => setDataAge(parseInt(e.target.value))}
              className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-vana-primary"
            />
          </div>`;
const replaceUI = `          {/* Date Range Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-vana-text">Max Data Age</label>
              <span className="text-xs font-mono bg-[#1a1a1a] px-2 py-1 rounded text-vana-primary border border-[#333]">
                {dataAge} Days
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="365" 
              value={dataAge}
              onChange={(e) => setDataAge(parseInt(e.target.value))}
              className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-vana-primary"
            />
          </div>
          
          {/* Quality Tier Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-vana-text block mb-3">Minimum Quality Tier</label>
            <div className="grid grid-cols-2 gap-2">
              {['Any', 'Tier B (Top 50%)', 'Tier A (Top 20%)', 'Tier S (Premium 5%)'].map(tier => (
                <button
                  key={tier}
                  onClick={() => setQualityTier(tier)}
                  className={\`py-2 px-3 rounded-xl text-xs font-semibold transition-all \${
                    qualityTier === tier
                      ? 'bg-vana-primary text-black shadow-[0_0_10px_rgba(205,255,100,0.2)]'
                      : 'bg-[#111] text-gray-400 border border-[#222] hover:border-vana-primary/50'
                  }\`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>`;
builder = builder.replace(targetUI, replaceUI);
fs.writeFileSync('src/components/DataQueryBuilder.tsx', builder);
