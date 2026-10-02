import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    await initDb();
    
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');
    const source = searchParams.get('source');

    if (!wallet || !source) {
      return NextResponse.json({ error: 'Missing wallet or source' }, { status: 400 });
    }

    // Find the connection
    const connResult = await sql`
      SELECT connection_id FROM user_connections 
      WHERE wallet_address = ${wallet} AND source_id = ${source}
      LIMIT 1
    `;

    if (connResult.length === 0) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    const connectionId = connResult[0].connection_id;

    // Fetch the raw data
    const dataResult = await sql`
      SELECT data FROM downloaded_data WHERE connection_id = ${connectionId} LIMIT 1
    `;

    if (dataResult.length === 0) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    const rawData = dataResult[0].data;

    // Extract a safe preview snippet
    // We'll mask personal info like emails and names if they exist at top level,
    // and just return a formatted JSON string of the structure.
    
    let previewObj: any = {};
    
    if (rawData?.data?.results) {
      // Just take the keys of the results to show what files were pulled
      const files = Object.keys(rawData.data.results);
      previewObj.files_included = files;
      
      // Grab a snippet from the first file
      if (files.length > 0) {
        const firstFile = rawData.data.results[files[0]];
        // Try to find an array of items or profile data
        if (firstFile?.data?.data) {
           const payload = firstFile.data.data;
           if (Array.isArray(payload)) {
             previewObj.sample_items_count = payload.length;
             previewObj.sample_data = payload.slice(0, 2); // only show first 2 items
           } else {
             // Mask email/phone in objects
             const masked = { ...payload };
             if (masked.email) masked.email = '***@***.***';
             if (masked.phone) masked.phone = '+1***';
             previewObj.sample_data = masked;
           }
        }
      }
    } else {
      previewObj = { raw: rawData };
    }

    return NextResponse.json({ preview: previewObj });

  } catch (error) {
    console.error('Failed to get preview:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
