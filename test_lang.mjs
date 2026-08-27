import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();

  // Test Spanish
  const contextEs = await browser.newContext();
  await contextEs.addCookies([{ name: 'lang', value: 'es', url: 'http://localhost:4321' }]);
  const pageEs = await contextEs.newPage();
  await pageEs.goto('http://localhost:4321/');
  await pageEs.waitForLoadState('networkidle');
  await pageEs.screenshot({ path: 'screenshot_es.png' });
  const textEs = await pageEs.innerText('body');
  console.log("ES includes Inicio:", textEs.includes("Inicio"));
  await contextEs.close();

  // Test English
  const contextEn = await browser.newContext();
  await contextEn.addCookies([{ name: 'lang', value: 'en', url: 'http://localhost:4321' }]);
  const pageEn = await contextEn.newPage();
  await pageEn.goto('http://localhost:4321/');
  await pageEn.waitForLoadState('networkidle');
  await pageEn.screenshot({ path: 'screenshot_en.png' });
  const textEn = await pageEn.innerText('body');
  console.log("EN includes Home:", textEn.includes("Home"));
  await contextEn.close();

  await browser.close();
  process.exit(0);
})();
