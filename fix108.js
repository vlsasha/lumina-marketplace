const fs = require('fs');
let c = fs.readFileSync('src/lib/data-sources.ts', 'utf8');

c = c.replace(
  `description: 'AI conversation history, memories, and interaction patterns from OpenAI\\'s ChatGPT.'`,
  `description: 'Monetize your AI interaction patterns, prompt engineering techniques, and conversational logic securely.'`
);

fs.writeFileSync('src/lib/data-sources.ts', c);
