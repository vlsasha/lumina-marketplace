const fs = require('fs');
let c = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

c = c.replace(
  `<a
            href="https://docs.vana.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl border border-[#333] bg-[#111]/50 backdrop-blur-sm hover:border-vana-primary/50 text-white font-semibold text-base transition-all hover:bg-[#1a1a1a]"
          >
            Read Documentation
          </a>`,
  `<Link
            href="/docs"
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl border border-[#333] bg-[#111]/50 backdrop-blur-sm hover:border-vana-primary/50 text-white font-semibold text-base transition-all hover:bg-[#1a1a1a]"
          >
            Read Documentation
          </Link>`
);

fs.writeFileSync('src/components/HeroSection.tsx', c);
