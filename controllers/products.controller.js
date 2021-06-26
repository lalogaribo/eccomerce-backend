const { Product } = require("../models/product");
const { Category } = require("../models/category");
const { request, response } = require("express");

const getAllProducts = async (req = request, res = response) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).select(
    "name image images price category _id"
  );

  if (!productList) {
    res.status(404).json({ success: false });
  }
  res.send(productList);
};

const getSingleProduct = async (req = request, res = response) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).populate("category");

    if (!product) {
      res.status(404).send({
        success: false,
        message: `Product with given ${productId} id, was not found in the database`,
      });
    }
    res.send({ success: true, product });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

const createProduct = async (req = request, res = response) => {
  const { category } = req.body;

  const findCategory = await Category.findById(category);
  if (!findCategory)
    return res
      .status(404)
      .send({ success: false, message: "Category not found" });
  const product = new Product({
    ...req.body,
  });

  try {
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: "Missing data" });
  }
};

const updateProduct = async (req = request, res = response) => {
  const { productId } = req.params;

  try {
    let product = await Product.findByIdAndUpdate(
      productId,
      { ...req.body },
      { new: true }
    );
    res.status(200).send({ success: true, product });
  } catch (e) {
    res.status(404).send({
      success: false,
      message: "Product with given id not found in DB",
    });
  }
};

const getFeatured = async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const featuredProducts = await Product.find({ isFeatured: true }).limit(
    +count
  );

  if (!featuredProducts) {
    res.status(500).json({ success: false });
  }
  res.status(200).send({ success: true, count: featuredProducts });
};

const getCount = async (req, res) => {
  const productCount = await Product.countDocuments((count) => count);

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.status(200).send({ success: true, count: productCount });
};

module.exports = {
  productController: {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    getFeatured,
    getCount,
  },
};
