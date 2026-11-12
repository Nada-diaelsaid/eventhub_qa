import { Page, Locator } from "@playwright/test";

export async function findValidElement(page: Page, locators: string[]): Promise<Locator | null>
{
  let validElement: Locator | null = null;
  const TIMEOUT_MS = 5000;

  for (const locator of locators) {
    try {
      const element = page.locator(locator);
      await element.waitFor({ state: "attached", timeout: TIMEOUT_MS });
      validElement = element;
    //   console.log(`Found valid element with locator: ${locator}`);
      break; // Exit loop if valid element found
    } catch (error) {
      console.error(`Invalid locator: ${locator}`);
    }
  }

  if (!validElement) {
    console.error("All locators are invalid");
  }

  return validElement;
}

export async function findValidElementInScope(root: Locator, locators: string[]): Promise<Locator | null>
{
  const TIMEOUT_MS = 5000;

  for (const locator of locators) {
    try {
      const element = root.locator(locator);
      await element.waitFor({ state: "attached", timeout: TIMEOUT_MS });
      const count = await element.count();

      if (count === 1) {
        return element;
      }

      console.error(`Locator matched ${count} elements in scope: ${locator}`);
    } catch (error) {
      console.error(`Invalid locator in scope: ${locator}`);
    }
  }

  console.error("No unique valid element found in scope");
  return null;
}