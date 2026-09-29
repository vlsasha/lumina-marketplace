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
    description: 'AI conversation history, memories, and interaction patterns from OpenAI\'s ChatGPT.',
    category: 'AI & Productivity',
    source: 'chatgpt',
    scopes: [
      {
        id: 'chatgpt.conversations',
        name: 'Conversations',
        description: 'All conversation history including messages with ChatGPT',
        maturity: 'stable',
      },
      {
        id: 'chatgpt.memories',
        name: 'Memories',
        description: 'Saved memories that ChatGPT uses to personalize responses',
        maturity: 'stable',
      },
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
        id: 'github.repos',
        name: 'Repositories',
        description: 'Public and private repositories with details',
        maturity: 'stable',
      },
      {
        id: 'github.starred',
        name: 'Starred',
        description: 'Repositories you have starred on GitHub',
        maturity: 'stable',
      },
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
    description: 'Social media profile, posts, following, and advertising data from Instagram.',
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
        description: 'Published posts from your feed',
        maturity: 'stable',
      },
      {
        id: 'instagram.following',
        name: 'Following',
        description: 'The list of Instagram accounts you follow',
        maturity: 'stable',
      },
      {
        id: 'instagram.ads',
        name: 'Ads',
        description: 'Advertisers and ad topic interests based on activity',
        maturity: 'stable',
      },
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
    description: 'Professional profile, work experience, skills, education, and network connections.',
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
        id: 'linkedin.experience',
        name: 'Experience',
        description: 'Your work experience including job titles, companies, dates',
        maturity: 'stable',
      },
      {
        id: 'linkedin.education',
        name: 'Education',
        description: 'Your education history including schools, degrees, years',
        maturity: 'stable',
      },
      {
        id: 'linkedin.skills',
        name: 'Skills',
        description: 'Your skills and endorsement counts',
        maturity: 'stable',
      },
      {
        id: 'linkedin.connections',
        name: 'Connections',
        description: 'Your LinkedIn connections with names and headlines',
        maturity: 'stable',
      },
      {
        id: 'linkedin.languages',
        name: 'Languages',
        description: 'Your languages and proficiency levels',
        maturity: 'stable',
      },
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
    description: 'Music preferences, saved tracks, playlists, and listening profile from Spotify.',
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
        id: 'spotify.savedTracks',
        name: 'Saved Tracks',
        description: 'Saved/liked tracks in your library',
        maturity: 'stable',
      },
      {
        id: 'spotify.playlists',
        name: 'Playlists',
        description: 'Playlists and their tracks',
        maturity: 'stable',
      },
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
    description: 'Published videos, Shorts, watch history, subscriptions, and channel profile.',
    category: 'Entertainment',
    source: 'youtube',
    scopes: [
      {
        id: 'youtube.videos',
        name: 'Published Videos',
        description: 'Read published videos and Shorts metadata',
        maturity: 'stable',
      },
      {
        id: 'youtube.history',
        name: 'Watch History',
        description: 'Raw watch history entries',
        maturity: 'beta',
      },
      {
        id: 'youtube.likes',
        name: 'Likes',
        description: 'Videos you have liked',
        maturity: 'beta',
      },
      {
        id: 'youtube.subscriptions',
        name: 'Subscriptions',
        description: 'Channels you are subscribed to',
        maturity: 'beta',
      },
      {
        id: 'youtube.playlists',
        name: 'Playlists',
        description: 'Playlists visible in your YouTube Library',
        maturity: 'beta',
      },
      {
        id: 'youtube.watchLater',
        name: 'Watch Later',
        description: 'Videos saved to Watch Later',
        maturity: 'beta',
      },
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
    description: 'Order history, purchase details, and account profile from Amazon.',
    category: 'E-commerce',
    source: 'amazon',
    scopes: [
      {
        id: 'amazon.orders',
        name: 'Orders',
        description: 'Order history including items, prices, dates, and delivery status',
        maturity: 'beta',
      },
      {
        id: 'amazon.profile',
        name: 'Profile',
        description: 'Account name and Prime membership status',
        maturity: 'beta',
      },
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
    description: 'AI conversation history and projects from Anthropic\'s Claude assistant.',
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
        description: 'Claude projects and their detail',
        maturity: 'experimental',
      },
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
    description: 'Notes content, folder structure, and organization from Apple iCloud Notes.',
    category: 'Productivity',
    source: 'icloud_notes',
    scopes: [
      {
        id: 'icloud_notes.notes',
        name: 'Notes',
        description: 'Note content, titles, created/modified timestamps, and folder assignment',
        maturity: 'experimental',
      },
      {
        id: 'icloud_notes.folders',
        name: 'Folders',
        description: 'Folder structure for organizing notes',
        maturity: 'experimental',
      },
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
    description: 'Health and wellness data: sleep, activity, and readiness from Oura Ring.',
    category: 'Health & Fitness',
    source: 'oura',
    scopes: [
      {
        id: 'oura.sleep',
        name: 'Sleep',
        description: 'Daily sleep scores with duration, stages, heart rate, and HRV',
        maturity: 'stable',
      },
      {
        id: 'oura.activity',
        name: 'Activity',
        description: 'Daily activity scores, step counts, calorie burn',
        maturity: 'stable',
      },
      {
        id: 'oura.readiness',
        name: 'Readiness',
        description: 'Daily readiness scores with HRV balance, resting heart rate',
        maturity: 'stable',
      },
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
    description: 'Fitness activities, GPS routes, heart rate, and performance metrics from Strava.',
    category: 'Health',
    source: 'strava',
    status: 'available',
    requiresDesktop: false,
    scopes: [
      {
        id: 'read_activities',
        name: 'Activities',
        description: 'Read detailed activity history and performance data',
        maturity: 'stable',
      },
      {
        id: 'read_routes',
        name: 'Routes',
        description: 'Read GPS routes and maps',
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
    description: '24/7 biometric data, recovery scores, sleep, and strain metrics from WHOOP.',
    category: 'Health',
    source: 'whoop',
    status: 'available',
    requiresDesktop: false,
    scopes: [
      {
        id: 'read_recovery',
        name: 'Recovery',
        description: 'Read daily recovery scores and HRV',
        maturity: 'stable',
      },
      {
        id: 'read_sleep',
        name: 'Sleep',
        description: 'Read detailed sleep stages and performance',
        maturity: 'stable',
      },
      {
        id: 'read_strain',
        name: 'Strain',
        description: 'Read cardiovascular strain and workout data',
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
