const fs = require('fs');

let providers = fs.readFileSync('src/app/api/providers/route.ts', 'utf8');

// Replace jsonbFilter logic
const oldJsonbLogic = `    // Build dynamic where clause for JSONB filtering
    let jsonbFilter = sql\\\`\\\`;
    if (regionParam && regionParam !== 'Global') {
      // Look inside the downloaded_data JSON for a country/location match.
      // This uses PostgreSQL JSONB operators to search various paths depending on the provider.
      // Using ILIKE for case-insensitive matching if it was text, but with JSONB we cast to text.
      jsonbFilter = sql\\\`
        AND EXISTS (
          SELECT 1 FROM downloaded_data dd 
          WHERE dd.connection_id = user_connections.connection_id
          AND (
            (dd.data::text ILIKE \\\`%\\\${regionParam}%\\\`)
          )
        )
      \\\`;
    }

    if (ageParam && ageParam !== 'Any') {
      // Simulating age extraction. In reality, most providers don't give age in raw JSON.
      // This will just scan the text for keywords as a placeholder MVP implementation.
      let ageKeyword = '';
      if (ageParam === '18-24') ageKeyword = '200'; // born in 200x
      if (ageParam === '25-31') ageKeyword = '199'; // born in 199x
      if (ageParam === '32-38') ageKeyword = '198';
      if (ageParam === '39-45') ageKeyword = '198';
      if (ageParam === '45+') ageKeyword = '197';
      
      if (ageKeyword) {
        jsonbFilter = sql\\\`
          \\\${jsonbFilter}
          AND EXISTS (
            SELECT 1 FROM downloaded_data dd 
            WHERE dd.connection_id = user_connections.connection_id
            AND (dd.data::text ILIKE \\\`%\\\${ageKeyword}%\\\`)
          )
        \\\`;
      }
    }`;

// Since string matching is hard, I'll use regex again
providers = providers.replace(
  /\/\/ Build dynamic where clause for JSONB filtering[\s\S]*?if \(ageKeyword\) \{[\s\S]*?\}\n    \}/,
  `    let sqlFilter = sql\`\`;
    if (regionParam && regionParam !== 'Global') {
      sqlFilter = sql\` AND region = \${regionParam}\`;
    }
    if (ageParam && ageParam !== 'Any') {
      sqlFilter = sql\` \${sqlFilter} AND age_group = \${ageParam}\`;
    }`
);
providers = providers.replace(/\$\{jsonbFilter\}/g, '${sqlFilter}');

fs.writeFileSync('src/app/api/providers/route.ts', providers);

// Do the same for inventory sources
let inventory = fs.readFileSync('src/app/api/inventory/sources/route.ts', 'utf8');
inventory = inventory.replace(
  /\/\/ Build dynamic where clause for JSONB filtering[\s\S]*?if \(ageKeyword\) \{[\s\S]*?\}\n    \}/,
  `    let sqlFilter = sql\`\`;
    if (regionParam && regionParam !== 'Global') {
      sqlFilter = sql\` AND region = \${regionParam}\`;
    }
    if (ageParam && ageParam !== 'Any') {
      sqlFilter = sql\` \${sqlFilter} AND age_group = \${ageParam}\`;
    }`
);
inventory = inventory.replace(/\$\{jsonbFilter\}/g, '${sqlFilter}');

fs.writeFileSync('src/app/api/inventory/sources/route.ts', inventory);
