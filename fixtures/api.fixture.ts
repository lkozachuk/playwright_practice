import { test as base, expect } from '@playwright/test';
import { AccountApiClient } from '../api/AccountApiClient';

type ApiFixtures = {
    accountApiClient: AccountApiClient;
    testAccount: { register: (email: string, password: string) => void };
};

export const test = base.extend<ApiFixtures>({
    accountApiClient: async ({ request }, use) => {
        await use(new AccountApiClient(request));
    },

    // Auto-cleanup: call testAccount.register(email, password) right after
    // creating an account in a test, and it gets deleted automatically after
    // the test finishes - pass or fail.
    testAccount: async ({ accountApiClient }, use) => {
        let createdEmail: string | null = null;
        let createdPassword: string | null = null;

        const register = (email: string, password: string) => {
            createdEmail = email;
            createdPassword = password;
        };

        await use({ register });

        if (createdEmail && createdPassword) {
            await accountApiClient.deleteAccount(createdEmail, createdPassword);
        }
    },
});

export { expect };