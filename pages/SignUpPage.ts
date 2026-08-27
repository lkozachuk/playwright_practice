import { type Locator, type Page } from "@playwright/test";

export class SignUpPage {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly genderMr: Locator;
    readonly genderMs: Locator;
    readonly name: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly birthDay: Locator
    readonly birthMonth: Locator;
    readonly birthYear: Locator;
    readonly newsletterSignUp: Locator;
    readonly receiveSpecialOffer: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly company: Locator;
    readonly address: Locator;
    readonly country: Locator;
    readonly state: Locator;
    readonly city: Locator;
    readonly zipCode: Locator;
    readonly mobileNumber: Locator;
    readonly createAccountBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.getByText("Enter Account Information");
        this.genderMr = page.locator("#uniform-id_gender1");
        this.genderMs = page.locator("#uniform-id_gender2");
        this.name = page.getByTestId("name");
        this.email = page.getByTestId("email");
        this.password = page.getByTestId("password");
        this.birthDay = page.getByTestId("days");
        this.birthMonth = page.getByTestId("months");
        this.birthYear = page.getByTestId("years");
        this.newsletterSignUp = page.getByRole("checkbox", { name: "Sign up for our newsletter!" });
        this.receiveSpecialOffer = page.getByRole("checkbox", { name: "Receive special offers from our partners!" });
        this.firstName = page.getByTestId("first_name");
        this.lastName = page.getByTestId("last_name");
        this.company = page.getByTestId("company");
        this.address = page.getByTestId("address");
        this.country = page.getByTestId("country");
        this.state = page.getByTestId("state");
        this.city = page.getByTestId("city");
        this.zipCode = page.getByTestId("zipcode");
        this.mobileNumber = page.getByTestId("mobile_number");
        this.createAccountBtn = page.getByTestId("create-account");
    }

    async fillInAccounInformation(password: string, birthDay: string, birthMonth: string, birthYear: string) {
        await this.genderMr.click();
        await this.password.fill(password);
        await this.page.evaluate(() => window.scrollBy(0, 200));
        await this.birthDay.selectOption(birthDay);
        await this.birthMonth.selectOption(birthMonth);
        await this.birthYear.selectOption(birthYear);
        await this.newsletterSignUp.click();
        await this.receiveSpecialOffer.click();
    }

    async fillInAddressInformation(firstName: string, lastName: string, companyName: string, address: string, country: string, state: string, city: string, zipCode: string, mobileNumber: string) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.company.fill(companyName);
        await this.address.fill(address);
        await this.country.selectOption(country);
        await this.state.fill(state);
        await this.city.fill(city);
        await this.page.evaluate(() => window.scrollBy(0, 500));
        await this.zipCode.fill(zipCode);
        await this.mobileNumber.fill(mobileNumber);
        await this.createAccountBtn.click();
    }


}


