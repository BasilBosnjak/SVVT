# IT 302 — Senior Design Project

A full-stack e-commerce web application built on the MERN stack (MongoDB, Express, React, Node.js).

## What it does

The app is an online store. Visitors can browse a product catalogue, view individual
products with their reviews, and add items to a shopping cart. Registered users can
place orders and pay through Stripe Checkout, then review their past orders.
Administrators get a separate panel for managing products and users.

Main features:

- **Products** — catalogue browsing, product detail pages, search/filtering, customer reviews and ratings
- **Accounts** — registration with email verification, login (email/password or Google Sign-In), password reset by email
- **Cart & checkout** — shopping cart, Stripe-hosted checkout with selectable shipping rates, success/cancel handling
- **Orders** — order history for the logged-in user
- **Admin panel** — product and user management for admin accounts

### Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 (Create React App), Redux Toolkit, React Router, Chakra UI, Formik + Yup |
| Backend | Node.js, Express 4, JWT auth, bcrypt |
| Database | MongoDB with Mongoose |
| Services | Stripe (payments), Nodemailer (transactional email), Google OAuth (sign-in) |

The Express API is served under `/api` (`/api/products`, `/api/users`, `/api/orders`,
`/api/checkout`); in production the same server also serves the built React app.

## Running the project

### Prerequisites

- Node.js 18+ and npm
- A MongoDB database (local instance or MongoDB Atlas connection string)
- A Stripe account (test keys are fine) for the checkout flow

### 1. Install dependencies

```bash
npm install          # server dependencies
npm install --prefix client   # client dependencies
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017/senior-design
PORT=5001
NODE_ENV=development
TOKEN_SECRET=some-long-random-string
BASE_URL=http://localhost:3000

# Stripe
STRIPE_API_SECRET=sk_test_...
STANDARD_SHIPPING_ID=shr_...
EXPRESS_SHIPPING_ID=shr_...

# Email (verification + password reset)
EMAIL_USER=your@email.com
EMAIL_PASS=your-app-password

# Google Sign-In
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
```

Only `MONGO_URI` and `TOKEN_SECRET` are needed to browse the app; the Stripe, email
and Google values are required for checkout, account e-mails and Google login.

### 3. Seed the database (optional)

```bash
npm run data:import    # load sample products, categories and users
npm run data:destroy   # wipe that data again
```

### 4. Start the app

```bash
npm run app       # runs the API (port 5001) and the React dev server (port 3000) together
```

Or start the two halves separately:

```bash
npm run server    # API only, http://localhost:5001
npm run client    # React dev server only, http://localhost:3000
```

The React dev server proxies API requests to port 5001, so open
<http://localhost:3000> in the browser.

### Production build

```bash
npm run build     # builds the React app into client/build
NODE_ENV=production npm start
```

With `NODE_ENV=production` the Express server serves the built frontend and the API
from a single port.
