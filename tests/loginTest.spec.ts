import { test, expect } from '@playwright/test';
import LoginPage from '../src/pages/LoginPage.ts';

test('Login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  console.log('Navigated to login page', process.env.EVENTHUB_EMAIL, process.env.EVENTHUB_PASSWORD);
  await loginPage.fillEmail(process.env.EVENTHUB_EMAIL!);
  await loginPage.fillPassword(process.env.EVENTHUB_PASSWORD!);

  await loginPage.clickSignIn();

  await expect(page.getByRole('heading', { name: 'Discover & Book' })).toBeVisible();
});