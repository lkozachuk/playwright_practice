import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { testData } from "../../test-data/testData";
import { generateRandomEmail } from '../../utils/random';
import { ProductsPage } from "../../pages/ProductsPage";


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

});
