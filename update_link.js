const fs = require('fs');
let code = fs.readFileSync('src/components/SourcesGrid.tsx', 'utf8');

const target = 'href="https://github.com/vana-com/data-connect/releases/latest"';
const replacement = 'href="https://app.vana.org/download"';

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/SourcesGrid.tsx', code);
    console.log("Successfully updated download link URL.");
} else {
    console.log("Target string not found in SourcesGrid.tsx.");
}
