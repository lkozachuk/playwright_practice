// import test and expect from Playwright test library
import { test, expect } from '@playwright/test';

// a test with async function declaration that check title presence on the page
test('has title', async ({ page }) => {
  //this line navigates to the Playwright website
  await page.goto('https://playwright.dev/');

  // Expect that title with name "Playwright" is present on the page
  await expect(page).toHaveTitle(/Playwright/);
});

// a test with async function declaration that check the presence of "Get started" link and after clicking on it, checks for the presence of "Installation" heading on the page
test('get started link', async ({ page }) => {
  // this line navigates to the Playwright website
  await page.goto('https://playwright.dev/');

  // this line finds a link with the name "Get started" and clicks on it
  await page.getByRole('link', { name: 'Get started' }).click();

  // this line is an assertion that expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

// ------------------------------------------------------------------------

test('list handling', async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Swag Labs/);
  const loginCredentialsContainer = page.locator("[data-test='login-credentials']");
  const fullText = await loginCredentialsContainer.innerText();
  const loginCredentials = fullText
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(1);
  console.log("Login credentials amount:", loginCredentials.length);
  expect(loginCredentials.length).toBe(6);

  const secondLoginCredential = loginCredentials[1];
  console.log("Second login credential:", secondLoginCredential);
  expect(secondLoginCredential).toBe("locked_out_user");
});

