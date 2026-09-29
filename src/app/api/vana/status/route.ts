/**
 * API Route: Get the status of a data Connect session.
 * GET /api/vana/status?source=xxx&connectionId=xxx
 */

import { getConnectionStatus } from '@/lib/vana';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const connectionId = searchParams.get('connectionId') || searchParams.get('requestId');

    if (!source || !connectionId) {
      return NextResponse.json(
        { error: 'Missing required params: source, connectionId' },
        { status: 400 }
      );
    }

    const status = await getConnectionStatus(source, connectionId);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error getting connection status:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get connection status',
      },
      { status: 500 }
    );
  }
}
