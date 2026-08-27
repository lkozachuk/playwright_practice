import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
    readonly slider: Locator;

    constructor(page: Page) {
        super(page);
        this.slider = page.locator("#slider-carousel");
    }

    async open() {
        await this.page.goto("/");
    }

    getLoggedInText(name: string): Locator {
        return this.page.getByText(`Logged in as ${name}`);
    }

}