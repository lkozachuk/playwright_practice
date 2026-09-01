import { test, expect } from '@playwright/test';
import { testData } from '../../test-data/testData';
import { generateRandomEmail } from '../../utils/random';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { DeleteAccountPage } from '../../pages/DeleteAccountPage';

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
        const response = await request.post('https://automationexercise.com/api/createAccount', {
            form: {
                name: name,
                email: email,
                password: password,
                title: 'Mr',
                birth_date: testData.signUp.birthDay,
                birth_month: testData.signUp.birthMonth,
                birth_year: testData.signUp.birthYear,
                firstname: testData.signUp.firstName,
                lastname: testData.signUp.lastName,
                company: testData.signUp.companyName,
                address1: testData.signUp.address,
                address2: '',
                country: testData.signUp.country,
                zipcode: testData.signUp.zipCode,
                state: testData.signUp.state,
                city: testData.signUp.city,
                mobile_number: testData.signUp.mobileNumber,
            },
        });

        const body = await response.json();
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

});