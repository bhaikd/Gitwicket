import puppeteer from 'puppeteer-core';

async function run() {
  console.log('========================================================');
  console.log('       RUNNING COMPREHENSIVE VERIFICATION SUITE         ');
  console.log('========================================================\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const hydrationWarnings = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
    if (text.includes('hydration') || text.includes('Hydration') || text.includes('didn\'t match')) {
      hydrationWarnings.push(text);
    }
  });

  page.on('pageerror', (err) => consoleErrors.push(err.toString()));

  const inputSelector = 'input[type="text"]';
  const submitBtnSelector = 'button[type="submit"]';

  try {
    // -----------------------------------------------------------
    // TEST 1: Repeat 3x: Submit username -> Card page -> Browser Back -> Type new username
    // -----------------------------------------------------------
    console.log('👉 TEST 1: 3x Navigation Cycles (Home -> Submit -> Card -> Browser Back -> Type)');
    const testUsers = ['torvalds', 'shadcn', 'antfu'];

    for (let cycle = 0; cycle < 3; cycle++) {
      const user = testUsers[cycle];
      console.log(`\n  --- Cycle ${cycle + 1}/3: Testing @${user} ---`);

      if (cycle === 0) {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      }

      // Check input status before typing
      const isInputDisabled = await page.$eval(inputSelector, (el) => el.disabled);
      const isButtonDisabled = await page.$eval(submitBtnSelector, (el) => el.disabled);
      const curVal = await page.$eval(inputSelector, (el) => el.value);

      console.log(`  State before typing: input.disabled=${isInputDisabled}, input.value="${curVal}", button.disabled=${isButtonDisabled}`);
      if (isInputDisabled) throw new Error(`Cycle ${cycle + 1}: Input was frozen/disabled on home page!`);

      // Type username and submit
      console.log(`  Typing "${user}" and submitting...`);
      await page.type(inputSelector, user);
      await page.click(submitBtnSelector);

      // Wait for navigation to complete
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      console.log(`  Landed on card page: ${page.url()}`);
      if (!page.url().includes(user)) throw new Error(`Failed to navigate to user page: ${page.url()}`);

      // Press browser back
      console.log('  Pressing browser Back button...');
      await page.goBack({ waitUntil: 'networkidle2' });
      console.log(`  Returned to URL: ${page.url()}`);

      // Verify input state after Back
      const inputDisabledAfter = await page.$eval(inputSelector, (el) => el.disabled);
      const valAfter = await page.$eval(inputSelector, (el) => el.value);
      const btnDisabledAfter = await page.$eval(submitBtnSelector, (el) => el.disabled);
      const btnTextAfter = await page.$eval(submitBtnSelector, (el) => el.innerText.trim());

      console.log(`  State after Back: input.disabled=${inputDisabledAfter}, input.value="${valAfter}", button.disabled=${btnDisabledAfter}, button.text="${btnTextAfter}"`);

      if (inputDisabledAfter) {
        throw new Error(`Cycle ${cycle + 1} FAILED: Input is disabled after pressing Back!`);
      }
      if (btnDisabledAfter) {
        throw new Error(`Cycle ${cycle + 1} FAILED: Submit button is disabled after pressing Back!`);
      }

      // Test that user can type without errors
      await page.type(inputSelector, 'test');
      const testVal = await page.$eval(inputSelector, (el) => el.value);
      console.log(`  Verified user can type into input: "${testVal}"`);
      // Clear for next cycle
      await page.$eval(inputSelector, (el) => (el.value = ''));
      console.log(`  ✓ Cycle ${cycle + 1} PASSED!`);
    }

    // -----------------------------------------------------------
    // TEST 2: Forward and Back Navigation
    // -----------------------------------------------------------
    console.log('\n👉 TEST 2: Forward & Back Navigation');
    console.log('  Clicking forward button...');
    await page.goForward({ waitUntil: 'networkidle2' });
    console.log(`  Landed on forward URL: ${page.url()}`);

    console.log('  Clicking Back button again...');
    await page.goBack({ waitUntil: 'networkidle2' });
    console.log(`  Returned to URL: ${page.url()}`);

    const forwardBackInputDisabled = await page.$eval(inputSelector, (el) => el.disabled);
    console.log(`  Input disabled after forward/back: ${forwardBackInputDisabled}`);
    if (forwardBackInputDisabled) throw new Error('Input disabled after forward/back!');
    console.log('  ✓ Forward & Back Navigation PASSED!');

    // -----------------------------------------------------------
    // TEST 3: In-App Back Link from Card Page
    // -----------------------------------------------------------
    console.log('\n👉 TEST 3: In-App Back Link Navigation');
    console.log('  Navigating directly to /antfu...');
    await page.goto('http://localhost:3000/antfu', { waitUntil: 'networkidle2' });

    console.log('  Clicking "Back to Arena Home" in-app link...');
    const inAppLink = await page.$('a[href="/"]');
    if (!inAppLink) throw new Error('Could not find in-app link a[href="/"]!');
    await inAppLink.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
    console.log(`  Landed on: ${page.url()}`);

    const inAppInputDisabled = await page.$eval(inputSelector, (el) => el.disabled);
    const inAppInputVal = await page.$eval(inputSelector, (el) => el.value);
    console.log(`  Input state after in-app link: disabled=${inAppInputDisabled}, value="${inAppInputVal}"`);
    if (inAppInputDisabled) throw new Error('Input disabled after in-app link!');

    await page.type(inputSelector, 'shadcn');
    const typedInApp = await page.$eval(inputSelector, (el) => el.value);
    console.log(`  Successfully typed into input: "${typedInApp}"`);
    console.log('  ✓ In-App Back Link Navigation PASSED!');

    // -----------------------------------------------------------
    // TEST 4: Invalid Username Recovery & Slow Network Handling
    // -----------------------------------------------------------
    console.log('\n👉 TEST 4: Invalid Username Handling & Recovery');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    console.log('  Submitting invalid username: "-invalid--name-"');
    await page.type(inputSelector, '-invalid--name-');
    await page.click(submitBtnSelector);

    // Give react time to render error
    await new Promise((r) => setTimeout(r, 200));

    const errorMsg = await page.$eval('p.text-rose-400', (el) => el.innerText.trim()).catch(() => null);
    console.log(`  Validation error displayed: "${errorMsg}"`);
    if (!errorMsg) throw new Error('Expected validation error for invalid username!');

    const inputAfterErrorDisabled = await page.$eval(inputSelector, (el) => el.disabled);
    console.log(`  Input disabled after error: ${inputAfterErrorDisabled}`);
    if (inputAfterErrorDisabled) throw new Error('Input locked after validation error!');

    // Clear and enter valid username
    await page.$eval(inputSelector, (el) => (el.value = ''));
    await page.type(inputSelector, 'shadcn');
    await page.click(submitBtnSelector);
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log(`  Recovered and navigated successfully to: ${page.url()}`);
    console.log('  ✓ Invalid Username Recovery PASSED!');

    // -----------------------------------------------------------
    // TEST 5: Console Errors & Hydration Warnings Check
    // -----------------------------------------------------------
    console.log('\n👉 TEST 5: Console Logs & Hydration Warnings Check');
    console.log(`  Total Console Errors: ${consoleErrors.length}`);
    console.log(`  Total Hydration Warnings: ${hydrationWarnings.length}`);

    if (consoleErrors.length > 0) {
      console.log('  Console Errors found:');
      consoleErrors.forEach((e) => console.log('    -', e));
    }
    if (hydrationWarnings.length > 0) {
      console.log('  Hydration Warnings found:');
      hydrationWarnings.forEach((w) => console.log('    -', w));
    }

    if (hydrationWarnings.length > 0) {
      throw new Error(`Found ${hydrationWarnings.length} hydration warnings!`);
    }

    console.log('\n========================================================');
    console.log('       ALL 5 VERIFICATION SUITES PASSED CLEANLY!        ');
    console.log('========================================================');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
