const fs = require('fs');
let c = fs.readFileSync('src/lib/data-sources.ts', 'utf8');

c = c.replace(
  /\{\s*id: 'instagram\.profile',\s*name: 'Profile',\s*description: 'Profile information including bio and follower counts',\s*maturity: 'stable',\s*\}/,
  `{
          id: 'instagram.profile',
          name: 'Profile',
          description: 'Profile information including bio and follower counts',
          maturity: 'stable',
        },
        {
          id: 'instagram.posts',
          name: 'Posts',
          description: 'Your photos, videos, and reels',
          maturity: 'stable',
        },
        {
          id: 'instagram.following',
          name: 'Following',
          description: 'Accounts you follow',
          maturity: 'stable',
        },
        {
          id: 'instagram.ads',
          name: 'Ads & Interests',
          description: 'Ad topics and advertisers you interact with',
          maturity: 'stable',
        }`
);

fs.writeFileSync('src/lib/data-sources.ts', c);
