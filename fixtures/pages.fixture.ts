import { test as base, expect } from '@playwright/test';

import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { DeleteAccountPage } from '../pages/DeleteAccountPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { ProductsListPage } from '../pages/ProductsListPage';
import { SignUpPage } from '../pages/SignUpPage';
import { TestCasesListPage } from '../pages/TestCasesListPage';

import { AddedToCartModal } from '../components/AddedToCartModal';
import { CheckoutRegisterLoginModal } from '../components/CheckoutRegisterLoginModal';

type PageFixtures = {
    accountCreatedPage: AccountCreatedPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    contactUsPage: ContactUsPage;
    deleteAccountPage: DeleteAccountPage;
    homePage: HomePage;
    loginPage: LoginPage;
    paymentPage: PaymentPage;
    productDetailsPage: ProductDetailsPage;
    productsListPage: ProductsListPage;
    signUpPage: SignUpPage;
    testCasesListPage: TestCasesListPage;

    addedToCartModal: AddedToCartModal;
    checkoutRegisterLoginModal: CheckoutRegisterLoginModal;
};

export const test = base.extend<PageFixtures>({
    accountCreatedPage: async ({ page }, use) => {
        await use(new AccountCreatedPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    contactUsPage: async ({ page }, use) => {
        await use(new ContactUsPage(page));
    },
    deleteAccountPage: async ({ page }, use) => {
        await use(new DeleteAccountPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    paymentPage: async ({ page }, use) => {
        await use(new PaymentPage(page));
    },
    productDetailsPage: async ({ page }, use) => {
        await use(new ProductDetailsPage(page));
    },
    productsListPage: async ({ page }, use) => {
        await use(new ProductsListPage(page));
    },
    signUpPage: async ({ page }, use) => {
        await use(new SignUpPage(page));
    },
    testCasesListPage: async ({ page }, use) => {
        await use(new TestCasesListPage(page));
    },
    addedToCartModal: async ({ page }, use) => {
        await use(new AddedToCartModal(page));
    },
    checkoutRegisterLoginModal: async ({ page }, use) => {
        await use(new CheckoutRegisterLoginModal(page));
    },
});

export { expect };