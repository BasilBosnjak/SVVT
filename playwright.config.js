import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./server/system-tests",
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "https://svvt.onrender.com",
    trace: "retain-on-failure",
  },
});
