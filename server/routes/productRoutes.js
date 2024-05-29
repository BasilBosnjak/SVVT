import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const productRoutes = express.Router();

const getProducts = async (req, res) => {
  const page = parseInt(req.params.page); // pages, ex: 1, 2, 3
  const limit = parseInt(req.params.limit); // items per page, ex: 10, 15, 20

  const products = await Product.find({});

  if (page && limit) {
    const totalPages = Math.ceil(products.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    res.json({
      products: paginatedProducts,
      pagination: { currentPage: page, totalPages },
    });
  } else {
    res.json({ products, pagination: {} });
  }
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found!");
  } else {
    res.json(product);
  }
};

/*
const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category: category });
  if (!products) {
    res.status(404);
    throw new Error("Products by category not found!");
  } else {
    res.json(products);
  }
};
*/

const createProductReview = async (req, res) => {
  const { rating, comment, userId, title } = req.body;

  const product = await Product.findById(req.params.id);
  const user = await User.findById(userId);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed.");
    }

    const review = {
      name: user.name,
      rating: Number(rating),
      comment,
      title,
      user: user._id,
    };

    product.reviews.push(review);

    product.numberOfReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review saved successfully." });
  } else {
    res.status(404);
    throw new Error("Product does not exist.");
  }
};

productRoutes.route("/").get(getProducts);
productRoutes.route("/:page/:limit").get(getProducts);
productRoutes.route("/:id").get(getProductById);
productRoutes.route("/reviews/:id").post(protectRoute, createProductReview);
//productRoutes.route("/category/:category").get(getProductsByCategory);

export default productRoutes;
