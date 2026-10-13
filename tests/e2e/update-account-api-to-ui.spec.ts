import { test, expect } from '../../fixtures/index';
import { buildAccount } from '../../factories/accountFactory';

test.describe('Account updated via API reflects in UI', { tag: '@regression' }, () => {

    test('Account name updated via API is shown after logging in via UI', async ({ accountApiClient, testAccount, homePage, loginPage }) => {
        const account = buildAccount();

        await test.step('Create account via API', async () => {
            await accountApiClient.createAccount(account.name, account.email, account.password);
            testAccount.register(account.email, account.password);
        });

        await test.step('Update account first name via API', async () => {
            const updatedAccount = buildAccount({
                email: account.email,
                password: account.password,
                name: 'UpdatedFirstName',
            });
            const result = await accountApiClient.updateAccount(updatedAccount);
            expect(result.responseCode, 'Account should be updated successfully').toBe(200);
        });

        await test.step('Log in via UI and verify updated name is shown', async () => {
            await homePage.open();
            await loginPage.open();
            await loginPage.login(account.email, account.password);
            await expect(homePage.getLoggedInText('UpdatedFirstName'), 'UI should reflect name updated via API').toBeVisible();
        });
    });

});