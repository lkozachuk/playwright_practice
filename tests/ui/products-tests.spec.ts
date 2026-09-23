import { test, expect } from "@playwright/test";
import { ProductsListPage } from "../../pages/ProductsListPage";
import { HomePage } from "../../pages/HomePage";
import { ProductsDetailsPage } from "../../pages/ProductDetailsPage";
import { AddedToCartModal } from "../../components/AddedToCartModal";
import { CartPage } from "../../pages/CartPage";
import { testData } from "../../test-data/testData";
import { generateRandomEmail } from "../../utils/random";

test.describe('Product listing and search', { tag: '@regression' }, () => {

    //Test case #9
    test('User can search a product by name', { tag: '@smoke' }, async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        const productsListPage = new ProductsListPage(page);

        await test.step('Open Products List page and search for a product', async () => {
            await productsListPage.open();
            await expect(productsListPage.productListTitle, 'Product list title should be "All Products"').toHaveText(testData.search.allProductsTitle);
            await productsListPage.searchProduct(testData.search.sleevelessDressProduct);
        });
        await test.step('Verify search results contain the searched product', async () => {
            await expect(productsListPage.productListTitle).toHaveText(testData.search.searchedProductsTitle);
            await expect(productsListPage.productList, 'Product list should not be empty after search').not.toBeEmpty();
            await expect(productsListPage.productList, 'There should be exactly one product displayed').toHaveCount(1);
            await expect(productsListPage.productNames.first()).toHaveText(
                new RegExp(testData.search.sleevelessDressProduct, "i")
            );
        });
    });

    //Test case #8
    test('User can open product details page and check product information', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const productsListPage = new ProductsListPage(page);

        await test.step('Open Products List page and search for a product top', async () => {
            await productsListPage.open();
            await expect(productsListPage.productListTitle, 'Product list title should be "All Products"').toHaveText(testData.search.allProductsTitle);
            await productsListPage.searchProduct("top");
        });

        await test.step('Verify search results contain the searched product details', async () => {
            await expect(productsListPage.productListTitle).toHaveText(testData.search.searchedProductsTitle);
            await expect(productsListPage.productList, 'Product list should not be empty after search').not.toHaveCount(0);
            await expect(productsListPage.productNames.first()).toHaveText(/Blue Top/i);
            await expect(productsListPage.productPrices.first()).toHaveText(/Rs. 500/i);
        });
        // Click on the first product to open its details page
        await productsListPage.viewDetailsProductList.first().click();
        const productDetailsPage = new ProductsDetailsPage(page);

        await test.step('Verify product details page displays correct product information', async () => {
            await expect(productDetailsPage.productDetails, 'Product details should be visible').toBeVisible();
            await expect(productDetailsPage.productName, 'Product name should be "Blue Top"').toHaveText(/Blue Top/i);
            const productCategoryText = await productDetailsPage.productCategory.textContent();
            console.log("Product category text: ", productCategoryText);
            await expect(productDetailsPage.productCategory, 'Product category should be Category: Women > Tops').toHaveText(/Category: Women > Tops/i);
            await expect(productDetailsPage.productPrice, 'Product price should be Rs. 500').toHaveText(/Rs. 500/i);
            await expect(productDetailsPage.productAvailability, 'Product availability should be Availability: In Stock').toHaveText(/Availability: In Stock/i);
            await expect(productDetailsPage.productCondition, 'Product condition should be Condition: New').toHaveText(/Condition: New/i);
            await expect(productDetailsPage.productBrand, 'Product brand should be Brand: Polo').toHaveText("Brand: Polo");
        });
    });

    //Test case #12
    test('User can add two products to cart and verify the cart total/price/quantity', { tag: '@smoke' }, async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        const productsListPage = new ProductsListPage(page);
        const modal = new AddedToCartModal(page);

        let firstProductName: string | null;
        let firstProductPrice: string | null;
        let secondProductName: string | null;
        let secondProductPrice: string | null;

        await test.step('Open Products List page', async () => {
            await productsListPage.open();
            await expect(productsListPage.productListTitle, 'Product list title should be "All Products"').toHaveText(testData.search.allProductsTitle);
            await expect(productsListPage.productList, 'Product list should not be empty after search').not.toHaveCount(0);
        });

        await test.step('Add first product (ID 1) to the cart', async () => {
            await expect(productsListPage.getAddToCartButtonById("1"), 'Add to cart button for the first product should be visible').toBeVisible();
            firstProductName = await productsListPage.productList.nth(0).locator("p").nth(1).textContent();
            const firstProduct = productsListPage.getProductCardByName(firstProductName || "First product name not found");
            await expect(firstProduct, 'First product should be visible').toBeVisible();
            firstProductPrice = await productsListPage.getProductPriceByName(firstProductName || "First product name not found").textContent();
            await productsListPage.getAddToCartButtonById("1").click();
        });

        await test.step('Verify first product added to cart modal and continue shopping', async () => {
            await modal.waitForOpen();
            await expect(modal.modalTitle).toHaveText("Added!");
            await expect(modal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
            await modal.clickContinueShopping();
            await expect(modal.modal).toBeHidden();
            await expect(productsListPage.productList, 'Product list should not be empty after search').not.toHaveCount(0);
        });

        await test.step('Add second product (ID 2) to the cart', async () => {
            secondProductName = await productsListPage.productList
                .nth(1)
                .locator("p")
                .nth(1)
                .textContent();
            const secondProduct = productsListPage.getProductCardByName(secondProductName || "Second product name not found");
            await expect(secondProduct, 'Second product should be visible').toBeVisible();
            secondProductPrice = await productsListPage.getProductPriceByName(secondProductName || "Second product name not found").textContent();
            await productsListPage.getAddToCartButtonById("2").click();
        });

        await test.step('Verify second product added to cart modal and navigate to Cart page', async () => {
            await modal.waitForOpen();
            await expect(modal.modalTitle).toHaveText("Added!");
            await expect(modal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
            await modal.clickViewCart();
        });

        await test.step('Verify cart page displays correct products, prices, quantities and totals', async () => {
            const cartPage = new CartPage(page);
            await expect(cartPage.cartTable, 'Cart table should be visible').toBeVisible();
            await expect(cartPage.cartTableRows, 'There should be exactly two products in the cart').toHaveCount(2);
            console.log("First product name: ", await cartPage.cartTableRowProductNames.nth(0).textContent());
            console.log("Second product name: ", await cartPage.cartTableRowProductNames.nth(1).textContent());
            await expect(cartPage.cartTableRowProductNames.nth(0), 'First product name in cart should match the first added product').toContainText(firstProductName || "First product name not found");
            await expect(cartPage.cartTableRowProductNames.nth(1), 'Second product name in cart should match the second added product').toContainText(secondProductName || "Second product name not found");

            await expect(cartPage.cartTableRowProductPrices.nth(0), 'Product price on Cart page should be the same as on the products page').toContainText(firstProductPrice || "First product price not found");
            await expect(cartPage.cartTableRowProductPrices.nth(1), 'Product price on Cart page should be the same as on the products page').toContainText(secondProductPrice || "Second product price not found");
            await expect(cartPage.cartTableRowProductQuantities.nth(0), 'First product quantity in cart should be 1').toHaveText("1");
            await expect(cartPage.cartTableRowProductQuantities.nth(1), 'Second product quantity in cart should be 1').toHaveText("1");
            await expect(cartPage.cartTableRowProductTotalPrices.nth(0), 'Product total price should be correct').toContainText(firstProductPrice || "First product price not found");
            await expect(cartPage.cartTableRowProductTotalPrices.nth(1), 'Product total price should be correct').toContainText(secondProductPrice || "Second product price not found");
        });
    });

    //Test case #17
    test('User can remove a product from cart', { tag: '@smoke' }, async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const productsListPage = new ProductsListPage(page);
        const modal = new AddedToCartModal(page);

        let firstProductName: string | null;
        let firstProductPrice: string | null;
        let secondProductName: string | null;
        let secondProductPrice: string | null;

        await test.step('Open Products List page', async () => {
            await productsListPage.open();
            await expect(productsListPage.productListTitle, 'Product list title should be "All Products"').toHaveText(testData.search.allProductsTitle);
            await expect(productsListPage.productList, 'Product list should not be empty after search').not.toHaveCount(0);
        });

        await test.step('Add first product (ID 2) to the cart', async () => {
            await expect(productsListPage.getAddToCartButtonById("2"), 'Add to cart button for the first product should be visible').toBeVisible();
            firstProductName = await productsListPage.productList
                .nth(1)
                .locator("p")
                .nth(1)
                .textContent();
            const firstProduct = productsListPage.getProductCardByName(firstProductName || "First product name not found");
            await expect(firstProduct, 'First product should be visible').toBeVisible();
            firstProductPrice = await productsListPage.getProductPriceByName(firstProductName || "First product name not found").textContent();
            await productsListPage.getAddToCartButtonById("2").click();
        });

        await test.step('Verify first product added to cart modal and continue shopping', async () => {
            await modal.waitForOpen();
            await expect(modal.modalTitle).toHaveText("Added!");
            await expect(modal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
            await modal.clickContinueShopping();
            await expect(modal.modal).toBeHidden();
        });

        await test.step('Add second product (ID 3) to the cart', async () => {
            await expect(productsListPage.productList, 'Product list should not be empty after search').not.toHaveCount(0);
            secondProductName = await productsListPage.productList
                .nth(2)
                .locator("p")
                .nth(1)
                .textContent();
            const secondProduct = productsListPage.getProductCardByName(secondProductName || "Second product name not found");
            await expect(secondProduct, 'Second product should be visible').toBeVisible();
            secondProductPrice = await productsListPage.getProductPriceByName(secondProductName || "Second product name not found").textContent();
            await productsListPage.getAddToCartButtonById("3").click();
        });

        await test.step('Verify second product added to cart modal and navigate to Cart page', async () => {
            await modal.waitForOpen();
            await expect(modal.modalTitle).toHaveText("Added!");
            await expect(modal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
            await modal.clickViewCart();
        });

        const cartPage = new CartPage(page);

        await test.step('Verify cart page displays correct products, prices, quantities and totals', async () => {
            await expect(cartPage.cartTable, 'Cart table should be visible').toBeVisible();
            await expect(cartPage.cartTableRows, 'There should be exactly two products in the cart').toHaveCount(2);
            console.log("First product name: ", await cartPage.cartTableRowProductNames.nth(0).textContent());
            console.log("Second product name: ", await cartPage.cartTableRowProductNames.nth(1).textContent());
            await expect(cartPage.cartTableRowProductNames.nth(0), 'First product name in cart should match the first added product').toContainText(firstProductName || "First product name not found");
            await expect(cartPage.cartTableRowProductNames.nth(1), 'Second product name in cart should match the second added product').toContainText(secondProductName || "Second product name not found");

            await expect(cartPage.cartTableRowProductPrices.nth(0), 'Product price on Cart page should be the same as on the products page').toContainText(firstProductPrice || "First product price not found");
            await expect(cartPage.cartTableRowProductPrices.nth(1), 'Product price on Cart page should be the same as on the products page').toContainText(secondProductPrice || "Second product price not found");
            await expect(cartPage.cartTableRowProductQuantities.nth(0), 'First product quantity in cart should be 1').toHaveText("1");
            await expect(cartPage.cartTableRowProductQuantities.nth(1), 'Second product quantity in cart should be 1').toHaveText("1");
            await expect(cartPage.cartTableRowProductTotalPrices.nth(0), 'Product total price should be correct').toContainText(firstProductPrice || "First product price not found");
            await expect(cartPage.cartTableRowProductTotalPrices.nth(1), 'Product total price should be correct').toContainText(secondProductPrice || "Second product price not found");
        });

        await test.step('Remove the second product from the cart and verify the remaining product details', async () => {
            await cartPage.cartTableRowRemoveButtons.nth(1).click();
            await expect(cartPage.cartTableRows, 'There should be exactly one product in the cart after removal').toHaveCount(1);
            await expect(cartPage.cartTableRowProductNames.nth(0), 'Remaining product name in cart should match the first added product').toContainText(firstProductName || "First product name not found");
            await expect(cartPage.cartTableRowProductPrices.nth(0), 'Remaining product price on Cart page should be the same as on the products page').toContainText(firstProductPrice || "First product price not found");
            await expect(cartPage.cartTableRowProductQuantities.nth(0), 'Remaining product quantity in cart should be 1').toHaveText("1");
            await expect(cartPage.cartTableRowProductTotalPrices.nth(0), 'Remaining product total price should be correct').toContainText(firstProductPrice || "First product price not found");
        });
    });

    //Test case #19
    test('User can view brand products', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const productsListPage = new ProductsListPage(page);

        await test.step('Open Products List page and scroll to Brands section', async () => {
            await productsListPage.open();
            await expect(productsListPage.productListTitle, 'Product list title should be "All Products"').toHaveText(testData.search.allProductsTitle);
            await page.evaluate(() => window.scrollBy(0, 700));
            await expect(productsListPage.productList, 'User should see products list').not.toHaveCount(0);
            await expect(productsListPage.brandsSection, 'User should see brands section').toContainText("Brands");
        });

        await test.step('Select Polo brand and verify filtered products', async () => {
            await productsListPage.selectBrand("Polo");
            await productsListPage.closeGoogleVignette();
            await expect(productsListPage.productListTitle, 'Product list title should be "Brand - Polo Products"').toHaveText(testData.products.poloProductsTitle);
            await expect(productsListPage.productList, 'User should see products list').not.toHaveCount(0);
        });

        await test.step('Select Madame brand and verify filtered products', async () => {
            await productsListPage.selectBrand("Madame");
            await productsListPage.closeGoogleVignette();
            await expect(productsListPage.productListTitle, 'Product list title should be "Brand - Madame Products"').toHaveText(testData.products.madameProductsTitle);
            await expect(productsListPage.productList, 'User should see products list').not.toHaveCount(0);
        });
    });

    //Test case #21
    test('User can add a review to a product', { tag: '@smoke' }, async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();
        const email = generateRandomEmail();

        const productsListPage = new ProductsListPage(page);
        const productDetailsPage = new ProductsDetailsPage(page);

        await test.step('Open Products List page and navigate to first product details', async () => {
            await productsListPage.open();
            await expect(productsListPage.productListTitle, 'Product list title should be "All Products"').toHaveText(testData.search.allProductsTitle);
            await productsListPage.viewDetailsProductList.first().click();
        });

        await test.step('Scroll to review form and submit a review', async () => {
            await page.evaluate(() => window.scrollBy(0, 500));
            await page.waitForFunction(() => window.scrollY >= 500);
            await productDetailsPage.closeGoogleVignette();
            await expect(productDetailsPage.writeYourReviewTitle, 'Write Your Review title should be visible').toBeVisible();
            await expect(productDetailsPage.writeYourReviewTitle, 'Write Your Review title should be visible').toHaveText("Write Your Review");
            await productDetailsPage.leaveProductReview(testData.products.reviewName, email, testData.products.reviewDescription);
        });

        await expect(productDetailsPage.page.getByText("Thank you for your review.")).toBeVisible();

    });

});