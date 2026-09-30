const fs = require('fs');

let api = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');
const targetApi = `    return NextResponse.json({ success: true });
  } catch (error) {`;
const replaceApi = `    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save connection', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!sql) return NextResponse.json({ success: true });
    
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');
    const source = searchParams.get('source');
    
    if (!wallet || !source) return NextResponse.json({ error: 'Missing args' }, { status: 400 });

    await initDb();
    
    await sql\`
      DELETE FROM user_connections 
      WHERE wallet_address = \${wallet} AND source_id = \${source}
    \`;

    return NextResponse.json({ success: true });
  } catch (error) {`;
api = api.replace(targetApi, replaceApi);
fs.writeFileSync('src/app/api/connections/route.ts', api);

let page = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
const targetPage = `    const newConns = connections.filter((c) => c.sourceId !== sourceId);
    setConnections(newConns);
    localStorage.setItem('vana_connections', JSON.stringify(newConns));
    if (dataPreview?.source === sourceId) {
      setDataPreview(null);
    }
  };`;
const replacePage = `    const newConns = connections.filter((c) => c.sourceId !== sourceId);
    setConnections(newConns);
    localStorage.setItem('vana_connections', JSON.stringify(newConns));
    if (dataPreview?.source === sourceId) {
      setDataPreview(null);
    }
    
    if (address) {
      fetch(\`/api/connections?wallet=\${address}&source=\${sourceId}\`, {
        method: 'DELETE'
      }).catch(console.error);
    }
  };`;
page = page.replace(targetPage, replacePage);
fs.writeFileSync('src/app/dashboard/page.tsx', page);
