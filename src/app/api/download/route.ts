import { NextResponse } from 'next/server';
import sql, { initDb } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    await initDb();
    
    const { searchParams } = new URL(req.url);
    const datasetIdRaw = searchParams.get('datasetId') || '';
    const datasetId = datasetIdRaw;
    
    // Convert to lowercase before map lookup to support legacy data ("instagram (Tier D)")
    const datasetName = datasetIdRaw.replace(/ \(Tier [A-Z]\)$/i, '').toLowerCase();
    const sourceMap: Record<string, string> = {
      'chatgpt': 'chatgpt',
      'github': 'github',
      'instagram': 'instagram',
      'linkedin': 'linkedin',
      'spotify': 'spotify',
      'youtube': 'youtube',
      'amazon': 'amazon',
      'claude': 'claude',
      'icloud notes': 'icloud_notes',
      'oura ring': 'oura',
      'strava': 'strava',
      'whoop': 'whoop'
    };
    
    // Fallback to datasetName in case it's already an exact ID like "instagram"
    const baseSourceId = sourceMap[datasetName] || datasetName;

    const format = searchParams.get('format') || 'jsonl';
    let buyerId = searchParams.get('buyerId');
    const apiKey = searchParams.get('apiKey');

    if (apiKey) {
      // Validate API key logic
    } else {
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

    // 2. Verify purchase and collect purchased wallets
    const purchases = await sql`
      SELECT provider_wallets FROM purchases 
      WHERE buyer_id = ${buyerId} AND dataset_id = ${datasetId}
    `;

    if (purchases.length === 0) {
      return NextResponse.json({ error: 'You have not purchased this dataset.' }, { status: 403 });
    }

    let allowedWallets: string[] = [];
    purchases.forEach(p => {
      if (p.provider_wallets && Array.isArray(p.provider_wallets)) {
        allowedWallets.push(...p.provider_wallets);
      }
    });

    // 3. Fetch data ONLY for purchased wallets
    // If allowedWallets is empty (legacy data), we fallback to pulling all data for that source (backward compatibility).
    let records;
    if (allowedWallets.length > 0) {
      records = await sql`
        SELECT d.data 
        FROM downloaded_data d
        JOIN user_connections u ON d.connection_id = u.connection_id
        WHERE u.source_id = ${baseSourceId} AND u.wallet_address = ANY(${allowedWallets})
      `;
    } else {
      records = await sql`
        SELECT d.data 
        FROM downloaded_data d
        JOIN user_connections u ON d.connection_id = u.connection_id
        WHERE u.source_id = ${baseSourceId}
      `;
    }

    if (records.length === 0) {
      return NextResponse.json({ error: 'No data available for this dataset yet.' }, { status: 404 });
    }

    // 4. Format data
    let output = '';
    let contentType = 'text/plain';
    let filename = `${datasetId}_export.${format}`;

    if (format.toLowerCase() === 'jsonl') {
      contentType = 'application/x-ndjson';
      output = records.map(r => JSON.stringify(r.data)).join('\\n');
    } 
    else if (format.toLowerCase() === 'csv') {
      contentType = 'text/csv';
      if (records.length > 0) {
        const keys = Object.keys(records[0].data || {});
        output = keys.join(',') + '\\n';
        output += records.map(r => keys.map(k => '"' + (typeof r.data[k] === 'object' ? JSON.stringify(r.data[k]) : String(r.data[k])).replace(/"/g, '""') + '"').join(',')).join('\\n');
      }
    }
    else if (format.toLowerCase() === 'parquet') {
      contentType = 'application/octet-stream';
      output = "PARQUET_MOCK_DATA\\n" + records.map(r => JSON.stringify(r.data)).join('\\n');
    }
    else {
      return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }

    // 5. Send response
    return new NextResponse(output, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

