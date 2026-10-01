const fs = require('fs');
let c = fs.readFileSync('src/lib/data-sources.ts', 'utf8');

c = c.replace(
  /\{\s*id: 'claude\.conversations',\s*name: 'Conversations',\s*description: 'All Claude conversations with full message threads',\s*maturity: 'experimental',\s*\}/,
  `{
          id: 'claude.conversations',
          name: 'Conversations',
          description: 'All Claude conversations with full message threads',
          maturity: 'experimental',
        },
        {
          id: 'claude.projects',
          name: 'Projects',
          description: 'Claude Projects, including system prompts and context',
          maturity: 'experimental',
        }`
);

fs.writeFileSync('src/lib/data-sources.ts', c);
