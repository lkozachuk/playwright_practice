import { test, expect } from '../../fixtures/pages.fixture';
import { testData } from "../../test-data/testData";

test.describe('Test cases page', { tag: '@regression' }, () => {
    //Test case #7
    test('User can navigate to the Test Cases page', async ({ homePage, testCasesListPage }) => {
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        await test.step('Click on the Test Cases category and verify navigation to the Test Cases page', async () => {
            await testCasesListPage.open();
            await expect(testCasesListPage.title, 'Test Cases Page title should be visible').toBeVisible();
            await expect(testCasesListPage.subTitle, "Page subtitle should be highlighted in red").toHaveCSS("color", "rgb(255, 0, 0)")
            await expect(testCasesListPage.subTitle, "Test cases sub title should be equal to the expected text").toHaveText(testData.subTitles.testCasesSubTitle);
        });
    });

});