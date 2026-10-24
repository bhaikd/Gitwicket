import puppeteer from 'puppeteer-core';

async function run() {
  console.log('--- REPRODUCING BUG IN BROWSER ---');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const consoleLogs = [];
  page.on('console', (msg) => consoleLogs.push(`[Browser ${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => consoleLogs.push(`[Page Error] ${err.toString()}`));

  try {
    console.log('1. Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    const inputSelector = 'input[type="text"]';
    const submitBtnSelector = 'button[type="submit"]';

    const initialDisabled = await page.$eval(inputSelector, (el) => el.disabled);
    console.log(`Initial input disabled status: ${initialDisabled}`);

    console.log('2. Typing "shadcn" into input and submitting...');
    await page.type(inputSelector, 'shadcn');
    await page.click(submitBtnSelector);

    console.log('3. Waiting for navigation to /shadcn...');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Current URL after submit:', page.url());

    console.log('4. Pressing browser Back button (page.goBack())...');
    await page.goBack({ waitUntil: 'networkidle2' });
    console.log('Current URL after goBack:', page.url());

    // Check if input is disabled or frozen
    const isInputDisabledAfterBack = await page.$eval(inputSelector, (el) => el.disabled);
    const inputValueAfterBack = await page.$eval(inputSelector, (el) => el.value);
    const isButtonDisabledAfterBack = await page.$eval(submitBtnSelector, (el) => el.disabled);
    const buttonTextAfterBack = await page.$eval(submitBtnSelector, (el) => el.innerText.trim());

    console.log(`\n=== REPRODUCTION RESULTS (Browser Back) ===`);
    console.log(`Input disabled: ${isInputDisabledAfterBack}`);
    console.log(`Input value: "${inputValueAfterBack}"`);
    console.log(`Submit button disabled: ${isButtonDisabledAfterBack}`);
    console.log(`Submit button text: "${buttonTextAfterBack}"`);

    // Try typing into input
    let canType = false;
    try {
      await page.type(inputSelector, 'antfu', { timeout: 2000 });
      const newVal = await page.$eval(inputSelector, (el) => el.value);
      canType = newVal.includes('antfu');
    } catch (e) {
      canType = false;
    }
    console.log(`Can type into input after Back: ${canType}`);

    // Now test with in-app back link
    console.log('\n5. Testing with in-app back link from card page...');
    await page.goto('http://localhost:3000/shadcn', { waitUntil: 'networkidle2' });
    const backLink = await page.$('a[href="/"]');
    if (backLink) {
      await backLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
      const inputDisabledAfterLink = await page.$eval(inputSelector, (el) => el.disabled);
      console.log(`Input disabled after in-app back link: ${inputDisabledAfterLink}`);
    }

    console.log('\nConsole logs captured during test:');
    consoleLogs.forEach((l) => console.log(l));
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Test script error:', err);
  process.exit(1);
});
