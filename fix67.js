const fs = require('fs');
let c = fs.readFileSync('src/app/api/connections/route.ts', 'utf8');

c = c.replace(
  `        } catch (e) {
          console.error(e);
        }
      }`,
  `        } catch (e) {
          console.error(e);
        }
      } else if (connection.sourceId === 'claude') {
        try {
          const dbResult = await sql\`SELECT data FROM downloaded_data WHERE connection_id = \${connection.connectionId}\`;
          let json = null;
          if (dbResult && dbResult.length > 0) json = dbResult[0].data;
          
          const claudeData = json?.data?.results?.['claude.conversations']?.data?.data || json;
          if (claudeData?.organizationId) {
            providerAccountId = 'claude_' + claudeData.organizationId;
            
            const plan = claudeData.profile?.plan || '';
            if (plan.toLowerCase().includes('pro') || plan.toLowerCase().includes('paid')) {
              qualityScore += 20;
            }
            
            const convos = claudeData.conversations || [];
            if (convos.length >= 50) qualityScore += 40;
            else if (convos.length >= 10) qualityScore += 20;
            
            const msgTotal = claudeData.messageTotal || 0;
            if (msgTotal >= 500) qualityScore += 40;
            else if (msgTotal >= 100) qualityScore += 20;
          }
        } catch (e) {
          console.error(e);
        }
      }`
);

fs.writeFileSync('src/app/api/connections/route.ts', c);
