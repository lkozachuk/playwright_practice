import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { testData } from "../../test-data/testData";
import { generateRandomEmail } from '../../utils/random';
import { CartPage } from "../../pages/CartPage";
import { AddedToCartModal } from "../../components/AddedToCartModal";
import { CheckoutRegisterLoginModal } from "../../components/CheckoutRegisterLoginModal";
import { LoginPage } from "../../pages/LoginPage";
import { SignUpPage } from "../../pages/SignUpPage";
import { AccountCreatedPage } from "../../pages/AccountCreatedPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { PaymentPage } from "../../pages/PaymentPage";
import { DeleteAccountPage } from "../../pages/DeleteAccountPage";

test.describe('Checkout page tests', () => {
    test.use({
        baseURL: 'https://automationexercise.com/',
    });

    //Test case #14
    test('User can register during Checkout flow and placing an order and delete this account later', async ({ page }) => {

        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        await page.evaluate(() => window.scrollBy(0, 500));
        await homePage.addToCartProductById("3").click();

        const addedToCartModal = new AddedToCartModal(page);
        await addedToCartModal.waitForOpen();
        await expect(addedToCartModal.modalTitle).toHaveText("Added!");
        await expect(addedToCartModal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
        await addedToCartModal.clickContinueShopping();
        await expect(addedToCartModal.modal).toBeHidden();

        await homePage.addToCartProductById("4").click();
        await addedToCartModal.waitForOpen();
        await expect(addedToCartModal.modalTitle).toHaveText("Added!");
        await addedToCartModal.clickContinueShopping();
        await expect(addedToCartModal.modal).toBeHidden();

        const cartPage = new CartPage(page);
        await cartPage.open();
        await expect(cartPage.cartTable, 'Cart table should be visible').toBeVisible();
        await expect(cartPage.cartTableRows, 'There should be exactly two products in the cart').toHaveCount(2);
        await cartPage.cartProceedCheckout.click();

        const checkoutRegistLoginModal = new CheckoutRegisterLoginModal(page);
        await checkoutRegistLoginModal.waitForOpen();
        await expect(checkoutRegistLoginModal.modalTitle).toHaveText("Checkout");
        await expect(checkoutRegistLoginModal.modalDescription).toHaveText(testData.messages.checkoutModalDescription);
        await checkoutRegistLoginModal.clickRegisterLoginLink();

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


    //Test case #15
    //Test case #23
    test('User can register before Checkout flow, check address details on Checkout page and place an order', async ({ page }) => {

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

        await page.evaluate(() => window.scrollBy(0, 500));
        await homePage.addToCartProductById("4").click();

        const addedToCartModal = new AddedToCartModal(page);
        await addedToCartModal.waitForOpen();
        await expect(addedToCartModal.modalTitle).toHaveText("Added!");
        await expect(addedToCartModal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
        await addedToCartModal.clickContinueShopping();
        await expect(addedToCartModal.modal).toBeHidden();

        await homePage.addToCartProductById("5").click();
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

});