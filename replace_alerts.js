const fs = require('fs');

function replaceAlerts(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes("import toast from 'react-hot-toast'")) {
    code = code.replace(/import\s+.*?;?\n/, "$&\nimport toast from 'react-hot-toast';\n");
  }

  // Generic alert replacement
  code = code.replace(/alert\('Please connect your wallet first!'\);/g, "toast.error('Please connect your wallet first!');");
  code = code.replace(/alert\('Please select a data source to acquire.'\);/g, "toast.error('Please select a data source to acquire.');");
  code = code.replace(/alert\('Network error downloading dataset.'\);/g, "toast.error('Network error downloading dataset.');");
  code = code.replace(/alert\(errorData\.error \|\| 'Failed to download dataset\.'\);/g, "toast.error(errorData.error || 'Failed to download dataset.');");
  code = code.replace(/alert\('DB Error loading purchases: ' \+ data\.details\);/g, "toast.error('DB Error loading purchases: ' + data.details);");
  code = code.replace(/alert\(\`Vana Error: \$\{data\.error \|\| 'Unknown error'\}\`\);/g, "toast.error(`Vana Error: ${data.error || 'Unknown error'}`);");
  
  // Custom for DataQueryBuilder success
  code = code.replace(
    /alert\(locale === 'ru' \? 'Транзакция отправлена! Датасет появится в Workspace через 1-2 минуты.' : 'Transaction sent! Dataset will appear in your Workspace in 1-2 minutes.'\);/g,
    "toast.success(locale === 'ru' ? 'Транзакция отправлена! Датасет скоро появится в Workspace.' : 'Transaction sent! Dataset will appear in your Workspace soon.', { duration: 5000 });"
  );
  
  // Custom for errors in catch blocks where it might not be an alert
  // e.g. DataQueryBuilder error:
  code = code.replace(/console.error\('Error buying data:', err\);/g, "console.error('Error buying data:', err);\n      toast.error('Transaction failed or was rejected.');");

  fs.writeFileSync(file, code);
}

replaceAlerts('src/app/account/page.tsx');
replaceAlerts('src/components/DataQueryBuilder.tsx');
replaceAlerts('src/components/SourceCard.tsx');
