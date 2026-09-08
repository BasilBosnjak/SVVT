process.env.TOKEN_SECRET = "test-secret";

import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { connect, clearDatabase, closeDatabase } from "../test-utils/dbTestServer.js";

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

const tokenFor = (userId) =>
  jwt.sign({ id: userId }, process.env.TOKEN_SECRET, { expiresIn: "2h" });

const makeProduct = (overrides = {}) =>
  Product.create({
    name: "Test Product",
    price: 19.99,
    brand: "TestBrand",
    description: "A product used for testing.",
    category: "Laptops",
    images: ["image1.jpg"],
    ...overrides,
  });

describe("GET /api/products", () => {
  test("returns all products when no pagination is given", async () => {
    await makeProduct({ name: "A" });
    await makeProduct({ name: "B" });

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(2);
  });

  test("returns an empty array for a page beyond the available results (boundary)", async () => {
    await makeProduct();

    const res = await request(app).get("/api/products/2/10");

    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(0);
    expect(res.body.pagination.totalPages).toBe(1);
  });
});

describe("GET /api/products/:id", () => {
  test("returns the product for a valid id", async () => {
    const product = await makeProduct();

    const res = await request(app).get(`/api/products/${product._id}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Test Product");
  });

  // Previously these two cases crashed the whole Node process (see
  // docs/report.md, Section 4 and 8) because getProductById wasn't wrapped in
  // expressAsyncHandler. Now that it is, both are safe to exercise directly.
  test("returns 404 for a well-formed but non-existent id", async () => {
    const fakeId = "64b64e5f5f5f5f5f5f5f5f5f";

    const res = await request(app).get(`/api/products/${fakeId}`);

    expect(res.status).toBe(404);
  });

  // Now cleanly errors (500, via Express's default error handler) instead of
  // hanging/crashing the whole process. A 400 would be a nicer response than
  // a bare 500, but that's a minor follow-up — the critical fix (no crash)
  // is what mattered here.
  test("returns a clean error response (not a hang/crash) for a malformed id", async () => {
    const res = await request(app).get("/api/products/not-a-valid-object-id");

    expect(res.status).toBe(500);
  });
});

describe("POST /api/products/reviews/:id", () => {
  const makeReviewer = () =>
    User.create({ name: "Reviewer", email: "reviewer@example.com", password: "password123" });

  test("submits a review with a title", async () => {
    const product = await makeProduct();
    const user = await makeReviewer();

    const res = await request(app)
      .post(`/api/products/reviews/${product._id}`)
      .set("Authorization", `Bearer ${tokenFor(user._id)}`)
      .send({ comment: "Great!", userId: user._id.toString(), rating: 5, title: "Nice" });

    expect(res.status).toBe(201);
  });

  // Regression test: the review form's title field is explicitly labeled
  // "(optional)" in the UI, but the schema required it, so any real user
  // leaving it blank got a 500 (reported live: "reviews return a 500").
  // Reproduced locally, fixed by dropping `required: true` from
  // Product.js's reviewSchema.title.
  test("submits a review with no title (the UI marks it optional)", async () => {
    const product = await makeProduct();
    const user = await makeReviewer();

    const res = await request(app)
      .post(`/api/products/reviews/${product._id}`)
      .set("Authorization", `Bearer ${tokenFor(user._id)}`)
      .send({ comment: "Great!", userId: user._id.toString(), rating: 5, title: "" });

    expect(res.status).toBe(201);
  });

  test("rejects a second review from the same user", async () => {
    const product = await makeProduct();
    const user = await makeReviewer();
    const submit = () =>
      request(app)
        .post(`/api/products/reviews/${product._id}`)
        .set("Authorization", `Bearer ${tokenFor(user._id)}`)
        .send({ comment: "Great!", userId: user._id.toString(), rating: 5, title: "Nice" });

    await submit();
    const res = await submit();

    expect(res.status).toBe(400);
  });
});
