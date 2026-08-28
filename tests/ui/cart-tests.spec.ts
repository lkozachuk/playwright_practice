import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { testData } from "../../test-data/testData";
import { generateRandomEmail } from '../../utils/random';
import { CartPage } from "../../pages/CartPage";

test.describe('User can subscribe on Cart page', () => {
    test.use({
        baseURL: 'https://automationexercise.com/',
    });

    test('User can create a new account and delete it', async ({ page }) => {
        const email = generateRandomEmail();

        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const cartPage = new CartPage(page);
        await cartPage.open();
        await expect(cartPage.cartEmptyInfo, 'Cart page should be empty').toBeVisible

        await expect(cartPage.subscriptionFieldName, 'User should see Subscription label').toBeVisible();
        await cartPage.subscriptionInput.fill(email);
        await cartPage.subscriptionBtn.click();
        await expect(cartPage.subscribeSuccessMsg, 'Success message should appear after subscribing').toBeVisible();
        await expect(cartPage.subscribeSuccessMsg).toHaveText(testData.messages.subscribedSuccessMsg);
    });

});
