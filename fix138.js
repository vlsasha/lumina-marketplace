const fs = require('fs');

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(
  `className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12"`,
  `className="w-full 2xl:px-12 mx-auto px-4 sm:px-6 lg:px-8 py-12"`
);
fs.writeFileSync('src/components/Footer.tsx', footer);

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
header = header.replace(
  `className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8"`,
  `className="w-full 2xl:px-12 mx-auto px-4 sm:px-6 lg:px-8"`
);
fs.writeFileSync('src/components/Header.tsx', header);
