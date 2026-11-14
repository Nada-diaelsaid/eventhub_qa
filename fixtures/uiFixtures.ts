import { expect, test as base, type Page } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';

const authFile = 'src/config/.auth/user.json';

type UiFixtures = {
  bookingsClearedPage: Page;
};

export const test = base.extend<UiFixtures>({
  bookingsClearedPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: authFile });
    try {
      const page = await context.newPage();
      await page.goto('/');
      await expect(page.getByRole('heading', { name: 'Discover & Book' })).toBeVisible();

      const homePage = new HomePage(page);
      await homePage.clickMyBookings();
      await homePage.clearAllBookings();

      await page.goto('/');
      await expect(page.getByRole('heading', { name: 'Discover & Book' })).toBeVisible();
      await use(page);
    } finally {
      await context.close();
    }
  },
});

export { expect };
