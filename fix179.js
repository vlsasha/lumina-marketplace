const fs = require('fs');

let providers = fs.readFileSync('src/app/api/providers/route.ts', 'utf8');

// Replace the old query param logic
const oldLogic = `    const regionParam = searchParams.get('region');
    const ageParam = searchParams.get('age');`;
const newLogic = `    const tierParam = searchParams.get('tier');`;
providers = providers.replace(oldLogic, newLogic);

const oldSqlFilter = `    let sqlFilter = sql\\\`\\\`;
    if (regionParam && regionParam !== 'Global') {
      sqlFilter = sql\\\` AND region = \\\${regionParam}\\\`;
    }
    if (ageParam && ageParam !== 'Any') {
      sqlFilter = sql\\\` \\\${sqlFilter} AND age_group = \\\${ageParam}\\\`;
    }`;

const newSqlFilter = `    let sqlFilter = sql\`\`;
    if (tierParam && tierParam !== 'Any') {
      if (tierParam === 'A') sqlFilter = sql\` AND quality_score >= 80\`;
      else if (tierParam === 'B') sqlFilter = sql\` AND quality_score >= 50 AND quality_score < 80\`;
      else if (tierParam === 'C') sqlFilter = sql\` AND quality_score >= 20 AND quality_score < 50\`;
      else if (tierParam === 'D') sqlFilter = sql\` AND quality_score < 20\`;
    }`;

// Since regex is hard with backticks, I'll use literal string replacement carefully
providers = providers.replace(/let sqlFilter = sql` `;[\s\S]*?AND age_group = \$\{ageParam\}`;\n    \}/, newSqlFilter);

fs.writeFileSync('src/app/api/providers/route.ts', providers);

let inventory = fs.readFileSync('src/app/api/inventory/sources/route.ts', 'utf8');
inventory = inventory.replace(oldLogic, newLogic);
inventory = inventory.replace(/let sqlFilter = sql` `;[\s\S]*?AND age_group = \$\{ageParam\}`;\n    \}/, newSqlFilter);

// Also fix fallback logic in inventory
inventory = inventory.replace(
  `(!regionParam || regionParam === 'Global') && (!ageParam || ageParam === 'Any')`,
  `(!tierParam || tierParam === 'Any')`
);

fs.writeFileSync('src/app/api/inventory/sources/route.ts', inventory);
