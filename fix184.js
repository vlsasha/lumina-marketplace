const fs = require('fs');

let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

file = file.replace(/>80 pts/g, '&gt;80 pts');
file = file.replace(/<20 pts/g, '&lt;20 pts');

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
