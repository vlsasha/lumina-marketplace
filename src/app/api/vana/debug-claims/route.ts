import { NextResponse } from 'next/server';
import { createPublicClient, http, parseAbiItem, formatUnits } from 'viem';
import { vana } from 'viem/chains';

const publicClient = createPublicClient({ chain: vana, transport: http() });

export async function GET(req: Request) {
  try {
    const address1 = '0xC1d3007A33d86Fd7390B087304AD3083FC87438C';
    const address2 = '0x8E3f4BFB720582bF7223FDB6A1a678957b38835A';
    
    // We can't fetch from 0 on standard RPC, but let's try a smaller block chunk if needed.
    // Actually we just return 200 for now.
    return NextResponse.json({ msg: "Hello" });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
