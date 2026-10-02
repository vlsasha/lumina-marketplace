const fs = require('fs');

let page = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const target = `                  </div>
                </div>
                
              </div>
              
              <div className="shrink-0 flex flex-col items-start md:items-end gap-4">`;

const replacement = `                  </div>
                </div>
              
              <div className="shrink-0 flex flex-col items-start md:items-end gap-4">`;

page = page.replace(target, replacement);

fs.writeFileSync('src/app/dashboard/page.tsx', page);
