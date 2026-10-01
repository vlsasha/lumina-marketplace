const fs = require('fs');
let c = fs.readFileSync('src/lib/data-sources.ts', 'utf8');

c = c.replace(
  /\{\s*id: 'linkedin\.profile',\s*name: 'Profile',\s*description: 'Your LinkedIn profile including name, headline, location, about',\s*maturity: 'stable',\s*\}/,
  `{
          id: 'linkedin.profile',
          name: 'Profile',
          description: 'Your LinkedIn profile including name, headline, location, about',
          maturity: 'stable',
        },
        {
          id: 'linkedin.connections',
          name: 'Connections',
          description: 'Your professional network and connections list',
          maturity: 'stable',
        },
        {
          id: 'linkedin.education',
          name: 'Education',
          description: 'Your educational background and degrees',
          maturity: 'stable',
        },
        {
          id: 'linkedin.experience',
          name: 'Experience',
          description: 'Your work history and positions',
          maturity: 'stable',
        },
        {
          id: 'linkedin.languages',
          name: 'Languages',
          description: 'Languages you speak',
          maturity: 'stable',
        },
        {
          id: 'linkedin.skills',
          name: 'Skills',
          description: 'Your professional skills and endorsements',
          maturity: 'stable',
        }`
);

fs.writeFileSync('src/lib/data-sources.ts', c);
