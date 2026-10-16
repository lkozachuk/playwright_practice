# Test Strategy

## Scope
This framework automates the 26 official AutomationExercise test cases plus
additional negative scenarios, covering UI, API, and combined API+UI flows
against https://automationexercise.com.

## Test pyramid for this project
- **UI tests** (`tests/ui/`) — user-facing flows: account management, cart,
  checkout, product browsing, contact form.
- **API tests** (`tests/api/`) — account CRUD operations tested directly
  against the backend, independent of the UI.
- **E2E tests** (`tests/e2e/`) — combined flows where API calls set up state
  (e.g. account creation) and UI verifies the resulting behavior, or vice versa.

## Risk-based prioritization
Negative scenarios are prioritized by real-world impact:
- **High**: payment validation, duplicate account creation — anything touching
  money or data integrity.
- **Medium**: form validation UX (empty fields, invalid formats).

See [Additional negative scenarios](README.md#additional-negative-scenarios)
for the implemented list.

## Tools
- **Playwright + TypeScript** — UI and API test execution
- **zod** — runtime response schema validation
- **ESLint + Prettier** — code quality and formatting
- **GitHub Actions** — CI/CD (see [CI/CD](README.md#cicd))

## Environments
All tests run against the live production site (automationexercise.com) —
there is no staging/sandbox environment for this public demo site.

## Known limitations
See [Known limitations](README.md#known-limitations) in the main README.

## Design decisions
See [Design decisions](README.md#design-decisions) in the main README for
rationale behind specific architectural choices (no `storageState`,
factory-based test data, automatic API cleanup).