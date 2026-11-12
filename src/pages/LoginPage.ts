import { Page } from '@playwright/test';
import { LoginLocators } from '../locators/loginLocators.ts';
import HomePage from './HomePage.ts';
import { findValidElement } from '../utils/selfHealingLocators.utils.ts';

export default class LoginPage {
  private readonly emailInputLocator=LoginLocators.emailInput;
  private readonly passwordInputLocator=LoginLocators.passwordInput;
  private readonly signInButtonLocator=LoginLocators.loginButton;

  constructor(private page: Page) {
  }

  async fillEmail(email: string) {
    const validElement = await findValidElement(this.page, this.emailInputLocator);
    if (validElement) {
      await validElement.fill(email);
    }
  }

  async fillPassword(password: string) {
    const validElement = await findValidElement(this.page, this.passwordInputLocator);
    if (validElement) {
      await validElement.fill(password);
    }
  }

  async navigateToLoginPage() {
    // Navigate to the login page base url is set in playwright.config.ts
    await this.page.goto("/");
  }

  async clickSignIn() {
    await this.page.click(this.signInButtonLocator)
    .catch((error) => {
      console.error('Error clicking the Sign In button:', error);
    });

    const homePage = new HomePage(this.page);
    return homePage;
  }

}
