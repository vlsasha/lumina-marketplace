const fs = require('fs');

function injectLazyCron(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes('/api/cron/verify-purchases')) return;
  
  code = code.replace(
    'useEffect(() => {',
    `useEffect(() => {
    // Lazy cron: verify any pending purchases in the background
    fetch('/api/cron/verify-purchases').catch(()=>console.log('cron skip'));
`
  );
  fs.writeFileSync(file, code);
}

injectLazyCron('src/app/dashboard/page.tsx');
injectLazyCron('src/app/account/page.tsx');
