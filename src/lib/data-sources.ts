/**
 * Lumina Data Sources Configuration
 * Maps all available Vana data sources with their scopes, icons, and metadata.
 * Based on the official Vana scope catalog:
 * https://github.com/PDP-Connect/data-connectors/blob/main/SCOPES.md
 */

export type SourceStatus = 'available' | 'connected' | 'public_only' | 'desktop_required';
export type ConnectorMaturity = 'stable' | 'beta' | 'experimental';

export interface DataScope {
  id: string;
  name: string;
  description: string;
  maturity: ConnectorMaturity;
}

export interface DataSource {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: string;
  source: string; // Vana source identifier
  scopes: DataScope[];
  status: SourceStatus;
  requiresDesktop: boolean;
  docsUrl: string;
}

export const DATA_SOURCES: DataSource[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128',
    color: '#10A37F',
    description: 'Monetize your AI interaction patterns, prompt engineering techniques, and conversational logic securely.',
    category: 'AI & Productivity',
    source: 'chatgpt',
    scopes: [
      {
        id: 'chatgpt.conversations',
        name: 'Conversations',
        description: 'All conversation history including messages with ChatGPT',
        maturity: 'stable',
      }
    ],
    status: 'available',
    requiresDesktop: false,
    docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
    color: '#ffffff',
    description: 'Share your coding habits, tech stack preferences, and open-source contribution patterns.',
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
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=128',
    color: '#E4405F',
    description: 'Unlock the value of your visual content engagement, brand interactions, and audience demographics.',
    category: 'Social Media',
    source: 'instagram',
    scopes: [
      {
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
        }
    ],
    status: 'available',
    requiresDesktop: false,
    docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=128',
    color: '#0A66C2',
    description: 'Turn your professional trajectory, industry networking, and skill endorsements into a valuable asset.',
    category: 'Professional',
    source: 'linkedin',
    scopes: [
      {
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
        }
    ],
    status: 'available',
    requiresDesktop: false,
    docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: 'https://www.google.com/s2/favicons?domain=spotify.com&sz=128',
    color: '#1DB954',
    description: 'Share your unique audio taste profile, genre affinities, and listening habits with researchers.',
    category: 'Entertainment',
    source: 'spotify',
    scopes: [
      {
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
        }
    ],
    status: 'available',
    requiresDesktop: false,
    docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128',
    color: '#FF0000',
    description: 'Monetize your video consumption behavior, content preferences, and creator engagement metrics.',
    category: 'Entertainment',
    source: 'youtube',
    scopes: [
      {
        id: 'youtube.history',
        name: 'Watch History',
        description: 'Complete history of watched videos',
        maturity: 'stable',
      },
      {
        id: 'youtube.likes',
        name: 'Likes',
        description: 'Videos you have liked',
        maturity: 'stable',
      },
      {
        id: 'youtube.playlists',
        name: 'Playlists',
        description: 'Saved and created playlists',
        maturity: 'stable',
      },
      {
        id: 'youtube.profile',
        name: 'Profile',
        description: 'Channel profile and statistics',
        maturity: 'stable',
      },
      {
        id: 'youtube.subscriptions',
        name: 'Subscriptions',
        description: 'Channels you are subscribed to',
        maturity: 'stable',
      },
      {
        id: 'youtube.watchLater',
        name: 'Watch Later',
        description: 'Videos saved to Watch Later',
        maturity: 'stable',
      }
    ],
    status: 'available',
    requiresDesktop: false,
    docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128',
    color: '#FF9900',
    description: 'Provide high-value consumer insights, purchasing habits, and product category preferences.',
    category: 'E-commerce',
    source: 'amazon',
    scopes: [
      {
        id: 'amazon.profile',
        name: 'Profile',
        description: 'Account name and Prime membership status',
        maturity: 'beta',
      }
    ],
    status: 'available',
    requiresDesktop: false,
    docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128',
    color: '#D97706',
    description: 'Extract value from your structured AI workflows, complex prompt engineering, and project context.',
    category: 'AI & Productivity',
    source: 'claude',
    scopes: [
      {
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
        }
    ],
    status: 'available',
    requiresDesktop: false,
    docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
  },
  {
    id: 'icloud_notes',
    name: 'iCloud Notes',
    icon: 'https://www.google.com/s2/favicons?domain=icloud.com&sz=128',
    color: '#FFD60A',
    description: 'Monetize your organizational habits, thought structuring, and personal productivity workflows.',
    category: 'Productivity',
    source: 'icloud_notes',
    scopes: [
      {
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
        }
    ],
    status: 'available',
    requiresDesktop: false,
    docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
  },
  {
    id: 'oura',
    name: 'Oura Ring',
    icon: 'https://www.google.com/s2/favicons?domain=ouraring.com&sz=128',
    color: '#A855F7',
    description: 'Contribute high-fidelity biometric signals, sleep architecture, and physiological recovery trends.',
    category: 'Health & Fitness',
    source: 'oura',
    scopes: [
      {
        id: 'oura.sleep',
        name: 'Sleep',
        description: 'Daily sleep scores with duration, stages, heart rate, and HRV',
        maturity: 'stable',
      }
    ],
    status: 'available',
    requiresDesktop: false,
    docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
  },
  {
    id: 'strava',
    name: 'Strava',
    icon: 'https://www.google.com/s2/favicons?domain=strava.com&sz=128',
    color: '#FC4C02',
    description: 'Share your athletic endurance metrics, geospatial training routes, and physical performance data.',
    category: 'Health & Fitness',
    source: 'strava',
    status: 'available',
    requiresDesktop: false,
    scopes: [
      {
        id: 'read_activities',
        name: 'Activities',
        description: 'Read detailed activity history and performance data',
        maturity: 'stable',
      }
    ],
    docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
  },
  {
    id: 'whoop',
    name: 'WHOOP',
    icon: 'https://www.google.com/s2/favicons?domain=whoop.com&sz=128',
    color: '#000000',
    description: 'Monetize your continuous physiological monitoring, cardiovascular strain, and metabolic activity.',
    category: 'Health & Fitness',
    source: 'whoop',
    status: 'available',
    requiresDesktop: false,
    scopes: [
      {
        id: 'read_recovery',
        name: 'Recovery',
        description: 'Read daily recovery scores and HRV',
        maturity: 'stable',
      }
    ],
    docsUrl: 'https://docs.vana.org/build-a-vana-app/source-and-scopes',
  }
];

