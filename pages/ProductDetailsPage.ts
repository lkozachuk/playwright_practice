import { type Locator, type Page } from "@playwright/test";

export class ProductsDetailsPage {
    readonly page: Page;
    readonly productDetails: Locator;
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productDetails = page.locator(".product-information");
        this.productName = page.locator(".product-information h2");
        this.productCategory = page.locator(".product-information p:has-text('Category')");
        this.productPrice = page.locator(".product-information span span");
        this.productAvailability = page.locator(".product-information p:has-text('Availability')");
        this.productCondition = page.locator(".product-information p:has-text('Condition')");
        this.productBrand = page.locator(".product-information p:has-text('Brand')");
    }

}