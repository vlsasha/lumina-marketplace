const fs = require('fs');

const transcriptPath = 'C:\\\\Users\\\\Alexander\\\\.gemini\\\\antigravity\\\\brain\\\\a26c290c-eebc-4471-94ad-a6d3e0bd97e6\\\\.system_generated\\\\logs\\\\transcript_full.jsonl';
const exportPath = 'd:\\\\Проект Vana\\\\Vana app\\\\databridge\\\\conversation_export.md';

let exportContent = '# DataBridge Project Conversation History\\n\\n';

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\\n');

for (const line of lines) {
  if (!line.trim()) continue;
  
  try {
    const entry = JSON.parse(line);
    
    // Only export user requests and model responses
    if (entry.type === 'USER_INPUT' || entry.source === 'USER_EXPLICIT') {
      exportContent += '## 🧑 User (Step ' + entry.step_index + ')\\n\\n';
      exportContent += (entry.content || '') + '\\n\\n';
      exportContent += '---\\n\\n';
    } else if (entry.type === 'PLANNER_RESPONSE' || entry.source === 'MODEL') {
      exportContent += '## 🤖 Assistant (Step ' + entry.step_index + ')\\n\\n';
      exportContent += (entry.content || '') + '\\n\\n';
      exportContent += '---\\n\\n';
    }
  } catch (e) {
    console.error('Error parsing line:', e);
  }
}

fs.writeFileSync(exportPath, exportContent);
console.log('Export completed successfully!');
