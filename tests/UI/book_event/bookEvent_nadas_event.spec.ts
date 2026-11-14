import { expect, test } from '@playwright/test';
import { EventsPage } from '../../../src/pages/EventsPage.ts';

const authFile = "src/config/.auth/user.json";

test("opens Nada's event from its Book Now button", async ({ browser }) => {
  const eventName = "Nada's event2";

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // login using auth file.
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const context = await browser.newContext({ storageState: authFile  });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole('heading', { name: 'Discover & Book' })).toBeVisible();

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Press Book Now for event "Nada's event2"
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const eventsPage = new EventsPage(page);
  // await eventsPage.navigateToEventsPage();
  await eventsPage.clickBookNowButton(eventName);


  await expect(page.getByRole('heading', { name: "Nada\'s event2", exact: true })).toBeVisible();

  const events_element = page.getByRole('main').getByRole('link', { name: 'Events', exact: true });
  await expect(events_element).toBeVisible();
  await expect(events_element).toHaveAttribute('href', '/events');

  console.log("page.url()",page.url());
});