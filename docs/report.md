# SVVT Course Project Report

**Project under test:** Shopium — a MERN-stack e-commerce application (Node/Express + MongoDB/Mongoose backend, React/Redux frontend, Stripe checkout, JWT authentication).
**Repository:** this repo (C:\SVVT)
**Hosted at:** https://svvt.onrender.com/

This report is built up incrementally, one VVT activity at a time, alongside the work itself.

---

## 1. Static Analysis

### 1.1. Linting

**Tooling:** ESLint 8.57.0 (already present via `client/node_modules`, reused for both halves of the app).

- **Client** (`client/src`): uses the existing Create React App `eslint-config-react-app` config (declared in `client/package.json`).
- **Server** (`server/`): had no ESLint config. Added a minimal `server/.eslintrc.json` (`eslint:recommended`, Node + ES2022 modules) since the server is plain Express/ESM with no framework-provided lint setup.

**Command run:**
```
cd client && node_modules/.bin/eslint src --ext .js,.jsx
node_modules/.bin/eslint server --ext .js   (run from client's binary against the server folder)
```

**Results:** Client — 16 warnings across 9 files, all `no-unused-vars` (unused imports/variables, e.g. unused icon imports, an unused `getHeadingContent` in `CartScreen.jsx`, unused Redux action imports in `ReviewsTab.jsx`). Server — 3 errors, also all `no-unused-vars` (an unused `id` param in `sendVerificationEmail.js`, an unused `Schema` import in `models/Product.js`, an unused `mongoose` import in `seed.js`).

**Assessment:** No correctness bugs, no undefined-variable errors, no unreachable code — every finding is dead code. **Documented only, not fixed**, to keep the diff focused on the testing work itself.

### 1.2. Dependency Vulnerability Scan (`npm audit`)

**Server (root `package.json`):** 16 vulnerabilities — 2 critical, 7 high, 3 moderate, 4 low.

