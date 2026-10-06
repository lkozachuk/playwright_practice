import { test, expect } from '../../fixtures/index';
import { testData } from '../../test-data/testData';
import { generateRandomEmail } from '../../utils/random';

test.describe('Account API - Create, Read, Update, Delete operations', { tag: '@regression' }, () => {

    test('API: verifyLogin returns 200 for valid credentials', async ({ accountApiClient }) => {
        const email = generateRandomEmail();
        await accountApiClient.createAccount('Test', email, testData.signUp.password);

        const result = await accountApiClient.verifyLogin(email, testData.signUp.password);
        expect(result.responseCode, 'Valid credentials should return 200').toBe(200);
        expect(result.message, 'Response should confirm user exists').toBe('User exists!');
    });

    test('API: verifyLogin returns 404 for invalid credentials', async ({ accountApiClient }) => {
        const result = await accountApiClient.verifyLogin('nonexistent@test.com', 'wrongpass');
        expect(result.responseCode, 'Invalid credentials should return 404').toBe(404);
        expect(result.message, 'Response should confirm user not found').toBe('User not found!');
    });

    test('API: updateAccount successfully updates user details', async ({ accountApiClient }) => {
        const email = generateRandomEmail();
        await accountApiClient.createAccount('Test', email, testData.signUp.password);

        const result = await accountApiClient.updateAccount({
            name: 'Test',
            email,
            password: testData.signUp.password,
            title: 'Mr',
            birth_date: testData.signUp.birthDay,
            birth_month: testData.signUp.birthMonth,
            birth_year: testData.signUp.birthYear,
            firstname: 'UpdatedFirstName',
            lastname: testData.signUp.lastName,
            company: testData.signUp.companyName,
            address1: testData.signUp.address,
            address2: '',
            country: testData.signUp.country,
            zipcode: testData.signUp.zipCode,
            state: testData.signUp.state,
            city: testData.signUp.city,
            mobile_number: testData.signUp.mobileNumber,
        });

        expect(result.responseCode, 'Account should be updated successfully').toBe(200);
        expect(result.message, 'Response should confirm user updated').toBe('User updated!');
    });

    test('API: getUserDetailByEmail returns correct user data', async ({ accountApiClient }) => {
        const email = generateRandomEmail();
        await accountApiClient.createAccount('Test', email, testData.signUp.password);

        const result = await accountApiClient.getUserDetailByEmail(email);
        expect(result.responseCode, 'Should return 200').toBe(200);
        expect(result.user.email, 'Returned user email should match').toBe(email);
    });

    test.afterEach(async ({ accountApiClient }) => {
        // cleanup handled per-test once the testAccount fixture pattern is wired in;
        // for now, each test above creates its own account without deleting it
    });

});