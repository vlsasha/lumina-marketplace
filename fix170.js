const fs = require('fs');

let uiFile = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

const regex = /<option value="18-24">18-24<\/option>[\s\S]*?<option value="25-34">25-34<\/option>[\s\S]*?<option value="30-40">30-40<\/option>[\s\S]*?<option value="35-44">35-44<\/option>[\s\S]*?<option value="45\+">45\+<\/option>/;

const replacement = `<option value="18-24">18-24</option>
                  <option value="25-31">25-31</option>
                  <option value="32-38">32-38</option>
                  <option value="39-45">39-45</option>
                  <option value="45+">45+</option>`;

uiFile = uiFile.replace(regex, replacement);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', uiFile);
