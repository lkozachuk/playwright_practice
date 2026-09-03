import { type Locator, type Page } from "@playwright/test";

export class BasePage {
    readonly page: Page;
    readonly subscriptionFieldName: Locator;
    readonly subscriptionInput: Locator;
    readonly subscriptionBtn: Locator;
    readonly subscribeSuccessMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.subscriptionFieldName = page.getByText("Subscription");
        this.subscriptionInput = page.getByPlaceholder("Your email address");
        this.subscriptionBtn = page.locator("#subscribe");
        this.subscribeSuccessMsg = page.locator('.alert-success');
    }

    async closeAdvertisement() {
        for (const frame of this.page.frames()) {
            const closeButton = frame.getByText('Close', { exact: true }).first();

            try {
                await closeButton.waitFor({
                    state: 'visible',
                    timeout: 3000
                });

                await closeButton.click();
                return;
            } catch {
                // No close button in this frame — continue
            }
        }
    }

}