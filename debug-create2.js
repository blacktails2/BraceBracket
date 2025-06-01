const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Go to create page
  await page.goto('http://localhost:3000/create');
  
  // Wait for page to load
  await page.waitForTimeout(10000);
  
  // Look for layout section specifically
  const layoutText = await page.textContent('body');
  const hasLayoutText = layoutText.includes('レイアウト');
  console.log('Page contains layout text:', hasLayoutText);
  
  // Look for form elements
  const forms = await page.locator('form').count();
  console.log('Forms found:', forms);
  
  // Look for any data-testid attributes
  const testIds = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-testid]');
    return Array.from(elements).map(el => el.getAttribute('data-testid'));
  });
  console.log('All test IDs found:', testIds);
  
  // Check for errors in console
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
  });
  
  await page.waitForTimeout(3000);
  
  if (errors.length > 0) {
    console.log('JavaScript errors found:', errors);
  } else {
    console.log('No JavaScript errors found');
  }
  
  // Get the HTML around radio buttons
  const radioContext = await page.evaluate(() => {
    const radios = document.querySelectorAll('input[type="radio"]');
    return Array.from(radios).map(radio => ({
      id: radio.id,
      name: radio.name,
      value: radio.value,
      testId: radio.getAttribute('data-testid'),
      parentHTML: radio.parentElement?.outerHTML?.substring(0, 200)
    }));
  });
  
  console.log('Radio button details:', JSON.stringify(radioContext, null, 2));
  
  await browser.close();
})();