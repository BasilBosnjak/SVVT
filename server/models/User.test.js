import bcrypt from "bcryptjs";
import User from "./User.js";

describe("User.matchPasswords", () => {
  test("returns true for the correct plaintext password", async () => {
    const hash = await bcrypt.hash("correct-password", 10);
    const user = new User({ name: "Test", email: "test@example.com", password: hash });

    await expect(user.matchPasswords("correct-password")).resolves.toBe(true);
  });

  test("returns false for an incorrect plaintext password", async () => {
    const hash = await bcrypt.hash("correct-password", 10);
    const user = new User({ name: "Test", email: "test@example.com", password: hash });

    await expect(user.matchPasswords("wrong-password")).resolves.toBe(false);
  });
});
