import { test, expect } from "@playwright/test";

// Per the test plan (equivalence partitioning / boundary value analysis on
// the Yup schemas in RegisterScreen.jsx), and per the decision *not* to
// submit real registrations against the production database — these tests
// only check client-side validation messages, never a successful submit.

test.describe("Register form validation (no submit)", () => {
  test("mismatched passwords show a 'Passwords must match' error", async ({ page }) => {
    await page.goto("/register");

    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.fill('input[name="confirmPassword"]', "different123");
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByText(/passwords must match/i)).toBeVisible();
  });

  test("a 2-character password (boundary, below the 3-char minimum) is rejected", async ({ page }) => {
    await page.goto("/register");

    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "ab");
    await page.fill('input[name="confirmPassword"]', "ab");
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByText(/at least 3 characters/i).first()).toBeVisible();
  });

  test("an invalid email format is rejected", async ({ page }) => {
    await page.goto("/register");

    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "not-an-email");
    await page.fill('input[name="password"]', "password123");
    await page.fill('input[name="confirmPassword"]', "password123");
    await page.getByRole("button", { name: "Sign up" }).click();

    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });
});

test.describe("Login", () => {
  test("wrong credentials show the real server error message", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "nobody-really@example.com");
    await page.fill('input[name="password"]', "wrongpassword123");
    await page.locator('button[type="submit"]').getByText("Sign in", { exact: true }).click();

    // Previously showed Axios's generic "Request failed with status code 401"
    // because the server sent a plain-text body instead of JSON (see
    // docs/report.md, Section 8, bug #4) — now fixed and confirmed live here.
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });
});
