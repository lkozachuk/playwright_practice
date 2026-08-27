import { type Locator, type Page } from "@playwright/test";

export class AccountCreatedPage {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly continueBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.getByTestId("account-created");
        this.continueBtn = page.getByTestId("continue-button");
    }

}