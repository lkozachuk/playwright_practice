import { type Locator, type Page } from "@playwright/test";

export class AddedToCartModal {
    readonly page: Page;
    readonly modal: Locator;
    readonly modalTitle: Locator;
    readonly modalDescription: Locator;
    readonly continueShoppingButton: Locator;
    readonly viewCartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.locator("#cartModal");
        this.modalTitle = this.modal.locator(".modal-content h4");
        this.modalDescription = this.modal.locator(".modal-body p").nth(0);
        this.continueShoppingButton = this.modal.locator(".close-modal");
        this.viewCartButton = this.modal.locator(".modal-body a");
    }

    async waitForOpen() {
        await this.modal.waitFor({ state: "visible" });
    }

    async clickContinueShopping() {
        await this.continueShoppingButton.click();
    }

    async clickViewCart() {
        await this.viewCartButton.click();
    }

}