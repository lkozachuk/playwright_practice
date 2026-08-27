import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { testData } from "../test-data/testData";
import { LoginPage } from "../pages/LoginPage";
import { generateRandomEmail } from '../utils/random';
import { SignUpPage } from "../pages/SignUpPage";
import { AccountCreatedPage } from "../pages/AccountCreatedPage";
import { DeleteAccountPage } from "../pages/DeleteAccountPage";

test.describe('User login and sign up', () => {
    test.use({
        baseURL: 'https://automationexercise.com/',
    });

    test('User can create a new account and delete it', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const loginPage = new LoginPage(page);
        await loginPage.open();
        await expect(loginPage.newUserSignUpTitle, 'New User Signup title should be visible').toHaveText(testData.login.loginSignUpTitle);
        await expect(loginPage.usernameInput, 'User name input field should be visible').toBeVisible();
        const name = "Test";
        const email = generateRandomEmail();
        await loginPage.signUp(name, email);

        const signUpPage = new SignUpPage(page);
        await expect(signUpPage.pageTitle, 'Sign Up page title should be visible').toHaveText(testData.signUp.signUpPageTitle);
        await signUpPage.fillInAccounInformation(testData.signUp.password, testData.signUp.birthDay, testData.signUp.birthMonth, testData.signUp.birthYear);
        await expect(await signUpPage.name, 'Name should be the same').toHaveValue(name);
        await expect(await signUpPage.email, 'Email should be the same').toHaveValue(email);

        await signUpPage.fillInAddressInformation(testData.signUp.firstName, testData.signUp.lastName, testData.signUp.companyName, testData.signUp.address,
            testData.signUp.country, testData.signUp.state, testData.signUp.city, testData.signUp.zipCode, testData.signUp.mobileNumber);

        const accountCreatedPage = new AccountCreatedPage(page);
        await expect(accountCreatedPage.pageTitle, 'Account Created Page should have title').toHaveText(testData.accountCreated.title);
        await accountCreatedPage.continueBtn.click();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        await expect(homePage.getLoggedInText(name), 'User should be logged in').toBeVisible();

        const deleteAccountPage = new DeleteAccountPage(page);
        await deleteAccountPage.open();
        await expect(deleteAccountPage.title, 'Delete Account page title should be visible').toBeVisible();
        await expect(deleteAccountPage.title, 'Delete Account page should have title').toHaveText(testData.accountDeleted.title);
        await deleteAccountPage.continueBtn.click();
        await homePage.closeAdvertisement();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
    });

});