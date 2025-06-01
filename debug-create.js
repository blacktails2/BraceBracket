const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Go to create page
  await page.goto('http://localhost:3000/create');
  
  // Wait for page to load
  await page.waitForTimeout(5000);
  
  // Check if the page content is rendering
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check if we can find any radio buttons
  const radioButtons = await page.locator('input[type="radio"]').count();
  console.log('Number of radio buttons found:', radioButtons);
  
  // Check for test IDs
  const radioSingle = await page.locator('[data-testid="radio-single"]').count();
  console.log('radio-single elements found:', radioSingle);
  
  // Get page HTML to see what's actually rendered
  const content = await page.content();
  console.log('Page content length:', content.length);
  
  // Look for DesignRadioButton components
  const designRadio = await page.locator('.label').count();  // From DesignRadioButton styles
  console.log('Design radio elements found:', designRadio);
  
  // Check for any errors in console
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  // Wait a bit more
  await page.waitForTimeout(5000);
  
  await browser.close();
})();