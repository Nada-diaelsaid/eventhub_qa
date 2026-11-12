import { expect, test } from '@playwright/test';
import { EventsPage } from '../src/pages/EventsPage.ts';
import { BookEventPage } from '../src/pages/BookEventPage.ts';

const authFile = "src/config/.auth/user.json";

test("opens Nada's event from its Book Now button", async ({ browser }) => {
  const eventName = "World Tech Summit";

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // login using auth file.
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const context = await browser.newContext({ storageState: authFile });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole('heading', { name: 'Discover & Book' })).toBeVisible();

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Press Book Now for event "World Tech Summit"
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const eventsPage = new EventsPage(page);
  // await eventsPage.navigateToEventsPage();
  await eventsPage.clickBookNowButton(eventName);
  
  await expect(page.getByRole('heading', { name: eventName, exact: true })).toBeVisible();

  const events_element = page.getByRole('main').getByRole('link', { name: 'Events', exact: true });
  await expect(events_element).toBeVisible();
  await expect(events_element).toHaveAttribute('href', '/events');

  console.log("page.url()", page.url());
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Continue to Confirm booking page.
  ///////////////////////////////////////////////////////////////////////////////////////////////

  // Increase ticket quantity with the max which is 8
  const bookEventPage = new BookEventPage(page);
  await bookEventPage.incrementTicketQuantity(7); // Click 7 times to make the total ticket count 8
  await expect(page.locator('#ticket-count')).toHaveText('8');
  console.log("Ticket count:", await page.locator('#ticket-count').textContent());

  await bookEventPage.decrementTicketQuantity(2);
  await expect(page.locator('#ticket-count')).toHaveText('6');

  await bookEventPage.fillFullName('Playwright Test User');
  await bookEventPage.fillEmail('qa.bookevent@example.com');
  await bookEventPage.fillPhoneNumber('+91 98765 43210');
  await expect(page.locator('#confirm-booking')).toBeEnabled();
  
  await bookEventPage.clickConfirmBookingButton();
  await expect(page.getByRole('heading', { name: 'Booking Confirmed! 🎉' })).toBeVisible();

  console.log("page.url() after click confirm booking", page.url());

});