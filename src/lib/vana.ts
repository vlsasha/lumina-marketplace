import { DATA_SOURCES } from './data-sources';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://lumina-vana.vercel.app';
const APP_PRIVATE_KEY = process.env.APP_PRIVATE_KEY;
const ODL_APP_ID = process.env.ODL_APP_ID || 'lumina-marketplace';
const MODE = process.env.VANA_MODE || 'sample';

export function getVanaConfig() {
  return {
    appId: process.env.ODL_APP_ID || 'lumina-marketplace',
    mode: process.env.VANA_MODE || 'sample',
    apiBaseUrl: 'https://api.vana.org/api/v1',
    network: 'mainnet' as 'mainnet' | 'moksha'
  };
}

const controllers = new Map<string, Promise<any>>();

async function getConnectController(sourceId: string) {
  if (!APP_PRIVATE_KEY || !ODL_APP_ID) {
    return null;
  }
  
  if (controllers.has(sourceId)) {
    return controllers.get(sourceId);
  }

  const promise = (async () => {
    try {
      const { createDirectDataController } = await import('@opendatalabs/vana-sdk/server');
      const { privateKeyToAccount } = await import('viem/accounts');
      
      const pKey = APP_PRIVATE_KEY.startsWith('0x') ? APP_PRIVATE_KEY : `0x${APP_PRIVATE_KEY}`;
      const account = privateKeyToAccount(pKey as `0x${string}`);
      const appId = ODL_APP_ID.startsWith('0x') ? ODL_APP_ID : `0x${ODL_APP_ID}`;

      return createDirectDataController({
        env: 'production',
        appPrivateKey: pKey,
        app: {
          id: appId,
          name: 'Lumina Marketplace',
          homepageUrl: APP_URL
        },
        source: sourceId,
        scopes: DATA_SOURCES.find((s) => s.id === sourceId)?.scopes.map(s => s.id) || ['read:profile'],
      });
    } catch (error) {
      console.error('Failed to create vana-sdk controller:', error);
      return null;
    }
  })();

  controllers.set(sourceId, promise);
  return promise;
}

export async function createConnectSession(sourceId: string) {
  const source = DATA_SOURCES.find((s) => s.id === sourceId);
  if (!source) throw new Error(`Unknown source: ${sourceId}`);

  if (!APP_PRIVATE_KEY) {
    if (MODE !== 'sample') {
      throw new Error('APP_PRIVATE_KEY is missing in Vercel Environment Variables. Required by vana-sdk.');
    }
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
    const controller = await getConnectController(sourceId);
    if (!controller) throw new Error("Could not initialize Vana Controller");

    const request = await controller.createAccessRequest({
      returnUrl: `${APP_URL}/connect/return?source=${sourceId}`,
    });

    return {
      connectionId: request.requestId,
      approvalUrl: request.approvalUrl,
      source: sourceId,
      scopes: source.scopes.map((s) => s.id),
    };
  } catch (error) {
    console.error(`Failed to create session for ${source.name}:`, error);
    if (MODE !== 'sample') throw error;

    const sampleConnectionId = `conn_err_${sourceId}_${Date.now()}`;
    const redirectUrl = encodeURIComponent(`${APP_URL}/connect/return`);
    const errorMessage = encodeURIComponent(error instanceof Error ? error.message : String(error));
    const mockUrl = `${APP_URL}/mock-vana-approval?source=${sourceId}&connectionId=${sampleConnectionId}&redirectUrl=${redirectUrl}&error=${errorMessage}`;
    
    return {
      connectionId: sampleConnectionId,
      connectUrl: mockUrl,
      approvalUrl: mockUrl,
      source: sourceId,
      scopes: source.scopes.map((s) => s.id),
    };
  }
}

export async function getConnectionStatus(sourceId: string, connectionId: string) {
  const source = DATA_SOURCES.find((s) => s.id === sourceId);
  if (!source) throw new Error(`Unknown source: ${sourceId}`);

  if (connectionId.startsWith('conn_err_') || connectionId.startsWith('conn_sample_')) {
    return { status: 'approved', connectionId, scopes: source.scopes.map((s) => s.id) };
  }

  if (MODE === 'sample' || !APP_PRIVATE_KEY) {
    return { status: 'approved', connectionId, scopes: source.scopes.map((s) => s.id) };
  }

  const controller = await getConnectController(sourceId);
  if (!controller) return { status: 'approved', connectionId, scopes: source.scopes.map((s) => s.id) };

  return controller.getAccessRequestStatus(connectionId);
}

export async function readConnectionData(
  sourceId: string,
  connectionId: string,
  scope?: string
) {
  const source = DATA_SOURCES.find((s) => s.id === sourceId);
  if (!source) throw new Error(`Unknown source: ${sourceId}`);

  if (MODE === 'sample' || !APP_PRIVATE_KEY || connectionId.startsWith('conn_')) {
    return getSampleData(sourceId, scope);
  }

  const controller = await getConnectController(sourceId);
  if (!controller) return getSampleData(sourceId, scope);

  const result = await controller.readAllApprovedData({ requestId: connectionId });
  return {
    data: result,
    source: sourceId,
    scope: scope || 'all',
    timestamp: new Date().toISOString(),
  };
}

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
        bio: '✨ Building with Vana',
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
