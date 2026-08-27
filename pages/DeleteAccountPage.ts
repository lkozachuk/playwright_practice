import { type Locator, type Page } from "@playwright/test";

export class DeleteAccountPage {
    readonly page: Page;
    readonly title: Locator;
    readonly continueBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId("account-deleted");
        this.continueBtn = page.getByTestId("continue-button");
    }

    async open() {
        await this.page.goto("/delete_account");
    }


}