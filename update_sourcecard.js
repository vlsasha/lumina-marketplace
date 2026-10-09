const fs = require('fs');

let file = fs.readFileSync('src/components/SourceCard.tsx', 'utf8');

file = file.replace(/import { useSession, signIn } from 'next-auth\/react';\r?\n/, '');
file = file.replace(/const \{ status: sessionStatus \} = useSession\(\);\r?\n/, '');

file = file.replace(
`  const handleConnect = async () => {
    if (!address && sessionStatus !== 'authenticated') {
      setShowAuthModal(true);
      return;
    }`,
`  const handleConnect = async () => {
    if (!address) {
      setShowAuthModal(true);
      return;
    }`
);

// Optional: Change the auth modal message if it mentions Google
file = file.replace(
  'Please connect your Vana wallet or sign in with an external provider to connect data sources.',
  'Please connect your Web3 wallet to connect data sources and start earning.'
);

// Check if signIn is used in the modal
const signInRegex = /<button[\s\S]*?onClick=\{\(\) => signIn\('google'\)\}[\s\S]*?<\/button>/;
file = file.replace(signInRegex, '');


fs.writeFileSync('src/components/SourceCard.tsx', file);
console.log("SourceCard updated.");
