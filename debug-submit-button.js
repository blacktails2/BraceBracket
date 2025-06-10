const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Go to create page
  await page.goto('http://localhost:3000/create');
  
  // Wait for page to load
  await page.waitForTimeout(5000);
  
  // Check for submit button
  const submitButtons = await page.locator('button[type="submit"]').count();
  console.log('Submit buttons found:', submitButtons);
  
  // Check for data-testid on submit button
  const testIdButtons = await page.locator('[data-testid="create-submit-button"]').count();
  console.log('create-submit-button found:', testIdButtons);
  
  // Get all buttons with their properties
  const buttonDetails = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    return Array.from(buttons).map(button => ({
      type: button.type,
      textContent: button.textContent?.trim(),
      testId: button.getAttribute('data-testid'),
      className: button.className,
      outerHTML: button.outerHTML.substring(0, 200)
    }));
  });
  
  console.log('All button details:', JSON.stringify(buttonDetails, null, 2));
  
  // Try clicking the layout first to see if that helps
  console.log('Clicking layout...');
  await page.locator('label[for="single"]').click();
  await page.waitForTimeout(2000);
  
  // Check again after layout selection
  const testIdButtonsAfter = await page.locator('[data-testid="create-submit-button"]').count();
  console.log('create-submit-button found after layout selection:', testIdButtonsAfter);
  
  // Try to find submit button by text
  const submitByText = await page.locator('button:has-text("スコアボードを作成")').count();
  console.log('Submit button found by text:', submitByText);
  
  // Get all test IDs on the page
  const allTestIds = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-testid]');
    return Array.from(elements).map(el => el.getAttribute('data-testid'));
  });
  console.log('All test IDs found:', allTestIds);
  
  await browser.close();
})();