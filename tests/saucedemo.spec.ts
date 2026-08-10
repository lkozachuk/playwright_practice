import { test, expect } from '@playwright/test';

test.describe('SauceDemo', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the login page
        await page.goto('/');
        await expect(page, 'Login page should have title Swag Labs').toHaveTitle(/Swag Labs/);
    });

    async function loginWithCredentials(page: any, username: string, password: string) {
        // Fill in the login form with provided credentials
        await page.fill('[data-test="username"]', username);
        await page.fill('[data-test="password"]', password);

        // Click the login button
        await page.click('[data-test="login-button"]');
    }

    test('user can log in with valid credentials', async ({ page }) => {
        // Fill in the login form with valid credentials
        loginWithCredentials(page, 'standard_user', 'secret_sauce');

        // Assert that the user is redirected to the inventory page
        await expect(page, 'User should be redirected to inventory page').toHaveURL(/inventory/);

        // Assert that the inventory items are visible on the page
        const inventoryItems = page.locator('[data-test="inventory-item"]');
        const inventoryItemsCount = await inventoryItems.count();
        console.log("Inventory items count:", inventoryItemsCount);
        await expect(inventoryItems, 'Amount of inventory items should be 6 items').toHaveCount(6);
    });

    test('user cannot log in with invalid credentials', async ({ page }) => {
        const errorMsgText = "Epic sadface: Username and password do not match any user in this service";

        // Fill in the login form with invalid credentials
        await page.fill('[data-test="username"]', 'standard_user');
        await page.fill('[data-test="password"]', 'wrong_password');
        await page.click('[data-test="login-button"]');

        await expect(page, 'Login page should have title Swag Labs').toHaveTitle(/Swag Labs/);
        // Assert that the error message is displayed
        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage, 'Error message should be visible on the page').toBeVisible();
        const errorMessageText = await errorMessage.textContent();
        console.log("Error message:", errorMessageText);
        await expect(errorMessage, 'Error message should match expected "Epic sadface: Username and password do not match any user in this service"').toHaveText(errorMsgText);
    });

    test('logged in user can add product to cart', async ({ page }) => {

        // Fill in the login form with valid credentials
        loginWithCredentials(page, 'standard_user', 'secret_sauce');

        // Assert that the user is redirected to the inventory page
        await expect(page, 'User should be redirected to inventory page').toHaveURL(/inventory/);
        const inventoryItems = page.locator('[data-test="inventory-item"]');
        const inventoryItemsCount = await inventoryItems.count();
        console.log("Inventory items count:", inventoryItemsCount);

        const randomIndex = Math.floor(Math.random() * inventoryItemsCount);
        const randomProduct = inventoryItems.nth(randomIndex);
        if (randomIndex > 3) {
            // scroll down to the product if it's not visible
            await randomProduct.scrollIntoViewIfNeeded();
        }
        const productName = await randomProduct.locator('[data-test="inventory-item-name"]').textContent();
        console.log("Adding item to cart:", productName);
        await randomProduct.getByRole('button', { name: 'Add to cart' }).click();

        const removeButton = randomProduct.getByRole('button', { name: 'Remove' });
        await expect(removeButton, "Remove button should be visible").toBeVisible();
        await expect(removeButton, "Remove button should have name 'Remove'").toHaveText('Remove');

        // Assert that the cart badge shows the correct number of items
        const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        await expect(cartBadge, "Cart badge should be visible").toBeVisible();
        await expect(cartBadge, "Cart badge should show 1 item").toHaveText('1');

        // Navigate to the cart page
        await page.click('[data-test="shopping-cart-link"]');
        await expect(page, "User should be redirected to cart page").toHaveURL(/cart/);

        // Assert that the correct item is in the cart
        const cartItemName = await page.locator('[data-test="inventory-item-name"]').textContent();
        console.log("Item in cart:", cartItemName);
        await expect(cartItemName, "Item name in cart should match the added item name").toBe(productName);
    });

    test('logged in user can remove product from cart', async ({ page }) => {

        // Fill in the login form with valid credentials
        loginWithCredentials(page, 'standard_user', 'secret_sauce');

        // Assert that the user is redirected to the inventory page
        await expect(page, "User should be redirected to inventory page").toHaveURL(/inventory/);
        const inventoryItems = page.locator('[data-test="inventory-item"]');
        const inventoryItemsCount = await inventoryItems.count();
        console.log("Inventory items count:", inventoryItemsCount);

        const randomIndex = Math.floor(Math.random() * inventoryItemsCount);
        const randomProduct = inventoryItems.nth(randomIndex);
        if (randomIndex > 3) {
            // scroll down to the product if it's not visible
            await randomProduct.scrollIntoViewIfNeeded();
        }
        const productName = await randomProduct.locator('[data-test="inventory-item-name"]').textContent();
        console.log("Adding item to cart:", productName);
        await randomProduct.getByRole('button', { name: 'Add to cart' }).click();

        const removeButton = randomProduct.getByRole('button', { name: 'Remove' });
        await expect(removeButton, "Remove button should be visible").toBeVisible();
        await expect(removeButton, "Remove button should have name 'Remove'").toHaveText('Remove');

        // Assert that the cart badge shows the correct number of items
        const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        await expect(cartBadge, "Cart badge should be visible").toBeVisible();
        await expect(cartBadge, "Cart badge should show 1 item").toHaveText('1');

        // Navigate to the cart page
        await page.click('[data-test="shopping-cart-link"]');
        await expect(page, "User should be redirected to cart page").toHaveURL(/cart/);

        // Assert that the correct item is in the cart
        const cartItemName = await page.locator('[data-test="inventory-item-name"]').textContent();
        console.log("Item in cart:", cartItemName);
        await expect(cartItemName, "Item name in cart should match the name of the added item").toBe(productName);

        const removeFromCartButton = page.getByRole('button', { name: 'Remove' });
        await expect(removeFromCartButton, "Remove from cart button should be visible").toBeVisible();
        await removeFromCartButton.click();
        await expect(removeFromCartButton, "Remove from cart button should not be visible").not.toBeVisible();

        // Assert that the cart badge is no longer visible
        await expect(cartBadge, "Cart badge should not be visible").not.toBeVisible();

        // Assert that the cart is empty
        const cartItems = page.locator('[data-test="cart-item"]');
        await expect(cartItems, "Cart should be empty").toHaveCount(0);
    });

    test('empty login form validation', async ({ page }) => {
        const errorMsgEmptyFields = "Epic sadface: Username is required";
        const errorMsgEmptyPassword = "Epic sadface: Password is required";
        const errorMsgEmptyUsername = "Epic sadface: Username is required";

        // Click the login button without filling in the form
        await page.click('[data-test="login-button"]');

        // Assert that the error message is displayed
        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage, "Error message should be visible").toBeVisible();
        const errorEmptyFieldsMessageText = await errorMessage.textContent();
        console.log("Error message:", errorEmptyFieldsMessageText);
        await expect(errorMessage, "Error message should match text: Epic sadface: Username is required").toHaveText(errorMsgEmptyFields);

        await page.fill('[data-test="username"]', 'standard_user');
        await page.click('[data-test="login-button"]');
        await expect(errorMessage, "Error message should be visible").toBeVisible();
        const errorEmptyPasswordMessageText = await errorMessage.textContent();
        console.log("Error message:", errorEmptyPasswordMessageText);
        await expect(errorMessage, "Error message should match text: Epic sadface: Password is required").toHaveText(errorMsgEmptyPassword);

        await page.locator('[data-test="username"]').clear();
        await page.fill('[data-test="password"]', 'secret_sauce');
        await page.click('[data-test="login-button"]');
        await expect(errorMessage, "Error message should be visible").toBeVisible();
        const errorEmptyUsernameMessageText = await errorMessage.textContent();
        console.log("Error message:", errorEmptyUsernameMessageText);
        await expect(errorMessage, "Error message should match text: Epic sadface: Username is required").toHaveText(errorMsgEmptyUsername);
    });


    test.skip('checkout button should be disabled if cart is empty', async ({ page }) => {
        //test('checkout button should be disabled if cart is empty', async ({ page }) => {

        // Fill in the login form with valid credentials
        loginWithCredentials(page, 'standard_user', 'secret_sauce');

        // Assert that the user is redirected to the inventory page
        await expect(page, "User should be redirected to the inventory page").toHaveURL(/inventory/);

        // Navigate to the cart page
        await page.click('[data-test="shopping-cart-link"]');
        await expect(page, "User should be redirected to the cart page").toHaveURL(/cart/);

        // Assert that the checkout button is disabled if the cart is empty
        const checkoutButton = page.locator('[data-test="checkout"]');
        await expect(checkoutButton, "Checkout button should be disabled").toBeDisabled();
    });

    test('remove item from cart while cart is still has items', async ({ page }) => {

        // Fill in the login form with valid credentials
        loginWithCredentials(page, 'standard_user', 'secret_sauce');

        // Assert that the user is redirected to the inventory page
        await expect(page, "User should be redirected to the inventory page").toHaveURL(/inventory/);
        const inventoryItems = page.locator('[data-test="inventory-item"]');
        const inventoryItemsCount = await inventoryItems.count();
        console.log("Inventory items count:", inventoryItemsCount);

        // Add first three products to the cart
        for (let i = 0; i < 3; i++) {
            const productName = await inventoryItems.nth(i).locator('[data-test="inventory-item-name"]').textContent();
            console.log(`Adding item ${i + 1} to cart:`, productName);
            await inventoryItems.nth(i).getByRole('button', { name: 'Add to cart' }).click();
        }
        await expect(page.locator('[data-test="shopping-cart-badge"]'), "Shopping cart badge should show number of 3 items").toHaveText('3');

        // Navigate to the cart page
        await page.click('[data-test="shopping-cart-link"]');
        await expect(page, "User should be redirected to the cart page").toHaveURL(/cart/);

        // Assert that there are three items in the cart
        const cartItems = page.locator('[data-test="inventory-item"]');
        await expect(cartItems, "Cart should contain 3 items").toHaveCount(3);

        // Remove one item from the cart
        const removeFromCartButton = cartItems.nth(0).getByRole('button', { name: 'Remove' });
        await expect(removeFromCartButton, "Remove button should be visible").toBeVisible();
        await removeFromCartButton.click();

        // Assert that there is one item left in the cart
        await expect(cartItems, "Cart should contain 2 items").toHaveCount(2);
        await expect(page.locator('[data-test="shopping-cart-badge"]'), "Shopping cart badge should show number of 2 items").toHaveText('2');
    });

    test.skip('check sorting price from low to high', async ({ page }) => {

        // Fill in the login form with valid credentials
        loginWithCredentials(page, 'standard_user', 'secret_sauce');

        // Assert that the user is redirected to the inventory page
        await expect(page, "User should be redirected to the inventory page").toHaveURL(/inventory/);

        const inventoryItems = page.locator('[data-test="inventory-item"]');
        const firstProductName = await inventoryItems.nth(0).locator('[data-test="inventory-item-name"]').textContent();
        const firstProductPrice = await inventoryItems.nth(0).locator('[data-test="inventory-item-price"]').textContent();
        console.log("First product before sorting:", firstProductName, firstProductPrice);

        // Select "Price (low to high)" from the sorting dropdown
        await page.click('[data-test="product-sort-container"]');
        await page.locator('[data-test="product_sort_container"] option[value="lohi"]').click();
        //await page.selectOption('[data-test="product_sort_container"]', 'lohi');

        // Get the prices of the products after sorting
        const productPrices = await page.$$eval('.inventory_item_price', prices => prices.map(price => parseFloat(price.textContent.replace('$', ''))));

        // Check if the prices are sorted in ascending order
        const isSorted = productPrices.every((price, index) => index === 0 || price >= productPrices[index - 1]);
        console.log("Product prices after sorting (low to high):", productPrices);
        await expect(isSorted, "Products should be sorted by price (low to high)").toBe(true);
    });

    test('when user refresh cart page with product, product should remain in the cart', async ({ page }) => {

        // Fill in the login form with valid credentials
        loginWithCredentials(page, 'standard_user', 'secret_sauce');

        // Assert that the user is redirected to the inventory page
        await expect(page, "User should be redirected to the inventory page").toHaveURL(/inventory/);
        const inventoryItems = page.locator('[data-test="inventory-item"]');
        const inventoryItemsCount = await inventoryItems.count();
        console.log("Inventory items count:", inventoryItemsCount);

        const randomIndex = Math.floor(Math.random() * inventoryItemsCount);
        const randomProduct = inventoryItems.nth(randomIndex);
        if (randomIndex > 3) {
            // scroll down to the product if it's not visible
            await randomProduct.scrollIntoViewIfNeeded();
        }
        const productName = await randomProduct.locator('[data-test="inventory-item-name"]').textContent();
        console.log("Adding item to cart:", productName);
        await randomProduct.getByRole('button', { name: 'Add to cart' }).click();

        // Navigate to the cart page
        await page.click('[data-test="shopping-cart-link"]');
        await expect(page, "User should be redirected to the cart page").toHaveURL(/cart/);

        // Assert that the correct item is in the cart
        const cartItemName = await page.locator('[data-test="inventory-item-name"]').textContent();
        console.log("Item in cart:", cartItemName);
        await expect(cartItemName, "Name of item in cart should match the name of the added product").toBe(productName);
        await page.reload();

        // Assert that the correct item is still in the cart after refresh
        const cartItemNameAfterRefresh = await page.locator('[data-test="inventory-item-name"]').textContent();
        console.log("Item in cart after refresh:", cartItemNameAfterRefresh);
        await expect(cartItemNameAfterRefresh, "Name of item in cart after refresh should match the name of the previouly added product").toBe(productName);
    });

    test.only('user cannot log in with locked out email', async ({ page }) => {
        const errorMsgLockedOutUserText = "Epic sadface: Sorry, this user has been locked out.";

        // Fill in the login form with invalid credentials
        await page.fill('[data-test="username"]', 'locked_out_user');
        await page.fill('[data-test="password"]', 'secret_sauce');
        await page.click('[data-test="login-button"]');

        await expect(page, 'Login page should have title Swag Labs').toHaveTitle(/Swag Labs/);
        
        // Assert that the error message is displayed
        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage, 'Error message should be visible on the page').toBeVisible();
        const errorMessageText = await errorMessage.textContent();
        console.log("Error message:", errorMessageText);
        await expect(errorMessage, 'Error message should match expected "Epic sadface: Sorry, this user has been locked out."').toHaveText(errorMsgLockedOutUserText);
    });
});