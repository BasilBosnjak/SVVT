import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads with the expected title and primary nav links", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Shopium/i);
    await expect(page.locator('a[href="/products"]').first()).toBeVisible();
    await expect(page.locator('a[href="/contact"]').first()).toBeVisible();
    await expect(page.locator('a[href="/new-deals"]').first()).toBeVisible();
  });

  test("Products link in the nav goes to the product listing", async ({ page }) => {
    await page.goto("/");

    await page.locator('a[href="/products"]').first().click();

    await expect(page).toHaveURL(/\/products/);
  });
});
