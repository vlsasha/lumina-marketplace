const fs = require('fs');
let file = fs.readFileSync('src/components/Header.tsx', 'utf8');

file = file.replace(/import \{ signOut, signIn, useSession \} from 'next-auth\/react';\r?\n/, '');
file = file.replace(/const \{ status: sessionStatus \} = useSession\(\);\r?\n/, '');

// Replace the dropdown signout logic
file = file.replace(
`                  {(sessionStatus === 'authenticated' || isConnected) && (
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          if (sessionStatus === 'authenticated') signOut();
                          if (isConnected) disconnect();
                        }}`,
`                  {isConnected && (
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          if (isConnected) disconnect();
                        }}`
);

// Remove the mobile sign in button
const mobileSignInRegex = /\{sessionStatus !== 'authenticated' && \([\s\S]*?<\/button>\r?\n\s*\)\}/;
file = file.replace(mobileSignInRegex, '');

// Remove the mobile sign out button
const mobileSignOutRegex = /\{sessionStatus === 'authenticated' && \([\s\S]*?<\/button>\r?\n\s*\)\}/;
file = file.replace(mobileSignOutRegex, '');

fs.writeFileSync('src/components/Header.tsx', file);
console.log("Header updated.");
