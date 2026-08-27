import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ContactUsPage extends BasePage {
    readonly contactForm: Locator;
    readonly getInTouchTitle: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly subjectInput: Locator;
    readonly messageTextArea: Locator;
    readonly fileUploadInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly homeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.contactForm = page.locator("#form-section #contact-us-form");
        this.getInTouchTitle = page.getByRole('heading', { name: 'Get In Touch' });
        this.nameInput = page.getByPlaceholder("Name");
        this.emailInput = this.contactForm.getByPlaceholder("Email");
        this.subjectInput = page.getByPlaceholder("Subject");
        this.messageTextArea = page.getByPlaceholder("Your Message Here");
        this.fileUploadInput = this.contactForm.locator("input[type='file']");
        this.submitButton = this.contactForm.locator("[data-qa='submit-button']");
        this.successMessage = page.locator(".status.alert.alert-success");
        this.homeButton = page.locator(".btn-success");
    }

    async open() {
        await this.page.goto("/contact_us");
    }

}