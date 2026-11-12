import { Page, Locator, expect } from '@playwright/test';
import HomePage from './HomePage.ts';

export default class LoginPage {
  private readonly emailInputLocator="#email";
  private readonly passwordInputLocator='#password';
  private readonly signInButtonLocator='#login-btn';

  constructor(private page: Page) {
  }

  async fillEmail(email: string) {
    await this.page.locator(this.emailInputLocator).fill(email);
  }

  async fillPassword(password: string) {
    await this.page.locator(this.passwordInputLocator).fill(password);
  }

  async navigateToLoginPage() {
    // Navigate to the login page base url is set in playwright.config.ts
    await this.page.goto("/");
  }

  async clickSignIn() {
    await this.page.locator(this.signInButtonLocator).click()
    .catch((error) => {
      console.error('Error clicking the Sign In button:', error);
    });

    const homePage = new HomePage(this.page);
    return homePage;
  }

}
