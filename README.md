# Final Project — Playwright Test Suite

## Test target
AutomationExercise (https://automationexercise.com)

## Covered user journey
Product discovery → cart → checkout

## Test cases
- User can search a product by name
- User can open product details page and check product information
- User can add two products to cart and verify the cart total/price/quantity
- User can remove a product from cart
- User can submit contact form with file upload


## Project structure
- `pages/` — Page Object classes (CartPage, ContactUsPage, HomePage, LoginPage, ProductDetailsPage, ProductsPage)
- `tests/` — test specs (*.spec.ts)
- `test-data/` — credentials and test inputs
- `playwright.config.ts` — configuration

## How to run
```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

## Notes
- No hard waits (`waitForTimeout`) are used
- Tests use semantic locators (`getByRole`, `getByTestId`, `getByPlaceholder`)
- Test data is stored separately from test logic

## Known limitations
- This suite covers only the selected user journey
- It does not cover all possible edge cases