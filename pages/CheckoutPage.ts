import { type Locator, type Page } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;
    readonly title: Locator;
    readonly deliveryAddress: Locator;
    readonly billingAddress: Locator;
    readonly orderCommentTextarea: Locator;
    readonly placeOrderBtn: Locator;
    readonly orderTitle: Locator;
    readonly cartProductRows: Locator;
    readonly grandTotalPrice: Locator;
    readonly cartProductsPrice: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByRole('heading', { name: 'Address Details' });
        this.deliveryAddress = page.locator('#address_delivery');
        this.billingAddress = page.locator('#address_invoice');
        this.orderCommentTextarea = page.locator(".form-control");
        this.orderTitle = page.getByRole('heading', { name: 'Review Your Order' });
        this.placeOrderBtn = page.getByRole("link", { name: "Place Order" });
        this.cartProductRows = page.locator('tr[id^="product-"]');
        this.cartProductsPrice = page.locator('tr[id^="product-"] .cart_total_price');
        this.grandTotalPrice = page.locator('#cart_info tbody tr').last().locator('.cart_total_price');
    }

    async countProductsPrice(): Promise<number> {
        const productTotalTexts = await this.cartProductsPrice.allTextContents();
        const productTotals = productTotalTexts.map(text => parseInt(text.replace(/[^0-9]/g, "")));
        const sumOfProductTotals = productTotals.reduce((sum, price) => sum + price, 0);
        return sumOfProductTotals;
    }

}