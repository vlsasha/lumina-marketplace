const fs = require('fs');

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove NextAuth imports
    content = content.replace(/import \{ useSession, signIn \} from 'next-auth\/react';\r?\n/, '');
    content = content.replace(/import \{ useSession \} from 'next-auth\/react';\r?\n/, '');

    // 2. Remove session status fetching
    content = content.replace(/const sessionObj = useSession\(\);\r?\n\s*const status = sessionObj\?\.status;\r?\n/, '');
    content = content.replace(/const \{ status: sessionStatus \} = useSession\(\);\r?\n/, '');
    
    // 3. Remove from conditionals
    content = content.replace(/status === 'authenticated' \|\| /, '');
    content = content.replace(/\[status, isConnected\]/, '[isConnected]');
    content = content.replace(/&& sessionStatus !== 'authenticated'/g, '');

    let lines = content.split('\n');
    let newLines = [];
    let skipMode = false;

    for (let i = 0; i < lines.length; i++) {
        // Find Google button start
        if (lines[i].includes("signIn('google'")) {
            // Pop the <button> tag line
            newLines.pop();
            skipMode = true;
            continue;
        }

        // Find Google button end
        if (skipMode && (lines[i].includes('Sign in with Google') || lines[i].includes('signInGoogle}'))) {
            // skip the current line and the </button> line
            i++;
            skipMode = false;
            continue;
        }

        if (!skipMode) {
            newLines.push(lines[i]);
        }
    }

    content = newLines.join('\n');
    
    // 4. Remove OR divider
    const orDivider = `              <div className="w-full flex items-center gap-4 my-6 opacity-40">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">OR</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>`;
              
    const orDivider2 = `                <div className="w-full flex items-center gap-4 my-6 opacity-40">
                  <div className="flex-1 h-px bg-gray-600"></div>
                  <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">OR</span>
                  <div className="flex-1 h-px bg-gray-600"></div>
                </div>`;
                
    const orDivider3 = `                <div className="w-full flex items-center gap-4 my-6 opacity-40">\r
                  <div className="flex-1 h-px bg-gray-600"></div>\r
                  <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">OR</span>\r
                  <div className="flex-1 h-px bg-gray-600"></div>\r
                </div>`;

    // Regex to generically remove the OR divider regardless of indentation or CRLF
    const orRegex = /<div className="w-full flex items-center gap-4 my-6 opacity-40">[\s\S]*?<div className="flex-1 h-px bg-gray-600"><\/div>[\s\S]*?<span className="text-xs font-medium text-gray-300 uppercase tracking-wider">OR<\/span>[\s\S]*?<div className="flex-1 h-px bg-gray-600"><\/div>[\s\S]*?<\/div>/g;
    
    content = content.replace(orRegex, '');

    fs.writeFileSync(filePath, content);
    console.log(`Cleaned ${filePath}`);
}

cleanFile('src/components/SourceCard.tsx');
cleanFile('src/app/dashboard/page.tsx');
