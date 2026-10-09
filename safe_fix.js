const fs = require('fs');
let content = fs.readFileSync('src/components/SourceCard.tsx', 'utf8');

// 1. Remove useSession import
content = content.replace(/import \{ useSession, signIn \} from 'next-auth\/react';\r?\n/, '');

// 2. Remove sessionStatus destructuring
content = content.replace(/const \{ status: sessionStatus \} = useSession\(\);\r?\n/, '');

// 3. Remove sessionStatus from handleConnect
content = content.replace(/&& sessionStatus !== 'authenticated'/g, '');

// 4. Remove Google SignIn Button precisely line by line
let lines = content.split('\n');
let newLines = [];
let skipMode = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("signIn('google'")) {
        // Remove the preceding <button line
        newLines.pop();
        skipMode = true;
        continue;
    }
    
    if (skipMode && lines[i].includes('Sign in with Google')) {
        // Skip this line and the next line (</button>)
        i++; // skip </button>
        skipMode = false;
        continue;
    }
    
    if (!skipMode) {
        newLines.push(lines[i]);
    }
}

// 5. Replace text
const finalContent = newLines.join('\n').replace(
    'Please connect your Vana wallet or sign in with an external provider to connect data sources.',
    'Please connect your Web3 wallet to connect data sources and start earning.'
);

fs.writeFileSync('src/components/SourceCard.tsx', finalContent);
console.log('Fixed SourceCard safely.');
