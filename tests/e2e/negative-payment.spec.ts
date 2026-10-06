import { test, expect } from '../../fixtures/index';
import { testData } from '../../test-data/testData';
import { generateRandomEmail } from '../../utils/random';

test.describe('Negative scenarios - Payment', { tag: '@regression' }, () => {

    test('User cannot submit payment with empty required fields', async ({ accountApiClient, homePage, loginPage, addedToCartModal, cartPage, checkoutPage, paymentPage }) => {
        const name = 'Test';
        const email = `negtest${Date.now()}@test.com`;
        const password = testData.signUp.password;

        await test.step('Create account via API and log in', async () => {
            const body = await accountApiClient.createAccount(name, email, password);
            expect(body.responseCode, 'Account should be created successfully via API').toBe(201);

            await homePage.open();
            await loginPage.open();
            await loginPage.login(email, password);
            await expect(homePage.getLoggedInText(name), 'User should be logged in').toBeVisible();
        });

        await test.step('Add product to cart and proceed to checkout', async () => {
            await homePage.addToCartProductById('1').click();
            await addedToCartModal.waitForOpen();
            await addedToCartModal.clickViewCart();

            await expect(cartPage.cartTable, 'Cart table should be visible').toBeVisible();
            await cartPage.cartProceedCheckout.click();
            await checkoutPage.placeOrderBtn.click();
        });

        await test.step('Submit payment form without filling any fields', async () => {
            await expect(paymentPage.title, 'Payment page title should be visible').toBeVisible();
            await paymentPage.payAndConfirmBtn.click();
        });

        await test.step('Verify order is not placed', async () => {
            await expect(paymentPage.orderPlacedTitle, 'Order placed confirmation should NOT appear').not.toBeVisible();
        });
    });

});