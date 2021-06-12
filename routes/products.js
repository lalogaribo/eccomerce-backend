const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();

router.get(`/`, async (req, res) => {
  let filter = {}
  if(req.query.categories) {
     filter = {category: req.query.categories.split(",") }
  }
  const productList = await Product.find(filter).select(
    "name image images price category _id"
  );

  if (!productList) {
    res.status(404).json({ success: false });
  }
  res.send(productList);
});

router.get("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).populate('category')

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
});

router.put("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
   let product = await Product.findByIdAndUpdate(productId, { ...req.body }, { new: true });
   res.status(200).send({success: true, product})
  } catch (e) {
    res.status(404).send({
      success: false,
      message: "Product with given id not found in DB",
    });
  }
});

router.get('/get/count', async (req,res) => {
  const productCount = await Product.countDocuments(count => count)

  if(!productCount){
    res.status(500).json({success: false})
  }
  res.status(200).send({success: true, count: productCount})
})

router.get('/get/featured/:count', async (req, res) => {
  const count = req.params.count ? req.params.count : 0
  const featuredProducts = await Product.find({isFeatured: true}).limit(+count)

  if (!featuredProducts) {
    res.status(500).json({success: false})
  }
  res.status(200).send({success: true, count: featuredProducts})
})


module.exports = router;
