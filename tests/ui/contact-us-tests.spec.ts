import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { ContactUsPage } from "../../pages/ContactUsPage";
import { testData } from "../../test-data/testData";

test.describe('Contact Us page to leave a feedback', () => {
    test.use({
        baseURL: 'https://automationexercise.com/',
    });


    test('User can submit contact form with file upload', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        // Navigate to the Contact Us page
        const contactUsPage = new ContactUsPage(page);
        await contactUsPage.open();
        await expect(contactUsPage.getInTouchTitle, 'Get In Touch title should be visible').toHaveText("Get In Touch");

        await (contactUsPage.nameInput.fill(testData.contactForm.name));
        await (contactUsPage.emailInput.fill(testData.contactForm.email));
        await (contactUsPage.subjectInput.fill(testData.contactForm.subject));
        await (contactUsPage.messageTextArea.fill(testData.contactForm.message));
        await contactUsPage.fileUploadInput.setInputFiles("test-data/test-file.txt");

        page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.accept();
        });

        await contactUsPage.submitButton.click();
        await expect(contactUsPage.successMessage, 'Success message should be visible after form submission').toHaveText(testData.messages.contactUsSuccessMsg);
        await expect(contactUsPage.homeButton, 'Home button should be visible after form submission').toBeVisible();
        await expect(contactUsPage.nameInput, 'Name input should not be visible').not.toBeVisible();
        await expect(contactUsPage.emailInput, 'Email input should not be visible').not.toBeVisible();

        await contactUsPage.homeButton.click();
        await contactUsPage.closeAdvertisement();

        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
    });

});