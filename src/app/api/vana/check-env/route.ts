import { NextResponse } from 'next/server';

export async function GET() {
  const pk = process.env.PRIVATE_KEY;
  return NextResponse.json({ 
    hasKey: !!pk,
    length: pk ? pk.length : 0,
    prefix: pk ? pk.substring(0, 4) : null
  });
}
