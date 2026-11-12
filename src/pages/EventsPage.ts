import { Page } from '@playwright/test';
import { EventLocators } from '../locators/eventLocators.ts';
import { findValidElementInScope } from '../utils/selfHealingLocators.utils.ts';

export class EventsPage {
  constructor(private page: Page) {}

  async navigateToEventsPage() {
    await this.page.goto('/events');
  }

  async _getEventCard(eventName: string) {
    const eventCard = this.page.locator(EventLocators.eventCard).filter({has: this.page.getByRole('heading', { name: eventName, exact: true }),
    });
    console.log("eventCard", eventCard);
    // await expect(eventCard).toHaveCount(1);

    return eventCard;
  }

  async clickBookNowButton(eventName: string) {
    const eventCard = await this._getEventCard(eventName);
    const bookNowButton = await findValidElementInScope(eventCard, EventLocators.bookNowButton);
    console.log("bookNowButton", bookNowButton);
    
    if (!bookNowButton) {
        throw new Error(`Book Now button not found for "${eventName}"`);
    }
    await bookNowButton.click();
  }
}
