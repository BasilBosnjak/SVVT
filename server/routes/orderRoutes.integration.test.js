process.env.TOKEN_SECRET = "test-secret";

import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
import { connect, clearDatabase, closeDatabase } from "../test-utils/dbTestServer.js";

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

const tokenFor = (userId) =>
  jwt.sign({ id: userId }, process.env.TOKEN_SECRET, { expiresIn: "2h" });

describe("GET /api/orders — access control decision table", () => {
  test("no token -> 401 Unauthorized", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(401);
  });

  test("valid token, non-admin user -> 403 Forbidden", async () => {
    const user = await User.create({
      name: "Regular User",
      email: "regular@example.com",
      password: "password123",
      isAdmin: false,
    });

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${tokenFor(user._id)}`);

    expect(res.status).toBe(403);
  });

  test("valid token, admin user -> 200 OK", async () => {
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      isAdmin: true,
    });

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${tokenFor(admin._id)}`);

    expect(res.status).toBe(200);
  });
});
