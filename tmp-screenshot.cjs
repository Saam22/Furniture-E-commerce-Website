const { chromium } = require('playwright');
const TARGET_URL = 'http://localhost:5173';
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'D:\\saad\\furnture\\screenshots\\home.png', fullPage: true });
  console.log('home done');
  await browser.close();
})();
