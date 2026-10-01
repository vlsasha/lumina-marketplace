const fs = require('fs');
let c = fs.readFileSync('src/components/StatsSection.tsx', 'utf8');

c = c.replace(
  `Built for the future of AI`,
  `Built for the future of data ownership`
);

c = c.replace(
  `Lumina provides the enterprise-grade infrastructure needed to securely route private user data into LLM training pipelines.`,
  `Lumina provides the enterprise-grade infrastructure needed to securely connect, validate, and route private user data directly to researchers and brands.`
);

fs.writeFileSync('src/components/StatsSection.tsx', c);
