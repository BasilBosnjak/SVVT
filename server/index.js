import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import databaseConnection from "./db.js";
import path from "path";

// Routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import stripeRoute from "./routes/stripeRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Middleware
import logger from "./middleware/loggerMiddleware.js";

databaseConnection();
const app = express();
app.use(express.json());
app.use(cors());

// logging middleware, *use before routes
app.use(logger);

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/checkout", stripeRoute);
app.use("/api/orders", orderRoutes);

const PORT = 5001;

const __dirname = path.resolve();
app.use("/live", express.static(path.join(__dirname, "/live")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/config/google", (req, res) => {
  res.send(process.env.GOOGLE_CLIENT_ID);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
