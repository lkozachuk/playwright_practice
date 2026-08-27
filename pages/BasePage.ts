import { type Page } from "@playwright/test";

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async closeAdvertisement() {
        for (const frame of this.page.frames()) {
            const closeButton = frame.getByText('Close', { exact: true });

            if (await closeButton.count() > 0) {
                if (await closeButton.isVisible()) {
                    await closeButton.click();
                }
                return;
            }
        }
    }
}