import { type Locator, type Page } from "@playwright/test";

export class HomePage {
    readonly page: Page;
    readonly slider: Locator;

    constructor(page: Page) {
        this.page = page;
        this.slider = page.locator("#slider-carousel");
    }

    async open() {
        await this.page.goto("/");
        //await this.page.goto("/", { waitUntil: "domcontentloaded" });
        // console.log('Navigating to:', this.page.url());
        // await this.page.goto("/", { waitUntil: "domcontentloaded" });
    }

}