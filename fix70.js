const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(/\}\s*\}\s*\}\);\s*if \(!postRes\.ok\)/, `}
                      })
                    });
                    
                    if (!postRes.ok)`);

c = c.replace(/\}\s*\}\s*\}\);\s*if \(!postRes\.ok\)/, `}
              })
            });
            
            if (!postRes.ok)`);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
