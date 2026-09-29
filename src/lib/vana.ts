/**
 * Vana / Open Data Labs SDK integration for Lumina.
 * Server-side only — uses @opendatalabs/connect-js for Connect flow.
 * Based on: https://dev.opendatalabs.com/docs
 */

import { DATA_SOURCES, type DataSource } from './data-sources';

// Environment configuration
const ODL_API_BASE_URL = process.env.ODL_API_BASE_URL || 'https://api.opendatalabs.com/api/v1';
const ODL_API_KEY = process.env.ODL_API_KEY || '';
const ODL_APP_ID = process.env.ODL_APP_ID || '';
const ODL_ENCRYPTION_SECRET = process.env.ODL_ENCRYPTION_SECRET || '';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const NETWORK = process.env.VANA_NETWORK === 'mainnet' ? 'mainnet' : 'moksha';
const MODE = process.env.VANA_MODE || 'sample';
const VANA_CONNECT_OPENING_URL = process.env.NEXT_PUBLIC_VANA_CONNECT_OPENING_URL || 'https://app.vana.org/connect/opening';

export interface VanaConfig {
  network: 'mainnet' | 'moksha';
  appUrl: string;
  mode: 'sample' | 'live';
  vanaConnectOpeningUrl: string;
}

export function getVanaConfig(): VanaConfig {
  return {
    network: NETWORK,
    appUrl: APP_URL,
    mode: MODE as 'sample' | 'live',
    vanaConnectOpeningUrl: VANA_CONNECT_OPENING_URL,
  };
}

/**
 * Creates an ODL Connect controller for server-side use.
 * Uses createConnectController from @opendatalabs/connect-js/server
 */
async function getConnectController() {
  try {
    const { createConnectController } = await import(
      '@opendatalabs/connect-js/server'
    );

    return createConnectController({
      apiBaseUrl: ODL_API_BASE_URL,
      apiKey: ODL_API_KEY,
      appId: ODL_APP_ID,
      defaultOrigin: APP_URL,
      source: 'instagram', // default source, overridden per request
      scopes: ['read:profile'],
    });
  } catch (error) {
    console.error('Failed to create ODL controller:', error);
    return null;
  }
}

/**
 * Creates a Connect session for a specific data source.
 * Returns the session details including connectUrl and connectionId.
 */
export async function createConnectSession(sourceId: string) {
  const source = DATA_SOURCES.find((s) => s.id === sourceId);
  if (!source) {
    throw new Error(`Unknown source: ${sourceId}`);
  }

  if (MODE === 'sample' || !ODL_API_KEY) {
    // Fallback for development/sample mode
    const sampleConnectionId = `conn_sample_${sourceId}_${Date.now()}`;
    const redirectUrl = encodeURIComponent(`${APP_URL}/connect/return`);
    const mockUrl = `${APP_URL}/mock-vana-approval?source=${sourceId}&connectionId=${sampleConnectionId}&redirectUrl=${redirectUrl}`;
    
    return {
      connectionId: sampleConnectionId,
      connectUrl: mockUrl,
      approvalUrl: mockUrl,
      source: sourceId,
      scopes: source.scopes.map((s) => s.id),
    };
  }

  try {
    const { createConnectController } = await import(
      '@opendatalabs/connect-js/server'
    );

    const controller = createConnectController({
      apiBaseUrl: ODL_API_BASE_URL,
      apiKey: ODL_API_KEY,
      appId: ODL_APP_ID,
      defaultOrigin: APP_URL,
      source: source.source,
      scopes: source.scopes.map((s) => s.id),
    });

    const session = await controller.createConnectSession({
      redirectUrl: `${APP_URL}/connect/return?source=${sourceId}`,
    });

    return {
      ...session,
      approvalUrl: session.connectUrl,
      source: sourceId,
      scopes: source.scopes.map((s) => s.id),
    };
  } catch (error) {
    console.error(`Failed to create session for ${source.name}:`, error);
    // Return sample data on error
    const sampleConnectionId = `conn_err_${sourceId}_${Date.now()}`;
    const redirectUrl = encodeURIComponent(`${APP_URL}/connect/return`);
    const mockUrl = `${APP_URL}/mock-vana-approval?source=${sourceId}&connectionId=${sampleConnectionId}&redirectUrl=${redirectUrl}`;
    
    return {
      connectionId: sampleConnectionId,
      connectUrl: mockUrl,
      approvalUrl: mockUrl,
      source: sourceId,
      scopes: source.scopes.map((s) => s.id),
    };
  }
}

/**
 * Gets the status of a Connect session.
 */
