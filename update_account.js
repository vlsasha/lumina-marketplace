const fs = require('fs');

let file = fs.readFileSync('src/app/account/page.tsx', 'utf8');

// Remove import
file = file.replace(/import { useSession, signIn } from 'next-auth\/react';\r?\n/, '');

// Remove session usage
file = file.replace(/const sessionObj = useSession\(\);\r?\n\s*const status = sessionObj\?\.status;\r?\n/, '');

// Update useEffect logic
file = file.replace(
`  useEffect(() => {
    if (status === 'authenticated' || isConnected) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [status, isConnected]);`,
`  useEffect(() => {
    if (isConnected) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isConnected]);`
);

// Remove "Sign in with Google" button
const googleBtnRegex = /<button[\s\S]*?onClick=\{\(\) => signIn\('google', \{ callbackUrl: '\/account' \}\)\}[\s\S]*?<\/button>/;
file = file.replace(googleBtnRegex, '');

// Fix wording in "Connect to Access Workspace" block
file = file.replace(
  'Please connect your Vana wallet or sign in with an external provider to view your personalized dashboard.',
  'Please connect your Web3 wallet to view your personalized dashboard and track your earnings.'
);

fs.writeFileSync('src/app/account/page.tsx', file);
console.log("Account page updated.");
