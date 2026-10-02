const fs = require('fs');

function updateFile(filename) {
  let file = fs.readFileSync(filename, 'utf8');

  // Replace sqlFilter block
  file = file.replace(
    /let sqlFilter = sql\`\`;\s*if \(regionParam[\s\S]*?age_group = \$\{ageParam\}\`;\s*\}/,
    `let sqlFilter = sql\`\`;
    if (tierParam && tierParam !== 'Any') {
      if (tierParam === 'A') sqlFilter = sql\` AND quality_score >= 80\`;
      else if (tierParam === 'B') sqlFilter = sql\` AND quality_score >= 50 AND quality_score < 80\`;
      else if (tierParam === 'C') sqlFilter = sql\` AND quality_score >= 20 AND quality_score < 50\`;
      else if (tierParam === 'D') sqlFilter = sql\` AND quality_score < 20\`;
    }`
  );
  
  fs.writeFileSync(filename, file);
}

updateFile('src/app/api/providers/route.ts');
updateFile('src/app/api/inventory/sources/route.ts');
