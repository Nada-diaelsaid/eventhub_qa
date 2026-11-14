# EventHub QA Framework Overview

This project is a browser-testing framework for [EventHub — Discover & Book Events](https://eventhub.rahulshettyacademy.com/). It uses **Playwright Test** with **TypeScript** to automate browser interactions and verify application behavior.

> **Current status:** UI and API tests live under `tests/`. The API framework currently includes an authenticated client, a booking service, a booking payload factory, shared response assertions, and API fixtures.

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
| Base URL | `BASE_URL` from `.env`, defaulting to the EventHub website |
| npm scripts | `npm test` and `npm run test:api` |

The settings above are defined in `playwright.config.ts`. Browser binaries may need to be installed once on a new machine.

## Project layout

```text
eventhub_qa/
├── framework_overview.md
├── package.json
├── playwright.config.ts
├── src/
│   ├── clients/      # APIRequestContext wrapper
│   ├── config/       # Existing local environment configuration
│   ├── data/         # Intended test data
│   ├── logging/      # Intended logging utilities
│   ├── pages/        # Intended page objects and UI locators
│   ├── payloads/     # API request payload builders
│   ├── reporting/    # Intended reporting helpers
│   ├── services/     # Endpoint-specific API services and UI workflows
│   ├── utils/        # Intended general-purpose helpers
│   └── validators/   # Shared API response assertions
├── fixtures/         # Dependency injection for API tests
└── tests/
    ├── APIs/
    └── UI/
```

API tests use `fixtures/apiFixtures.ts` to create an authenticated API context and inject `BookingService`. Endpoint code lives in `src/services/`, request data builders in `src/payloads/`, and response and Ajv JSON Schema assertions in `src/validators/`. Keep test scenarios in `tests/` and move shared API workflows into these modules.

## Quick walkthrough

### 1. Install dependencies and browsers

From the project directory, run:

```powershell
npm install
npx playwright install
```

### 2. Add an EventHub test

Create a browser spec such as `tests/eventhub-home.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('opens the EventHub website', async ({ page }) => {
  await page.goto('https://eventhub.rahulshettyacademy.com/');

  await expect(page).toHaveURL(/eventhub\.rahulshettyacademy\.com/);
});
```

This is a minimal smoke test: it checks that navigation reaches the target domain. Add assertions for visible page content after confirming the website's current UI and expected behavior.

### EventHub API tests

Set `API_URL`, `EVENTHUB_API_TOKEN`, and `EVENTHUB_TEST_EVENT_ID` in `src/config/.env`, which is loaded by the Playwright configuration. Keep real credentials and tokens out of source control.

The framework tests are in `tests/APIs/post_booking_framework.spec.ts`. The retrieval test creates a booking, reads its top-level `id` from the POST response, then verifies `GET /api/bookings/{id}` returns that booking. These tests create real bookings, so use an event available in the target test environment.

Run the API spec against Chromium:

```powershell
npx playwright test tests/APIs/post_booking_framework.spec.ts --project=chromium --grep "retrieves a booking"
```

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

- Add endpoint-specific schemas under `src/validators/` once the API response contracts are confirmed.
- Add endpoint services and payload factories as more API workflows are automated.
- Put stable, non-sensitive test inputs in `src/data/`; keep credentials out of source control and use environment variables or a suitable local secret store.

## Existing exploratory notes

`notes.txt` currently records observations that may be useful when designing booking tests: a ticket limit of 10 regardless of displayed availability, and name/email fields requested despite a logged-in user. Treat these as items to verify against the live application before turning them into expected behavior.