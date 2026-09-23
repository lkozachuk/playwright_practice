import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { testData } from "../../test-data/testData";
import { LoginPage } from "../../pages/LoginPage";
import { generateRandomEmail } from '../../utils/random';
import { SignUpPage } from "../../pages/SignUpPage";
import { AccountCreatedPage } from "../../pages/AccountCreatedPage";
import { DeleteAccountPage } from "../../pages/DeleteAccountPage";
import { ProductsListPage } from "../../pages/ProductsListPage";
import { AddedToCartModal } from "../../components/AddedToCartModal";
import { CartPage } from "../../pages/CartPage";

test.describe('User login and sign up', { tag: ['@smoke', '@regression'] }, () => {

    // Test case #1
    test('User can create a new account and delete it', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const loginPage = new LoginPage(page);
        await loginPage.open();
        await expect(loginPage.newUserSignUpTitle, 'New User Signup title should be visible').toHaveText(testData.login.signUpTitle);
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
        await homePage.closeGoogleVignette();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
    });

    // Test case #3
    test("User can't login with incorrect email or password", async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const loginPage = new LoginPage(page);
        await loginPage.open();
        await expect(loginPage.loginToAccountTitle, 'Login to your account title should be visible').toHaveText(testData.login.loginTitle);

        await loginPage.login(testData.login.validUser.email, testData.login.invalidUser.password);
        await expect(loginPage.errorLoginMsg, "Error message should be visible").toBeVisible();
        await expect(loginPage.errorLoginMsg, "Error message should be highlighted in red").toHaveCSS("color", "rgb(255, 0, 0)")

        await loginPage.login(testData.login.invalidUser.email, testData.login.validUser.password);
        await expect(loginPage.errorLoginMsg, "Error message should be visible").toBeVisible();
        await expect(loginPage.errorLoginMsg, "Error message should be highlighted in red").toHaveCSS("color", "rgb(255, 0, 0)")

        await loginPage.login("randomEmail50@test.com", "Password");
        await expect(loginPage.errorLoginMsg, "Error message should be visible").toBeVisible();
        await expect(loginPage.errorLoginMsg, "Error message should be highlighted in red").toHaveCSS("color", "rgb(255, 0, 0)")

        await loginPage.login(testData.login.validUser.email, testData.login.validUser.password);
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        await expect(homePage.getLoggedInText("Test"), 'User should be logged in').toBeVisible();
    });

    //Test case #4
    test("User can logout from account", async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const loginPage = new LoginPage(page);
        await loginPage.open();
        await expect(loginPage.loginToAccountTitle, 'Login to your account title should be visible').toHaveText(testData.login.loginTitle);

        await loginPage.login(testData.login.validUser.email, testData.login.validUser.password);
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        await expect(homePage.getLoggedInText("Test"), 'User should be logged in').toBeVisible();

        await homePage.logoutFromAccount();
        await expect(loginPage.loginToAccountTitle, 'Login to your account title should be visible').toHaveText(testData.login.loginTitle);
    });

    //Test case #5
    test("User can't create a new account with already registered email", async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const loginPage = new LoginPage(page);
        await loginPage.open();
        await expect(loginPage.newUserSignUpTitle, 'New User Signup title should be visible').toHaveText(testData.login.signUpTitle);
        await expect(loginPage.usernameInput, 'User name input field should be visible').toBeVisible();
        const name = "Test";
        await loginPage.signUp(name, testData.login.validUser.email);
        await expect(loginPage.errorSignUpMsg, "Error Sign Up message should be visible").toBeVisible();
        await expect(loginPage.errorSignUpMsg, "Error Sign Up message should be highlighted in red").toHaveCSS("color", "rgb(255, 0, 0)")
    });

    //Test case #20
    test("User can see added product in the cart after log in to account", async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const productsPage = new ProductsListPage(page);
        await productsPage.open();
        await expect(productsPage.productListTitle, 'Product list title should be "All Products"').toHaveText(testData.search.allProductsTitle);
        await productsPage.searchProduct(testData.search.sleevelessDressProduct);
        await expect(productsPage.productListTitle).toHaveText(testData.search.searchedProductsTitle);
        await expect(productsPage.productList, 'Product list should not be empty after search').not.toBeEmpty();
        await expect(productsPage.productList, 'There should be exactly one product displayed').toHaveCount(1);
        await expect(productsPage.productNames.first()).toHaveText(new RegExp(testData.search.sleevelessDressProduct, "i"));
        await productsPage.getAddToCartButtonById("3").click();

        const modal = new AddedToCartModal(page);
        await modal.waitForOpen();
        await expect(modal.modalTitle).toHaveText("Added!");
        await expect(modal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
        await modal.clickContinueShopping();
        await expect(modal.modal).toBeHidden();

        const cartPage = new CartPage(page);
        await cartPage.open();
        await expect(cartPage.cartTable, 'Cart table should be visible').toBeVisible();
        await expect(cartPage.cartTableRows, 'There should be exactly one product in the cart').toHaveCount(1);
        await expect(cartPage.cartTableRowProductNames.nth(0), 'Product name in cart should match the first added product').toContainText(testData.search.sleevelessDressProduct);

        const loginPage = new LoginPage(page);
        await loginPage.open();
        await expect(loginPage.loginToAccountTitle, 'Login to your account title should be visible').toHaveText(testData.login.loginTitle);
        await loginPage.login(testData.login.validUser.email, testData.login.validUser.password);
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        await expect(homePage.getLoggedInText("Test"), 'User should be logged in').toBeVisible();

        await cartPage.open();
        await expect(cartPage.cartTable, 'Cart table should be visible').toBeVisible();
        await expect(cartPage.cartTableRows, 'There should be exactly one product in the cart').toHaveCount(1);
        await expect(cartPage.cartTableRowProductNames.nth(0), 'Product name in cart should match the first added product').toContainText(testData.search.sleevelessDressProduct);
    });
});