import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsDetailsPage extends BasePage{
    readonly productDetails: Locator;
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;
    readonly inputQuantity: Locator;
    readonly addToCartBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.productDetails = page.locator(".product-information");
        this.productName = page.locator(".product-information h2");
        this.productCategory = page.locator(".product-information p:has-text('Category')");
        this.productPrice = page.locator(".product-information span span");
        this.productAvailability = page.locator(".product-information p:has-text('Availability')");
        this.productCondition = page.locator(".product-information p:has-text('Condition')");
        this.productBrand = page.locator(".product-information p:has-text('Brand')");
        this.inputQuantity = page.locator("#quantity");
        this.addToCartBtn = page.getByRole("button", { name: "Add to cart" });
    }

}