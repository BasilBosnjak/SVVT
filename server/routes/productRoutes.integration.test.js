import request from "supertest";
import app from "../app.js";
import Product from "../models/Product.js";
import { connect, clearDatabase, closeDatabase } from "../test-utils/dbTestServer.js";

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

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

  // NOTE: requests for a well-formed-but-nonexistent id, or a malformed id,
  // are deliberately NOT exercised here. getProductById isn't wrapped in
  // expressAsyncHandler, so its error path (`throw` after res.send(), or the
  // CastError from an invalid id) is an unhandled promise rejection — and on
  // Node 15+ (default config, which is what this app runs on) an unhandled
  // rejection crashes the whole process. Manually confirmed outside Jest
  // (see docs/report.md, Section 4) rather than repeatedly re-triggering a
  // process-crashing bug inside the automated suite. This is the most
  // critical finding of this testing pass — left unfixed for now, pending
  // the dedicated Bug Reports and Fixes phase.
});
