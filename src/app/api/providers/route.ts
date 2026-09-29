import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, this would query a database for users who have validated data.
  // For the MVP, we return the Treasury wallet which has a valid PoC score on-chain.
  return NextResponse.json({
    providers: [
      '0xC1d3007A33d86Fd7390B087304AD3083FC87438C'
    ]
  });
}
