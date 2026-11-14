import { type Dialog, type Page } from '@playwright/test';
import { HomePageLocators } from '../locators/homePageLocators';

export class HomePage {
    constructor(private page: Page) {
    }

    async clickMyBookings(): Promise<void> {
        await this.page.locator(HomePageLocators.myBookingsButton[0]).click();
    }

    async clearAllBookings(): Promise<void> {
        const clearButton = this.page.getByRole('button', { name: 'Clear all bookings' });
        const acceptDialog = (dialog: Dialog) => dialog.accept();

        await clearButton.waitFor({ state: 'visible' });
        this.page.on('dialog', acceptDialog);
        try {
            await clearButton.click();
        } finally {
            this.page.off('dialog', acceptDialog);
        }
    }
}