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

## Project structure
 - `pages/` — Page Object classes (BasePage, CartPage, CheckoutPage, HomePage, LoginPage, PaymentPage, ProductsListPage, ProductDetailsPage, ContactUsPage, DeleteAccountPage, SignUpPage, AccountCreatedPage, TestCasesListPage)
 - `components/` — reusable UI components (AddedToCartModal, CheckoutRegisterLoginModal)
 - `tests/ui/` — UI-only test specs
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

## CI/CD
- **On PR to `main`:** smoke tests (`@smoke`) run on Chromium only, for fast feedback before merge
- **Nightly (weekdays, 05:00 Kyiv time) and manual trigger:** full regression suite runs across Chromium, Firefox, and WebKit
- Workflow file: `.github/workflows/playwright.yml`
- HTML reports are uploaded as build artifacts (30-day retention)

## Browser coverage
Chromium, Firefox, WebKit

## Notes
- No hard waits (`waitForTimeout`) are used
- Tests use semantic locators (`getByRole`, `getByTestId`, `getByPlaceholder`)
- Test data is stored separately from test logic

## Known limitations
- It does not cover all possible edge cases beyond the official test case list