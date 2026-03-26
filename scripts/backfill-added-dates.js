import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const dataDir = path.join(import.meta.dirname, '../data');

const cityDirs = fs.readdirSync(dataDir).filter(f => {
  return !f.startsWith('.') && fs.statSync(path.join(dataDir, f)).isDirectory();
});

let updated = 0;
let skipped = 0;

for (const city of cityDirs) {
  const cityPath = path.join(dataDir, city);
  const files = fs.readdirSync(cityPath).filter(f => f.endsWith('.md') && f !== 'index.md');

  for (const file of files) {
    const filePath = path.join(cityPath, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has added field
    if (/^added:/m.test(content)) {
      skipped++;
      continue;
    }

    // Get first commit date from git
    const relPath = path.relative(process.cwd(), filePath);
    let date;
    try {
      const out = execSync(`git log --diff-filter=A --follow --format=%aI -- "${relPath}"`, { encoding: 'utf8' }).trim();
      date = out.split('\n').pop().split('T')[0];
    } catch (e) {}

    if (!date) {
      try {
        const out = execSync(`git log --follow --format=%aI -- "${relPath}"`, { encoding: 'utf8' }).trim();
        date = out.split('\n').pop().split('T')[0];
      } catch (e) {}
    }

    if (!date) {
      console.log(`NODATE ${relPath}`);
      continue;
    }

    // Insert added: right after the opening ---
    const newContent = content.replace(/^---\n/, `---\nadded: ${date}\n`);
    fs.writeFileSync(filePath, newContent);
    console.log(`${relPath} -> ${date}`);
    updated++;
  }
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
