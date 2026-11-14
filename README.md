# EventHub QA

Playwright and TypeScript automation for the EventHub website and its booking API. The project keeps test cases separate from reusable browser and API code so tests stay readable and endpoint or UI changes have a single place to update.

## US-114: Ambiguities and open questions

US-114 describes the happy path for booking an event, but leaves business rules and unexpected behavior undefined. Clarify these points before finalizing acceptance criteria and test expectations.

**Working assumption:** “Visitor” means a user who must log in before booking. Confirm whether guest booking is allowed.

| Area | Ambiguity or question to resolve |
| --- | --- |
| Event eligibility | How does a user select an event? Are there restrictions based on event status, audience, date, location, availability, or the user's account? |
| Ticket quantity | What are the minimum and maximum tickets per booking or per user? How should the system handle requests exceeding remaining availability? |
| Booking details | The booking form asks for name, email, and phone number again even though the user is assumed to be logged in. Are these fields required, should they be prefilled, and can the user change them for a booking? |
| Confirmation email | A confirmation email should be sent after a successful booking. Who receives it, what should it contain, when should it arrive, and what happens if delivery fails? |
| Cancellation and refund | Until when can a booking be cancelled? Which bookings are eligible for a refund, how much is refunded, and what should the system report if cancellation or refund processing fails? |
| Reliability and concurrency | How should simultaneous bookings for the last available tickets be handled? The story does not define overselling prevention, duplicate submissions/retries, or expected behavior during service failures. |

## Requirements

- Node.js 20 or later
- npm
- Playwright browser binaries
- Test credentials and an EventHub API token for authenticated tests

## Setup

From the repository root:

```powershell
npm install
npx playwright install
```

Playwright reads local environment variables from `src/config/.env`. You can also set them in the shell or CI environment. Add the values needed for your test run:

| Variable | Used for |
| --- | --- |
| `BASE_URL` | Website base URL. Defaults to `https://eventhub.rahulshettyacademy.com`. |
| `API_URL` | API origin, for example `https://eventhub.rahulshettyacademy.com`. Keep the `/api` path off; services add their own route prefixes. |
| `EVENTHUB_API_TOKEN` | Bearer token for API tests. Set the token itself; the API fixture adds the `Bearer` prefix. |
| `EVENTHUB_TEST_EVENT_ID` | Positive ID of an event that exists in the configured test environment. |
| `EVENTHUB_EMAIL` | AES-encrypted login email used by the UI login specs. |
| `EVENTHUB_PASSWORD` | AES-encrypted login password used by the UI login specs. |
| `SALT` | Optional encryption salt. It must match the salt used to encrypt the login values. |

The login specs decrypt the email and password with `src/utils/cryptoJS.util.ts`. Do not put plain credentials in workflow files or commit credentials, tokens, or the generated browser state file. **In the current checkout, `src/config/.env` and `src/config/.auth/user.json` are tracked, and their `.gitignore` entries are commented out.** If they contain real credentials or session data, rotate/revoke it and remove the files from version control before sharing the repository.

## Running tests

On the first run, create the saved browser login state used by the booking UI test:

```powershell
npx playwright test tests/UI/login/auth.spec.ts --project=chromium
```

Then run the suite:

```powershell
npm test
```

`npm test` runs all discovered tests in Chromium, Firefox, and WebKit. To run only Chromium:

```powershell
npx playwright test --project=chromium
```

Run API tests in Chromium:

```powershell
npm run test:api
```

Run one framework API spec or UI test:

```powershell
npx playwright test tests/APIs/post_booking_framework.spec.ts --project=chromium
npx playwright test tests/UI/book_event/bookEvent.spec.ts --project=chromium
```

Booking tests send real requests to `API_URL` or the website. The API create/get/delete scenarios create and cancel bookings; the UI booking scenario also submits a booking. Use a dedicated test environment and valid test event ID. Playwright path filters use forward slashes in these commands, including on Windows.

## Test plan and test specifications

