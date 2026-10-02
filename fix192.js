const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

file = file.replace(/Number of Users to Acquire/g, 'Datasets to Acquire');
file = file.replace(/Users Volume/g, 'Datasets Volume');
file = file.replace(/\{volume\.toLocaleString\(\)\} users/g, '{volume.toLocaleString()} datasets');
file = file.replace(/Cost per User/g, 'Cost per Dataset');

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
