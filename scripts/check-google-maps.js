import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { load } from '../data.js';

const args = process.argv.slice(2);
const include = args.filter(a => !a.startsWith('-'));
const exclude = args.filter(a => a.startsWith('-')).map(a => a.slice(1));
const { places } = load();
const toCheck = places.filter(p => {
  if (!p.google_maps || p.closed) return false;
  if (exclude.includes(p.city)) return false;
  if (include.length > 0) return include.includes(p.city);
  return true;
});

const label = include.length ? ` in ${include.join(', ')}` : exclude.length ? ` excluding ${exclude.join(', ')}` : '';
console.log(`Found ${toCheck.length} non-closed cafes to check${label}.\n`);

async function checkPlace(browser, url) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 900 });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    const separator = url.includes('?') ? '&' : '?';
    await page.goto(`${url}${separator}hl=en`, { timeout: 30000 });
    await page.waitForSelector('h1', { timeout: 15000 }).catch(() => {});

    const result = await page.evaluate(() => {
      const name = document.querySelector('h1')?.textContent?.trim() || null;
      const bodyText = document.body.innerText;
      const closed = /permanently closed/i.test(bodyText);
      return { name, closed };
    });

    if (!result.name) {
      return { closed: true, reason: 'link not working' };
    } else if (result.closed) {
      return { name: result.name, closed: true, reason: 'permanently closed' };
    }
    return { name: result.name, closed: false };
  } catch (err) {
    return { closed: true, reason: `error: ${err.message}` };
  } finally {
    await page.close();
  }
}

function markClosed(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content.replace(/^---\n/, '---\nclosed: true\n');
  fs.writeFileSync(filePath, updated);
}

const browser = await puppeteer.launch({ headless: true });
const newlyClosed = [];

for (let i = 0; i < toCheck.length; i++) {
  const place = toCheck[i];
  const filePath = path.join('data', place.file);

  process.stdout.write(`[${i + 1}/${toCheck.length}] ${place.name} ... `);

  const result = await checkPlace(browser, place.google_maps);

  if (result.closed) {
    console.log(`CLOSED (${result.reason})`);
    markClosed(filePath);
    newlyClosed.push({ file: place.file, name: place.name, reason: result.reason });
  } else {
    console.log('open');
  }
}

await browser.close();

console.log(`\n--- Done ---`);
console.log(`Checked: ${toCheck.length}`);
console.log(`Newly closed: ${newlyClosed.length}`);
if (newlyClosed.length > 0) {
  console.log('\nFiles updated:');
  for (const c of newlyClosed) {
    console.log(`  ${c.file} (${c.reason})`);
  }
}
