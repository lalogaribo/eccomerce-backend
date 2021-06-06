const { Product } = require("../models/product");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(404).json({ success: false });
  }
  res.send(productList);
});

router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  console.log(req);
  try {
    const product = await Product.findById(productId);

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
});

router.post(`/`, async (req, res) => {
  const { name, image, countInStock, price } = req.body;
  const product = new Product({
    name,
    image,
    countInStock,
    price,
  });

  try {
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Missing data" });
  }
});

module.exports = router;
