import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    if (!sql) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    }
    
    await initDb();
    
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store in DB, expires in 10 minutes
    await sql`
      INSERT INTO auth_codes (email, code, expires_at)
      VALUES (${email}, ${code}, NOW() + INTERVAL '10 minutes')
    `;

    // Send email via Resend if configured, else print to console (development mode)
    if (resend) {
      await resend.emails.send({
        from: 'Lumina Marketplace <noreply@lumina.market>', // Fallback placeholder if custom domain not verified
        to: email,
        subject: 'Lumina Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Lumina Marketplace</h2>
            <p>Your verification code is:</p>
            <h1 style="font-size: 32px; letter-spacing: 4px; color: #6E56CF;">${code}</h1>
            <p>This code will expire in 10 minutes.</p>
          </div>
        `
      });
      console.log(`[AUTH] Sent OTP ${code} to ${email} via Resend`);
    } else {
      console.log(`\n\n========== MOCK EMAIL ==========\nTo: ${email}\nCode: ${code}\n================================\n\n`);
    }

    return NextResponse.json({ success: true, message: 'Verification code sent' });
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