export const CATEGORIES = Array.from(
  new Set(DATA_SOURCES.map((s) => s.category))
);

export function getSourceById(id: string): DataSource | undefined {
  return DATA_SOURCES.find((s) => s.id === id);
}

export function getSourcesByCategory(category: string): DataSource[] {
  return DATA_SOURCES.filter((s) => s.category === category);
}

export function getTotalScopes(): number {
  return DATA_SOURCES.reduce((acc, s) => acc + s.scopes.length, 0);
}

export const EARNINGS_RATES = [
  { id: 'github', metric: 'Verified Dev Profile & Code', price: 15.00, monthlyYield: 5.00 },
  { id: 'linkedin', metric: 'Professional Network Graph', price: 10.00, monthlyYield: 2.00 },
  { id: 'oura', metric: 'Continuous Biometric Stream', price: 5.00, monthlyYield: 10.00 },
  { id: 'whoop', metric: 'Continuous Recovery Stream', price: 5.00, monthlyYield: 10.00 },
  { id: 'chatgpt', metric: 'Reasoning Trace & Prompts', price: 4.00, monthlyYield: 2.00 },
  { id: 'claude', metric: 'Project Context & Prompts', price: 4.00, monthlyYield: 2.00 },
  { id: 'amazon', metric: 'Historical Purchases + Sync', price: 3.50, monthlyYield: 1.00 },
  { id: 'icloud_notes', metric: 'Knowledge Base + Sync', price: 3.00, monthlyYield: 1.00 },
  { id: 'youtube', metric: 'Psychographic Watch Profile', price: 1.50, monthlyYield: 0.50 },
  { id: 'instagram', metric: 'Social Engagement Graph', price: 1.50, monthlyYield: 0.50 },
  { id: 'spotify', metric: 'Audio Affinity Profile', price: 1.50, monthlyYield: 0.50 },
  { id: 'strava', metric: 'Endurance & Route Log', price: 2.00, monthlyYield: 1.00 }
];
