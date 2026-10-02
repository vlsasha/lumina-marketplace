const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// Fix initial volume state from 10 to 1
file = file.replace(
  `const [volume, setVolume] = useState<number>(10);`,
  `const [volume, setVolume] = useState<number>(1);`
);

// Fix useEffect that ensures volume doesn't exceed inventory
file = file.replace(
  `setVolume(Math.max(10, availableInventory));`,
  `setVolume(Math.max(1, availableInventory));`
);

// Fix slider input
const oldSlider = `                  <input 
                    type="range" 
                    min="10" 
                    max={availableInventory > 10 ? availableInventory : 10} 
                    step="10"
                    value={volume} 
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-vana-primary"
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
                    <span>10</span>
                    <span>{availableInventory.toLocaleString()}</span>
                  </div>`;

const newSlider = `                  <input 
                    type="range" 
                    min="1" 
                    max={Math.max(1, availableInventory)} 
                    step="1"
                    value={volume} 
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-vana-primary"
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
                    <span>1</span>
                    <span>{availableInventory.toLocaleString()}</span>
                  </div>`;

file = file.replace(oldSlider, newSlider);

// Also fix the treasury subtraction in useEffect fetching /api/providers
// If we have 1 real user, data.count might be 2 (if treasury is there)
// But to prevent UI bugs where it shows 0, let's just use data.count
file = file.replace(
  `setTotalUsersAvailable(data.count <= 1 ? 0 : data.count - 1);`,
  `setTotalUsersAvailable(data.count);`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
