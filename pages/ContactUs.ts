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
        this.contactForm = page.locator("#contact-form");
        this.getInTouchTitle = page.locator(".contact-form .title");
        this.nameInput = this.contactForm.locator("input[name='name']");
        this.emailInput = this.contactForm.locator("input[name='email']");
        this.subjectInput = this.contactForm.locator("input[name='subject']");
        this.messageTextarea = this.contactForm.locator("textarea[name='message']");
        this.fileUploadInput = this.contactForm.locator("input[type='file']");
        this.submitButton = this.contactForm.locator("[data-qa='submit-button']");
        this.successMessage = page.locator(".status.alert.alert-success");
        this.homeButton = page.locator(".btn-success");
    }

    async open() {
        await this.page.goto("/contact_us");
    }

}