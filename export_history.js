const fs = require('fs');
const readline = require('readline');
const path = require('path');

const inputPath = 'C:\\Users\\Alexander\\.gemini\\antigravity\\brain\\a26c290c-eebc-4471-94ad-a6d3e0bd97e6\\.system_generated\\logs\\transcript_full.jsonl';
const outputPath = 'd:\\Проект Vana\\Vana app\\databridge\\conversation_export.md';

async function processTranscript() {
    const fileStream = fs.createReadStream(inputPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let markdown = '# DataBridge Development History\\n\\n';
    markdown += '> This file contains the dialogue history between the User and the AI Assistant (DataBridge Builder) for context when sharing with other AI agents.\\n\\n---\\n\\n';

    for await (const line of rl) {
        if (!line.trim()) continue;
        try {
            const entry = JSON.parse(line);
            
            // Only capture actual conversational turns (skip generic tool executions etc.)
            if (entry.source === 'USER_EXPLICIT' && entry.type === 'USER_INPUT') {
                let content = entry.content || '';
                // Clean up metadata blocks if needed, but keeping them might be useful context
                markdown += `## 👤 User\\n\\n${content}\\n\\n---\\n\\n`;
            } else if (entry.source === 'MODEL' && entry.type === 'PLANNER_RESPONSE') {
                let content = entry.content || '';
                if (content.trim()) {
                    markdown += `## 🤖 AI Assistant (DataBridge Builder)\\n\\n${content}\\n\\n---\\n\\n`;
                }
            }
        } catch (e) {
            console.error('Error parsing line', e);
        }
    }

    fs.writeFileSync(outputPath, markdown, 'utf8');
    console.log('Exported successfully to ' + outputPath);
}

processTranscript();
