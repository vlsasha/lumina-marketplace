const fs = require('fs');
let c = fs.readFileSync('src/components/Header.tsx', 'utf8');

c = c.replace(
  `<NavLink href="/sources">Sources</NavLink>`,
  `<NavLink href="/">Home</NavLink>\n            <NavLink href="/sources">Sources</NavLink>`
);
c = c.replace(
  `<NavLink href="/analytics">Analytics</NavLink>`,
  ``
);

c = c.replace(
  `<MobileNavLink href="/sources" onClick={() => setIsMenuOpen(false)}>Sources</MobileNavLink>`,
  `<MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>\n              <MobileNavLink href="/sources" onClick={() => setIsMenuOpen(false)}>Sources</MobileNavLink>`
);
c = c.replace(
  `<MobileNavLink href="/analytics" onClick={() => setIsMenuOpen(false)}>Analytics</MobileNavLink>`,
  ``
);

fs.writeFileSync('src/components/Header.tsx', c);
