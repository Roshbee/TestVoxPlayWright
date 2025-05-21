import { test, expect } from '@playwright/test';

test('Form submission at DemoQA', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');

  await page.fill('#userName', 'Virat Kholi');
  await page.fill('#userEmail', 'Virat@example.com');
  await page.fill('#currentAddress', 'Pune');
  await page.fill('#permanentAddress', 'Nagpur');

  await page.click('#submit');

  await expect(page.locator('#output #name')).toContainText('Virat Kholi');
  await expect(page.locator('#output #email')).toContainText('Virat@example.com');
});
