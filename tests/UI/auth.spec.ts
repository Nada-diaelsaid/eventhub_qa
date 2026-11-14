import { test as setup, expect } from '@playwright/test';
import LoginPage from '../../src/pages/LoginPage.ts';
import { encrypt, decrypt } from '../../src/utils/cryptoJS.util.ts';

const authFile = 'src/config/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  console.log('Navigated to login page', decrypt(process.env.EVENTHUB_EMAIL!), decrypt(process.env.EVENTHUB_PASSWORD!));
  await loginPage.fillEmail(decrypt(process.env.EVENTHUB_EMAIL!));
  await loginPage.fillPassword(decrypt(process.env.EVENTHUB_PASSWORD!));

  await loginPage.clickSignIn();

  await expect(page.getByRole('heading', { name: 'Discover & Book' })).toBeVisible();

  // Save cookies and localStorage to the JSON file
  await page.context().storageState({ path: authFile });
});