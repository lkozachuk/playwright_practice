# Playwright TypeScript Automation Framework

A greenfield UI/API automation framework demonstrating scalable test architecture, 
reusable page/component abstractions, API integration, test-data management, 
cross-browser execution, CI/CD, and reporting.

## Test target
[AutomationExercise](https://automationexercise.com)

## Tech stack
- Playwright (TypeScript)
- Node.js 24.x (Active LTS)

## Covered user journeys
All 26 official [AutomationExercise test cases](https://automationexercise.com/test_cases)
are automated, organized below by journey.

### Account management
- [Test Case 1: Register User](https://automationexercise.com/test_cases#collapse1)
- [Test Case 2: Login User with correct email and password](https://automationexercise.com/test_cases#collapse2)
- [Test Case 3: Login User with incorrect email and password](https://automationexercise.com/test_cases#collapse3)
- [Test Case 4: Logout User](https://automationexercise.com/test_cases#collapse4)
- [Test Case 5: Register User with existing email](https://automationexercise.com/test_cases#collapse5)

### Product browsing & search
- [Test Case 8: Verify All Products and product detail page](https://automationexercise.com/test_cases#collapse8)
- [Test Case 9: Search Product](https://automationexercise.com/test_cases#collapse9)
- [Test Case 18: View Category Products](https://automationexercise.com/test_cases#collapse18)
- [Test Case 19: View & Cart Brand Products](https://automationexercise.com/test_cases#collapse19)
- [Test Case 20: Search Products and Verify Cart After Login](https://automationexercise.com/test_cases#collapse20)
- [Test Case 21: Add review on product](https://automationexercise.com/test_cases#collapse21)
- [Test Case 22: Add to cart from Recommended items](https://automationexercise.com/test_cases#collapse22)

### Cart
- [Test Case 11: Verify Subscription in Cart page](https://automationexercise.com/test_cases#collapse11)
- [Test Case 12: Add Products in Cart](https://automationexercise.com/test_cases#collapse12)
- [Test Case 13: Verify Product quantity in Cart](https://automationexercise.com/test_cases#collapse13)
- [Test Case 17: Remove Products From Cart](https://automationexercise.com/test_cases#collapse17)

### Checkout & orders
- [Test Case 14: Place Order: Register while Checkout](https://automationexercise.com/test_cases#collapse14)
- [Test Case 15: Place Order: Register before Checkout](https://automationexercise.com/test_cases#collapse15)
- [Test Case 16: Place Order: Login before Checkout](https://automationexercise.com/test_cases#collapse16)
- [Test Case 23: Verify address details in checkout page](https://automationexercise.com/test_cases#collapse23)
- [Test Case 24: Download Invoice after purchase order](https://automationexercise.com/test_cases#collapse24)

### Site-wide UI behavior
- [Test Case 10: Verify Subscription in home page](https://automationexercise.com/test_cases#collapse10)
- [Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality](https://automationexercise.com/test_cases#collapse25)
- [Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down functionality](https://automationexercise.com/test_cases#collapse26)

### Contact & static pages
- [Test Case 6: Contact Us Form](https://automationexercise.com/test_cases#collapse6)
- [Test Case 7: Verify Test Cases Page](https://automationexercise.com/test_cases#collapse7)

## Additional negative scenarios
Beyond the 26 official test cases, the following negative scenarios were added
to strengthen coverage around form validation and error handling. These are not
part of the official AutomationExercise test case list, so they have no
corresponding test case number.

## API test coverage
[#api-test-coverage](#api-test-coverage)

Beyond UI automation, this framework includes dedicated API-level test coverage
for account management, using a typed `AccountApiClient`:

| Operation | API endpoint | Test location |
|---|---|---|
| Create account | `POST /api/createAccount` | `tests/api/account-api.spec.ts` |
| Verify login (valid/invalid) | `POST /api/verifyLogin` | `tests/api/account-api.spec.ts` |
| Update account | `PUT /api/updateAccount` | `tests/api/account-api.spec.ts` |
| Get user detail by email | `GET /api/getUserDetailByEmail` | `tests/api/account-api.spec.ts` |
| Delete account | `DELETE /api/deleteAccount` | used for automatic test cleanup |

Response shapes are validated at runtime using [zod](https://zod.dev) schemas
(`schemas/accountSchemas.ts`), catching any mismatch between the documented API
contract and the actual response — not just checking individual fields ad hoc.

An API → UI test (`tests/e2e/update-account-api-to-ui.spec.ts`) verifies that a
change made via the API (updating an account's name) is correctly reflected
when viewing the same account through the UI, confirming the two layers stay
in sync.

### Account management
- User can't log in with empty email and password
- User can't sign up with invalid email format

### Product browsing & search
- Searching for a nonexistent product shows no results

### Checkout & orders
- User cannot submit payment with empty required fields

### Contact & static pages
- Contact Us form cannot be submitted with empty required fields

## Project structure
 - `pages/` — Page Object classes (BasePage, CartPage, CheckoutPage, HomePage, LoginPage, PaymentPage, ProductsListPage, ProductDetailsPage, ContactUsPage, DeleteAccountPage, SignUpPage, AccountCreatedPage, TestCasesListPage)
 - `components/` — reusable UI components (AddedToCartModal, CheckoutRegisterLoginModal)
 - `fixtures/` — custom Playwright fixtures; injects page objects, components, and API clients into tests, removing manual instantiation
 - `api/` — API client classes for direct backend requests (e.g. AccountApiClient)
 - `models/` — typed interfaces describing API request/response shapes (e.g. Account.ts)
 - `factories/` — functions that build complete, valid test data objects with sensible defaults (e.g. accountFactory.ts)
 - `schemas/` — zod schemas for runtime validation of API responses against expected shape
 - `tests/ui/` — UI-only test specs
 - `tests/api/` — API-only test specs (no browser involved)
 - `tests/e2e/` — combined API + UI test specs
 - `test-data/` — credentials and test inputs
 - `utils/` — helper functions (e.g. random email generator)
 - `playwright.config.ts` — configuration
 - `.github/workflows/` — CI pipeline definitions

 ## Test tagging
- `@smoke` — critical-path tests, run on every PR (Chromium only)
- `@regression` — full suite, run nightly and on manual trigger (Chromium, Firefox, WebKit)

## How to run
```bash
npm install
npx playwright install
```

Common scripts:
```bash
npm test                  # run all tests
npm run test:smoke        # smoke tests only
npm run test:regression   # regression tests only
npm run test:chromium     # run on Chromium only
npm run test:firefox      # run on Firefox only
npm run test:webkit       # run on WebKit only
npm run test:ui           # run tests/ui only
npm run test:e2e          # run tests/e2e only
npm run test:headed       # run in headed mode
npm run test:ui-mode      # interactive UI mode
npm run test:debug        # debug mode
npm run report            # open last HTML report
```

## Playwright MCP (optional, local dev tooling)
This project includes a `.vscode/mcp.json` config for the Playwright MCP server, enabling AI assistants (e.g. GitHub Copilot Chat) to drive a real browser via natural-language instructions — useful for exploratory testing and locator discovery.

- Config: `.vscode/mcp.json`
- Runtime artifacts (`.playwright-mcp/`) are git-ignored
- Not part of the automated test suite or CI pipeline

## CI/CD
- **On PR to `main`:** typecheck and lint run first, then smoke tests (`@smoke`) run on Chromium only — chosen for fast feedback before merge; full cross-browser coverage runs nightly instead.
- **Nightly (weekdays, 05:00 Kyiv time) and manual trigger:** typecheck and lint run once in a dedicated `validate` job; once that passes, the full regression suite runs across Chromium, Firefox, and WebKit in parallel.
- **Failure diagnostics:** failed runs write a summary directly to the GitHub Actions job summary, and the Playwright HTML report (including screenshots, videos, and traces) is uploaded as a build artifact per browser (30-day retention).
- Workflow file: `.github/workflows/playwright.yml`
- HTML reports are uploaded as build artifacts (30-day retention)
- **Note:** direct pushes to `main` do not trigger any job — all changes are expected to go through a PR, which is already gated by the `smoke` job above.

## Browser coverage
Chromium, Firefox, WebKit

## Notes
- No hard waits (`waitForTimeout`) are used
- Tests use semantic locators (`getByRole`, `getByTestId`, `getByPlaceholder`)
- Test data is stored separately from test logic

## Design decisions
- **No `storageState` / pre-authenticated sessions.** Playwright supports reusing a logged-in session via `storageState` to skip repeating login steps across tests. This framework intentionally does not use it: most covered test cases are full user journeys (registration, login, search, cart, checkout) where the login step itself is part of what's being verified, not incidental setup. Bypassing it with a stored session would mean these flows no longer reflect real user behavior end-to-end. This is a deliberate tradeoff — tests run slower and create more accounts via the API than a session-reuse approach would — but each test more accurately simulates what a real user experiences. If future test cases need to verify behavior unrelated to login itself (e.g. account settings, order history), `storageState` may be reconsidered for that specific subset — but the current suite's journeys are chosen specifically because login is part of the scenario.

- **Test data built via factories, not hardcoded inline.** Account data (`factories/accountFactory.ts`) is generated with sensible defaults and a fresh random email per call, with only the fields relevant to a specific test overridden. This avoids duplicating ~15 fields across every test file and keeps each test's actual intent readable at a glance.

- **Automatic API cleanup.** Tests that create an account via the API register it with a `testAccount` fixture (`fixtures/api.fixture.ts`), which deletes the account during teardown — even if the test fails partway through. This keeps the suite from accumulating orphaned accounts on the live site over repeated runs.


## Known limitations
- It does not cover all possible edge cases beyond the official test case list