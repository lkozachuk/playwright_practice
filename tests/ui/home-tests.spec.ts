import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { testData } from "../../test-data/testData";
import { generateRandomEmail } from '../../utils/random';
import { ProductsPage } from "../../pages/ProductsPage";
import { AddedToCartModal } from "../../components/AddedToCartModal";
import { CartPage } from "../../pages/CartPage";

test.describe('Home page tests', () => {
    test.use({
        baseURL: 'https://automationexercise.com/',
    });

    //Test case #10
    test('User can subscribe on Home page', async ({ page }) => {
        const email = generateRandomEmail();

        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        await page.keyboard.press('End');

        await expect(homePage.subscriptionFieldName, 'User should see Subscription label').toBeVisible();
        await homePage.subscriptionInput.fill(email);
        await homePage.subscriptionBtn.click();
        await expect(homePage.subscribeSuccessMsg, 'Success message should appear after subscribing').toBeVisible();
        await expect(homePage.subscribeSuccessMsg).toHaveText(testData.messages.subscribedSuccessMsg);
    });

    //Test case #18
    test('User can see category products on Home page', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await page.evaluate(() => window.scrollBy(0, 600));
        await expect(homePage.leftSidebar, 'User should see left sidebar on the Home page').toBeVisible();
        await expect(homePage.categoryProductsList, 'User should see category products list on the left sidebar').toBeVisible();
        await homePage.womenCategory.click();
        await homePage.closeGoogleVignette();
        await expect(homePage.womenDressSubcategory, 'User should see Women Dress subcategory').toBeVisible();
        await homePage.womenDressSubcategory.click();

        const productsPage = new ProductsPage(page);
        await expect(productsPage.productListTitle, 'User should see title of the products list').toBeVisible();
        await expect(productsPage.productListTitle).toHaveText(testData.products.dressProductTitle);
        await expect(productsPage.productList, 'User should see products list').not.toHaveCount(0);

        await productsPage.menCategory.click();
        await productsPage.closeGoogleVignette();
        await expect(productsPage.menJeansSubcategory, 'User should see Men Jeans subcategory').toBeVisible();
        await productsPage.menJeansSubcategory.click();
        await expect(productsPage.productListTitle).toHaveText(testData.products.jeansProductTitle);
        await expect(productsPage.productList, 'User should see products list').not.toHaveCount(0);
    });

    //Test case #22
    test('User can add product from Recommended items section to Cart', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await homePage.recommendedItems.scrollIntoViewIfNeeded();
        await expect(homePage.recommendedItems, 'Section should have title "Recommended Items"').toContainText('recommended items');
        const recommendedItemName = await homePage.productNameInRecommendedItems.first().textContent();
        const recommendedItemPrice = await homePage.productPriceInRecommendedItems.first().textContent();
        await homePage.addtoCartVisibleRecommendedItem();

        const modal = new AddedToCartModal(page);
        await modal.waitForOpen();
        await expect(modal.modalTitle).toHaveText("Added!");
        await expect(modal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
        await modal.clickViewCart();

        const cartPage = new CartPage(page);
        await expect(cartPage.cartTable, 'Cart table should be visible').toBeVisible();
        await expect(cartPage.cartTableRows, 'There should be exactly two products in the cart').toHaveCount(1);
        console.log("Product name: ", await cartPage.cartTableRowProductNames.nth(0).textContent());
        await expect(cartPage.cartTableRowProductNames.nth(0), 'First product name in cart should match the first added product').toContainText(recommendedItemName || "Recommended item name not found");

        await expect(cartPage.cartTableRowProductPrices.nth(0), 'Product price on Cart page should be the same as on the products page').toContainText(recommendedItemPrice || "Recommended item price not found");
        await expect(cartPage.cartTableRowProductQuantities.nth(0), 'First product quantity in cart should be 1').toHaveText("1");
        await expect(cartPage.cartTableRowProductTotalPrices.nth(0), 'Product total price should be correct').toContainText(recommendedItemPrice || "Recommended item price not found");

    });

    //Test case #25
    test('User can scroll up using "Arrow" button', async ({ page, browserName }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        await expect(homePage.subscriptionFieldName.scrollIntoViewIfNeeded());
        await expect(homePage.subscriptionFieldName, 'User should see Subscription label').toBeVisible();
        await expect(homePage.scrollUpButton, 'Scroll Up button should be visible after scrolling down').toBeVisible();
        await homePage.closeGoogleVignette();
        const scrollYBottom = await page.evaluate(() => window.scrollY);
        expect(scrollYBottom, 'Page should be scrolled down after pressing End').toBeGreaterThan(0);
        await homePage.scrollUpButton.click();
        await homePage.closeGoogleVignette();
        if (browserName === 'webkit' && await homePage.scrollUpButton.isVisible()) {
            await homePage.scrollUpButton.click();
        }
        await expect(homePage.logo, 'Logo should be visible after clicking Scroll Up button').toBeVisible();
        await expect(homePage.slider, 'Slider should be visible after clicking Scroll Up button').toBeVisible();
        await expect(homePage.scrollUpButton, 'Scroll Up button should be visible after scrolling down').not.toBeVisible();

        const scrollUpYAfterClick = await page.evaluate(() => window.scrollY);
        expect(scrollUpYAfterClick, 'Page should be scrolled back to top after clicking Scroll Up').toBe(0);
    });

    //Test case #26
    test('User can scroll up without using "Arrow" button', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        await page.keyboard.press('End');
        await expect(homePage.subscriptionFieldName, 'User should see Subscription label').toBeVisible();
        await expect(homePage.subscriptionBtn, 'User should see Subscription button').toBeVisible();
        await homePage.closeGoogleVignette();
        const scrollYBottom = await page.evaluate(() => window.scrollY);
        expect(scrollYBottom, 'Page should be scrolled down after pressing End').toBeGreaterThan(0);
        await expect(homePage.slider.scrollIntoViewIfNeeded());
        await expect(homePage.slider, 'Slider should be visible after clicking Scroll Up button').toBeVisible();
        await expect(homePage.scrollUpButton, 'Scroll Up button should be visible after scrolling down').not.toBeVisible();
        const scrollUpYAfterClick = await page.evaluate(() => window.scrollY);
        expect(scrollUpYAfterClick, 'Page should be scrolled back to top after clicking Scroll Up').toBe(0);
    });
});
