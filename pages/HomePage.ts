import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
    readonly slider: Locator;
    readonly productsList: Locator;
    readonly viewDetailsProductList: Locator;
    readonly leftSidebar: Locator;
    readonly categoryProductsList: Locator;
    readonly womenCategory: Locator;
    readonly womenDressSubcategory: Locator;
    readonly recommendedItems: Locator;
    readonly activeRecommendedItem: Locator;
    readonly addToCartButtonInRecommendedItems: Locator;
    readonly productPriceInRecommendedItems: Locator;
    readonly productNameInRecommendedItems: Locator;

    constructor(page: Page) {
        super(page);
        this.slider = page.locator("#slider-carousel");
        this.productsList = page.locator(".product-image-wrapper");
        this.viewDetailsProductList = this.productsList.locator(".choose a");
        this.leftSidebar = page.locator(".left-sidebar");
        this.categoryProductsList = page.locator(".category-products");
        this.womenCategory = page.getByRole('link', { name: 'Women' });
        this.womenDressSubcategory = page.locator('#Women').getByRole('link', { name: 'Dress' });
        this.recommendedItems = page.locator('.recommended_items');
        this.activeRecommendedItem = this.recommendedItems.locator('.item.active');
        this.addToCartButtonInRecommendedItems = this.activeRecommendedItem.locator('.add-to-cart');
        this.productPriceInRecommendedItems = this.activeRecommendedItem.locator('h2');
        this.productNameInRecommendedItems = this.activeRecommendedItem.locator('p');
    }

    async open() {
        await this.page.goto("/");
    }

    getLoggedInText(name: string): Locator {
        return this.page.getByText(`Logged in as ${name}`);
    }

    async logoutFromAccount() {
        await this.page.goto("/logout");
    }

    getProductCardByName(productName: string): Locator {
        return this.productsList.filter({ hasText: productName }).first();
    }

    getProductPriceByName(productName: string): Locator {
        return this.getProductCardByName(productName).locator(".productinfo h2");
    }

    addToCartProductById(productId: string): Locator {
        return this.page.locator(`[data-product-id="${productId}"]`).first();
    }

    async addtoCartVisibleRecommendedItem() {
        await this.addToCartButtonInRecommendedItems.first().click();
    }
}