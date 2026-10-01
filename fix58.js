const fs = require('fs');

let c = fs.readFileSync('src/lib/data-sources.ts', 'utf8');

const regex = /\{\s*id: 'github\.profile',\s*name: 'Profile',\s*description: 'GitHub profile including bio, company, location, and stats',\s*maturity: 'stable',\s*\}/;

const replaceStr = `{
          id: 'github.profile',
          name: 'Profile',
          description: 'GitHub profile including bio, company, location, and stats',
          maturity: 'stable',
        },
        {
          id: 'github.repositories',
          name: 'Repositories',
          description: 'Public and private repositories you own or contribute to',
          maturity: 'stable',
        },
        {
          id: 'github.contributions',
          name: 'Contributions',
          description: 'Your contribution graph and commit history',
          maturity: 'stable',
        },
        {
          id: 'github.starred',
          name: 'Starred Projects',
          description: 'Repositories you have starred',
          maturity: 'stable',
        },
        {
          id: 'github.history',
          name: 'History',
          description: 'Your browsing history on GitHub',
          maturity: 'stable',
        }`;

c = c.replace(regex, replaceStr);
fs.writeFileSync('src/lib/data-sources.ts', c);
