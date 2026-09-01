import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { testData } from "../../test-data/testData";
import { generateRandomEmail } from '../../utils/random';


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

});