The detailed test plan and test specifications are maintained in [Event_hub_qa.xlsx](./Event_hub_qa.xlsx). Refer to the workbook for the planned coverage and individual test cases; the automated Playwright specs are in the `tests/` directory.

## Reports

Playwright writes:

- The interactive HTML report to `playwright-report/`.
- A CTRF JSON report to `ctrf/ctrf-report.json`.

Open the most recent local HTML report with:

```powershell
npx playwright show-report
```

The GitHub Actions workflow in `.github/workflows/playwright.yml` runs Chromium, uploads the HTML report as the `playwright-report` artifact, and publishes a CTRF test summary/table in the Actions run. To view the full HTML report from a workflow run, download and extract that artifact into a `playwright-report` folder, then point `show-report` to it:

```powershell
npx playwright show-report .\playwright-report
```

## Architecture

```text
src/
  clients/       Thin wrappers around Playwright APIRequestContext
  config/        Local environment and generated browser auth state
  locators/      Centralized UI selector alternatives
  pages/         Page objects and reusable UI actions/assertions
  payloads/      Typed API request payload builders
  services/      Endpoint-specific API operations
  utils/         Shared helpers, including locator and encryption utilities
  validators/    Reusable API response assertions
fixtures/
  apiFixtures.ts Authenticated API context and BookingService injection
  uiFixtures.ts  Authenticated browser page with bookings cleared before the UI test
tests/
  APIs/          API behavior specs
  UI/            Browser behavior specs
```

### Why the layers are separated

- **API client:** owns the common HTTP transport, leaving endpoint paths out of test code.
- **Services:** express EventHub operations such as creating, retrieving, and deleting bookings.
- **Payload builders:** keep request data typed and reusable, and reject invalid event IDs before sending.
- **Fixtures:** provide an authenticated API client or a preconditioned browser page to specs, and clean up their request/browser contexts afterward. The UI fixture clears existing bookings before the booking scenario.
- **Validators:** share status/content-type assertions so tests report useful failures consistently.
- **Page objects and locators:** keep browser interactions and selector changes out of the test scenarios.
- **Tests:** describe behavior: the API specs cover booking creation, retrieval, cancellation, and invalid event IDs; the UI booking spec checks ticket totals and the My Bookings list.

## Self-healing locators

The locator helper in `src/utils/selfHealingLocators.utils.ts` provides ordered fallback selectors. Page objects pass it locator candidates from `src/locators/`; the helper tries each candidate and uses the first one that is attached to the page. Scoped lookups also require the candidate to match exactly one element, which helps avoid selecting the wrong button when a page contains repeated controls.

For example, `EventsPage` searches for a “Book Now” button within the selected event card rather than across the whole page. Booking form fields and controls use the same approach within their form or control group.

This is a fallback mechanism, not automatic selector generation: it only handles DOM changes covered by the predefined candidates. It checks attachment and, for scoped searches, uniqueness; it does not by itself guarantee that an element is visible or enabled. If no candidate is suitable, the helper returns `null`, and the calling page-object action should fail rather than silently continue. Keep candidate order intentional and prefer the most specific, stable locator first.

## Continuous integration

The `.github/workflows/playwright.yml` workflow:

- Runs on pushes and pull requests targeting `main` or `master`.
- Uses an Ubuntu runner, sets up the latest LTS version of Node.js, and installs npm dependencies and Playwright browsers.
- Sensitive test values such as credentials and API tokens are configured as GitHub Actions secrets. Map them to environment variables for the test process, and keep them out of the workflow source and repository.
- Runs the Playwright suite on Chromium.
- Uploads the interactive HTML report as the `playwright-report` artifact, retained for 30 days.
- Publishes the CTRF summary and test table to the Actions run, including failed runs when Playwright generated the CTRF report.

## If I had more time

- Set up the Playwright MCP server to support browser exploration and test development.
- Implement the full set of test specifications documented in [Event_hub_qa.xlsx](./Event_hub_qa.xlsx).
- Spend more time testing the APIs, including their edge cases and failure behavior.
