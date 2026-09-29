/**
 * API Route: Get all available data sources and their configuration.
 * GET /api/sources
 */

import { DATA_SOURCES, CATEGORIES, getTotalScopes } from '@/lib/data-sources';
import { getVanaConfig, NETWORK_INFO } from '@/lib/vana';
import { NextResponse } from 'next/server';

export async function GET() {
  const config = getVanaConfig();
  const networkInfo = NETWORK_INFO[config.network];

  return NextResponse.json({
    sources: DATA_SOURCES.map((source) => ({
      id: source.id,
      name: source.name,
      icon: source.icon,
      color: source.color,
      description: source.description,
      category: source.category,
      scopeCount: source.scopes.length,
      scopes: source.scopes,
      status: source.status,
      requiresDesktop: source.requiresDesktop,
    })),
    categories: CATEGORIES,
    totalScopes: getTotalScopes(),
    totalSources: DATA_SOURCES.length,
    network: {
      name: networkInfo.name,
      chainId: networkInfo.chainId,
      explorer: networkInfo.explorer,
      mode: config.mode,
    },
  });
}