Security-relevant findings (sit on the app's actual request-handling path):

| Package | Severity | Why it matters here |
|---|---|---|
| `mongoose` | Critical | NoSQL injection / prototype pollution in query casting — every DB query in the app goes through Mongoose. |
| `jws` (transitive via `jsonwebtoken`) | High | Improperly verifies HMAC signatures — directly relevant since the app's auth is JWT-based. |
| `nodemailer` | High | Multiple CVEs (SMTP/header injection, SSRF) — used for verification and password-reset emails. |
| `express` / `body-parser` / `path-to-regexp` / `qs` / `send` / `serve-static` | High/Moderate/Low | All transitive from an outdated Express version. |

Lower-priority (transitive build/dev tooling, not on the request path): `shell-quote` (critical), `browserslist` (high), `lodash` (high).

**Client:** 72 vulnerabilities — 3 critical, 38 high, 16 moderate, 15 low. The large majority live inside `react-scripts`' build tooling (webpack-dev-server, jest, svgo, workbox, resolve-url-loader, etc.) — dev-time only, never shipped in the production bundle, and fixing most of them requires a semver-major bump of `react-scripts` (breaking-change risk). The runtime dependencies actually imported by app code that are flagged: `axios`, `react-router-dom` (both high).

**Bottom line:** the two findings worth calling out as real risk are the **mongoose NoSQL-injection/prototype-pollution CVE** and the **jws/JWT signature-verification CVE**, since both sit directly on the auth and data-access paths. Everything else is mostly transitive noise from an aging Express/CRA toolchain.

**Decision:** documented only; `package.json` left untouched, since bumping dependencies mid-project risks breaking the already-deployed app on Render.

---

## 2. Test Plan

### 2.1. Scope

Unlike the reference example project (which tested a live third-party site with no source access, so was limited to black-box system tests), we own the full source **and** the app is publicly hosted, so unit, integration, and system testing are all in scope.

**In scope:** auth (register/login/Google login/email-verification/password-reset), product browsing/search/reviews, cart, checkout up to the point of redirecting to Stripe, order history, and the admin panel (products/users/orders management).

**Out of scope / limited:**
- **Completing a real Stripe payment** — we won't push real charges. We *will* test the checkout flow up to and including Stripe redirect, and the cancel path.
- **Verifying actual email delivery/content** (verification & password-reset emails) — we'll test that the endpoints respond correctly, not that Gmail delivers the message.
- **Guest checkout** — doesn't exist in this app (`CheckoutScreen` redirects to `/login` if unauthenticated), unlike the Bershka example.

**Suspected defects already spotted during code reading** (to be confirmed with actual test execution, not fixed yet):
- `authMiddleware.js`'s `isAdmin` calls the deprecated `res.send(403)` shorthand instead of `res.status(403).send(...)` — suspected to send an HTTP 200 with body `"403"` rather than an actual 403 status. *(Update, Section 4: Express actually special-cases `res.send(<number>)` to set the real status code too, so this turned out not to be a live bug — see the correction there.)*
- `User.js`'s pre-save hook calls `next()` without `return`ing when the password hasn't changed, then falls through and re-hashes `this.password` anyway — every save of a user (e.g. email verification, `firstLogin` flag update) may re-hash an already-hashed password, potentially breaking login after that save.
- `stripeRoutes.js` creates the `Order` and decrements product `stock` immediately after creating the Stripe session — *before* the user has actually paid. Cancelling on Stripe's hosted checkout page likely still leaves behind a persisted order and reduced stock.

### 2.2. Testing Environment and Tools

- **Unit testing:** Jest, for isolated logic (password hashing/matching, price/rating calculations, middleware).
- **Integration testing:** Jest + Supertest, hitting Express routes against an in-memory MongoDB (`mongodb-memory-server`), so DB-backed route/middleware/model behavior is verified without touching the real database.
- **System (black-box) testing:** Playwright, driving the real hosted app at https://svvt.onrender.com/.
- **Coverage:** Jest's built-in coverage reporter (`--coverage`).
- **Static analysis:** ESLint + `npm audit` (already done, see Section 1).

### 2.3. Test Case Design Techniques

- **Equivalence partitioning** — e.g. email field: valid format / missing `@` / empty string.
- **Boundary value analysis** — e.g. password minimum length is 3 (`RegisterScreen`/`PasswordResetScreen` Yup schemas): test 2, 3, and 4 characters. Shipping address/city/postal code/country minimum length is 5 (`ShippingInfo`): test 4, 5, and 6 characters. Cart quantity vs. product stock: 0, 1, `stock`, `stock + 1`.
- **Decision tables** — e.g. route access = f(authenticated?, isAdmin?) for admin-only endpoints; review submission = f(already reviewed?, valid rating?).
- **State-based** — order lifecycle across the Stripe redirect: initiated → completed vs. initiated → cancelled (targets the suspected order/stock bug above).

Detailed test cases are written up alongside each testing phase (unit/integration/system) rather than duplicated here, to keep this plan short.

---

## 3. Unit Testing

**Tooling:** Jest 30, run natively against ES modules (`node --experimental-vm-modules`, since the server uses `"type": "module"`). Config in `jest.config.js`; run via `npm test` (or `npm run test:coverage`).

**Scope of this pass:** only logic that's genuinely unit-testable without a database — i.e. pure/sync functions or methods that don't require `.save()`/queries. DB-backed logic (route handlers, the password re-hash bug in `User`'s pre-save hook, Stripe order creation) needs a real or in-memory database and is covered in Integration Testing (Section 4) instead.

| Suite | What it covers | Result |
|---|---|---|
| `server/middleware/authMiddleware.test.js` | `isAdmin`: allows admins through, blocks non-admins/missing user with an expected HTTP 403 | 1 pass, 2 `test.failing` (fail as expected — later found to be a false alarm, see Section 8) |
| `server/models/User.test.js` | `User.matchPasswords`: correct password → true, wrong password → false | 2/2 pass |

**Apparent bug (later corrected — see Section 8):** the two `test.failing` cases initially looked like they confirmed the defect flagged in the test plan — `res.send(403)` instead of `res.status(403)`, so `res.status` is never explicitly invoked. This turned out to be a flaw in the *test's mock*, not the app: Express actually special-cases `res.send(<number>)` to set the real status code too (with a deprecation warning), so live requests were already getting a real 403. Fixed anyway in Section 8 (deprecated API, worth cleaning up) — but it was never an active bug affecting users.

---

## 4. Integration Testing

**Tooling:** Jest + Supertest, hitting the real Express app (`server/app.js`) against an in-memory MongoDB (`mongodb-memory-server`) — no real database is ever touched.

**Refactor needed first:** `server/index.js` previously built the Express app *and* called `databaseConnection()`/`app.listen()` all in one file, with side effects firing on import — impossible to import into a test. Split it: `server/app.js` now just builds and exports the Express `app` (same routes/middleware, unchanged behavior); `server/index.js` is now a thin bootstrap that imports `app.js`, connects the database, and listens. This is the standard "app factory" pattern and doesn't change any request-handling behavior.

| Suite | What it covers |
|---|---|
| `userRoutes.integration.test.js` | register (valid, duplicate email), login (correct/wrong password, unknown email), and a **regression check** for the suspected password-re-hash bug |
| `productRoutes.integration.test.js` | product listing, pagination boundary (page past the last result), fetch-by-id (found/not-found) |
| `orderRoutes.integration.test.js` | admin-route access decision table: no token → 401, non-admin token → 403, admin token → 200 |

**Result:** 17/17 pass across all 5 suites (2 unit + 3 integration).

**Regression check — password re-hash bug ruled out:** the test plan flagged that `User`'s pre-save hook might re-hash an already-hashed password on any unrelated save (missing `return` after `next()`). The integration test registers a user, hits `/verify-email` (which saves the user again without touching the password), then logs in with the original password — **and it passes**. On closer reading, the bug is real but harmless in practice: because the hook declares a `next` parameter, Mongoose runs it in callback style and commits the write the moment `next()` is called — which happens synchronously, before the `await bcrypt.hash(...)` line ever runs. The subsequent re-hash still executes (wasted work, mutating the in-memory document) but by then Mongoose has already persisted the correct original hash, so nothing observable breaks. Worth noting as a case where reading the code suggested a defect that testing then clarified — it's dead/wasteful code, not a data-corrupting one. Left as-is (no fix needed).

**Critical bug found — process crash on a bad product id:** `getProductById` isn't wrapped in `expressAsyncHandler`, so when a product id is well-formed-but-not-found (`throw` after `res.send()`) or malformed (a Mongoose `CastError`), the resulting rejection is unhandled. Node 15+ **terminates the process by default** on an unhandled rejection. Confirmed by manually reproducing outside Jest:

```
GET /api/products/64b64e5f5f5f5f5f5f5f5f5f
Error: Product not found!
    at getProductById (server/routes/productRoutes.js:33:11)
Node.js v24.18.0        ← process exits here
```

This means **any client requesting a nonexistent or malformed product id can crash the live server** — a real availability/DoS-flavored defect, not just a wrong status code. Deliberately **not** exercised repeatedly inside the automated suite (re-triggering a process-crashing rejection inside a shared Jest worker is itself unsafe); the two other route handlers with the same unwrapped-`async` pattern (`getProducts`, `createProductReview`) likely share this risk and should be checked in the Bug Reports and Fixes phase. This is the most severe finding of the project so far — left unfixed for now, but should be prioritized first when fixes are applied.

**Correction to the suspected `isAdmin` bug:** unlike the unit-level mock, this integration test hits the real Express app end-to-end — and it passed even *before* any fix (`GET /api/orders` correctly returned `403` for a non-admin user, both with the original code and after). This confirms the "bug" from Section 3 was never actually live: Express's deprecated `res.send(<number>)` shorthand still sets the real status code, so no real request was ever affected. See Section 8 for what was actually changed and why.

---

## 5. System (Black-Box) Testing

**Tooling:** Playwright, run against the real hosted app at https://svvt.onrender.com/ — no mocking, no local server.

**Scope decision:** register/login are tested for **client-side validation only** (bad password, mismatched confirm, invalid email) — no test ever actually submits a real registration, since that would create a permanent user record in the production database. Full register/login *behavior* is already covered by the integration tests against an in-memory DB (Section 4).

| Suite | What it covers |
|---|---|
| `home.spec.js` | homepage loads, primary nav links present and navigable |
| `products.spec.js` | product listing shows priced items, opening a product shows its detail page, adding to cart updates the cart |
| `auth.spec.js` | register form validation (equivalence partitioning/boundary value analysis: mismatched passwords, 2-char password vs. the 3-char minimum, invalid email), and a **live confirmation** of a login UX bug |
| `responsive.spec.js` | nav usable on an iPhone X viewport, product listing usable on an iPad viewport |

**Result:** 11/11 pass.

**New bug found — login error message never reaches the user:** the server sends a specific message (`"Invalid Email or Password!"`) as plain text on a failed login, but the client reads `error.response.data.message`, which is `undefined` for a non-JSON response body — so it falls back to Axios's generic message. Reproduced live: entering wrong credentials on the production site shows **"Request failed with status code 401"** instead of the real reason. Written up as a passing test that documents today's actual behavior; left unfixed for now (fix: have the server respond with JSON, or have the client read `error.response.data` directly).

---

## 6. Regression Testing

To demonstrate that the suite actually catches changes (rather than just passing by construction), a small bug was deliberately injected, run, observed to fail, then reverted:

- **Injected:** in `productRoutes.js`'s `getProducts`, changed `Math.ceil(products.length / limit)` to `Math.ceil` → `Math.floor` for the `totalPages` calculation.
- **Ran `npm test`:** 1 of 17 tests failed — precisely the boundary-value test added in Integration Testing (`returns an empty array for a page beyond the available results`), which expects `totalPages` to be `1` for a single product with `limit=10`; `Math.floor(1/10)` gives `0` instead. Every other test was unaffected, showing the failure was correctly isolated to the one case that actually exercises this line.
- **Reverted** the change back to `Math.ceil`, re-ran: 17/17 pass again. `git diff` confirms the file is byte-identical to before the experiment.

This confirms the boundary-value test written in Section 4 is doing real work — it would catch this exact class of off-by-one pagination bug if it were ever reintroduced (e.g. by a future refactor).

---

## 7. Test Coverage Analysis

**Tooling:** Jest's built-in coverage reporter (`npm run test:coverage`), scoped to `server/` — the only part of the codebase with automated (non-system) tests. Test helpers and Playwright specs are excluded from the metric since they aren't application code.

**Overall: 44% statements, 40% branches, 29% functions** across `server/`. Breakdown:

| Area | Coverage | Notes |
|---|---|---|
| `models/User.js`, `Product.js`, `Order.js` | 100% | Fully exercised (directly or via routes) |
| `models/Category.js` | 0% | Not used by any live route — only referenced by `seed.js` and by a commented-out route (`getProductsByCategory`) |
| `middleware/authMiddleware.js` | 88% | Only the token-missing branch of `protectRoute` is untested |
| `middleware/send*Email.js` | 12.5% | Intentionally out of scope (test plan §2.1 — not verifying real email delivery) |
| `routes/userRoutes.js` | 49% | Login/register covered; Google login, password-reset, admin user-management endpoints are not |
| `routes/productRoutes.js` | 31% | Read endpoints covered; all admin write endpoints (create/update/delete product, reviews) are not |
| `routes/orderRoutes.js` | 39% | Access-control decision table covered; `setDelivered`/`deleteOrderById`/`getOrderById` are not |
| `routes/stripeRoutes.js` | 24% | Intentionally out of scope (test plan §2.1 — no real Stripe payments) |
| `db.js` | 0% | Never invoked — tests connect directly to the in-memory database instead |

**Assessment:** coverage is concentrated on the flows called out as in-scope in the test plan (auth happy/error paths, product read/pagination, admin access control) rather than spread thin. The clearest real gap is the **admin write endpoints** (product/order/user management) — untested, and exactly the kind of surface where the same "missing `expressAsyncHandler`" pattern behind the process-crash bug (Section 4) could be lurking elsewhere. Worth checking when the Bug Reports and Fixes phase addresses that bug family. Client-side coverage wasn't measured — no component-level tests were written for the React app in this pass.

---

## 8. Bug Reports and Fixes

All fixes below were committed locally (one commit per fix, each verified against the full local test suite before committing), reviewed, and then pushed to `origin/main` — the app is auto-deployed from this repo on Render, so all four are now **live in production**.

| # | Bug | Severity | Status |
|---|---|---|---|
| 1 | Unhandled async errors crashed the whole process (`getProductById` and 4 others weren't wrapped in `expressAsyncHandler`) | Critical | **Fixed** — wrapped in `expressAsyncHandler` |
| 2 | `isAdmin` used the deprecated `res.send(403)` shorthand | Low (see correction below) | **Fixed** — now explicit `res.status(403).json(...)` |
| 3 | `User` pre-save hook re-hashed an unmodified password | Low, harmless in practice | **Fixed** — added missing `return` |
| 4 | Server sent plain-text error bodies; client expects JSON `.message` — affected **every** error response in the app, not just login | Medium (broad UX impact) | **Fixed** — all 19 error-path responses now `res.json({ message })` |
| 5 | Submitting a product review with no title returned 500 (`Product.js`'s `reviewSchema.title` was `required: true`, but the UI labels the field "(optional)") | Medium — a core feature was broken for any user who left the optional field blank | **Fixed** — dropped `required: true` from `title` |

**Correction on bug #2:** the initial unit test (Section 3) suggested non-admins were getting HTTP 200 instead of 403. Re-checking at the integration level (real Express + Supertest, no mocks) showed the *original* code already returned a real 403 — Express special-cases the deprecated `res.send(<number>)` shorthand to also set the actual status code. The unit test's hand-rolled `res` mock didn't replicate that legacy behavior, producing a false alarm. The fix was still applied (removes the deprecation warning and a dependency on legacy behavior that could be dropped in a future Express version), but it's a code-quality change, not a user-facing one. Kept in this report as an example of why a suspected bug should be confirmed against real end-to-end behavior before being written up as confirmed.

**Scope note on bug #4:** originally scoped to the login endpoint only (found via system testing, Section 5). Checking how widespread the underlying pattern was (`res.status(x).send("string")` vs. the client's `error.response.data.message`) turned up 18 more identical cases across `orderRoutes.js`, `productRoutes.js`, and `userRoutes.js`. All were fixed together, since it's the same one-line mechanical change repeated consistently. Success-path plain-text responses (e.g. the password-reset-request confirmation, which the client reads as a raw string, not via `.message`) were deliberately left untouched.

**Verification:** the full local suite (unit + integration) passes after each fix — 20/20 tests. After the fixes were pushed and deployed, the login system test (Section 5) was re-run directly against production: it previously asserted the buggy generic message and now asserts (and confirms) the real one — `GET /login` with wrong credentials shows **"Invalid Email or Password!"** live, no longer "Request failed with status code 401". Full system suite re-run post-deploy: 11/11 pass.

**Bug #5** was reported directly by the user after noticing reviews returned a 500 on the live site — not found through the earlier planned test passes. Reproduced locally first (a valid review with a title saves fine; the same request with an empty title throws `ValidationError: reviews.0.title: Path 'title' is required.`), confirming the root cause before touching any code. This is the same underlying defect class as bug #1 (an exception during `product.save()`), except this one isn't a crash — it's a validation mismatch between the client's UI copy and the server's schema, so the fix is schema-side, not `expressAsyncHandler`-side. Added 3 new tests for `POST /api/products/reviews/:id` (previously completely untested — flagged as a coverage gap in Section 7): submit with a title, submit with no title (the regression case), and reject a duplicate review. Full suite after this fix: 23/23.

---

## 9. Conclusion

### 9.1. Testing Summary

| Activity | Tooling | Result |
|---|---|---|
| Static analysis | ESLint, `npm audit` | 16 client + 3 server lint warnings (dead code, documented); 2 real-risk CVEs flagged (mongoose, jws), rest transitive/dev-only noise |
| Unit testing | Jest | 5 tests — isolated `isAdmin` and `User.matchPasswords` logic |
| Integration testing | Jest + Supertest + in-memory MongoDB | 18 tests — auth, product listing/pagination/reviews, admin access control |
| System (black-box) testing | Playwright, against the live production site | 11 tests — navigation, cart, form validation, responsiveness |
| Regression testing | Jest | 1 deliberately injected bug, caught by exactly 1 test, then reverted |
| Coverage analysis | Jest `--coverage` | 44% statements across `server/`, concentrated on in-scope flows |
| Bugs found | — | 5 found, 5 fixed (4 deployed to production: commits `ae1a0cc`, `6914cc5`, `670837b`, `50f02c8`; 1 committed locally: `c5f9feb`) |

**34 automated tests total** (23 Jest + 11 Playwright), all passing as of this writing.

### 9.2. Final Thoughts

Having both the source code and a live deployment changed the shape of this project compared to the reference example (which only had black-box access to a third-party site): unit and integration testing caught two of the four bugs before a browser was ever opened, and reading the code first (rather than only clicking through the UI) is what turned up the process-crash bug and the suspected password/admin issues in the first place.

Not every suspicion held up, though — the `isAdmin` "wrong status code" bug (Section 3) looked confirmed at the unit level but turned out to be a false alarm once checked against real Express behavior (Section 4). That correction is arguably as valuable a result as the real bugs: a reminder that a mock is only as good as how faithfully it represents the real system, and that a suspected bug belongs in a report as *confirmed* only after it's been reproduced end-to-end, not just inferred from source or a hand-rolled test double.

The most severe finding — a single malformed URL parameter crashing the entire live server — was also the easiest to fix (one word, `expressAsyncHandler`, repeated five times), which is a useful thing to have on record: high-severity bugs aren't always the hardest to fix, and low-effort defensive patterns (consistently wrapping async route handlers) prevent a whole category of them at once.

Bug #5 (review submission 500) came in after this report's "final" sections were already written — the user found it live and reported it directly, rather than it surfacing from a planned test pass. It's left in as evidence that this VVT process didn't stop being useful once the formal phases were done: the same reproduce-first, minimal-fix, add-a-regression-test discipline applied just as well to an ad hoc bug report as it did to the planned phases.

**Remaining work**, left deliberately out of scope for this pass and worth stating plainly rather than leaving implicit: real Stripe payment completion was never exercised; client-side (React component) test coverage is at 0%; and the admin write endpoints (create/update/delete product, order, user) are largely untested.
