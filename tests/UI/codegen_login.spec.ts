import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://eventhub.rahulshettyacademy.com/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('nada_diaelsaid@yahoo.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Nada@12345');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.goto('https://eventhub.rahulshettyacademy.com/');
  await page.locator('body').press('Tab');
});