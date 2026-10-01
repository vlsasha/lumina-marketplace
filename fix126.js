const fs = require('fs');
let c = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

c = c.replace(
  `max-w-5xl mx-auto`,
  `w-full mx-auto`
);

c = c.replace(
  `h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 pb-2"`,
  `h1 className="text-5xl sm:text-7xl lg:text-[90px] xl:text-[110px] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 pb-2 leading-[1.1]"`
);

c = c.replace(
  `Turn your personal data <br className="hidden sm:block" />`,
  `Turn your personal\u00A0data <br className="hidden sm:block" />`
);

fs.writeFileSync('src/components/HeroSection.tsx', c);
