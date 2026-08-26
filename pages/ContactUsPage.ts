import { type Locator, type Page } from "@playwright/test";

export class ContactUsPage {
    readonly page: Page
    readonly contactForm: Locator;
    readonly getInTouchTitle: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly subjectInput: Locator;
    readonly messageTextarea: Locator;
    readonly fileUploadInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly homeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.contactForm = page.locator("#form-section #contact-us-form");
        this.getInTouchTitle = page.getByRole('heading', { name: 'Get In Touch' });
        this.nameInput = page.getByPlaceholder("Name");
        this.emailInput = this.contactForm.getByPlaceholder("Email");
        this.subjectInput = page.getByPlaceholder("Subject");
        this.messageTextarea = page.getByPlaceholder("Your Message Here");
        this.fileUploadInput = this.contactForm.locator("input[type='file']");
        this.submitButton = this.contactForm.locator("[data-qa='submit-button']");
        this.successMessage = page.locator(".status.alert.alert-success");
        this.homeButton = page.locator(".btn-success");
    }

    async open() {
        await this.page.goto("/contact_us");
    }

    async closeAdvertisement() {
        for (const frame of this.page.frames()) {
            const closeButton = frame.getByText('Close', { exact: true });

            if (await closeButton.count() > 0) {
                if (await closeButton.isVisible()) {
                    await closeButton.click();
                }
                return;
            }
        }
    }


}