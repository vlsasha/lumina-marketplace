const fs = require('fs');
let file = fs.readFileSync('src/components/DataQueryBuilder.tsx', 'utf8');

file = file.replace(
  `                      </div>\n                    </div>\n                    </div>\n                    <div className={\`w-3 h-3`,
  `                      </div>\n                    </div>\n                    <div className={\`w-3 h-3`
);

fs.writeFileSync('src/components/DataQueryBuilder.tsx', file);
