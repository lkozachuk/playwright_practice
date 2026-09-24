import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { testData } from "../../test-data/testData";
import { generateRandomEmail } from '../../utils/random';
import { CartPage } from "../../pages/CartPage";
import { ProductsDetailsPage } from "../../pages/ProductDetailsPage";
import { AddedToCartModal } from "../../components/AddedToCartModal";

test.describe('Cart page tests', { tag: ['@smoke', '@regression'] }, () => {

    //Test case #11
    test('User can subscribe on Cart page', async ({ page }) => {
        const email = generateRandomEmail();

        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        await test.step('navigate to the Cart page and subscribe', async () => {
            const cartPage = new CartPage(page);
            await cartPage.open();
            await expect(cartPage.cartEmptyInfo, 'Cart page should be empty').toBeVisible();
            await expect(cartPage.subscriptionFieldName, 'User should see Subscription label').toBeVisible();
            await cartPage.subscriptionInput.fill(email);
            await cartPage.subscriptionBtn.click();
            await expect(cartPage.subscribeSuccessMsg, 'Success message should appear after subscribing').toBeVisible();
            await expect(cartPage.subscribeSuccessMsg).toHaveText(testData.messages.subscribedSuccessMsg);
        });
    });

    //Test case #13
    test('User can verify product quantity on the Cart page', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        await page.evaluate(() => window.scrollBy(0, 500));

        let productName: string;
        let productPrice: string;
        let randomIndex: number;

        await test.step('Pick a random product and capture its name and price', async () => {
            const productsCount = await homePage.productsList.count();
            randomIndex = Math.floor(Math.random() * productsCount);

            productName = await homePage.getOwnText(homePage.productsList.nth(randomIndex).locator("p").nth(0));
            await expect(productName, 'Product name should not be empty').toBeTruthy();
            productPrice = await homePage.getOwnText(homePage.getProductPriceByName(productName || "First product name not found"));
            await expect(productPrice, 'Product price should not be empty').toBeTruthy();
        });

        const productDetailsPage = new ProductsDetailsPage(page);

        await test.step('Open the selected product details page', async () => {
            await homePage.viewDetailsProductList.nth(randomIndex).click();
            if (randomIndex > 12) {
                await page.evaluate(() => window.scrollBy(0, 1500));
            }
            await productDetailsPage.closeGoogleVignette();
            if (!(await productDetailsPage.productDetails.isVisible())) {
                await page.evaluate(() => window.scrollTo(0, 0));
            }
            await expect(productDetailsPage.productDetails, 'Product details should be visible').toBeVisible();
            await expect(productDetailsPage.productName, `Product name should be "${productName}"`).toContainText(productName!);
        });

        await test.step('Set quantity to 4 and add product to cart', async () => {
            await productDetailsPage.inputQuantity.fill('4');
            await productDetailsPage.addToCartBtn.click();
        });

        await test.step('Verify added to cart modal and navigate to Cart page', async () => {
            const modal = new AddedToCartModal(page);
            await modal.waitForOpen();
            await expect(modal.modalTitle).toHaveText("Added!");
            await expect(modal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
            await modal.clickViewCart();
        });

        await test.step('Verify product name, price, quantity and total price on the Cart page', async () => {
            const cartPage = new CartPage(page);
            if (!productPrice) {
                throw new Error("Product price text content is null");
            }
            const numericPrice = parseInt(productPrice.replace(/[^0-9]/g, ""));
            const finalPrice = numericPrice * 4;
            await expect(cartPage.cartTable, 'Cart table should be visible').toBeVisible();
            await expect(cartPage.cartTableRows, 'There should be exactly one product in the cart').toHaveCount(1);
            await expect(cartPage.cartTableRowProductNames.nth(0), 'Product name in cart should match the first added product').toContainText(productName || "Product name not found");

            await expect(cartPage.cartTableRowProductPrices.nth(0), 'Product price on Cart page should be the same as on the products page').toContainText(productPrice || "Product price not found");
            await expect(cartPage.cartTableRowProductQuantities.nth(0), 'Product quantity in cart should be 4').toHaveText("4");
            await expect(cartPage.cartTableRowProductTotalPrices.nth(0), 'Product total price should be correct').toContainText(finalPrice.toString() || "First product price not found");
        });
    });

});
