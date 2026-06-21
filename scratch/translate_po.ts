import * as fs from 'fs';
import * as readline from 'readline';

async function run() {
  const poPath = 'c:/Users/aszx1/Desktop/games/don\'t starve/scripts/scripts/languages/chinese_t.po';
  const fileStream = fs.createReadStream(poPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentContext = '';
  let currentMsgId = '';
  let currentMsgStr = '';
  let parsingState: 'none' | 'msgctxt' | 'msgid' | 'msgstr' = 'none';

  const ctxtMap: Record<string, string> = {};
  const engMap: Record<string, string> = {};

  let count = 0;

  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed.startsWith('msgctxt ')) {
      parsingState = 'msgctxt';
      // extract string inside quotes
      const match = line.match(/"([^"]+)"/);
      currentContext = match ? match[1] : '';
    } else if (trimmed.startsWith('msgid ')) {
      parsingState = 'msgid';
      const match = line.match(/"([^"]*)"/);
      currentMsgId = match ? match[1] : '';
    } else if (trimmed.startsWith('msgstr ')) {
      parsingState = 'msgstr';
      const match = line.match(/"([^"]*)"/);
      currentMsgStr = match ? match[1] : '';
    } else if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      // continuation of previous multiline string
      const match = line.match(/"([^"]*)"/);
      const content = match ? match[1] : '';
      if (parsingState === 'msgctxt') {
        currentContext += content;
      } else if (parsingState === 'msgid') {
        currentMsgId += content;
      } else if (parsingState === 'msgstr') {
        currentMsgStr += content;
      }
    } else if (trimmed === '') {
      // entry end, save it
      if (currentMsgId && currentMsgStr) {
        if (currentContext) {
          ctxtMap[currentContext.toUpperCase()] = currentMsgStr;
        }
        engMap[currentMsgId.toLowerCase()] = currentMsgStr;
      }
      currentContext = '';
      currentMsgId = '';
      currentMsgStr = '';
      parsingState = 'none';
      count++;
      if (count % 100000 === 0) {
        console.log(`Parsed ${count} lines...`);
      }
    }
  }

  // Save last entry if exists
  if (currentMsgId && currentMsgStr) {
    if (currentContext) {
      ctxtMap[currentContext.toUpperCase()] = currentMsgStr;
    }
    engMap[currentMsgId.toLowerCase()] = currentMsgStr;
  }

  console.log(`Total entries parsed: ${count}`);
  console.log('Sample ctxtMap entries for STRINGS.NAMES:');
  const sampleKeys = Object.keys(ctxtMap).filter(k => k.startsWith('STRINGS.NAMES.')).slice(0, 20);
  for (const k of sampleKeys) {
    console.log(`${k} -> ${ctxtMap[k]}`);
  }

  console.log('\nSample engMap entries:');
  const sampleEng = Object.keys(engMap).slice(0, 20);
  for (const k of sampleEng) {
    console.log(`${k} -> ${engMap[k]}`);
  }
}

run().catch(console.error);
