import { test, expect } from '@playwright/test';
import { testData } from '../../test-data/testData';
import { generateRandomEmail } from '../../utils/random';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { DeleteAccountPage } from '../../pages/DeleteAccountPage';
import { AddedToCartModal } from "../../components/AddedToCartModal";
import { CartPage } from "../../pages/CartPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { PaymentPage } from "../../pages/PaymentPage";
import { AccountApiClient } from '../../api/AccountApiClient';

test.describe('E2E scenarios, combination of API + UI flows', () => {
    test.use({
        baseURL: 'https://automationexercise.com/',
    });

    //Test case #2
    test('User created via API can login and delete account via UI', async ({ request, page }) => {
        const name = 'Test';
        const email = generateRandomEmail();
        const password = testData.signUp.password;

        // Create account via API
        const apiClient = new AccountApiClient(request);
        const body = await apiClient.createAccount(name, email, password);
        expect(body.responseCode, 'Account should be created successfully via API').toBe(201);

        // Login via UI
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const loginPage = new LoginPage(page);
        await loginPage.open();
        await expect(loginPage.usernameInput, 'User name input field should be visible').toBeVisible();
        await expect(loginPage.newUserSignUpTitle, 'New User Signup title should be visible').toHaveText(testData.login.signUpTitle);
        await loginPage.login(email, password);
        await expect(homePage.getLoggedInText(name), 'User should be logged in').toBeVisible();

        // Delete account via UI
        const deleteAccountPage = new DeleteAccountPage(page);
        await deleteAccountPage.open();
        await expect(deleteAccountPage.title, 'Delete Account page title should be visible').toBeVisible();
        await expect(deleteAccountPage.title, 'Delete Account page should have correct title').toHaveText(testData.accountDeleted.title);
        await deleteAccountPage.continueBtn.click();
    });

    //Test case #16
    test('User can login before Checkout flow and place an order -> user created via API and login', async ({ request, page }) => {
        const name = 'Test';
        const email = generateRandomEmail();
        const password = testData.signUp.password;

        // Create account via API
        const apiClient = new AccountApiClient(request);
        const body = await apiClient.createAccount(name, email, password);
        expect(body.responseCode, 'Account should be created successfully via API').toBe(201);

        // Login via UI
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const loginPage = new LoginPage(page);
        await loginPage.open();
        await expect(loginPage.usernameInput, 'User name input field should be visible').toBeVisible();
        await expect(loginPage.newUserSignUpTitle, 'New User Signup title should be visible').toHaveText(testData.login.signUpTitle);
        await loginPage.login(email, password);
        await expect(homePage.getLoggedInText(name), 'User should be logged in').toBeVisible();

        await page.evaluate(() => window.scrollBy(0, 500));
        await homePage.addToCartProductById("1").click();

        const addedToCartModal = new AddedToCartModal(page);
        await addedToCartModal.waitForOpen();
        await expect(addedToCartModal.modalTitle).toHaveText("Added!");
        await expect(addedToCartModal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
        await addedToCartModal.clickContinueShopping();
        await expect(addedToCartModal.modal).toBeHidden();

        await homePage.addToCartProductById("2").click();
        await addedToCartModal.waitForOpen();
        await expect(addedToCartModal.modalTitle).toHaveText("Added!");
        await addedToCartModal.clickContinueShopping();
        await expect(addedToCartModal.modal).toBeHidden();

        const cartPage = new CartPage(page);
        await cartPage.open();
        await expect(cartPage.cartTable, 'Cart table should be visible').toBeVisible();
        await expect(cartPage.cartTableRows, 'There should be exactly two products in the cart').toHaveCount(2);
        await cartPage.cartProceedCheckout.click();

        const checkoutPage = new CheckoutPage(page);
        await expect(checkoutPage.title, "Checkout page should have Address Details title").toBeVisible();
        await expect(checkoutPage.deliveryAddress, 'Delivery address component should have header').toContainText("Your delivery address");
        await expect(checkoutPage.deliveryAddress, 'Delivery address component should have user name').toContainText(testData.signUp.firstName);
        await expect(checkoutPage.deliveryAddress, 'Delivery address component should have user surname').toContainText(testData.signUp.lastName);
        await expect(checkoutPage.deliveryAddress, 'Delivery address component should have user address').toContainText(testData.signUp.address);
        await expect(checkoutPage.deliveryAddress, 'Delivery address component should have user`s state').toContainText(testData.signUp.state);
        await expect(checkoutPage.deliveryAddress, 'Delivery address component should have user`s city').toContainText(testData.signUp.city);
        await expect(checkoutPage.deliveryAddress, 'Delivery address component should have user`s zipCode').toContainText(testData.signUp.zipCode);
        await expect(checkoutPage.deliveryAddress, 'Delivery address component should have user`s country').toContainText(testData.signUp.country);
        await expect(checkoutPage.deliveryAddress, 'Delivery address component should have user`s mobile number').toContainText(testData.signUp.mobileNumber);

        await expect(checkoutPage.billingAddress, 'Billing address component should have header').toContainText("Your billing address");
        await expect(checkoutPage.deliveryAddress, 'Billing address component should have user name').toContainText(testData.signUp.firstName);
        await expect(checkoutPage.deliveryAddress, 'Billing address component should have user surname').toContainText(testData.signUp.lastName);
        await expect(checkoutPage.deliveryAddress, 'Billing address component should have user address').toContainText(testData.signUp.address);
        await expect(checkoutPage.deliveryAddress, 'Billing address component should have user`s state').toContainText(testData.signUp.state);
        await expect(checkoutPage.deliveryAddress, 'Billing address component should have user`s city').toContainText(testData.signUp.city);
        await expect(checkoutPage.deliveryAddress, 'Billing address component should have user`s zipCode').toContainText(testData.signUp.zipCode);
        await expect(checkoutPage.deliveryAddress, 'Billing address component should have user`s country').toContainText(testData.signUp.country);
        await expect(checkoutPage.deliveryAddress, 'Billing address component should have user`s mobile number').toContainText(testData.signUp.mobileNumber);

        await expect(checkoutPage.orderTitle, 'Review Your Order section header should be visible').toBeVisible();
        await expect(checkoutPage.cartProductRows, 'There should be exactly two products in the cart').toHaveCount(2);

        const expectedTotalPrice = await checkoutPage.countProductsPrice();
        const grandTotalText = await checkoutPage.grandTotalPrice.textContent();
        const grandTotal = parseInt(grandTotalText!.replace(/[^0-9]/g, ""));
        expect(grandTotal, `Grand total (${grandTotal}) should equal sum of product totals (${expectedTotalPrice})`).toBe(expectedTotalPrice);

        await checkoutPage.orderCommentTextarea.fill(testData.messages.checkoutOrderComment);
        await checkoutPage.placeOrderBtn.click();

        const paymentPage = new PaymentPage(page);
        await expect(paymentPage.title, 'Payment page title should be visible').toBeVisible();

        await paymentPage.fillCreditCardData(testData.payment.validCreditCard.name, testData.payment.validCreditCard.cardNumber,
            testData.payment.validCreditCard.cvv, testData.payment.validCreditCard.expirationMonth,
            testData.payment.validCreditCard.expirationYear);

        await expect(paymentPage.orderPlacedTitle, 'Order placed title should be shown on the page').toHaveText(testData.messages.orderPlaced);
        await expect(paymentPage.orderPlacedTitle, "Order placed title should be highlighted in green").toHaveCSS("color", "rgb(0, 128, 0)");

        const deleteAccountPage = new DeleteAccountPage(page);
        await deleteAccountPage.open();
        await expect(deleteAccountPage.title, 'Delete Account page title should be visible').toBeVisible();
        await expect(deleteAccountPage.title, 'Delete Account page should have title').toHaveText(testData.accountDeleted.title);
        await deleteAccountPage.continueBtn.click();
        await homePage.closeAdvertisement();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
    });

    //Test case #24
    test('User can download invoice after order purchase -> user created via API and login', async ({ request, page }) => {
        const name = 'Test';
        const email = generateRandomEmail();
        const password = testData.signUp.password;

        // Create account via API
        const apiClient = new AccountApiClient(request);
        const body = await apiClient.createAccount(name, email, password);
        expect(body.responseCode, 'Account should be created successfully via API').toBe(201);

        // Login via UI
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const loginPage = new LoginPage(page);
        await loginPage.open();
        await expect(loginPage.usernameInput, 'User name input field should be visible').toBeVisible();
        await expect(loginPage.newUserSignUpTitle, 'New User Signup title should be visible').toHaveText(testData.login.signUpTitle);
        await loginPage.login(email, password);
        await expect(homePage.getLoggedInText(name), 'User should be logged in').toBeVisible();

        await page.evaluate(() => window.scrollBy(0, 600));
        await homePage.addToCartProductById("5").click();

        const addedToCartModal = new AddedToCartModal(page);
        await addedToCartModal.waitForOpen();
        await expect(addedToCartModal.modalTitle).toHaveText("Added!");
        await expect(addedToCartModal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
        await addedToCartModal.clickContinueShopping();
        await expect(addedToCartModal.modal).toBeHidden();

        await homePage.addToCartProductById("6").click();
        await addedToCartModal.waitForOpen();
        await expect(addedToCartModal.modalTitle).toHaveText("Added!");
        await addedToCartModal.clickContinueShopping();
        await expect(addedToCartModal.modal).toBeHidden();

        const cartPage = new CartPage(page);
        await cartPage.open();
        await expect(cartPage.cartTable, 'Cart table should be visible').toBeVisible();
        await expect(cartPage.cartTableRows, 'There should be exactly two products in the cart').toHaveCount(2);
        await cartPage.cartProceedCheckout.click();

        const checkoutPage = new CheckoutPage(page);
        await expect(checkoutPage.title, "Checkout page should have Address Details title").toBeVisible();
        await expect(checkoutPage.billingAddress, 'Billing address component should have header').toContainText("Your billing address");

        await expect(checkoutPage.orderTitle, 'Review Your Order section header should be visible').toBeVisible();
        await expect(checkoutPage.cartProductRows, 'There should be exactly two products in the cart').toHaveCount(2);

        const expectedTotalPrice = await checkoutPage.countProductsPrice();
        const grandTotalText = await checkoutPage.grandTotalPrice.textContent();
        const grandTotal = parseInt(grandTotalText!.replace(/[^0-9]/g, ""));
        expect(grandTotal, `Grand total (${grandTotal}) should equal sum of product totals (${expectedTotalPrice})`).toBe(expectedTotalPrice);

        await checkoutPage.orderCommentTextarea.fill(testData.messages.checkoutOrderComment);
        await checkoutPage.placeOrderBtn.click();

        const paymentPage = new PaymentPage(page);
        await expect(paymentPage.title, 'Payment page title should be visible').toBeVisible();

        await paymentPage.fillCreditCardData(testData.payment.validCreditCard.name, testData.payment.validCreditCard.cardNumber,
            testData.payment.validCreditCard.cvv, testData.payment.validCreditCard.expirationMonth,
            testData.payment.validCreditCard.expirationYear);

        await expect(paymentPage.orderPlacedTitle, 'Order placed title should be shown on the page').toHaveText(testData.messages.orderPlaced);
        await expect(paymentPage.orderPlacedTitle, "Order placed title should be highlighted in green").toHaveCSS("color", "rgb(0, 128, 0)");
        await expect(paymentPage.downloadInvoiceBtn, 'Download Invoice button should be visible').toBeVisible();
        const download = await paymentPage.downloadInvoice();
        expect(download.suggestedFilename()).toBeTruthy();
        await paymentPage.continueBtn.click();

        const deleteAccountPage = new DeleteAccountPage(page);
        await deleteAccountPage.open();
        await expect(deleteAccountPage.title, 'Delete Account page title should be visible').toBeVisible();
        await expect(deleteAccountPage.title, 'Delete Account page should have title').toHaveText(testData.accountDeleted.title);
        await deleteAccountPage.continueBtn.click();
        await homePage.closeAdvertisement();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
    });

});