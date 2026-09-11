import { type Locator, type Page, type Download } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PaymentPage extends BasePage {
    readonly title: Locator;
    readonly userNameOnCard: Locator;
    readonly cardNumber: Locator;
    readonly cardCVC: Locator;
    readonly cardExpiryMonth: Locator;
    readonly cardExpiryYear: Locator;
    readonly payAndConfirmBtn: Locator;
    readonly orderPlacedTitle: Locator;
    readonly downloadInvoiceBtn: Locator;
    readonly continueBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.getByRole('heading', { name: 'Payment' });
        this.userNameOnCard = page.getByTestId("name-on-card");
        this.cardNumber = page.getByTestId("card-number");
        this.cardCVC = page.getByTestId("cvc");
        this.cardExpiryMonth = page.getByTestId("expiry-month");
        this.cardExpiryYear = page.getByTestId("expiry-year");
        this.payAndConfirmBtn = page.getByTestId("pay-button");
        this.orderPlacedTitle = page.getByTestId('order-placed');
        this.downloadInvoiceBtn = page.getByRole('link', { name: 'Download Invoice' })
        this.continueBtn = page.getByTestId("continue-button");
    }

    async fillCreditCardData(nameOnCard: string, cardNumber: string, cardCVV: string, expiryMonth: string, expiryYear: string) {
        await this.userNameOnCard.fill(nameOnCard);
        await this.cardNumber.fill(cardNumber);
        await this.cardCVC.fill(cardCVV);
        await this.cardExpiryMonth.fill(expiryMonth);
        await this.cardExpiryYear.fill(expiryYear);
        await this.payAndConfirmBtn.click();
    }

    async downloadInvoice(): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadInvoiceBtn.click();
    return await downloadPromise;
}

}