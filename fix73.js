const fs = require('fs');
let c = fs.readFileSync('src/lib/data-sources.ts', 'utf8');

c = c.replace(
  /\{\s*id: 'spotify\.profile',\s*name: 'Profile',\s*description: 'Profile information',\s*maturity: 'stable',\s*\}/,
  `{
          id: 'spotify.profile',
          name: 'Profile',
          description: 'Profile information',
          maturity: 'stable',
        },
        {
          id: 'spotify.playlists',
          name: 'Playlists',
          description: 'Your created and saved playlists',
          maturity: 'stable',
        },
        {
          id: 'spotify.savedTracks',
          name: 'Saved Tracks',
          description: 'Your Liked Songs',
          maturity: 'stable',
        }`
);

fs.writeFileSync('src/lib/data-sources.ts', c);
