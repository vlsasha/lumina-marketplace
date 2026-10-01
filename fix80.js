const fs = require('fs');
let c = fs.readFileSync('src/lib/data-sources.ts', 'utf8');

c = c.replace(
  /\{\s*id: 'icloud_notes\.notes',\s*name: 'Notes',\s*description: 'Note content, titles, created\/modified timestamps, and folder assignment',\s*maturity: 'experimental',\s*\}/,
  `{
          id: 'icloud.folders',
          name: 'Folders',
          description: 'Folder structure and names',
          maturity: 'stable',
        },
        {
          id: 'icloud.notes',
          name: 'Notes',
          description: 'Note content and metadata',
          maturity: 'stable',
        }`
);

fs.writeFileSync('src/lib/data-sources.ts', c);