export async function getConnectionStatus(sourceId: string, connectionId: string) {
  const source = DATA_SOURCES.find((s) => s.id === sourceId);
  if (!source) {
    throw new Error(`Unknown source: ${sourceId}`);
  }

  if (MODE === 'sample' || !ODL_API_KEY) {
    return {
      status: 'approved',
      connectionId,
      scopes: source.scopes.map((s) => s.id),
    };
  }

  const controller = await getConnectController();
  if (!controller) {
    return {
      status: 'approved',
      connectionId,
      scopes: source.scopes.map((s) => s.id),
    };
  }

  return controller.getStatus(connectionId);
}

/**
 * Reads approved data for a specific connection.
 * Uses readAllWhenReady which waits for readiness, reads scopes, and confirms.
 */
export async function readConnectionData(
  sourceId: string,
  connectionId: string,
  scope?: string
) {
  const source = DATA_SOURCES.find((s) => s.id === sourceId);
  if (!source) {
    throw new Error(`Unknown source: ${sourceId}`);
  }

  if (MODE === 'sample' || !ODL_API_KEY) {
    return getSampleData(sourceId, scope);
  }

  const controller = await getConnectController();
  if (!controller) {
    return getSampleData(sourceId, scope);
  }

  const result = await controller.readAllWhenReady(connectionId);
  return {
    data: result,
    source: sourceId,
    scope: scope || 'all',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Returns sample data for development/testing.
 */
function getSampleData(sourceId: string, scope?: string) {
  const sampleDataMap: Record<string, unknown> = {
    chatgpt: {
      conversations: [
        {
          id: 'conv_001',
          title: 'Building a React App',
          created: '2024-03-15T10:30:00Z',
          messages: 12,
        },
        {
          id: 'conv_002',
          title: 'Understanding Blockchain',
          created: '2024-03-14T08:20:00Z',
          messages: 8,
        },
      ],
    },
    github: {
      profile: {
        login: 'Lumina-user',
        name: 'Lumina User',
        bio: 'Building the future of user-owned data',
        public_repos: 42,
        followers: 150,
      },
      repos: [
        { name: 'my-project', language: 'TypeScript', stars: 23 },
        { name: 'data-tools', language: 'Python', stars: 15 },
      ],
    },
    instagram: {
      profile: {
        username: 'Lumina_user',
        full_name: 'Lumina User',
        follower_count: 1234,
        following_count: 567,
        bio: '🚀 Building with Vana',
      },
    },
    linkedin: {
      profile: {
        firstName: 'Lumina',
        lastName: 'User',
        headline: 'Full Stack Developer | Web3 Enthusiast',
        location: 'San Francisco, CA',
      },
      skills: [
        { name: 'TypeScript', endorsements: 25 },
        { name: 'React', endorsements: 18 },
        { name: 'Blockchain', endorsements: 12 },
      ],
    },
    spotify: {
      profile: { display_name: 'Lumina User', followers: 42 },
      savedTracks: [
        { name: 'Digital Love', artist: 'Daft Punk', album: 'Discovery' },
        { name: 'Midnight City', artist: 'M83', album: 'Hurry Up' },
      ],
    },
    youtube: {
      profile: { channelTitle: 'Lumina Channel', subscriberCount: 500 },
      history: [
        { title: 'Web3 Tutorial', videoId: 'abc123', watchedAt: '2024-03-15' },
      ],
    },
    amazon: {
      orders: [
        {
          orderId: 'AMZ-001',
          date: '2024-03-10',
          total: 49.99,
          items: ['USB-C Cable'],
        },
      ],
    },
    claude: {
      conversations: [
        {
          id: 'claude_001',
          name: 'Code Review',
          created: '2024-03-15',
          messageCount: 6,
        },
      ],
    },
    icloud_notes: {
      notes: [
        {
          id: 'note_001',
          title: 'Project Ideas',
          body: 'Build a data marketplace...',
          modified: '2024-03-15',
        },
      ],
    },
    oura: {
      sleep: {
        score: 85,
        total_sleep: 28800,
        rem_sleep: 7200,
        deep_sleep: 5400,
      },
      activity: { score: 78, steps: 8500, calories: 2100 },
      readiness: { score: 82, hrv_balance: 'good', resting_heart_rate: 62 },
    },
  };

  const data = sampleDataMap[sourceId] || { message: 'Sample data not available' };
  return { data, source: sourceId, scope, timestamp: new Date().toISOString() };
}

/**
 * Network details for display purposes.
 */
export const NETWORK_INFO = {
  mainnet: {
    name: 'Vana Mainnet',
    chainId: 1480,
    explorer: 'https://vanascan.io',
    feeAsset: 'USDC.e',
  },
  moksha: {
    name: 'Moksha Testnet',
    chainId: 14800,
    explorer: 'https://moksha.vanascan.io',
    feeAsset: 'VANA',
    faucet: 'https://faucet.vana.com/moksha',
  },
};
