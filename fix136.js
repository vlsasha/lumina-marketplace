const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Some are `w-full 2xl:px-12 mx-auto`
    // Some are `flex-1 w-full 2xl:px-12 mx-auto`
    // Some are `relative w-full 2xl:px-12 mx-auto`
    
    content = content.replace(/w-full 2xl:px-12 mx-auto/g, 'max-w-[1440px] w-full mx-auto');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
