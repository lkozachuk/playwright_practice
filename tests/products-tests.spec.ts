import { test, expect } from "@playwright/test";
import { ProductsPage } from "../pages/ProductsPage";
import { HomePage } from "../pages/HomePage";
import { ProductsDetailsPage } from "../pages/ProductDetailsPage";
import { AddedToCartModal } from "../components/AddedToCartModal";
import { CartPage } from "../pages/CartPage";
import { testData } from "../test-data/testData";

test.describe('Product listing and search', () => {
    test.use({
        baseURL: 'https://automationexercise.com/',
    });

    test('user can search a product by name', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const productsPage = new ProductsPage(page);
        await productsPage.open();
        await expect(productsPage.productListTitle, 'Product list title should be "All Products"').toHaveText(testData.search.allProductsTitle);
        await productsPage.searchProduct(testData.search.sleevelessDressProduct);
        await expect(productsPage.productListTitle).toHaveText(testData.search.searchedProductsTitle);
        await expect(productsPage.productList, 'Product list should not be empty after search').not.toBeEmpty();
        await expect(productsPage.productList, 'There should be exactly one product displayed').toHaveCount(1);
        await expect(productsPage.productNames.first()).toHaveText(
            new RegExp(testData.search.sleevelessDressProduct, "i")
        );
    });

    test('user can open product details page and check product information', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const productsPage = new ProductsPage(page);
        await productsPage.open();
        await expect(productsPage.productListTitle, 'Product list title should be "All Products"').toHaveText("All Products");
        await productsPage.searchProduct("top");
        await expect(productsPage.productListTitle).toHaveText("Searched Products");
        await expect(productsPage.productList, 'Product list should not be empty after search').not.toHaveCount(0);
        await expect(productsPage.productNames.first()).toHaveText(/Blue Top/i);
        await expect(productsPage.productPrices.first()).toHaveText(/Rs. 500/i);

        // Click on the first product to open its details page
        await productsPage.viewDetailsProductList.first().click();

        const productDetailsPage = new ProductsDetailsPage(page);
        await expect(productDetailsPage.productDetails, 'Product details should be visible').toBeVisible();

        // Verify that the product details page is displayed with correct information
        await expect(productDetailsPage.productName, 'Product name should be "Blue Top"').toHaveText(/Blue Top/i);
        const productCategoryText = await productDetailsPage.productCategory.textContent();
        console.log("Product category text: ", productCategoryText);
        await expect(productDetailsPage.productCategory, 'Product category should be Category: Women > Tops').toHaveText(/Category: Women > Tops/i);
        await expect(productDetailsPage.productPrice, 'Product price should be Rs. 500').toHaveText(/Rs. 500/i);
        await expect(productDetailsPage.productAvailability, 'Product availability should be Availability: In Stock').toHaveText(/Availability: In Stock/i);
        await expect(productDetailsPage.productCondition, 'Product condition should be Condition: New').toHaveText(/Condition: New/i);
        await expect(productDetailsPage.productBrand, 'Product brand should be Brand: Polo').toHaveText("Brand: Polo");
    });

    test('user can add two products to cart and verify the cart total/price/quantity', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const productsPage = new ProductsPage(page);
        await productsPage.open();
        await expect(productsPage.productListTitle, 'Product list title should be "All Products"').toHaveText("All Products");
        await expect(productsPage.productList, 'Product list should not be empty after search').not.toHaveCount(0);
        await expect(productsPage.getAddToCartButtonById("1"), 'Add to cart button for the first product should be visible').toBeVisible();

        const firstProductName = await productsPage.productList
            .nth(0)
            .locator("p")
            .nth(1)
            .textContent();
        const firstProduct = productsPage.getProductCardByName(firstProductName || "First product name not found");
        await expect(firstProduct, 'First product should be visible').toBeVisible();
        const firstProductPrice = await productsPage.getProductPriceByName(firstProductName || "First product name not found").textContent();

        await productsPage.getAddToCartButtonById("1").click();

        const modal = new AddedToCartModal(page);
        await modal.waitForOpen();
        await expect(modal.modalTitle).toHaveText("Added!");
        await expect(modal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
        await modal.clickContinueShopping();
        await expect(modal.modal).toBeHidden();
        await expect(productsPage.productList, 'Product list should not be empty after search').not.toHaveCount(0);

        const secondProductName = await productsPage.productList
            .nth(1)
            .locator("p")
            .nth(1)
            .textContent();
        const secondProduct = productsPage.getProductCardByName(secondProductName || "Second product name not found");
        await expect(secondProduct, 'Second product should be visible').toBeVisible();
        const secondProductPrice = await productsPage.getProductPriceByName(secondProductName || "Second product name not found").textContent();
        await productsPage.getAddToCartButtonById("2").click();

        await modal.waitForOpen();
        await expect(modal.modalTitle).toHaveText("Added!");
        await expect(modal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
        await modal.clickViewCart();

        // Verify the cart page displays the correct total, price, and quantity for the two products
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

    test('user can remove a product from cart', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.slider, 'Slider should be visible on the Home page').toBeVisible();

        const productsPage = new ProductsPage(page);
        await productsPage.open();
        await expect(productsPage.productListTitle, 'Product list title should be "All Products"').toHaveText("All Products");
        await expect(productsPage.productList, 'Product list should not be empty after search').not.toHaveCount(0);
        await expect(productsPage.getAddToCartButtonById("2"), 'Add to cart button for the first product should be visible').toBeVisible();

        const firstProductName = await productsPage.productList
            .nth(1)
            .locator("p")
            .nth(1)
            .textContent();
        const firstProduct = productsPage.getProductCardByName(firstProductName || "First product name not found");
        await expect(firstProduct, 'First product should be visible').toBeVisible();
        const firstProductPrice = await productsPage.getProductPriceByName(firstProductName || "First product name not found").textContent();

        await productsPage.getAddToCartButtonById("2").click();

        const modal = new AddedToCartModal(page);
        await modal.waitForOpen();
        await expect(modal.modalTitle).toHaveText("Added!");
        await expect(modal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
        await modal.clickContinueShopping();
        await expect(modal.modal).toBeHidden();
        await expect(productsPage.productList, 'Product list should not be empty after search').not.toHaveCount(0);

        const secondProductName = await productsPage.productList
            .nth(2)
            .locator("p")
            .nth(1)
            .textContent();
        const secondProduct = productsPage.getProductCardByName(secondProductName || "Second product name not found");
        await expect(secondProduct, 'Second product should be visible').toBeVisible();
        const secondProductPrice = await productsPage.getProductPriceByName(secondProductName || "Second product name not found").textContent();
        await productsPage.getAddToCartButtonById("3").click();

        await modal.waitForOpen();
        await expect(modal.modalTitle).toHaveText("Added!");
        await expect(modal.modalDescription).toHaveText(testData.messages.addedToCartMsg);
        await modal.clickViewCart();

        // Verify the cart page displays the correct total, price, and quantity for the two products
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

        // Remove the first product from the cart
        await cartPage.cartTableRowRemoveButtons.nth(1).click();
        await expect(cartPage.cartTableRows, 'There should be exactly one product in the cart after removal').toHaveCount(1);
        await expect(cartPage.cartTableRowProductNames.nth(0), 'Remaining product name in cart should match the first added product').toContainText(firstProductName || "First product name not found");
        await expect(cartPage.cartTableRowProductPrices.nth(0), 'Remaining product price on Cart page should be the same as on the products page').toContainText(firstProductPrice || "First product price not found");
        await expect(cartPage.cartTableRowProductQuantities.nth(0), 'Remaining product quantity in cart should be 1').toHaveText("1");
        await expect(cartPage.cartTableRowProductTotalPrices.nth(0), 'Remaining product total price should be correct').toContainText(firstProductPrice || "First product price not found");
    });

});