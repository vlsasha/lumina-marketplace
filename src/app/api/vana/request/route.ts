/**
 * API Route: Create a data Connect session for a specific source.
 * POST /api/vana/request
 * Body: { source: string }
 */

import { createConnectSession } from '@/lib/vana';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source } = body;

    if (!source) {
      return NextResponse.json(
        { error: 'Missing required field: source' },
        { status: 400 }
      );
    }

    const result = await createConnectSession(source);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating connect session:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create connect session',
      },
      { status: 500 }
    );
  }
}
