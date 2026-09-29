const fs = require('fs');
const content = import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
       return NextResponse.json({ providers: ['0xC1d3007A33d86Fd7390B087304AD3083FC87438C'], count: 1 });
    }

    await initDb();
    const result = await sql\SELECT wallet_address FROM vana_users\;
    const providers = result.map(row => row.wallet_address);
    
    if (providers.length === 0) {
      providers.push('0xC1d3007A33d86Fd7390B087304AD3083FC87438C');
    }

    return NextResponse.json({
      providers,
      count: providers.length
    });
  } catch (error) {
    console.error('Failed to fetch providers', error);
    return NextResponse.json({ providers: ['0xC1d3007A33d86Fd7390B087304AD3083FC87438C'], count: 1 });
  }
}

export async function POST(req) {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({ success: true });
    
    const { wallet_address } = await req.json();
    if (!wallet_address) return NextResponse.json({ error: 'Missing wallet' }, { status: 400 });

    await initDb();
    
    await sql\
      INSERT INTO vana_users (wallet_address) 
      VALUES (\) 
      ON CONFLICT (wallet_address) DO NOTHING
    \;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to add provider', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
fs.writeFileSync('src/app/api/providers/route.ts', content);
