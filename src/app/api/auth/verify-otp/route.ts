import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    if (!sql) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    }
    
    await initDb();
    
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    // Check if valid code exists
    const result = await sql`
      SELECT id FROM auth_codes 
      WHERE email = ${email} 
        AND code = ${code} 
        AND used = FALSE 
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
    }

    // Mark as used
    await sql`
      UPDATE auth_codes 
      SET used = TRUE 
      WHERE id = ${result[0].id}
    `;

    // In a real app, we would create a JWT session cookie here.
    // For this prototype, we'll return a success flag and let the client manage state.
    
    return NextResponse.json({ success: true, message: 'Verified successfully' });
  } catch (error) {
    console.error('Failed to verify OTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
