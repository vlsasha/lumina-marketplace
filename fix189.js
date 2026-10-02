const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

const regex = /<span className="text-2xl font-bold text-white">\{volume\.toLocaleString\(\)\}<\/span>/;

const replacement = `<input
                    type="number"
                    min="0"
                    max={Math.max(0, availableInventory)}
                    value={volume}
                    onChange={(e) => {
                      let val = parseInt(e.target.value) || 0;
                      if (val > availableInventory) val = availableInventory;
                      if (val < 0) val = 0;
                      setVolume(val);
                    }}
                    className="w-28 bg-black/50 border border-[#333] hover:border-[#555] rounded-xl px-3 py-1.5 text-right text-xl font-bold text-white focus:outline-none focus:border-vana-primary transition-colors appearance-none"
                  />`;

file = file.replace(regex, replacement);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
