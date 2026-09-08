import { test, expect, devices } from "@playwright/test";

test.describe("Responsiveness", () => {
  test("primary nav is usable on a mobile viewport (iPhone X)", async ({ browser }) => {
    const context = await browser.newContext({ ...devices["iPhone X"] });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page.getByRole("link", { name: "Shopium", exact: true }).first()).toBeVisible();

    await context.close();
  });

  test("product listing is usable on a tablet viewport (iPad)", async ({ browser }) => {
    const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
    const page = await context.newPage();

    await page.goto("/products");
    await expect(page.getByText(/€\d/).first()).toBeVisible();

    await context.close();
  });
});
