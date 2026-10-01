const fs = require('fs');

// 1. Update HeroSection
let hero = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');
hero = hero.replace(`bg-[#050505]"`, `transparent"`);
hero = hero.replace(`{/* Animated grid */}\n        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMUUxRTFFIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9zdmc+')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-40" />`, ``);
fs.writeFileSync('src/components/HeroSection.tsx', hero);

// 2. Update StatsSection
let stats = fs.readFileSync('src/components/StatsSection.tsx', 'utf8');
stats = stats.replace(`bg-[#050505]`, `bg-transparent`);
fs.writeFileSync('src/components/StatsSection.tsx', stats);

// 3. Update page.tsx to include fixed global grid
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
page = page.replace(
  `<main className="pt-16">`,
  `{/* Global Full-Page Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#050505]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMUUxRTFFIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48L2c+PC9zdmc+')] opacity-40 [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]" />
      </div>

      <main className="pt-16">`
);
fs.writeFileSync('src/app/page.tsx', page);

// Let's also check MonetizeInfoSection and HowItWorks for solid backgrounds
