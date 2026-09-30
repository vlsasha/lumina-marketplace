const fs = require('fs');
let content = fs.readFileSync('src/lib/vana.ts', 'utf8');

const target = `  const result = await controller.readAllApprovedData({ requestId: connectionId });
  
    // Serialize any errors in the result because Error objects become {} in JSON
    if (result && result.errors) {
      for (const key of Object.keys(result.errors)) {
        if (result.errors[key] instanceof Error) {
          result.errors[key] = {
            message: result.errors[key].message,
            stack: result.errors[key].stack,
            name: result.errors[key].name
          };
        }
      }
    }
    return {
      data: result,
      source: sourceId,
    scope: scope || 'all',
    timestamp: new Date().toISOString(),
  };`;

const replacement = `  try {
    const result = await controller.readAllApprovedData({ requestId: connectionId });
    
    // Serialize any errors in the result because Error objects become {} in JSON
    if (result && result.errors) {
      for (const key of Object.keys(result.errors)) {
        const error = result.errors[key];
        console.error(\`[Vana SDK] Scope "\${key}" read failed:\`, {
          message: error?.message,
          isAuthError: error?.message?.includes('403'),
          isPaymentError: error?.message?.includes('402')
        });

        if (error instanceof Error) {
          result.errors[key] = {
            message: error.message,
            stack: error.stack,
            name: error.name,
            isPaymentError: error.message.includes('402'),
            isAuthError: error.message.includes('403')
          };
        }
      }
    }
    return {
      data: result,
      source: sourceId,
      scope: scope || 'all',
      timestamp: new Date().toISOString(),
    };
  } catch (e) {
    console.error('[Vana SDK] Top-level read error:', e);
    throw e;
  }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/lib/vana.ts', content);
