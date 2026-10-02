const fs = require('fs');

// 1. Update DataQueryBuilder.tsx
let uiFile = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

uiFile = uiFile.replace(
  `<option>18-24</option>\n                  <option>25-34</option>\n                  <option>30-40</option>\n                  <option>35-44</option>\n                  <option>45+</option>`,
  `<option>18-24</option>\n                  <option>25-31</option>\n                  <option>32-38</option>\n                  <option>39-45</option>\n                  <option>45+</option>`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', uiFile);

// 2. Update api/providers/route.ts
let providersFile = fs.readFileSync('src/app/api/providers/route.ts', 'utf8');
providersFile = providersFile.replace(`if (ageParam === '25-34') ageKeyword = '199';`, `if (ageParam === '25-31') ageKeyword = '199';`);
providersFile = providersFile.replace(`if (ageParam === '35-44') ageKeyword = '198';`, `if (ageParam === '32-38') ageKeyword = '198';`);
providersFile = providersFile.replace(`if (ageParam === '45+') ageKeyword = '197';`, `if (ageParam === '39-45') ageKeyword = '198';\n      if (ageParam === '45+') ageKeyword = '197';`);
fs.writeFileSync('src/app/api/providers/route.ts', providersFile);

// 3. Update api/inventory/sources/route.ts
let inventoryFile = fs.readFileSync('src/app/api/inventory/sources/route.ts', 'utf8');
inventoryFile = inventoryFile.replace(`if (ageParam === '25-34') ageKeyword = '199';`, `if (ageParam === '25-31') ageKeyword = '199';`);
inventoryFile = inventoryFile.replace(`if (ageParam === '35-44') ageKeyword = '198';`, `if (ageParam === '32-38') ageKeyword = '198';`);
inventoryFile = inventoryFile.replace(`if (ageParam === '45+') ageKeyword = '197';`, `if (ageParam === '39-45') ageKeyword = '198';\n      if (ageParam === '45+') ageKeyword = '197';`);
fs.writeFileSync('src/app/api/inventory/sources/route.ts', inventoryFile);
