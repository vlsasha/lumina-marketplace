import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    await initDb();
    
    const { searchParams } = new URL(req.url);
    const datasetId = searchParams.get('datasetId');
    const format = searchParams.get('format') || 'jsonl';
    let buyerId = searchParams.get('buyerId'); // from client if they use wallet address
    const apiKey = searchParams.get('apiKey');

    // 1. Authenticate user
    if (apiKey) {
      // Validate API key (for programmatic access)
      // For simplicity in this demo, we assume the API key maps to a user who bought it
      // A real app would hash the API key and look up the user
      // But we will fallback to checking session if no buyerId is provided explicitly
    } else {
      // If no API key, check session
      const session = await getServerSession(authOptions);
      if (session?.user?.email && !buyerId) {
        buyerId = session.user.email;
      }
    }

    if (!buyerId) {
      return NextResponse.json({ error: 'Unauthorized. Provide buyerId/apiKey or login.' }, { status: 401 });
    }

    if (!datasetId) {
      return NextResponse.json({ error: 'Missing datasetId' }, { status: 400 });
    }

    // 2. Verify purchase
    const purchases = await sql`
      SELECT id FROM purchases 
      WHERE buyer_id = ${buyerId} AND dataset_id = ${datasetId}
      LIMIT 1
    `;

    if (purchases.length === 0) {
      return NextResponse.json({ error: 'You have not purchased this dataset.' }, { status: 403 });
    }

    // 3. Fetch data
    const records = await sql`
      SELECT d.data 
      FROM downloaded_data d
      JOIN user_connections u ON d.connection_id = u.connection_id
      WHERE u.source_id = ${datasetId}
    `;

    if (records.length === 0) {
      return NextResponse.json({ error: 'No data available for this dataset yet.' }, { status: 404 });
    }

    // 4. Format data
    let output = '';
    let contentType = 'text/plain';
    let filename = `\${datasetId}_export.\${format}`;

    if (format.toLowerCase() === 'jsonl') {
      contentType = 'application/x-ndjson';
      output = records.map(r => JSON.stringify(r.data)).join('\n');
    } 
    else if (format.toLowerCase() === 'csv') {
      contentType = 'text/csv';
      // Basic CSV conversion for top-level keys
      if (records.length > 0) {
        // Flatten simple structure
        const extractKeys = (obj: any) => Object.keys(obj || {});
        // Find a representative object
        let headerRow = ['connection_data'];
        output = headerRow.join(',') + '\n';
        output += records.map(r => `"\${JSON.stringify(r.data).replace(/"/g, '""')}"`).join('\n');
      }
    }
    else if (format.toLowerCase() === 'parquet') {
      // Stub for PARQUET
      // Real parquet requires complex schema encoding using apache-arrow or parquetjs
      contentType = 'application/octet-stream';
      output = "PARQUET_MOCK_DATA\n" + records.map(r => JSON.stringify(r.data)).join('\n');
    }
    else {
      return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }

    // 5. Send response
    return new NextResponse(output, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="\${filename}"`,
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
