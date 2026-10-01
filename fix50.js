const fs = require('fs');

let c = fs.readFileSync('src/app/api/vana/data/route.ts', 'utf8');

const targetStr = `            INSERT INTO downloaded_data (connection_id, data) 
            VALUES (\${connectionId}, \${result as any}) 
            ON CONFLICT (connection_id) DO UPDATE SET data = \${result as any}`;

const replaceStr = `            INSERT INTO downloaded_data (connection_id, data) 
            VALUES (\${connectionId}, \${JSON.stringify(result)}) 
            ON CONFLICT (connection_id) DO UPDATE SET data = \${JSON.stringify(result)}`;

c = c.replace(targetStr, replaceStr);

fs.writeFileSync('src/app/api/vana/data/route.ts', c);
