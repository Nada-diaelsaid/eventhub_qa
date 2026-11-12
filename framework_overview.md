# EventHub QA Framework Overview

This project is a browser-testing framework for [EventHub — Discover & Book Events](https://eventhub.rahulshettyacademy.com/). It uses **Playwright Test** with **TypeScript** to automate browser interactions and verify application behavior.

> **Current status:** The Playwright configuration is in place, but the framework is still a starter. The only test currently in `tests/example.spec.ts` checks Playwright's own documentation site; it does not test EventHub yet. The directories under `src/` are present, but no implementation files are currently in them.

## Framework at a glance

| Area | Current setup |
|---|---|
| Test runner | `@playwright/test` |
| Language | TypeScript |
| Test directory | `tests/` |
| Browsers | Chromium, Firefox, and WebKit desktop projects |
| Parallelism | Tests run fully in parallel by default |
| CI behavior | Two retries and one worker when the `CI` environment variable is set |
| Reporter | Playwright HTML reporter |
| Trace | Collected on the first retry |
| Base URL | Not configured yet; tests can use the full EventHub URL or configure `baseURL` |
| npm scripts | None defined yet; run Playwright through `npx` |

The settings above are defined in `playwright.config.ts`. Browser binaries may need to be installed once on a new machine.

## Project layout

```text
eventhub_qa/
├── framework_overview.md
├── package.json
├── playwright.config.ts
├── src/
│   ├── api/          # Intended API helpers
│   ├── config/       # Intended shared framework configuration
│   ├── data/         # Intended test data
│   ├── logging/      # Intended logging utilities
│   ├── pages/        # Intended page objects and UI locators
│   ├── reporting/    # Intended reporting helpers
│   ├── services/     # Intended reusable application workflows
│   └── utils/        # Intended general-purpose helpers
└── tests/
    └── example.spec.ts
```

The `src/` entries describe the current directory names and their likely responsibilities; they are not implemented modules yet. As the suite grows, keep test scenarios in `tests/` and move reusable page interactions, data, and helpers into the relevant `src/` areas.

## Quick walkthrough

### 1. Install dependencies and browsers

From the project directory, run:

```powershell
npm install
npx playwright install
```

### 2. Add an EventHub test

Create a spec such as `tests/eventhub-home.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('opens the EventHub website', async ({ page }) => {
  await page.goto('https://eventhub.rahulshettyacademy.com/');

  await expect(page).toHaveURL(/eventhub\.rahulshettyacademy\.com/);
});
```

This is a minimal smoke test: it checks that navigation reaches the target domain. Add assertions for visible page content after confirming the website's current UI and expected behavior.

### 3. Run tests

Run all tests across the configured browser projects:

```powershell
npx playwright test
```

Run only the EventHub spec:

```powershell
npx playwright test tests/eventhub-home.spec.ts
```

Run a single browser project:

```powershell
npx playwright test --project=chromium
```

### 4. Review the report

The configured HTML reporter creates a report when tests run. Open the most recent report with:

```powershell
npx playwright show-report
```

For a failed test, Playwright's trace is configured to be collected on the first retry in CI. Traces can be inspected with `npx playwright show-trace <trace-file>`.

## Useful next steps

- Replace or supplement the starter tests in `tests/example.spec.ts` with EventHub scenarios.
- Set a shared `baseURL` in `playwright.config.ts` if using relative paths in tests.
- Add page objects and shared workflows under `src/pages/` and `src/services/` when multiple tests need them.
- Put stable, non-sensitive test inputs in `src/data/`; keep credentials out of source control and use environment variables or a suitable local secret store.
- Add npm scripts (for example, `test` and `test:chromium`) if convenient for the team.

## Existing exploratory notes

`notes.txt` currently records observations that may be useful when designing booking tests: a ticket limit of 10 regardless of displayed availability, and name/email fields requested despite a logged-in user. Treat these as items to verify against the live application before turning them into expected behavior.