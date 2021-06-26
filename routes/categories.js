const { categoryController } = require("../controllers/categories.controller");
const express = require("express");
const router = express.Router();

router.get(`/`, categoryController.getAllCategories);
router.get("/:categoryId", categoryController.getSingleCategory);
router.put("/:categoryId", categoryController.updateCategory);
router.post("/", categoryController.createCategory);
router.delete("/:categoryId", categoryController.deleteCategory);

module.exports = router;
