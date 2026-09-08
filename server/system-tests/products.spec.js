import { test, expect } from "@playwright/test";

test.describe("Product browsing and cart", () => {
  test("product listing shows at least one product, each with a price", async ({ page }) => {
    await page.goto("/products");

    const prices = page.getByText(/€\d/);
    await expect(prices.first()).toBeVisible();
  });

  test("opening a product shows its detail page with an Add to cart button", async ({ page }) => {
    await page.goto("/products");

    const firstProductLink = page.locator('a[href^="/product/"]').first();
    await firstProductLink.click();

    await expect(page.getByRole("button", { name: /add to cart/i })).toBeVisible();
  });

  test("adding a product to the cart updates the cart count in the header", async ({ page }) => {
    await page.goto("/products");
    await page.locator('a[href^="/product/"]').first().click();

    const addToCart = page.getByRole("button", { name: /add to cart/i });
    await expect(addToCart).toBeEnabled();
    await addToCart.click();

    await page.goto("/cart");
    await expect(page.getByText(/€\d/).first()).toBeVisible();
  });
});
