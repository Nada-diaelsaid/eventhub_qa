import { test, expect } from '@playwright/test';
import LoginPage from '../../src/pages/LoginPage.ts';
import { encrypt, decrypt } from '../../src/utils/cryptoJS.util.ts';

test('Login', async ({ page }) => {
  // const encryptedText = encrypt(process.env.EVENTHUB_EMAIL!);
  // console.log('Encrypted Text:', encryptedText);
  // const decryptedText = decrypt(encryptedText);
  // console.log('Decrypted Text:', decryptedText);

  // const encryptedText1 = encrypt(process.env.EVENTHUB_PASSWORD!);
  // console.log('Encrypted Text:', encryptedText1);
  // const decryptedText1 = decrypt(encryptedText1);
  // console.log('Decrypted Text:', decryptedText1);


  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  console.log('Navigated to login page', decrypt(process.env.EVENTHUB_EMAIL!), decrypt(process.env.EVENTHUB_PASSWORD!));
  await loginPage.fillEmail(decrypt(process.env.EVENTHUB_EMAIL!));
  await loginPage.fillPassword(decrypt(process.env.EVENTHUB_PASSWORD!));

  await loginPage.clickSignIn();

  await expect(page.getByRole('heading', { name: 'Discover & Book' })).toBeVisible();
});