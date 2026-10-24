import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const TIERS = [
  { tier: 'Legend', username: 'shadcn', filename: 'tier-1-legend-shadcn.png' },
  { tier: 'National', username: 'torvalds', filename: 'tier-2-national-torvalds.png' },
  { tier: 'State', username: 'sarah', filename: 'tier-3-state-sarah.png' },
  { tier: 'Club', username: 'taylorotwell', filename: 'tier-4-club-taylorotwell.png' },
  { tier: 'Rookie', username: 'bhaik', filename: 'tier-5-rookie-bhaik.png' },
];

const ARTIFACT_DIR = 'C:\\Users\\bhaik\\.gemini\\antigravity-ide\\brain\\20d752ec-137a-4eb6-8a4c-83759dfca8cf';
const PUBLIC_DIR = path.resolve('public', 'screenshots');

async function capture() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 960, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  console.log('--- CAPTURING ALL 5 TIERS ---');

  for (const item of TIERS) {
    console.log(`Navigating to /${item.username} (${item.tier} Tier)...`);
    await page.goto(`http://localhost:3000/${item.username}`, { waitUntil: 'networkidle2' });

    await page.waitForSelector('#player-cricket-card', { visible: true });
    // Slight pause for images/fonts to settle
    await new Promise((r) => setTimeout(r, 600));

    const cardEl = await page.$('#player-cricket-card');
    if (!cardEl) {
      console.error(`Could not find #player-cricket-card for ${item.username}`);
      continue;
    }

    const publicPath = path.join(PUBLIC_DIR, item.filename);
    const artifactPath = path.join(ARTIFACT_DIR, item.filename);

    await cardEl.screenshot({ path: publicPath });
    fs.copyFileSync(publicPath, artifactPath);
    console.log(`✓ Saved ${item.tier} screenshot to: ${publicPath} and artifact dir`);
  }

  await browser.close();
  console.log('\nAll 5 tier screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
