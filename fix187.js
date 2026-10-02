const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

// 1. Change initial state to 0
file = file.replace(
  `const [volume, setVolume] = useState<number>(1);`,
  `const [volume, setVolume] = useState<number>(0);`
);

// 2. Change useEffect boundary
file = file.replace(
  `  // Ensure volume doesn't exceed inventory
  useEffect(() => {
    if (volume > availableInventory) {
      setVolume(Math.max(1, availableInventory));
    }
  }, [availableInventory, volume]);`,
  `  // Ensure volume doesn't exceed inventory
  useEffect(() => {
    if (volume > availableInventory) {
      setVolume(Math.max(0, availableInventory));
    }
  }, [availableInventory, volume]);`
);

// 3. Change HTML slider
file = file.replace(
  `              <input 
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
              </div>`,
  `              <input 
                type="range" 
                min="0" 
                max={Math.max(0, availableInventory)} 
                step="1"
                value={volume} 
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-vana-primary"
                disabled={availableInventory === 0}
              />
              <div className="flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
                <span>0</span>
                <span>{availableInventory.toLocaleString()}</span>
              </div>`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
