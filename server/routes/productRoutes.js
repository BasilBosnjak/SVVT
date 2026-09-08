import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { isAdmin, protectRoute } from "../middleware/authMiddleware.js";
import expressAsyncHandler from "express-async-handler";

const productRoutes = express.Router();

const getProducts = expressAsyncHandler(async (req, res) => {
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
});

const getProductById = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).send("Product not found!");
    throw new Error("Product not found!");
  } else {
    res.json(product);
  }
});

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

const createProductReview = expressAsyncHandler(async (req, res) => {
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
    res.status(404).send("Product not found!");
    throw new Error("Product does not exist.");
  }
});

const createNewProduct = expressAsyncHandler(async (req, res) => {
  const {
    name,
    images,
    brand,
    category,
    stock,
    price,
    productIsNew,
    description,
    subtitle,
    stripeId,
  } = req.body;

  const newProduct = await Product.create({
    name,
    images,
    brand,
    category,
    stock,
    price,
    productIsNew,
    description,
    subtitle,
    stripeId,
  });

  await newProduct.save();

  const products = await Product.find({});

  if (newProduct) {
    res.json(products);
  } else {
    res.status(400).send("Product could not be created.");
    throw new Error("Product could not be created.");
  }
});

const updateProduct = expressAsyncHandler(async (req, res) => {
  const {
    name,
    images,
    brand,
    category,
    stock,
    price,
    productIsNew,
    description,
    subtitle,
    stripeId,
    imageOne,
    imageTwo,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).send("Product could not be found!");
    throw new Error("Product could not be found!");
  } else {
    product.name = name;
    product.price = price;
    product.brand = brand;
    product.stock = stock;
    product.description = description;
    product.productIsNew = Boolean(productIsNew);
    product.category = category;
    product.images = images;
    product.subtitle = subtitle;
    product.stripeId = stripeId;
    product.images = [imageOne, imageTwo];

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  }
});

const removeProductReview = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  const updatedReviews = product.reviews.filter(
    (review) => review._id.valueOf() != req.params.reviewId
  );

  if (product) {
    product.reviews = updatedReviews;

    product.numberOfReviews = product.reviews.length;

    if (product.numberOfReviews > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 5;
    }
    await product.save();
    const products = await Product.find({});
    res.json(products);
  } else {
    res.status(404).send("Product not found!");
    throw new Error("Product not found!");
  }
});

const deleteProductById = expressAsyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404).send("Product not found!");
    throw new Error("Product not found!");
  } else {
    res.json(product);
  }
});

productRoutes.route("/").get(getProducts);
productRoutes.route("/:page/:limit").get(getProducts);
productRoutes.route("/:id").get(getProductById);
productRoutes.route("/reviews/:id").post(protectRoute, createProductReview);
//productRoutes.route("/category/:category").get(getProductsByCategory);
productRoutes.route("/:id").delete(protectRoute, isAdmin, deleteProductById);
productRoutes.route("/").post(protectRoute, isAdmin, createNewProduct);
productRoutes.route("/:id").put(protectRoute, isAdmin, updateProduct);
productRoutes
  .route("/:id/:reviewId")
  .put(protectRoute, isAdmin, removeProductReview);

export default productRoutes;
