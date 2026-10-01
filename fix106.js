const fs = require('fs');
let c = fs.readFileSync('src/lib/data-sources.ts', 'utf8');

const replacements = {
  "AI conversation history, memories, and interaction patterns from OpenAI's ChatGPT.": "Monetize your AI interaction patterns, prompt engineering techniques, and conversational logic securely.",
  "Development activity, repositories, contributions, and starred projects from GitHub.": "Share your coding habits, tech stack preferences, and open-source contribution patterns.",
  "Social media profile, posts, following, and advertising data from Instagram.": "Unlock the value of your visual content engagement, brand interactions, and audience demographics.",
  "Professional profile, work experience, skills, education, and network connections.": "Turn your professional trajectory, industry networking, and skill endorsements into a valuable asset.",
  "Music preferences, saved tracks, playlists, and listening profile from Spotify.": "Share your unique audio taste profile, genre affinities, and listening habits with researchers.",
  "Watch history, likes, subscriptions, playlists, and channel profile.": "Monetize your video consumption behavior, content preferences, and creator engagement metrics.",
  "Order history, purchase details, and account profile from Amazon.": "Provide high-value consumer insights, purchasing habits, and product category preferences.",
  "AI conversation history and projects from Anthropic\\'s Claude assistant.": "Extract value from your structured AI workflows, complex prompt engineering, and project context.",
  "Notes content, folder structure, and organization from Apple iCloud Notes.": "Monetize your organizational habits, thought structuring, and personal productivity workflows.",
  "Health and wellness data: sleep, activity, and readiness from Oura Ring.": "Contribute high-fidelity biometric signals, sleep architecture, and physiological recovery trends.",
  "Fitness activities, GPS routes, heart rate, and performance metrics from Strava.": "Share your athletic endurance metrics, geospatial training routes, and physical performance data.",
  "24/7 biometric data, recovery scores, sleep, and strain metrics from WHOOP.": "Monetize your continuous physiological monitoring, cardiovascular strain, and metabolic activity."
};

for (const [oldDesc, newDesc] of Object.entries(replacements)) {
  // Try exact match or with escaped quotes
  let target = \`description: '\${oldDesc}'\`;
  if (!c.includes(target)) {
     target = \`description: "\${oldDesc}"\`;
  }
  
  if (c.includes(target)) {
    c = c.replace(target, \`description: '\${newDesc.replace(/'/g, "\\\\'")}'\`);
  } else {
    // If not found, just replace the string itself anywhere
    c = c.split(oldDesc).join(newDesc);
  }
}

fs.writeFileSync('src/lib/data-sources.ts', c);
