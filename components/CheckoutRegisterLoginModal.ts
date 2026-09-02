import { type Locator, type Page } from "@playwright/test";

export class CheckoutRegisterLoginModal {
    readonly page: Page;
    readonly modal: Locator;
    readonly modalTitle: Locator;
    readonly modalDescription: Locator;
    readonly registerLoginLink: Locator;
    readonly continueOnCartBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.locator(".modal-dialog");
        this.modalTitle = this.modal.locator(".modal-title");
        this.modalDescription = this.modal.locator(".modal-body p").nth(0);
        this.registerLoginLink = page.getByText("Register / Login", { exact: true });
        this.continueOnCartBtn = page.getByRole("button", { name: "Continue On Cart" });
    }

    async waitForOpen() {
        await this.modal.waitFor({ state: "visible" });
    }

    async clickRegisterLoginLink() {
        await this.registerLoginLink.click();
    }

    async clickContinueOnCart() {
        await this.continueOnCartBtn.click();
    }

}