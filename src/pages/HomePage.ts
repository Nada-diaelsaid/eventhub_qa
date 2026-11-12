import { Page, Locator, expect } from '@playwright/test';

export default class HomePage {
    private readonly homeTitleLocator = "Service";

    constructor(private page: Page) {
    }
}