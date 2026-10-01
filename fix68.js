const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

c = c.replace(
  `                      }
                      });`,
  `                      })
                    });`
);

c = c.replace(
  `              }
              });`,
  `              })
            });`
);

fs.writeFileSync('src/app/dashboard/page.tsx', c);
