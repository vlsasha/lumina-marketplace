const fs = require('fs');

let c = fs.readFileSync('src/lib/data-sources.ts', 'utf8');

const targetStr = `    {
      id: 'github',
      name: 'GitHub',
      icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
      color: '#ffffff',
      description: 'Development activity, repositories, contributions, and starred projects from GitHub.',
      category: 'Developer',
      source: 'github',
      scopes: [
        {
          id: 'github.profile',
          name: 'Profile',
          description: 'GitHub profile including bio, company, location, and stats',
          maturity: 'stable',
        }
      ],
      status: 'available',
      requiresDesktop: false,
      docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
    },`;

const replaceStr = `    {
      id: 'github',
      name: 'GitHub',
      icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
      color: '#ffffff',
      description: 'Development activity, repositories, contributions, and starred projects from GitHub.',
      category: 'Developer',
      source: 'github',
      scopes: [
        {
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
        }
      ],
      status: 'available',
      requiresDesktop: false,
      docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
    },`;

if (c.includes(targetStr)) {
  c = c.replace(targetStr, replaceStr);
  fs.writeFileSync('src/lib/data-sources.ts', c);
  console.log("Success");
} else {
  console.log("Failed");
}
