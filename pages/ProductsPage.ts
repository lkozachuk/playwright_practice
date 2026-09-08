import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly productList: Locator;
    readonly productNames: Locator;
    readonly productListTitle: Locator;
    readonly productPrices: Locator;
    readonly viewDetailsProductList: Locator;
    readonly menCategory: Locator;
    readonly menJeansSubcategory: Locator;
    readonly brandsSection: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByPlaceholder("Search Product");
        this.searchButton = page.locator("#submit_search");
        this.productList = page.locator(".product-image-wrapper");
        this.productNames = this.productList.locator(".productinfo p");
        this.productListTitle = page.locator("h2.title");
        this.productPrices = this.productList.locator(".productinfo h2");
        this.viewDetailsProductList = this.productList.locator(".choose a");
        this.menCategory = page.locator('a[href="#Men"]');
        this.menJeansSubcategory = page.getByRole('link', { name: 'Jeans' });
        this.brandsSection = page.locator('.brands_products');
    }

    async open() {
        await this.page.goto("/products");
    }

    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    getProductCardByName(productName: string): Locator {
        return this.productList.filter({ hasText: productName }).first();
    }

    getProductNameByName(productName: string): Locator {
        return this.getProductCardByName(productName).locator(".productinfo p").nth(1);
    }

    getProductPriceByName(productName: string): Locator {
        return this.getProductCardByName(productName).locator(".productinfo h2");
    }

    getAddToCartButtonById(productId: string): Locator {
        return this.page.locator(`[data-product-id="${productId}"]`).first();
    }

    async selectBrand(brandName: string) {
        const brandLink = this.brandsSection.getByRole('link', { name: brandName });
        await brandLink.click();
    }
}