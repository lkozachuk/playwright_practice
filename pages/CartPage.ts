import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
    readonly cartTable: Locator;
    readonly cartTableRows: Locator;
    readonly cartTableRowProductNames: Locator;
    readonly cartTableRowProductPrices: Locator;
    readonly cartTableRowProductQuantities: Locator;
    readonly cartTableRowProductTotalPrices: Locator;
    readonly cartTableRowRemoveButtons: Locator;
    readonly cartEmptyInfo: Locator;
    readonly cartProceedCheckout: Locator;

    constructor(page: Page) {
        super(page);
        this.cartTable = page.locator("#cart_info_table");
        this.cartTableRows = this.cartTable.locator("tbody tr");
        this.cartTableRowProductNames = this.cartTableRows.locator("td.cart_description h4 a");
        this.cartTableRowProductPrices = this.cartTableRows.locator("td.cart_price p");
        this.cartTableRowProductQuantities = this.cartTableRows.locator("button");
        this.cartTableRowProductTotalPrices = this.cartTableRows.locator(".cart_total_price");
        this.cartTableRowRemoveButtons = this.cartTableRows.locator("td.cart_delete a");
        this.cartEmptyInfo = page.locator("#empty_cart");
        this.cartProceedCheckout = page.getByText("Proceed To Checkout");
    }

    async open() {
        await this.page.goto("/view_cart");
    }

}