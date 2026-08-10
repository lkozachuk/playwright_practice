import { test, expect } from "@playwright/test";

//Root cause:   [incorrect placeholder username]
//Fix:          [changed placeholder "User name" to "Username"]
//How I verified: [ran npx playwright test --headed and verified that the test passed]
test("login should redirect to inventory", async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
    await page.getByPlaceholder("Username").fill("standard_user");   // ← is this the real placeholder?
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/inventory/);
});

//Root cause:   [incorrect locator of error message]
//Fix:          [changed locator from page.getByTestId("error") to page.locator("[data-test='error']")]
//How I verified: [ran npx playwright test --headed and verified that the test passed]
test("error message on wrong password", async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("wrong_password");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator("[data-test='error']")).toHaveText(
        "Epic sadface: Username and password do not match any user in this service"   // ← is this the exact text?
    );
});

//Root cause:   [missed await in the line that adds product to the cart]
//Fix:          [added await before the click action]
//How I verified: [ran npx playwright test --headed and verified that the test passed]
test("cart badge appears after adding product", async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await page.locator("[data-test=\"add-to-cart-sauce-labs-backpack\"]").click();   // ← something missing here

    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
}); 