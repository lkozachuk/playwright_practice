import { buildAccount } from '../../factories/accountFactory';
import { test, expect } from '../../fixtures/index';
import { GetUserDetailResponseSchema } from '../../schemas/accountSchemas';

test.describe('Account API - Create, Read, Update, Delete operations', { tag: '@regression' }, () => {

    test('API: verifyLogin returns 200 for valid credentials', async ({ accountApiClient, testAccount }) => {
        const account = buildAccount();
        await accountApiClient.createAccount(account.name, account.email, account.password);
        testAccount.register(account.email, account.password);

        const result = await accountApiClient.verifyLogin(account.email, account.password);
        expect(result.responseCode, 'Valid credentials should return 200').toBe(200);
        expect(result.message, 'Response should confirm user exists').toBe('User exists!');
    });

    test('API: verifyLogin returns 404 for invalid credentials', async ({ accountApiClient }) => {
        const result = await accountApiClient.verifyLogin('nonexistent@test.com', 'wrongpass');
        expect(result.responseCode, 'Invalid credentials should return 404').toBe(404);
        expect(result.message, 'Response should confirm user not found').toBe('User not found!');
    });

    test('API: updateAccount successfully updates user details', async ({ accountApiClient, testAccount }) => {
        const account = buildAccount();
        await accountApiClient.createAccount(account.name, account.email, account.password);
        testAccount.register(account.email, account.password);

        const updatedAccount = buildAccount({
            email: account.email,
            password: account.password,
            firstname: 'UpdatedFirstName',
        });

        const result = await accountApiClient.updateAccount(updatedAccount);
        expect(result.responseCode, 'Account should be updated successfully').toBe(200);
        expect(result.message, 'Response should confirm user updated').toBe('User updated!');
    });

    test('API: getUserDetailByEmail returns correct user data matching expected schema', async ({ accountApiClient, testAccount }) => {
        const account = buildAccount();
        await accountApiClient.createAccount(account.name, account.email, account.password);
        testAccount.register(account.email, account.password);
 
        const result = await accountApiClient.getUserDetailByEmail(account.email);
        expect(result.responseCode, 'Should return 200').toBe(200);
        expect(result.user.email, 'Returned user email should match').toBe(account.email);
 
        const parsed = GetUserDetailResponseSchema.safeParse(result);
        expect(parsed.success, `Response should match expected schema. Errors: ${JSON.stringify(parsed.error?.issues)}`).toBe(true);
    });

});