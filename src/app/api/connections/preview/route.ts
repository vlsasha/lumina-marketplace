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

    let previewObj: any = {};
    const tabs: Record<string, any> = {};

    const sanitizePayload = (payload: any): any => {
      if (!payload || typeof payload !== 'object') return payload;
      if (Array.isArray(payload)) {
        return payload.map(item => sanitizePayload(item));
      }
      const copy: any = { ...payload };
      for (const k of Object.keys(copy)) {
        if (/email/i.test(k) && typeof copy[k] === 'string') copy[k] = '***@***.***';
        if (/phone/i.test(k) && typeof copy[k] === 'string') copy[k] = '+1***';
        if (typeof copy[k] === 'object') copy[k] = sanitizePayload(copy[k]);
      }
      return copy;
    };

    const results = rawData?.data?.results || rawData?.results;

    if (results && typeof results === 'object') {
      const files = Object.keys(results);
      previewObj.files_included = files;

      for (const [key, value] of Object.entries(results as Record<string, any>)) {
        // e.g. 'spotify.savedTracks' -> 'SavedTracks', 'spotify.playlists' -> 'Playlists'
        const rawScope = key.includes('.') ? key.split('.').slice(1).join('.') : key;
        const tabTitle = rawScope.charAt(0).toUpperCase() + rawScope.slice(1);
        const payload = value?.data?.data || value?.data || value;
        tabs[tabTitle] = sanitizePayload(payload);
      }

      const firstKey = Object.keys(tabs)[0];
      if (firstKey) {
        previewObj.sample_data = tabs[firstKey];
      }
    } else if (rawData?.data && typeof rawData.data === 'object' && !Array.isArray(rawData.data)) {
      for (const [key, value] of Object.entries(rawData.data as Record<string, any>)) {
        if (['source', 'timestamp', 'scope', 'cached', 'error'].includes(key)) continue;
        const tabTitle = key.charAt(0).toUpperCase() + key.slice(1);
        tabs[tabTitle] = sanitizePayload(value);
      }
      const firstKey = Object.keys(tabs)[0];
      if (firstKey) previewObj.sample_data = tabs[firstKey];
    } else if (typeof rawData === 'object' && !Array.isArray(rawData)) {
      for (const [key, value] of Object.entries(rawData as Record<string, any>)) {
        if (['source', 'timestamp', 'scope', 'cached', 'error'].includes(key)) continue;
        const tabTitle = key.charAt(0).toUpperCase() + key.slice(1);
        tabs[tabTitle] = sanitizePayload(value);
      }
      const firstKey = Object.keys(tabs)[0];
      if (firstKey) previewObj.sample_data = tabs[firstKey];
    } else {
      previewObj = { raw: rawData };
    }

    return NextResponse.json({ 
      preview: previewObj, 
      tabs: Object.keys(tabs).length > 0 ? tabs : null,
      source 
    });

  } catch (error) {
    console.error('Failed to get preview:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
