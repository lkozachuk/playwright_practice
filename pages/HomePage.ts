import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
    readonly slider: Locator;
    readonly productsList: Locator;
    readonly viewDetailsProductList: Locator;

    constructor(page: Page) {
        super(page);
        this.slider = page.locator("#slider-carousel");
        this.productsList = page.locator(".product-image-wrapper");
        this.viewDetailsProductList = this.productsList.locator(".choose a");
    }

    async open() {
        await this.page.goto("/");
    }

    getLoggedInText(name: string): Locator {
        return this.page.getByText(`Logged in as ${name}`);
    }

    async logoutFromAccount(){
        await this.page.goto("/logout");
    }

    getProductCardByName(productName: string): Locator {
        return this.productsList.filter({ hasText: productName }).first();
    }

    getProductPriceByName(productName: string): Locator {
        return this.getProductCardByName(productName).locator(".productinfo h2");
    }
}