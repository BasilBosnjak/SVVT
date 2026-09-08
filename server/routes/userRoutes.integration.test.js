process.env.TOKEN_SECRET = "test-secret";

import { jest } from "@jest/globals";

// Prevent registration from sending a real email over the network during tests.
jest.unstable_mockModule("../middleware/sendVerificationEmail.js", () => ({
  sendVerificationEmail: jest.fn(),
}));

const request = (await import("supertest")).default;
const { default: app } = await import("../app.js");
const { default: User } = await import("../models/User.js");
const { connect, clearDatabase, closeDatabase } = await import(
  "../test-utils/dbTestServer.js"
);

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

const validUser = {
  name: "Jane Doe",
  email: "jane@example.com",
  password: "password123",
};

describe("POST /api/users/register", () => {
  test("registers a new user with valid data", async () => {
    const res = await request(app).post("/api/users/register").send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(validUser.email);
    expect(res.body.token).toBeDefined();
  });

  test("rejects registration with an email that already exists", async () => {
    await request(app).post("/api/users/register").send(validUser);
    const res = await request(app).post("/api/users/register").send(validUser);

    expect(res.status).toBe(400);
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/users/register").send(validUser);
  });

  test("logs in with correct email and password", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("rejects login with the wrong password", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: validUser.email, password: "wrong-password" });

    expect(res.status).toBe(401);
  });

  test("rejects login for an email that was never registered", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "nobody@example.com", password: "whatever" });

    expect(res.status).toBe(401);
  });
});

describe("regression: saving a user after registration should not break their password", () => {
  test("login still works with the original password after the verify-email save", async () => {
    const registerRes = await request(app)
      .post("/api/users/register")
      .send(validUser);
    const token = registerRes.body.token;

    const verifyRes = await request(app)
      .get("/api/users/verify-email")
      .set("Authorization", `Bearer ${token}`);
    expect(verifyRes.status).toBe(200);

    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ email: validUser.email, password: validUser.password });

    expect(loginRes.status).toBe(200);
  });

  // Stronger check than the one above: the pre-save hook used to re-hash
  // this.password even when it wasn't modified (missing `return` after
  // next()), which was harmless in practice (Mongoose already committed the
  // original hash before the redundant re-hash ran) but still meant the
  // stored hash value changed on every unrelated save. Now it shouldn't.
  test("the stored password hash is unchanged by an unrelated save", async () => {
    const registerRes = await request(app)
      .post("/api/users/register")
      .send(validUser);
    const token = registerRes.body.token;

    const before = await User.findOne({ email: validUser.email });

    await request(app)
      .get("/api/users/verify-email")
      .set("Authorization", `Bearer ${token}`);

    const after = await User.findOne({ email: validUser.email });

    expect(after.password).toBe(before.password);
  });
});
