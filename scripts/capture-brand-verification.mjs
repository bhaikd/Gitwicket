import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/bhaik/.gemini/antigravity-ide/brain/20d752ec-137a-4eb6-8a4c-83759dfca8cf';
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,1000'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 2 });

  console.log('Testing Home page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const homeTitle = await page.title();
  console.log('Home title:', homeTitle);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'gitwicket-home.png'),
    fullPage: false,
  });

  console.log('Testing Player Card page (/shadcn)...');
  await page.goto('http://localhost:3000/shadcn', { waitUntil: 'networkidle2', timeout: 30000 });
  const cardTitle = await page.title();
  console.log('Card title:', cardTitle);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'gitwicket-card-shadcn.png'),
    fullPage: false,
  });

  console.log('Testing Duel page (/duel?a=shadcn&b=leerob)...');
  await page.goto('http://localhost:3000/duel?a=shadcn&b=leerob', { waitUntil: 'networkidle2', timeout: 30000 });
  const duelTitle = await page.title();
  console.log('Duel title:', duelTitle);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'gitwicket-duel.png'),
    fullPage: false,
  });

  console.log('Testing OpenGraph image (/shadcn/opengraph-image)...');
  await page.goto('http://localhost:3000/shadcn/opengraph-image', { waitUntil: 'networkidle2' });
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'gitwicket-og-image.png'),
    fullPage: false,
  });

  console.log('Testing redirect (/codecricket -> /gitwicket)...');
  const res = await page.goto('http://localhost:3000/codecricket', { waitUntil: 'networkidle2' });
  console.log('Final URL after /codecricket:', page.url());

  await browser.close();
  console.log('All screenshots and verifications completed successfully!');
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
