// fixtures/api.fixture.ts
import { test as base, expect } from '@playwright/test';
import { AccountApiClient } from '../api/AccountApiClient';

type ApiFixtures = {
    accountApiClient: AccountApiClient;
};

export const test = base.extend<ApiFixtures>({
    accountApiClient: async ({ request }, use) => {
        await use(new AccountApiClient(request));
    },
});

export { expect };