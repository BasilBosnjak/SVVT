import express from "express";
import Product from "../models/Product.js";

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

productRoutes.route("/").get(getProducts);
productRoutes.route("/:page/:limit").get(getProducts);

export default productRoutes;
