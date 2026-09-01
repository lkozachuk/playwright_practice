import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { TestCasesPage } from "../../pages/TestCasesPage";
import { testData } from "../../test-data/testData";

test.describe('Test cases page', () => {
    test.use({
        baseURL: 'https://automationexercise.com/',
    });

    //Test case #7
    test('User can navigate to the Test Cases page', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const testCasesPage = new TestCasesPage(page);
        await testCasesPage.open();
        await expect(testCasesPage.title, 'Test Cases Page title should be visible').toBeVisible();
        await expect(testCasesPage.subTitle, "Page subtitle should be highlighted in red").toHaveCSS("color", "rgb(255, 0, 0)")
        await expect(testCasesPage.subTitle, "Test cases sub title should be equal to the expected text").toHaveText(testData.subTitles.testCasesSubTitle);

    });




});