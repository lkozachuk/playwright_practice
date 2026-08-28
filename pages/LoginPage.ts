import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly signUpEmailInput: Locator;
    readonly signUpButton: Locator;
    readonly loginEmailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly newUserSignUpTitle: Locator;
    readonly loginToAccountTitle: Locator;
    readonly errorLoginMsg: Locator
    readonly errorSignUpMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByTestId("signup-name");
        this.signUpEmailInput = page.getByTestId("signup-email");
        this.signUpButton = page.getByTestId("signup-button");
        this.loginEmailInput = page.getByTestId("login-email");
        this.passwordInput = page.getByTestId("login-password");
        this.loginButton = page.getByTestId("login-button");
        this.newUserSignUpTitle = page.locator(".signup-form h2");
        this.loginToAccountTitle = page.locator(".login-form h2");
        this.errorLoginMsg = page.getByText("Your email or password is incorrect!");
        this.errorSignUpMsg = page.getByText("Email Address already exist!");
    }

    async open() {
        await this.page.goto("/login");
    }

    async login(username: string, password: string) {
        await this.loginEmailInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async signUp(name: string, email: string) {
        await this.usernameInput.fill(name);
        await this.signUpEmailInput.fill(email);
        await this.signUpButton.click();
    }
}