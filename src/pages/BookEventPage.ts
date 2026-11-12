import { expect, Locator, Page } from '@playwright/test';
import { BookingEventLocators } from '../locators/bookingEventLocator.ts';
import { findValidElementInScope } from '../utils/selfHealingLocators.utils.ts';

export class BookEventPage {
  constructor(private page: Page) {}

  async incrementTicketQuantity(clickCount: number): Promise<void> {
    await this._changeTicketQuantity(clickCount, BookingEventLocators.increaseTicketsButton, 1, 'increment');
  }

  async decrementTicketQuantity(clickCount: number): Promise<void> {
    await this._changeTicketQuantity(clickCount, BookingEventLocators.decreaseTicketsButton, -1, 'decrement');
  }

  async fillFullName(fullName: string): Promise<void> {
    await this._fillBookingField(BookingEventLocators.fullNameInput, fullName, 'Full Name');
  }

  async fillEmail(email: string): Promise<void> {
    await this._fillBookingField(BookingEventLocators.emailInput, email, 'Email');
  }

  async fillPhoneNumber(phoneNumber: string): Promise<void> {
    await this._fillBookingField(BookingEventLocators.phoneInput, phoneNumber, 'Phone Number');
  }

  async clickConfirmBookingButton(): Promise<void> {
    const form = await findValidElementInScope(this.page.locator('body'),   BookingEventLocators.bookingForm);
    const confirmButton = await findValidElementInScope(form!, BookingEventLocators.confirmBookingButton);
    if (!confirmButton) {
      throw new Error('Confirm Booking button not found');
    }

    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();
  }

  private async _fillBookingField(locators: string[], value: string, fieldName: string): Promise<void> {
    const form = await findValidElementInScope(this.page.locator('body'),   BookingEventLocators.bookingForm);
    const field = await findValidElementInScope(form!, locators);
    if (!field) {
      throw new Error(`${fieldName} input not found`);
    }
    await field.fill(value);
    await expect(field).toHaveValue(value);
  }

  private async _changeTicketQuantity(
    clickCount: number,
    buttonLocators: string[],
    quantityChange: 1 | -1,
    action: 'increment' | 'decrement',
  ): Promise<void> {
    if (!Number.isInteger(clickCount) || clickCount < 0) {
      throw new RangeError('Ticket increment/decrement count must be a non-negative integer');
    }
    
    const form = await findValidElementInScope(this.page.locator('body'),   BookingEventLocators.bookingForm);
    const ticketControls = await findValidElementInScope(form!, BookingEventLocators.ticketControls);
    if (!ticketControls) {
      throw new Error('Ticket quantity controls not found');
    }

    const button = await findValidElementInScope(ticketControls, buttonLocators);
    if (!button) {
      throw new Error(`${action === 'increment' ? 'Increase' : 'Decrease'} tickets button not found`);
    }
    const ticketCount = await findValidElementInScope(ticketControls, BookingEventLocators.ticketCount);
    if (!ticketCount) {
      throw new Error('Ticket quantity display not found');
    }

    for (let click = 0; click < clickCount; click++) {
      const currentCount = Number((await ticketCount.textContent())?.trim());
      if (!Number.isInteger(currentCount)) {
        throw new Error('Ticket quantity display does not contain a valid number');
      }
      if (!(await button.isEnabled())) {
        throw new Error(`Cannot ${action} ticket quantity from ${currentCount}; button is disabled`);
      }

      await button.click();
      await expect(ticketCount).toHaveText(String(currentCount + quantityChange));
    }
  }
}