import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET() {
  await initDb();
  await sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS provider_wallets JSONB DEFAULT '[]'::jsonb`;
  
  // Backfill existing purchases to have an empty array if null
  await sql`UPDATE purchases SET provider_wallets = '[]'::jsonb WHERE provider_wallets IS NULL`;

  return NextResponse.json({ success: true });
}
