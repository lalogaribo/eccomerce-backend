const express = require("express");
const { productController } = require("../controllers/products.controller");
const router = express.Router();

router.get(`/`, productController.getAllProducts);

router.get("/:productId", productController.getSingleProduct);

router.post(`/`, productController.createProduct);

router.put("/:productId", productController.updateProduct);

router.get("/get/count", productController.getFeatured);

router.get("/get/featured/:count", productController.getCount);

module.exports = router;
