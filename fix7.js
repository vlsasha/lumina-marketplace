const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const target1 = `              // Fetch data preview automatically
              const dataRes = await fetch(\`/api/vana/data?source=\${sourceId}&connectionId=\${data.connectionId}\`);
              const previewData = await dataRes.json();
              setDataPreview(previewData);`;

const replacement1 = `              // Fetch data preview automatically
              const dataRes = await fetch(\`/api/vana/data?source=\${sourceId}&connectionId=\${data.connectionId}\`);
              const previewData = await dataRes.json();
              setDataPreview(previewData);
              if (!previewData.error) {
                localStorage.setItem(\`vana_data_\${data.connectionId}\`, JSON.stringify(previewData));
              }`;

c = c.replace(target1, replacement1);

const target2 = `  const handleReadData = async (sourceId: string) => {
    const connection = connections.find((c) => c.sourceId === sourceId);
    if (!connection) return;

    setLoading(sourceId);
    try {
      const res = await fetch(
        \`/api/vana/data?source=\${sourceId}&connectionId=\${connection.connectionId}\`
      );
      const data = await res.json();
      setDataPreview(data);
    } catch {
      console.error('Failed to read data');
    } finally {
      setLoading(null);
    }
  };`;

const replacement2 = `  const handleReadData = async (sourceId: string) => {
    const connection = connections.find((c) => c.sourceId === sourceId);
    if (!connection) return;

    setLoading(sourceId);
    try {
      const cached = localStorage.getItem(\`vana_data_\${connection.connectionId}\`);
      if (cached) {
        setDataPreview(JSON.parse(cached));
        setLoading(null);
        return;
      }

      const res = await fetch(
        \`/api/vana/data?source=\${sourceId}&connectionId=\${connection.connectionId}\`
      );
      const data = await res.json();
      setDataPreview(data);
      if (!data.error) {
        localStorage.setItem(\`vana_data_\${connection.connectionId}\`, JSON.stringify(data));
      }
    } catch {
      console.error('Failed to read data');
    } finally {
      setLoading(null);
    }
  };`;

c = c.replace(target2, replacement2);
fs.writeFileSync('src/app/dashboard/page.tsx', c);
