import { type Locator, type Page } from "@playwright/test";

export class TestCasesPage {
    readonly page: Page;
    readonly title: Locator;
    readonly subTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByRole('heading', { name: 'Test Cases', exact: true });
        this.subTitle = page.getByText('Below is the list of test Cases', { exact: false });
    }

    async open() {
        await this.page.goto("/test_cases");
    }

}

